const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");

const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Cron job triggered at:", new Date());

  try {
    // Get yesterday's date range
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Find yesterday's interested requests
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    console.log("Pending requests count:", pendingRequests.length);

    // Extract unique email IDs
    const listOfEmails = [
      ...new Set(
        pendingRequests.map((req) => req.toUserId.emailId)
      ),
    ];

    console.log("Emails to notify:", listOfEmails);

    // Send reminder emails
    for (const email of listOfEmails) {
      try {
        const response = await sendEmail(
          email,
          `Pending connection requests for ${email}`,
          "You have pending friend requests on DevBridge. Please login and respond."
        );

        console.log(`Email sent to ${email}`, response);
      } catch (error) {
        console.error(`Failed for ${email}:`, error);
      }
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});
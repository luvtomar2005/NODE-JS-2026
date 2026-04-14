const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("./sesClient");

const sendEmail = async (toEmail, subject, body) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_VERIFIED_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h2>${body}</h2>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
    },
  });

  try {
    return await sesClient.send(command);
  } catch (error) {
    console.error("SES email failed:", error);
    throw error;
  }
};

module.exports = sendEmail;
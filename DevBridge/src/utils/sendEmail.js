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
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  });

  return await sesClient.send(command);
};

module.exports = sendEmail;
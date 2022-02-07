const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const { subject, text, email } = options;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const content = {
    from: `ADMIN - ${process.env.EMAIL_USERNAME} from Sober Shop`,
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(content);
};

module.exports = sendMail;

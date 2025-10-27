const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Hu Xing" <mthmzimba@gmail.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
    throw err;
  }
};

module.exports = { sendEmail };

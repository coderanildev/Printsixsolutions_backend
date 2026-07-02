const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.BASE_URL}/user/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Hello ${user.name},</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verificationUrl}" target="_blank">Verify Email</a>
           <p>This link will expire in 24 hours.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;

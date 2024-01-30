import transporter from "../config/mail.js";


export const Send_Welcome_Email = async (req, res,next) => {
  const email = req.body.customer_email; // Get email from request body

  // Save verification token and user association in your database

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: 'Welcome to Legal Buddy',
    text: `this is a test mail
    Sincerely,
    Legal Buddy`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error)
  }
};

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    logger:true,
    debug:true,
    secureConnection:false,
    auth: {
      user:'dpo@roopaligrover.in',
      pass: 'RGA-Temp24',
    },
  });

  export default transporter
const nodemailer = require("nodemailer");
 
const emailConfig = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "samuelzamgon94@gmail.com",
        pass: "emil roym ihtt ifyu"
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (to, subject, html) => {
    try {
      const mailOptions = {
        from: "samuelzamgon94@gmail.com",
        to: to,
        subject: subject,
        html: html,
      };
   
      await emailConfig.sendMail(mailOptions);
    } catch (error) {
      console.log("ha fallado el envio", error.message);
    }
  };
   
  module.exports = { sendEmail };
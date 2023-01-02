"use strict";
const nodemailer = require("nodemailer");

let email = {};

// async..await is not allowed in global scope, must use a wrapper
email.test = async function main(res) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "outlook365",
    auth: {
      user: "8200398@estg.ipp.pt",// generated ethereal user
      pass: "Bizinha89", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '8200398@estg.ipp.pt', // sender address
    to: "8200397@estg.ipp.pt", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = email;
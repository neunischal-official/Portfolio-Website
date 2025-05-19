const SENDER_NAME = 'Portfolio - Nischal Neupane';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { format } = require('path');
const { info } = require('console');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


// Nodemailer Configuration

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }



  const adminHtml = `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #e8b8ec;
    padding: 2rem;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 0.8rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      overflow: hidden;
    ">
      <div style="
        background: #8a0594;
        padding: 1.5rem;
        text-align: center;
      ">
        <h2 style="
          margin: 0;
          color: #ffffff;
          font-size: 1.8rem;
        "><strong>New Form Submission</strong></h2>
      </div>
      <div style="
        padding: 1.5rem;
        color: #333333;
        font-size: 1rem;
        line-height: 1.6;
      ">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;">
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;">
        <p style="margin-bottom:0.5rem;"><strong>Message:</strong></p>
        <p style="
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 0.4rem;
          border: 1px solid #e0e0e0;
          white-space: pre-wrap;
        ">${message}</p>
      </div>
    </div>
  </div>
`;



  const firstName = name.split(' ')[0]; // Extract the first name
  const userHtml = `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #e8b8ec;
    padding: 2rem;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 0.8rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      overflow: hidden;
    ">
      <div style="
        background: #8a0594;
        padding: 1.5rem;
        text-align: center;
      ">
        <h2 style="
          margin: 0;
          color: #ffffff;
          font-size: 1.8rem;
        "><strong>Hello, ${firstName}!</strong></h2>
      </div>
      <div style="
        padding: 1.5rem;
        color: #333333;
        font-size: 1rem;
        line-height: 1.6;
      ">
        <p>Thanks for reaching out! We’ve received your message and will get back to you shortly.</p>
        <!-- Added Subject block below -->
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;">
        <p style="margin-bottom:0.5rem;"><strong>Subject:</strong></p>
        <p style="margin-top:0; margin-bottom:1.5rem;">${subject}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:1.5rem 0;">
        <p style="margin-bottom:0.5rem;"><strong>Your Message:</strong></p>
        <p style="
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 0.4rem;
          border: 1px solid #e0e0e0;
          white-space: pre-wrap;
        ">${message}</p>
        <p style="margin-top:2rem;">Best regards,</p>
        <p style="margin-bottom:0;"><strong>Nischal Neupane</strong></p>
      </div>
    </div>
  </div>
`;


  // Email to you

  const adminMailOptions = {
    from: `"${SENDER_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `${subject}`,
    html: adminHtml,
  };

  // Acknowledgement Email to User

  const userMailOptions = {
    from: `"${SENDER_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting us!`,
    html: userHtml,
  };

  // Send Emails to Admin

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending emails to admin:', error);
      return res.status(500).json({ error: 'Failed to send email to admin' });
    }
    console.log('Email sent to admin:', info.response);

    // Send Emails to User

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending emails to user:', error);
        return res.status(500).json({ error: 'Failed to send email to user' });
      }
      console.log('Email sent to user:', info.response);
      return res.status(200).json({ message: 'Emails sent successfully' });
    });
  });
})

app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`)
});





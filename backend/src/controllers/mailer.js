const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../src/routes/.env') });
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENTID,
  process.env.MAIL_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH,
});

async function getAccessToken() {
  const accessTokenResponse = await oauth2Client.getAccessToken();
  return accessTokenResponse.token;
}

const sendMail = async (to, subject, html, res) => {
  try {
    const accessToken = await getAccessToken();
    const googleTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "k.minju020129@gmail.com",
        clientId: process.env.MAIL_CLIENTID,
        clientSecret: process.env.MAIL_SECRET,
        refreshToken: process.env.MAIL_REFRESH,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "<core-view, k.minju020129@gmail.com>",
      to,
      subject,
      html,
    };

    await googleTransporter.sendMail(mailOptions);
    googleTransporter.close();
    console.log(`Mail sent to ${to}`);
  } catch (err) {
    res.status(500).send({ success: false, message: "잠시 후 다시 시도해주세요" });
    console.log(err);
  }
};

module.exports = {
  sendMail,
};
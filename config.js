require('dotenv').config();
module.exports = {
  ZOOM_API_KEY: process.env.ZOOM_API_KEY,
  ZOOM_API_SECRET: process.env.ZOOM_API_SECRET,
  VERIFICATION_TOKEN: process.env.VERIFICATION_TOKEN,
  DB: process.env.DB,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};

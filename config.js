require('dotenv').config();
module.exports = {
  VERIFICATION_TOKEN: process.env.VERIFICATION_TOKEN,
  DB: process.env.DB,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAILID1: process.env.EMAILID1,
  EMAILID2: process.env.EMAILID2,
  EMAILID3: process.env.EMAILID3
};

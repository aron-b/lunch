const dotenv = require('dotenv');
const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') dotenv.load();

const config = {
  ENV: process.env.NODE_ENV,
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
  SLACK_VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
  FSQUARE_CLIENT_ID: process.env.FSQUARE_CLIENT_ID,
  FSQUARE_CLIENT_SECRET: process.env.FSQUARE_CLIENT_SECRET,
  ICON_EMOJI: ':stars:'
};

module.exports = (key) => {
  if (!key) return config;

  return config[key];
}
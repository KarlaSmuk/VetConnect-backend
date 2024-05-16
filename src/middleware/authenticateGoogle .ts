import { google } from "googleapis";
import dotenv from 'dotenv'

dotenv.config();

export const authenticateGoogle = () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL!,
    keyId: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID!,
    key: process.env.GOOGLE_DRIVE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};
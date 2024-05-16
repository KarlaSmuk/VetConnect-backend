import { google } from 'googleapis';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

export const uploadToGoogleDrive = async (file: any, id: string, auth: any) => {
    const fileMetadata = {
      name: id,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!], // folder id
    };

    const bufferStream = new Readable({
      read() {
          this.push(file.buffer);
          this.push(null); // End of stream
      }
  });
  
    const media = {
      mimeType: file.mimetype,
      body: bufferStream
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id"
    });
    return response;
  };
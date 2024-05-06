import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

export const sendOtp = async (email: string, otp: number) => {

    try{
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Jednokratna lozinka za pristup VetConnect',
        html:   `<p>Poštovani,</p>
                <p>Vaša jednokratna lozinka za pristup je: <strong>${otp}</strong></p>`
    }

    transporter.sendMail(mailOptions)
    
    return

    }catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }
}
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

export const sendOtp = async (email: string, otp: number) => {

    
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    var mailOptions = {
        from: 'VetConnect ' + process.env.MAIL_USER,
        to: email,
        subject: 'Jednokratna lozinka za pristup VetConnect',
        html:   `<p>Poštovani,</p>
                <p>Vaša jednokratna lozinka za pristup je: <strong>${otp}</strong></p>`
    }

    try{

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
        
        return true

    }catch (error: unknown) {
        if (error instanceof Error) {
            console.log('Failed to send email: ', error.message)

            return false
        }
        
    }
}
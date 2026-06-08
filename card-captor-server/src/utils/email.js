import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: '2525',
    auth: {
        user: '2d564ec551e2ce',
        pass: '2edbac7a3b6bf5',
    }
});

export default transporter;
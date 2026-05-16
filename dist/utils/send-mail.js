import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendMail = async ({ to, subject, html }) => {
    try {
        const result = await resend.emails.send({
            from: "ParkOps <onboarding@resend.dev>",
            to: to,
            subject: subject,
            html: html
        });
        if (result) {
            console.log(`E-mail send successfully to: ${to}`);
        }
        ;
        return result;
    }
    catch (err) {
        console.log(`Failed to send E-mail to: ${to}, Mail error: ${err}`);
    }
    ;
};

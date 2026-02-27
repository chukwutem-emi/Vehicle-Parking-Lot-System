import { MailtrapClient } from "mailtrap";
const client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN
});
export const sendMail = async ({ to, subject, text, html }) => {
    try {
        const sender = {
            email: "hello@demomailtrap.co",
            name: "ChemSten-VehicleParkingLot"
        };
        const recipients = [{ email: to }];
        const result = await client.send({
            from: sender,
            to: recipients,
            subject: subject,
            html: html,
            text: text,
            category: "Transactional"
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

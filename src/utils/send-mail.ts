import { MailtrapClient} from "mailtrap";

type SendMail = {
    to       : string,
    subject  : string,
    text?    : string,
    html?    : string
};

const client = new MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN as string
});

export const sendMail = async ({to, subject, text, html}: SendMail) => {
    try {
        const sender = {
            email: "hello@demomailtrap.co",
            name: "ChemSten-VehicleParkingLot"
        };
    
        const recipients: {email: string}[] = [{email: to}];
    
        const result = await client.send({
            from     : sender,
            to       : recipients,
            subject  : subject,
            html     : html,
            text     : text,
            category : "Transactional"
        });
        if (result) {
            console.log(`E-mail send successfully to: ${to}`);
        };
        return result;
    } catch (err) {
        console.log(`Failed to send E-mail to: ${to}, Mail error: ${err}`)
    };
};
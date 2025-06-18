// const { MailtrapClient } = require("mailtrap");
// import dotenv from "dotenv"
import { MailtrapClient } from "mailtrap";
// const TOKEN = process.env.MAILTRAP_TOKEN;
const TOKEN = 'a10a1b1db5476ae5563e52ac711d003a'

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Anup",
};
// const recipients = [
//   {
//     email: "20anuppatel@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "<h1>Congrats for sending test email with Mailtrap!</h1>",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
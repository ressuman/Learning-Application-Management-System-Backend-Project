import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.messages
  .create({
    body: "Hello! This is a test message from Twilio.",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+233547796566", // Change this to your number
  })
  .then((message) => console.log("Message Sent: ", message.sid))
  .catch((error) => console.error("Twilio Error: ", error));

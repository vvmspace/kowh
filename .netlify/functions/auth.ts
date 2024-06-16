import { Handler } from "@netlify/functions";
import { sendAdminMessage } from "./webhook";

export const handler: Handler = async (event) => {
    await sendAdminMessage(event);
    return {
        statusCode: 200,
        body: "Webhook received",
    };
};
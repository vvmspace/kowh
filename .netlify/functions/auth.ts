import { Handler } from "@netlify/functions";
import { sendAdminMessage } from "./webhook";

export const handler: Handler = async (event) => {
    const {
        rawUrl,
        rawQuery,
        queryStringParameters
    } = event;
    await sendAdminMessage({
        rawUrl,
        rawQuery,
        queryStringParameters
    });
    return {
        statusCode: 200,
        body: "Webhook received",
    };
};
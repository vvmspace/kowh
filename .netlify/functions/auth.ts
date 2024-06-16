import crypto from 'crypto';
import { Handler } from "@netlify/functions";
import { sendAdminMessage } from "./webhook";

const { TELEGRAM_BOT_TOKEN } = process.env;

export const handler: Handler = async (event) => {
    const {
        rawUrl,
        rawQuery,
        queryStringParameters
    } = event;
    
    const data_check_string = rawQuery.split('&hash=')[0];
    // secret_key = HMAC_SHA256(<bot_token>, "WebAppData")
    // if (hex(HMAC_SHA256(data_check_string, secret_key)) == hash) {
    // // data is from Telegram
    // }
    
    // i need some hmac sha256 library
    const secretKey = crypto.createHmac('sha256', TELEGRAM_BOT_TOKEN as string)
                          .update('WebAppData')
                          .digest();

    const computedHash = crypto.createHmac('sha256', secretKey)
                                .update(data_check_string)
                                .digest('hex');

    const hash = queryStringParameters?.hash;

    if (computedHash !== hash) {
        return {
            statusCode: 400,
            body: "Invalid hash",
        };
    }

    await sendAdminMessage({
        rawUrl,
        rawQuery,
        queryStringParameters,
        data_check_string,
        hash,
        computedHash,
    });

    return {
        statusCode: 200,
        body: "Webhook received",
    };
};
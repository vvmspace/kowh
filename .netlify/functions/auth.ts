import crypto from "crypto";
import { Handler } from "@netlify/functions";
import { verifyTelegramData } from "../../src/utils/auth/verify";
import { sendAdminMessage } from "./webhook";

const { TELEGRAM_BOT_TOKEN } = process.env as Record<string, string>;

export const handler: Handler = async (event) => {
  const { rawQuery, queryStringParameters } = event;
  const isValid = await verifyTelegramData(rawQuery, TELEGRAM_BOT_TOKEN);

  await sendAdminMessage({ queryStringParameters, isValid });

  if (!isValid) {
    return {
      statusCode: 400,
      body: "Invalid hash",
    };
  }

  return {
    statusCode: 200,
    body: "Webhook received",
  };
};

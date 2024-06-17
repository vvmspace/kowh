import { Handler } from "@netlify/functions";
import { verifyTelegramData } from "../../src/utils/auth/verify";
import { sign } from "jsonwebtoken";

const { TELEGRAM_BOT_TOKEN } = process.env as Record<string, string>;

export const handler: Handler = async (event) => {
  const { rawQuery, queryStringParameters } = event;
  const isValid = await verifyTelegramData(rawQuery, TELEGRAM_BOT_TOKEN);

  if (!isValid) {
    return {
      statusCode: 400,
      body: "Invalid hash",
    };
  }

  const user = JSON.parse(queryStringParameters?.user as string) as Record<string, string>;

  const { id } = user;
  const auth_token = sign({ id }, TELEGRAM_BOT_TOKEN);

  return {
    statusCode: 200,
    body: JSON.stringify({ auth_token }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

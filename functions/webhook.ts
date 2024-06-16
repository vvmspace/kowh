// /.netlify/functions/webhook

import { Handler } from "@netlify/functions";

const { TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID } = process.env;

const sendTelegramMessage = async (chatId: string, text: string) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        chat_id: chatId,
        text,
        }),
    });
};

export const sendAdminMessage = async (data: unknown) => {
    if (!TELEGRAM_ADMIN_CHAT_ID) {
        return;
    }
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, text);
}



export const handler: Handler = async (event) => {
  const bodyAsText = event.body;
  if (!bodyAsText) {
    return {
      statusCode: 400,
      body: "No body provided",
    };
  }

  const body = JSON.parse(bodyAsText);
  const chatId = body.message.chat.id;
  const reply = JSON.stringify(body, null, 2);
  
  await sendTelegramMessage(chatId, reply);
  await sendAdminMessage(body);
  return {
    statusCode: 200,
    body: "Webhook received",
  };
};
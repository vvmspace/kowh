import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { sendAdminMessage } from "../../../.netlify/functions/webhook";

export const withAuth = (func: Handler): Handler => {
  return async (event: HandlerEvent, context: HandlerContext): Promise<any> => {
    const token = event.headers.authorization?.split(" ")[1];

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ ok: false, msg: "Unauthorized" }),
      };
    }

    try {
      const decoded = jwt.verify(token, process.env.TELEGRAM_BOT_TOKEN as string);
      context.clientContext.user = decoded;
        await sendAdminMessage(decoded);
    } catch (error) {
        await sendAdminMessage({
            error: error.message,
            token,
        });
      return {
        statusCode: 401,
        body: JSON.stringify({ ok: false, msg: "Unauthorized" }),
      };
    }

    return func(event, context);
  };
};

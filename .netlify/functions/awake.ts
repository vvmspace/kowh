import { withAuth } from "../../src/utils/auth/withAuth";
import { HandlerContext, HandlerEvent } from "@netlify/functions";
import { sendAdminMessage } from "./webhook";

const awake = async (event: HandlerEvent, context: HandlerContext) => {
  await sendAdminMessage(context);
  return {
    statusCode: 200,
    body: "Awake!",
  };
};

export const handler = withAuth(awake);

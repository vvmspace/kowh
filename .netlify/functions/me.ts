import { Handler } from "@netlify/functions";
import { withAuth } from "../../src/utils/auth/withAuth";

const me: Handler = async (event, context) => {
    const { user } = context.clientContext as Record<string, any>;
    return {
        statusCode: 200,
        body: JSON.stringify({ user }),
    };
};

export const handler = withAuth(me);
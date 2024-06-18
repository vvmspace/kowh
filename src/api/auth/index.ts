import WebApp from "@twa-dev/sdk";
import { privateRequest, publicRequest } from "../../utils/request";

export const getMe = async () => {
  const me = (
    await privateRequest("/api/auth/me", "GET", null).catch(async (e) => {
      await auth();
      return privateRequest("/api/auth/me", "GET", null);
    })
  ).data;
  return me;
};

export const auth = async () => {
  const authResponse = await publicRequest("/api/auth?" + WebApp.initData);
  if (!authResponse) return;
  const { accessToken } = authResponse.data;
  localStorage.setItem("accessToken", accessToken);
  await new Promise((res) =>
    WebApp.CloudStorage.setItem("accessToken", accessToken, res),
  );
  return authResponse;
};

import axios from "axios";
import WebApp from "@twa-dev/sdk";

const getAuthToken = async () => {
  const authToken =
    localStorage.getItem("accessToken") ||
    new Promise((resolve, reject) => {
      WebApp.CloudStorage.getItem("accessToken", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  return authToken;
};
export const publicRequest = (url: string) => {
  const requestBody = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // copy body to clipboard
  navigator.clipboard.writeText(JSON.stringify(requestBody));
  return axios(requestBody);
};

export const privateRequest = async (
  url: string,
  method = "POST",
  data = {},
) => {
  const authToken = await getAuthToken();
  return axios({
    method,
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
};

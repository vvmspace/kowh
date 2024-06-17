import axios from "axios";

export const publicRequest = (url: string) => axios.get(url);
export const privateRequest = (url: string, method = "GET", data = {}) => axios({
  method,
  url: url,
  data: data,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
  },
});
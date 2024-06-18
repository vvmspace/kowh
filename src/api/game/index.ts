import { privateRequest } from "../../utils/request";

export const awake = async () => {
  const result = (await privateRequest("/api/awake", "POST")).data;
  return result;
};

export const useCoffee = async () => {
  return (await privateRequest("/api/food/coffee")).data;
};

export const useSandwich = async () => {
  return (await privateRequest("/api/food/sandwich")).data;
};

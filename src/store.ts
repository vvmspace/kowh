import WebApp from "@twa-dev/sdk";

export const getItem = (item, defaultValue) =>
  new Promise((resolve) => {
    WebApp.CloudStorage.getItem(item, (value) => {
      if (value === null) {
        resolve(defaultValue);
      } else {
        resolve(value);
      }
    });
  });

export const setItem = (item, value) =>
  new Promise((resolve) => {
    WebApp.CloudStorage.setItem(item, value, () => {
      resolve(value);
    });
  });

export const removeItem = (item) =>
  new Promise((resolve) => {
    WebApp.CloudStorage.removeItem(item, () => {
      resolve(null);
    });
  });

export const incrementItem = (item, increment = 1) =>
  new Promise((resolve) => {
    WebApp.CloudStorage.getItem(item, (value) => {
      const newValue = value + increment;
      WebApp.CloudStorage.setItem(item, newValue, () => {
        resolve(newValue);
      });
    });
  });

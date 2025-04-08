import { useState } from "react";

export const changeCurrency = (newCurrency: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  user.currency = newCurrency;
  localStorage.setItem("user", JSON.stringify(user));
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<string>(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.currency || "VND";
  });

  const changeCurrencyAndSet = (newCurrency: string) => {
    changeCurrency(newCurrency);
    setCurrency(newCurrency);
  };

  return { currency, changeCurrency: changeCurrencyAndSet };
};

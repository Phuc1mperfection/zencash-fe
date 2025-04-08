export function formatCurrency(amount: number): string {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currency = user.currency || "VND";

  if (currency === "VND") {
    return `${amount.toLocaleString("vi-VN")} VND`;
  } else if (currency === "USD") {
    return `$${amount.toLocaleString("en-US")}`;
  }

  return amount.toString();
}
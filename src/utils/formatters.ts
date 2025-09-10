export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00.000Z");
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (date) => {
  if (!date) return "--";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const statusColor = (status) => {
  if (!status) return "text-gray-500";
  status = status.toLowerCase();
  if (status.includes("delivered")) return "text-green-600 font-medium";
  if (status.includes("in transit")) return "text-blue-600 font-medium";
  if (status.includes("pending")) return "text-orange-600 font-medium";
  if (status.includes("exception")) return "text-red-600 font-medium";
  return "text-gray-700";
};

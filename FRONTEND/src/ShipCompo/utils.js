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

  const s = status.toLowerCase();

  if (s.includes("delivered") || s.includes("success"))
    return "text-green-600 font-semibold";

  if (
    s.includes("in transit") ||
    s.includes("shipped") ||
    s.includes("dispatch") ||
    s.includes("on the way")
  )
    return "text-blue-600 font-semibold";

  if (
    s.includes("pending") ||
    s.includes("arrived") ||
    s.includes("at destination") 
    
  )
    return "text-red-800 font-semibold";

  if (
    s.includes("exception") ||
    s.includes("failed") ||
    s.includes("cancelled") ||
    s.includes("return") ||
    s.includes("rto") ||
    s.includes("processing bag")
  )
    return "text-red-600 font-semibold";
  if (s.includes("out for delivery"))
    return "text-amber-600 font-semibold";  

  if (s.includes("held") || s.includes("waiting"))
    return "text-yellow-600 font-semibold";

  return "text-gray-700 font-medium";
};
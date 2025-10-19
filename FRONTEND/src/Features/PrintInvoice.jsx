import React from "react";

// Helper: Convert numbers to words
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  if (num < 20) return a[num];
  if (num < 100)
    return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 ? " " + numberToWords(num % 100000) : "")
    );
  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore" +
    (num % 10000000 ? " " + numberToWords(num % 10000000) : "")
  );
}

export default function PrintInvoice({ order, onClose }) {
  if (!order) return null;

  const subtotal = order.subtotal || 0;
  const tax = order.tax || 0;
  const discount = order.discount || 0;
  const roundOff = order.roundOff || 0;
  const total = order.total || subtotal + tax - discount + roundOff;
  const grandTotalWords = numberToWords(Math.round(total)) + " Rupees Only";

  return (
    <div
      className="fixed inset-0 bg-white overflow-auto p-0 z-50 font-sans text-[11px]"
      style={{ WebkitPrintColorAdjust: "exact" }}
    >
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-[210mm] min-h-[297mm] mx-auto border border-gray-600 flex flex-col justify-between p-[10mm] overflow-y-auto">

        {/* Header */}
        <div>
          <div className="text-center border-b border-gray-600 pb-2 mb-2">
            <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">
              DUROFILL
            </h1>
            <p className="text-xs text-gray-800">Industrial & Construction Solutions</p>
            <p className="text-xs text-gray-700">
              No. 12, Industrial Estate, Kochi - 682021 | GSTIN: 32AAACD1234A1ZB
            </p>
            <p className="text-[10px] mt-[2px] font-semibold">TAX INVOICE</p>
          </div>

          <div className="flex justify-between text-xs mb-2">
            <div>
              <p><strong>Invoice No:</strong> {order.billNo || "INV-001"}</p>
              <p><strong>Date:</strong> {order.date || new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p><strong>Place of Supply:</strong> Kerala</p>
              <p><strong>State Code:</strong> 32</p>
            </div>
          </div>

          <div className="border border-gray-500 mb-2 text-xs">
            <div className="bg-gray-100 font-semibold border-b border-gray-500 px-2 py-[2px]">
              Buyer Details
            </div>
            <div className="px-2 py-1">
              <p><strong>Party Name:</strong> {order.ledger}</p>
              <p><strong>GSTIN:</strong> {order.ledgerGSTIN || "N/A"}</p>
              <p><strong>Address:</strong> {order.ledgerAddress || "—"}</p>
            </div>
          </div>

          <table className="w-full border border-gray-500 border-collapse text-[11px]">
            <thead className="bg-gray-100 border-b border-gray-500">
              <tr>
                <th className="border px-1 py-[2px] text-center w-[20px]">#</th>
                <th className="border px-1 py-[2px] text-left">Description</th>
                <th className="border px-1 py-[2px] text-center w-[50px]">Qty</th>
                <th className="border px-1 py-[2px] text-center w-[50px]">Unit</th>
                <th className="border px-1 py-[2px] text-center w-[60px]">Rate</th>
                <th className="border px-1 py-[2px] text-right w-[70px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td className="border px-1 py-[2px] text-center">{i + 1}</td>
                  <td className="border px-1 py-[2px]">{item.name}</td>
                  <td className="border px-1 py-[2px] text-center">{item.qty}</td>
                  <td className="border px-1 py-[2px] text-center">{item.unit}</td>
                  <td className="border px-1 py-[2px] text-center">
                    ₹{item.rate.toFixed(2)}
                  </td>
                  <td className="border px-1 py-[2px] text-right">
                    ₹{(item.qty * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Signatures */}
        <div className="mt-3 flex flex-col">
          <div className="flex justify-between border-t border-gray-500 pt-2">
            <div className="w-[60%] pr-2">
              <p className="text-xs">
                <strong>Amount in Words:</strong> {grandTotalWords}
              </p>
              <p className="text-[10px] mt-3 italic text-gray-500">
                * Subject to Kochi jurisdiction only.
              </p>
            </div>
            <div className="w-[40%] border-l border-gray-400 pl-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Round Off</span>
                <span>{roundOff >= 0 ? "+" : ""} ₹{roundOff.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-500 mt-1 pt-1 font-semibold text-sm">
                <span>Grand Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mt-10 text-xs">
            <div>
              <p>Receiver’s Signature</p>
              <div className="border-t border-gray-500 w-48 mt-6"></div>
            </div>
            <div className="text-right">
              <p>For <strong>{order.ledger}</strong></p>
              <div className="border-t border-gray-500 w-40 mt-6"></div>
              <p>Authorized Signatory</p>
            </div>
          </div>

          {/* Buttons at Bottom */}
          <div className="mt-4 flex justify-end gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-xs"
            >
              🖨️ Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-400 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
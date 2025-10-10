import React from "react";

// Convert number to words (simplified)
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
  return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(num % 10000000) : "");
}

export default function PrintInvoice({ order, onClose }) {
  if (!order) return null;

  const subtotal = order.items?.reduce((acc, i) => acc + i.qty * i.rate, 0) || 0;
  const cgst = parseFloat((subtotal * 0.09).toFixed(2));
  const sgst = parseFloat((subtotal * 0.09).toFixed(2));
  const grandTotal = parseFloat((subtotal + cgst + sgst).toFixed(2));
  const grandTotalWords = numberToWords(Math.round(grandTotal)) + " Rupees Only";

  return (
    <div
      className="fixed inset-0 bg-white overflow-auto p-0 z-50 font-sans text-[11px] print:p-0"
      style={{
        margin: 0,
        WebkitPrintColorAdjust: "exact",
      }}
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

      <div className="w-[210mm] min-h-[297mm] mx-auto px-[10mm] py-[8mm] border border-gray-400 print:border-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-400 pb-1 mb-1">
          <div>
            <h1 className="text-lg font-bold text-gray-800">🏢 My Company Pvt. Ltd.</h1>
            <p className="text-gray-700 text-xs">123 Industrial Area, Kochi</p>
            <p className="text-gray-700 text-xs">GSTIN: 22AAAAA0000A1Z5</p>
          </div>
          <div className="text-right text-xs text-gray-700">
            <p><strong>Tax Invoice</strong></p>
            <p>Date: {order.date}</p>
            {order.invoiceNo && <p>Invoice No: {order.invoiceNo}</p>}
          </div>
        </div>

        {/* Buyer Details */}
        <div className="border-b border-gray-400 pb-1 mb-1 flex justify-between text-xs">
          <div>
            <p><strong>Buyer:</strong> {order.ledger}</p>
            {order.address && <p>{order.address}</p>}
            <p>GSTIN: {order.gstin || "N/A"}</p>
          </div>
          <div className="text-right">
            <p><strong>Place of Supply:</strong> Kerala</p>
            <p><strong>State Code:</strong> 32</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border border-gray-400 border-collapse text-[11px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-1 py-[2px] text-left w-[20px]">#</th>
              <th className="border px-1 py-[2px] text-left">Description of Goods</th>
              <th className="border px-1 py-[2px] text-center w-[40px]">Qty</th>
              <th className="border px-1 py-[2px] text-center w-[40px]">Unit</th>
              <th className="border px-1 py-[2px] text-center w-[60px]">Rate</th>
              <th className="border px-1 py-[2px] text-right w-[70px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((i, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-1 py-[2px] text-center">{idx + 1}</td>
                <td className="border px-1 py-[2px]">{i.name}</td>
                <td className="border px-1 py-[2px] text-center">{i.qty}</td>
                <td className="border px-1 py-[2px] text-center">{i.unit}</td>
                <td className="border px-1 py-[2px] text-center">{i.rate.toFixed(2)}</td>
                <td className="border px-1 py-[2px] text-right">{(i.qty * i.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-between border-t border-gray-400 pt-2 mt-2">
          <div className="w-[60%] pr-2">
            <p className="text-xs"><strong>Amount in Words:</strong> {grandTotalWords}</p>
            <p className="text-[10px] mt-2 italic text-gray-500">* This is a computer-generated invoice.</p>
          </div>
          <div className="w-[40%] border-l border-gray-300 pl-2 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span>₹{cgst}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span>₹{sgst}</span>
            </div>
            <div className="flex justify-between border-t border-gray-400 mt-1 pt-1 font-semibold">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mt-6 text-xs">
          <div>
            <p>Receiver’s Signature: ____________________</p>
          </div>
          <div className="text-right">
            <p>For <strong>Safa Polymers.</strong></p>
            <p className="mt-3">Authorized Signatory</p>
          </div>
        </div>

        {/* Buttons */}
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
  );
}

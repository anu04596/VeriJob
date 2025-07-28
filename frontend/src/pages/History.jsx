import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import API_BASE_URL from './config';

const History = () => {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(`${API_BASE_URL}/history?uid=${user.uid}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setHistory(data);
    };

    fetchHistory();
  }, [user.uid, token]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Prediction History", 105, 15, null, null, "center");

    let y = 30;

    history.forEach((item, index) => {
      const inputText =
        item?.input?.text?.description?.replace(/\n/g, " ") || "N/A";
      const prediction = item?.result?.prediction || "Unknown";
      const confidence =
        item?.result?.confidence !== undefined
          ? `${item.result.confidence}%`
          : "N/A";
      const topWords = item?.topWords?.join(", ") || "N/A";

      doc.text(`${index + 1}. Input:`, 10, y);
      y += 7;
      doc.text(doc.splitTextToSize(inputText, 180), 10, y);
      y += 10;

      doc.text(`Prediction: ${prediction}`, 10, y);
      y += 7;

      doc.text(`Confidence: ${confidence}`, 10, y);
      y += 7;

      doc.text(`Top Words: ${topWords}`, 10, y);
      y += 10;

      if (y >= 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("prediction_history.pdf");
  };
  

  const deleteHistoryItem = async (timestamp) => {
  try {
    await fetch(`${API_BASE_URL}/delete_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
       },
      body: JSON.stringify({
        uid: user.uid,
        timestamp: timestamp // send as number (not string or formatted date)
      }),
    });

    // Optimistically update UI
    setHistory((prev) =>
      prev.filter((entry) => entry.timestamp !== timestamp)
    );
  } catch (err) {
    console.error("Failed to delete history:", err);
  }
};


  // Only paste this updated return JSX part into your existing History.js file

return (
  <motion.div
    className="p-4 sm:p-6 min-h-screen bg-blue-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-700 mb-6">
      Prediction History
    </h2>

    <div className="flex justify-center mb-4">
      <Button
        onClick={downloadPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
      >
        Download PDF
      </Button>
    </div>

    <div className="space-y-6">
      {history.length === 0 ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          No history found.
        </p>
      ) : (
        history.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="mb-2 text-sm sm:text-base">
              <strong>Input:</strong> {item.input?.text?.description || "N/A"}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Prediction:</strong> {item.result?.prediction}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Confidence:</strong> {item.result?.confidence}%
            </p>
            <p className="text-sm sm:text-base">
              <strong>Top Words:</strong>{" "}
              {item.topWords?.length > 0 ? item.topWords.join(", ") : "N/A"}
            </p>
            <button
              onClick={() => deleteHistoryItem(item.timestamp)}
              className="mt-3 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 text-xs sm:text-sm"
            >
              Delete
            </button>
          </motion.div>
        ))
      )}
    </div>
  </motion.div>
);

}
export default History;

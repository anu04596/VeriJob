import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from './config';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [text, setText] = useState("");
  const [stipend, setStipend] = useState(0);
  const [hasMentor, setHasMentor] = useState(false);
  const [difficulty, setDifficulty] = useState("Very Low");
  const [contactMode, setContactMode] = useState("WhatsApp");
  const [certificateOnly, setCertificateOnly] = useState(true);
  const [asksForMoney, setAsksForMoney] = useState(true);
  const [redFlags, setRedFlags] = useState(4);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first!");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("${API_BASE_URL}/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
         },
        body: JSON.stringify({
          uid: user.uid,
          structured: {
            stipend: Number(stipend),
            has_mentor: hasMentor,
            tasks_difficulty: difficulty,
            contact_mode: contactMode,
            certificate_only: certificateOnly,
            asks_for_money: asksForMoney,
            red_flags: Number(redFlags),
          },
          text: {
            description: text,
            offer_letter_text: text,
          },
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-tr from-indigo-50 to-purple-100 px-4 sm:px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-6 sm:mb-8">
        Dashboard - Analyze Your Offer
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-4"
      >
        <textarea
          rows="5"
          placeholder="Paste the job or internship description here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label>Stipend:</label>
            <input
              type="number"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              className="w-full border px-3 py-1 rounded"
            />
          </div>

          <div>
            <label>Task Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border px-3 py-1 rounded"
            >
              <option>Very Low</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Contact Mode:</label>
            <select
              value={contactMode}
              onChange={(e) => setContactMode(e.target.value)}
              className="w-full border px-3 py-1 rounded"
            >
              <option>WhatsApp</option>
              <option>Email</option>
              <option>LinkedIn</option>
            </select>
          </div>

          <div>
            <label>Red Flags (0–5):</label>
            <input
              type="number"
              min={0}
              max={5}
              value={redFlags}
              onChange={(e) => setRedFlags(e.target.value)}
              className="w-full border px-3 py-1 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasMentor}
              onChange={() => setHasMentor(!hasMentor)}
            />
            Has Mentor
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={certificateOnly}
              onChange={() => setCertificateOnly(!certificateOnly)}
            />
            Certificate Only
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={asksForMoney}
              onChange={() => setAsksForMoney(!asksForMoney)}
            />
            Asks for Money
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          {loading ? "Analyzing..." : "Check"}
        </button>
      </form>

      {result && (
        <motion.div
          className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-bold">
            Result:{" "}
            <span
              className={
                result.prediction === "Fake"
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {result.prediction}
            </span>
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Confidence: {result.confidence}%
          </p>

          {result.top_words && (
            <div className="mt-4">
              <p className="font-semibold">Top Contributing Words:</p>
              <ul className="list-disc ml-6 text-sm mt-1 text-gray-600">
                {result.top_words.map(([word, score], i) => (
                  <li key={i}>
                    {word} — {score}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;

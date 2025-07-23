import React from "react";
import { motion } from "framer-motion";

const examples = [
  {
    type: "Fake",
    text: "Congratulations! You are selected for a remote internship at Google. Kindly pay ₹850 as security fee.",
    reason: "No authentic company charges fees for recruitment.",
  },
  {
    type: "Real",
    text: "Your onboarding for the Software Engineer role at TCS is scheduled on Monday. Check the portal for documents.",
    reason: "Clear role details, onboarding info, and no payment requests.",
  },
  {
    type: "Fake",
    text: "You’ve been shortlisted by Wipro HR. Please share your Aadhaar card and bank details over WhatsApp.",
    reason: "Professional companies never request sensitive info via WhatsApp.",
  },
  {
    type: "Real",
    text: "We are excited to offer you a 2-month internship at Zomato. No fees, and all documents will be shared via official email.",
    reason: "No payment asked, professional communication.",
  },
  {
    type: "Fake",
    text: "Virtual internship alert: Join Amazon's project team by paying ₹499 to confirm your seat.",
    reason: "Fake projects usually ask for upfront payments and vague roles.",
  },
  {
    type: "Real",
    text: "Dear Candidate, your resume has been shortlisted for an interview at Infosys. Kindly appear for an online test via the official Infosys portal.",
    reason: "No fee involved, official process mentioned.",
  },
];

const Gallery = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 md:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700 mb-10">
        Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {examples.map((example, index) => (
          <motion.div
            key={index}
            className={`p-4 sm:p-6 rounded-xl shadow-lg bg-white border-l-8 ${
              example.type === "Fake" ? "border-red-400" : "border-green-400"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-2 font-semibold text-lg sm:text-xl">
              {example.type === "Fake" ? "🚩 Fake Offer" : "✅ Real Offer"}
            </div>
            <div className="text-gray-700 mb-3 italic text-sm sm:text-base">
              "{example.text}"
            </div>
            <div className="text-sm sm:text-base text-gray-600">
              <strong>Why:</strong> {example.reason}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Gallery;

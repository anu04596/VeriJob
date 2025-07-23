import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-100 via-blue-50 to-white min-h-screen text-gray-800">
      {/* Hero */}
      <motion.div
        className="text-center py-20 px-4 sm:px-6 md:px-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-blue-700">
          Your Shield Against Fake Jobs And Internships
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-600">
          Your reliable companion in identifying scam internship/job offers. Analyze descriptions and stay safe.
        </p>
        <Link to="/dashboard">
          <button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-lg shadow">
            Get Started
          </button>
        </Link>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10 text-blue-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {[
            {
              title: "1. Paste the Offer",
              desc: "Copy and paste the internship/job offer text.",
              icon: "📋",
            },
            {
              title: "2. Analyze Instantly",
              desc: "Our AI model evaluates the text in real time.",
              icon: "🤖",
            },
            {
              title: "3. Get Results",
              desc: "Know whether it's fake or genuine with confidence.",
              icon: "✅",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition-all text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-bold text-lg sm:text-xl text-blue-700">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-blue-700">Why This Project?</h2>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          With the rise of remote opportunities, fake internships and scams have also increased.
          This tool helps students and job seekers protect themselves by using machine learning to
          analyze text patterns and classify suspicious offers.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center py-12 bg-indigo-100 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-indigo-800">
          Ready to try it out?
        </h3>
        <Link to="/dashboard">
          <button className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow">
            Check Internships Now
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;

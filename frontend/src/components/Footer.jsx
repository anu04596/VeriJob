import { motion } from "framer-motion";
import React from "react";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 text-center text-xs sm:text-sm py-4 text-gray-700 shadow-inner mt-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      © {new Date().getFullYear()} <span className="font-semibold">VeriJob</span>. Built with ❤️.
    </motion.footer>
  );
};

export default Footer;

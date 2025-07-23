import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // install lucide-react or use heroicons

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    syncUser();
    const handleStorageChange = (e) => {
      if (e.key === "user") syncUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
    window.location.reload();
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200 text-gray-800 shadow-md sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-indigo-600 transition-colors">
          VeriJob
        </Link>

        {/* Mobile menu toggle button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-indigo-600 font-medium">Home</Link>
          <Link to="/dashboard" className="hover:text-indigo-600 font-medium">Dashboard</Link>
          <Link to="/history" className="hover:text-indigo-600 font-medium">History</Link>
          <Link to="/gallery" className="hover:text-indigo-600 font-medium">Gallery</Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" className="hover:text-indigo-600 font-medium">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-indigo-600 font-medium">Profile</Link>
              <button onClick={handleLogout} className="hover:text-red-600 font-medium">Logout</button>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-md rounded-b-xl">
          <Link to="/" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Home</Link>
          <Link to="/dashboard" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Dashboard</Link>
          <Link to="/history" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">History</Link>
          <Link to="/gallery" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Gallery</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={toggleMenu} className="block hover:text-indigo-600 font-medium">Profile</Link>
              <button onClick={() => { toggleMenu(); handleLogout(); }} className="block w-full text-left hover:text-red-600 font-medium">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;

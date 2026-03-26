import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-all ${
        scrolled
          ? "bg-white/90 border-b border-gray-300 shadow-md"
          : "bg-white/70 border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-destructive p-1.5 rounded-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <motion.span
              className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-md cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              GlobeTrek
            </motion.span>
          </Link>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-5"
        >
          <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Trip</span>
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2 px-5 hover:scale-105 transition"
            onClick={() => setOpenDialog(true)}
          >
            <User className="w-4 h-4" />
            Login
          </Button>

          <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
        </motion.div>
      </div>

      {/* Always visible bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300" />
    </motion.header>
  );
};

export default Header;
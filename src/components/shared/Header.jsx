import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Plus, User, Package, LogOut } from "lucide-react"; // added Package and LogOut
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { googleLogout } from "@react-oauth/google";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    navigate("/");
  };

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
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:scale-105 transition"
            onClick={() => navigate("/create-trip")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Trip</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={user?.picture}
                  alt="userProfile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-500 hover:scale-105 transition-transform"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 p-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                <DropdownMenuSeparator className="my-1 border-gray-300/40" />

                <DropdownMenuItem
                  onClick={() => navigate("/my-trips")}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-purple-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  My Trips
                </DropdownMenuItem>

                <DropdownMenuItem
  onClick={handleLogout}
  className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
>
  <LogOut className="w-4 h-4 text-red-600" />
  Logout
</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="destructive"
              className="flex items-center gap-2 px-5 hover:scale-105 transition"
              onClick={() => setOpenDialog(true)}
            >
              <User className="w-4 h-4" />
              Login
            </Button>
          )}

          {/* Login Dialog */}
          <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
        </motion.div>
      </div>

      {/* Always visible bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300" />
    </motion.header>
  );
};

export default Header;
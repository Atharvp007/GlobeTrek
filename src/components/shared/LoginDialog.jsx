import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { usegoogleAuth } from "../../services/authApi";
import { motion } from "framer-motion";

const LoginDialog = ({ open, onClose, onLoginSuccess }) => {
  const handleLogin = usegoogleAuth({
    onSuccess: () => {
      onClose();
      onLoginSuccess?.();
      toast.success("Login Successful");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 md:p-10 bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome Back!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Log in to unlock AI-powered itineraries, save your trips, and sync them across all your devices.
            </DialogDescription>
          </DialogHeader>

          {/* Google Login Button */}
          <DialogFooter>
            <Button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold hover:scale-105 transition-all shadow-lg"
            >
              <FaGoogle className="w-5 h-5" />
              Continue with Google
            </Button>
          </DialogFooter>

          <p className="text-sm text-gray-500 text-center">
            By logging in, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
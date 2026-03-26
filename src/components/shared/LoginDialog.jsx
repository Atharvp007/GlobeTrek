import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { usegoogleAuth } from "../../services/authApi";

const LoginDialog = ({ open, onClose ,onLoginSuccess}) => {

  const handleLogin = usegoogleAuth({
    onSuccess: () => {
      onClose();
      onLoginSuccess?.();
      toast.success("Login Successful");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
         <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>
            Log in to unlock AI itineraries and save your plans. Sync your travel schedules across all your devices.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => handleLogin()} className={"w-full rounded-md"}>
            <FaGoogle className="mr-2" />
            Login with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
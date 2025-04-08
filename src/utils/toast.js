import { toast } from "react-hot-toast";

export const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast(message, { icon: "⚠️" });
      break;
    default:
      toast(message);
  }
};

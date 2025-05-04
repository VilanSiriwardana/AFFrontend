import { toast } from "react-toastify";

const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message, {
        style: { fontSize: "14px" },
      });
      break;
    case "error":
      toast.error(message, {
        style: { fontSize: "14px" },
      });
      break;
    case "info":
      toast.info(message, {
        style: { fontSize: "14px" },
      });
      break;
    case "warning":
      toast.warning(message, {
        style: { fontSize: "14px" },
      });
      break;
    default:
      toast(message, {
        style: { fontSize: "14px" },
      });
      break;
  }
};

export default showToast;

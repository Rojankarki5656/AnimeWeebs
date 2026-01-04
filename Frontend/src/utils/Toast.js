import { toast } from "react-toastify";

const notify = (type, msg) => {
  switch (type) {
    case "info":
      return toast.info(msg);
    case "success":
      return toast.success(msg);
    case "warning":
      return toast.warn(msg);
    case "error":
      return toast.error(msg);
    default:
      return toast(msg);
  }
};

export default notify;

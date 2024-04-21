import { toast } from "react-toastify";

export default function notifyError(msg) {
  toast.error(msg, {
    position: "top-center",
  });
}

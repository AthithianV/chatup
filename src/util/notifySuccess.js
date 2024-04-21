import { toast } from "react-toastify";

export default function notifySuccess(msg) {
  toast.success(msg, {
    position: "top-center",
  });
}

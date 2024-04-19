import { ClipLoader } from "react-spinners";

export default function Spinner() {
  return (
    <ClipLoader
      color={"black"}
      loading={true}
      size={25}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

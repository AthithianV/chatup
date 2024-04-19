import { BeatLoader } from "react-spinners";

export default function SiderBarLoader() {
  return (
    <BeatLoader
      color={"black"}
      loading={true}
      size={25}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

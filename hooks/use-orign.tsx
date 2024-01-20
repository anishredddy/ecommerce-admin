import { useEffect, useState } from "react";

export const useOrign = () => {
  const [mounted, setMounted] = useState(false);

  const orign =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return " ";
  }

  return orign;
};

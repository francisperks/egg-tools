import { useEffect, useState } from "react";

export const useViewportState = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsCollapsed(width >= 768 && width <= 1220);
    };

    updateState();
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, []);

  return { isMobile, isCollapsed };
};

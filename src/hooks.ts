import { useState } from "react";

export const useToggle = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = (): void => {
    setIsShowing(!isShowing);
    return;
  };

  return [isShowing, toggle];
};

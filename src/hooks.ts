import {useState} from 'react';

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
    return;
  }

  return [isShowing, toggle];
};

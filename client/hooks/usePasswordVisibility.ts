import { useState } from 'react';

export function usePasswordVisibility(initiallyVisible = false) {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  const toggle = () => setIsVisible((prev) => !prev);

  return { isVisible, toggle };
}

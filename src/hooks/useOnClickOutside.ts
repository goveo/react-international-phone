import { RefObject, useEffect } from 'react';

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>({
  ref,
  onClickOutside,
}: {
  ref: RefObject<T>;
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
}) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onClickOutside(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, onClickOutside]);
};

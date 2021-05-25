import { useEffect, useRef } from 'react';

interface IDismissable<T extends HTMLElement, C extends HTMLElement> {
  refDismissable: React.RefObject<T>;
  refControl: React.RefObject<C>;
}

export function useDismissableElement<T extends HTMLElement, C extends HTMLElement = HTMLElement>(
  onRequestClose: () => void
): IDismissable<T, C> {
  const refDismissable = useRef<T>(null);
  const refControl = useRef<C>(null);

  useEffect(() => {
    function checkForDismissClick(e: any) {
      const dismissable = refDismissable.current;
      const control = refControl.current;

      if (!dismissable || dismissable.contains(e.target)) {
        return;
      }

      if (control && control.contains(e.target)) {
        return;
      }

      onRequestClose();
    }

    function checkForDismissKey(e: any) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        onRequestClose();
      }
    }

    document.addEventListener('mousedown', checkForDismissClick);
    document.addEventListener('keydown', checkForDismissKey);
    return () => {
      document.removeEventListener('mousedown', checkForDismissClick);
      document.removeEventListener('keydown', checkForDismissKey);
    };
  }, [onRequestClose]);

  return { refDismissable, refControl };
}

export function getAbbreviation(phrase: string) {
  const wordsToExclude = ['and', 'or', 'of', 'to', 'the'];
  return phrase
    .split(' ')
    .filter(item => !wordsToExclude.includes(item))
    .map(item => item.charAt(0))
    .join('')
    .substring(0, 3);
}

export async function halfSecondPromise() {
  await new Promise<void>((resolve, _) => {
    setTimeout(() => resolve(), 500);
  });
}

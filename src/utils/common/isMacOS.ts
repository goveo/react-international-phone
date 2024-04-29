export const isMacOS = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.navigator.userAgent.toLowerCase().includes('macintosh');
};

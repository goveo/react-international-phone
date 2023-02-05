export const scrollToChild = (parent: HTMLElement, child: HTMLElement) => {
  const initialDisplayValue = parent.style.display;
  // HACK: can't use getBoundingClientRect when display is 'none'
  if (initialDisplayValue !== 'block') {
    parent.style.display = 'block';
  }

  child.scrollIntoView({ block: 'nearest' });

  parent.style.display = initialDisplayValue;
};

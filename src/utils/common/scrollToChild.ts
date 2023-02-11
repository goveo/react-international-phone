export const scrollToChild = (parent: HTMLElement, child: HTMLElement) => {
  const initialDisplayValue = parent.style.display;
  // HACK: can't use getBoundingClientRect when display is 'none'
  if (initialDisplayValue !== 'block') {
    parent.style.display = 'block';
  }

  const parentPosition = parent.getBoundingClientRect();
  const childPosition = child.getBoundingClientRect();

  const topOffset = childPosition.top - parentPosition.top;
  const bottomOffset = parentPosition.bottom - childPosition.bottom;

  const isChildVisible = topOffset >= 0 && bottomOffset >= 0;

  if (!isChildVisible) {
    if (Math.abs(topOffset) < Math.abs(bottomOffset)) {
      // element above the container
      parent.scrollTop += topOffset;
    } else {
      // element below the container
      parent.scrollTop -= bottomOffset;
    }
  }

  parent.style.display = initialDisplayValue;
};

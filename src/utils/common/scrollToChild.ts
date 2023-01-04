// https://stackoverflow.com/a/45411081/7686245

export const scrollToChild = (parent: HTMLElement, child: HTMLElement) => {
  const initialDisplayValue = parent.style.display;
  // HACK: can't use getBoundingClientRect when display is 'none'
  if (initialDisplayValue !== 'block') {
    parent.style.display = 'block';
  }

  const { top: parentTop } = parent.getBoundingClientRect();
  const { top: childTop } = child.getBoundingClientRect();

  const isChildVisible =
    childTop >= parentTop && childTop <= parentTop + parent.clientHeight;

  if (!isChildVisible) {
    parent.scrollTop += childTop - parentTop;
  }

  parent.style.display = initialDisplayValue;
};

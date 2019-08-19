export const colorSelector = (quality: number) => {
  switch (quality) {
    case 2:
      return 'blue';
    case 3:
      return 'purple';
    case 4:
      return 'orange';
    default:
      return 'green';
  }
};

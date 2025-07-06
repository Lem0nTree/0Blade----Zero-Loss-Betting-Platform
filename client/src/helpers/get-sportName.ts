export const getSportName = (categoryId: string) => {
  if (categoryId === '0') {
    return 'Soccer';
  } else if (categoryId === '1') {
    return 'UFC';
  } else if (categoryId === '2') {
    return 'Hockey';
  } else if (categoryId === '3') {
    return 'WWE';
  }
};

export const getSportIcon = (categoryId: string) => {
  if (categoryId === '0') {
    return 'sdbr_ic_02.svg';
  } else if (categoryId === '1') {
    return 'sdbr_ic_01.svg';
  } else if (categoryId === '3') {
    return 'sdbr_ic_03.svg';
  } else if (categoryId === '4') {
    return 'sdbr_ic_04.svg';
  }
};

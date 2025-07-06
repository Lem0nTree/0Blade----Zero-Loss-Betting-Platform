import betOptions from '../data/betOptions.json';

export const getOptionDetails = (optionId: number, categoryId: string) => {
  let indexId = 99999;
  let groupId = 99999;
  let sportId = 99999;
  betOptions.map((betOption, sportIndex) => {
    if (betOption.category == Number(categoryId)) {
      betOption.betOptions.map((group, groupIndex) => {
        group.options.map((option, index) => {
          if (option.value === optionId.toString()) {
            indexId = index;
            groupId = groupIndex;
            sportId = sportIndex;
          }
        });
      });
    }
  });
  return {
    label: betOptions[sportId].betOptions[groupId].label,
    option: betOptions[sportId].betOptions[groupId].options[indexId],
  };
};

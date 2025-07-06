export const getMultiplier = (
  position: number,
  selectedBet: number,
  totalBettedAmount: number,
  treasuryFund: number,
  farmapy: number,
  lockingPeriod: number
) => {
  return (
    //  reward = userbet /  (userbet + totaloutputbet) * pot
    //  reward = userbet /  (userbet + totaloutputbet) * (totalbetted amount * farmapy / 365 * lockingperiod)%
    //  multiplier = (reward + userbet) / userbet
    (
      (((position / (position + selectedBet)) *
        (((totalBettedAmount + treasuryFund + position) *
          (farmapy / 365) *
          (lockingPeriod / 86400)) /
          100)) /
        2.5 + // Since usually the pot is divided between at least 3 winning output
        position) /
      position
    ).toFixed(2)
  );
};

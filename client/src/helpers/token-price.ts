import axios from 'axios';

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=mmfinance,crypto-com-chain&vs_currencies=usd';

  const { data } = await axios.get(url);

  cache['zBet'] = data['mmfinance'].usd;
  cache['CRO'] = data['crypto-com-chain'].usd;
};

export const getTokenPrice = (symbol: string): number => {
  return Number(cache[symbol]);
};

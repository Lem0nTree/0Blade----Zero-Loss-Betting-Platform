import axios from 'axios';

const CACHED_PRICES = {};
const CACHED_PROMISES = {};
export async function getTokenData(id = 'binancecoin') {
  if (CACHED_PRICES[id]) {
    return CACHED_PRICES[id];
  }

  if (!CACHED_PROMISES[id]) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;
    CACHED_PROMISES[id] = axios.get(url);
  }

  const res = await CACHED_PROMISES[id];

  CACHED_PRICES[id] = {
    price: res.data[id].usd,
  };

  return CACHED_PRICES[id];
}

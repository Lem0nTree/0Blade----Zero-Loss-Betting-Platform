import Web3 from "web3";

export function convertWei(value) {
  return +Web3.utils.fromWei(Number(value).toLocaleString("fullwide", { useGrouping: false }));
}

// export function convertWei(value) {
//   return Number(value) / 1e18;
// }

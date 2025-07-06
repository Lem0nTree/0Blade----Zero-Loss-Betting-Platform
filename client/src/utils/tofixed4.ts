import fromExponential from "from-exponential";

export function toFixed4(value: number) {
  return +value.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
}

export function toFixed2(value: number) {
  return +value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
}

export function toFixed6(value: number) {
  return +value.toString().match(/^-?\d+(?:\.\d{0,6})?/)[0];
}

export function fullLength(value: number) {
  return fromExponential(value);
}
/* eslint-disable no-restricted-properties */
import { BigNumber } from "bignumber.js";
import moment from "moment";

const STORAGE_PREFIX = "WEB_";

function storage(key, value) {
  if (value !== undefined) {
    return window.localStorage.setItem(STORAGE_PREFIX + key, value);
  }
  return window.localStorage.getItem(STORAGE_PREFIX + key);
}
function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
function formatHash(hash) {
  if (hash.length <= 12) return hash;
  const pre = hash.slice(0, 8);
  const suf = hash.slice(-4);
  return `${pre}...${suf}`;
}

function fixedBalanceAmountRaw(
  noDecimaledAmount,
  fixed,
  decimals,
  side = BigNumber.ROUND_DOWN
) {
  return new BigNumber(noDecimaledAmount)
    .div(new BigNumber(10).pow(decimals))
    .toFixed(Number(fixed) === 18 ? 17 : fixed, side)
    .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, "$1");
}
function toBalanceNoDecimaledRaw(balance, decimals) {
  return new BigNumber(balance)
    .times(new BigNumber(10).pow(decimals))
    .toFixed(0, BigNumber.ROUND_DOWN);
}

function handleDate(timestamp) {
  const date = moment(parseInt(`${timestamp}000`)).format("MMM Do YY");
  return date;
}
export {
  storage,
  formatAddress,
  fixedBalanceAmountRaw,
  formatHash,
  toBalanceNoDecimaledRaw,
  handleDate,
};

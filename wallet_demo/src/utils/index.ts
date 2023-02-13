import { BigNumber } from 'bignumber.js'

const STORAGE_PREFIX = 'WEB_'

export function storage(key: string, value?: any) {
  if (value !== undefined) {
    return window.localStorage.setItem(STORAGE_PREFIX + key, value)
  }
  return window.localStorage.getItem(STORAGE_PREFIX + key)
}

export function formatHash(hash: String) {
  if (hash.length <= 12) return hash
  const pre = hash.slice(0, 8)
  const suf = hash.slice(-4)
  return `${pre}...${suf}`
}

export function fixedBalanceAmountRaw(
  noDecimaledAmount: any,
  fixed: number,
  decimals = 18,
  side = BigNumber.ROUND_DOWN
) {
  return new BigNumber(noDecimaledAmount)
    .div(new BigNumber(10).pow(decimals))
    .toFixed(Number(fixed) === 18 ? 17 : fixed, side)
    .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}
export function toBalanceNoDecimaledRaw(balance: string, decimals: number) {
  return new BigNumber(balance)
    .times(new BigNumber(10).pow(decimals))
    .toFixed(0, BigNumber.ROUND_DOWN)
}

export function handleDate(timestamp: string) {
  // const date = moment(parseInt(`${timestamp}000`)).format("MMM Do YY");
  // return date;
}

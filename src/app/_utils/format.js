// Copyright 2016-2017 Rigo Investment Sagl.

// import { api } from '../parity';

import BigNumber from 'bignumber.js'

const DIVISOR = 10 ** 6
const ZERO = new BigNumber(0)

/**
 * A unit amount is defined as the amount of a token above the specified decimal places (integer part).
 * E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
 * to 1 unit.
 * @param   amount      The amount in baseUnits that you would like converted to units.
 * @param   decimals    The number of decimal places the unit amount has.
 * @return  The amount in units.
 */
export function toUnitAmount(amount, decimals) {
  const aUnit = new BigNumber(10).pow(decimals)
  const unit = amount.div(aUnit)
  return unit
}
/**
 * A baseUnit is defined as the smallest denomination of a token. An amount expressed in baseUnits
 * is the amount expressed in the smallest denomination.
 * E.g: 1 unit of a token with 18 decimal places is expressed in baseUnits as 1000000000000000000
 * @param   amount      The amount of units that you would like converted to baseUnits.
 * @param   decimals    The number of decimal places the unit amount has.
 * @return  The amount in baseUnits.
 */
export function toBaseUnitAmount(amount, decimals) {
  const unit = new BigNumber(10).pow(decimals)
  const baseUnitAmount = amount.times(unit)
  const hasDecimals = baseUnitAmount.decimalPlaces() !== 0
  if (hasDecimals) {
    throw new Error(
      `Invalid unit amount: ${amount.toString()} - Too many decimal places`
    )
  }
  return baseUnitAmount
}

export function formatBlockNumber(blockNumber) {
  return ZERO.eq(blockNumber || 0) ? 'Pending' : `#${blockNumber.toFormat()}`
}

export function formatCoins(amount, decimals = 4) {
  //prev. decimals = 6
  // console.log(amount.toNumber())
  const adjusted = amount.div(DIVISOR)
  if (decimals === -1) {
    if (adjusted.gte(10000)) {
      decimals = 0
    } else if (adjusted.gte(1000)) {
      decimals = 1
    } else if (adjusted.gte(100)) {
      decimals = 2
    } else if (adjusted.gte(10)) {
      decimals = 3
    } else {
      decimals = 4
    }
  }

  return adjusted.toFormat(decimals)
}

export function formatEth(eth, decimals = 4, api) {
  return api.util.fromWei(eth).toFormat(decimals)
}

export function formatHash(hash) {
  return `${hash.substr(0, 10)}...${hash.substr(-8)}`
}

export function toHex(str) {
  if (str && str.toString) {
    str = str.toString(16)
  }

  if (str && str.substr(0, 2) === '0x') {
    return str.toLowerCase()
  }

  return `0x${(str || '').toLowerCase()}`
}

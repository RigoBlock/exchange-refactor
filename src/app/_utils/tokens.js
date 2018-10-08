export const ERCdEX = 'ERCdEX'
export const Ethfinex = 'Ethfinex'

export const ERC20_TOKENS = {
  kovan: {
    WETH: {
      symbol: 'WETH',
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    ZRX: {
      symbol: 'ZRX',
      symbolTicker: {
        Ethfinex: 'ZRX'
      },
      address: '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
      decimals: 18,
      name: '0x Protocol Token'
    },
    GNT: {
      symbol: 'GNT',
      symbolTicker: {
        Ethfinex: 'GNT'
      },
      address: '0xef7fff64389b814a946f3e92105513705ca6b990',
      decimals: 18,
      name: 'Golem Network Token'
    },
    MKR: {
      symbol: 'MKR',
      symbolTicker: {
        Ethfinex: 'MKR'
      },
      address: '0x1dad4783cf3fe3085c1426157ab175a6119a04ba',
      decimals: 18,
      name: 'MakerDAO'
    },
    USDT: {
      symbol: 'USDT',
      symbolTicker: {
        Ethfinex: 'USD'
      },
      address: '0x3487A04103859A6d95ba0bAFdCf1Ca521490176E',
      decimals: 18,
      name: 'Tether USD'
    },
    GRG: {
      symbol: 'GRG',
      symbolTicker: {
        Ethfinex: 'GRG'
      },
      faucetAddress: '0x22974713439f6b74a1ea247ce6d42b285d12c8e0',
      address: '0x9F121AFBc98A7a133fbb31fE975205f39e8f08D2',
      decimals: 6,
      name: 'GRG Token'
    }
  },
  mainnet: {
    WETH: {
      symbol: 'WETH',
      symbolTicker: {
        [Ethfinex]: 'ETH'
      },
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
      name: 'Wrapped Ether'
    },
    ZRX: {
      symbol: 'ZRX',
      symbolTicker: {
        Ethfinex: 'ZRX'
      },
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      decimals: 18,
      name: '0x Protocol Token',
      wrappers: {
        Ethfinex: {
          symbol: 'ZRXW',
          decimals: 18,
          address: '0xd7a7afe4b20611f2c839ec5cd340f27fe08c949c',
          name: 'ZRX Wrapper'
        }
      }
    },
    ETHW: {
      symbol: 'WETH',
      address: '0x768C42FF6F5805bD2631AC7Cc9eaBE3AF17b4b41',
      decimals: 18,
      name: 'Wrapped Ether EFX'
    },
    ETH: {
      symbol: 'ETH',
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      wrappers: {
        Ethfinex: {
          symbol: 'ETHW',
          decimals: 18,
          address: '0x768C42FF6F5805bD2631AC7Cc9eaBE3AF17b4b41',
          name: 'ETH Wrapper'
        }
      }
    },
    GNT: {
      symbol: 'GNT',
      symbolTicker: {
        Ethfinex: 'GNT'
      },
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      decimals: 18,
      name: 'Golem Network Token'
    },
    MKR: {
      symbol: 'MKR',
      symbolTicker: {
        Ethfinex: 'MKR'
      },
      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      decimals: 18,
      name: 'MakerDAO'
    },
    USDT: {
      symbol: 'USDT',
      symbolTicker: {
        Ethfinex: 'USD'
      },
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      name: 'Tether USD',
      wrappers: {
        Ethfinex: {
          symbol: 'USDT',
          decimals: 6,
          address: '0x4c24a4dfb0c67916d47b4726958eb66b63bdd268',
          name: 'USDTWrapper'
        }
      }
    },
    GRG: {
      symbol: 'GRG',
      symbolTicker: {
        Ethfinex: 'GRG'
      },
      address: '0xD34cf65739954EB99D284fD20aB4f88c64e4d67D',
      decimals: 18,
      name: 'GRG Token'
    }
  },
  ropsten: {
    WETH: {
      symbol: 'WETH',
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      decimals: 18,
      name: 'Wrapped Ether 0x'
    },
    ZRX: {
      symbol: 'ZRX',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'ZRX'
      },
      address: '0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D',
      decimals: 18,
      name: '0x Protocol Token',
      wrappers: {
        Ethfinex: {
          symbol: 'ZRXW',
          decimals: 18,
          address: '0xFF32E76EAdc11Fc816A727980E92805D237CDB28',
          name: 'ZRX Wrapper'
        }
      }
    },
    ETHW: {
      symbol: 'WETH',
      address: '0x965808e7F815CfffD4c018ef2Ba4C5A65EBa087e',
      decimals: 18,
      name: 'Wrapped Ether EFX'
    },
    ETH: {
      symbol: 'ETH',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'ETH'
      },
      address: '0x0',
      decimals: 18,
      name: 'Ether',
      wrappers: {
        Ethfinex: {
          symbol: 'ETHW',
          decimals: 18,
          address: '0x965808e7F815CfffD4c018ef2Ba4C5A65EBa087e',
          name: 'ETH Wrapper'
        }
      }
    },
    USDT: {
      symbol: 'USDT',
      isOldERC20: true,
      symbolTicker: {
        Ethfinex: 'USD'
      },
      address: '0x0736d0c130b2eAD47476cC262dbed90D7C4eeABD',
      decimals: 6,
      name: 'Tether USD',
      wrappers: {
        Ethfinex: {
          symbol: 'USDTW',
          decimals: 6,
          address: '0x83E42e6d1ac009285376340ef64BaC1C7d106C89',
          name: 'USDT Wrapper'
        }
      }
    },
    GRG: {
      symbol: 'GRG',
      isOldERC20: false,
      symbolTicker: {
        Ethfinex: 'GRG'
      },
      address: '0x6FA8590920c5966713b1a86916f7b0419411e474',
      decimals: 18,
      faucetAddress: '0x756519e3A48d5E4A02e0a6197A0cBb783ff06738',
      name: 'GRG Token',
      wrappers: {
        Ethfinex: {
          symbol: 'GRGW',
          decimals: 18,
          address: '0x5959f2036608d693B4d085020ACAdBBf664C793E',
          name: 'GRG Wrapper'
        }
      }
    }
  }
}

// Supported tokens for trading in the form of base tokens for each quote tokens.
// USDT and WETH are quote tokens, meaning the tokens in which the price are expressed.

export const TRADE_TOKENS_PAIRS = {
  WETH: {
    GNT: {
      symbol: 'GNT',
      exchanges: [ERCdEX]
    },
    ZRX: {
      symbol: 'ZRX',
      exchanges: [ERCdEX]
    }
  },
  USDT: {
    ETH: {
      symbol: 'ETH',
      exchanges: [Ethfinex]
    }
  }
}

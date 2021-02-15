---
description: A simple overview of the protocol.
---

# What is Primitive?

**Primitive** is an options market protocol live on Ethereum mainnet.

**Liquidity providers** can earn yield on their DAI, ETH, or DeFi tokens through providing liquidity to the respective option markets. Yield is earned through trading fees generated on the supported AMMs \(Sushiswap\).

**Traders** can swap their DAI, ETH, or DeFi tokens to the respective Primitive Options tokens, giving them leveraged exposure in either direction. Call options can be purchase for the underlying tokens \(ETH, DeFi tokens\) to gain upside exposure, while Put options can be purchased for Dai to get downside protection. 

**Option Writers** can collateralize the options and sell them to earn upfront returns on their DAI, ETH, or DeFi tokens. When options expire, they release the remaining collateral held in the smart contract. In the case of an option expiring out-of-the-money, the initial collateral deposit would be released. In the case that an option is exercised, option writers are entitled to the be paid the strike price of the option \(in DAI for Calls and in underlying tokens for Puts\).

The open-source interface to use Primitive is hosted here: [https://app.primitive.finance](https://app.primitive.finance).



## What problems does Primitive solve?

In DeFi, the spot and lending markets have grown exponentially, which introduce more market needs:

**Missing:** Leverage instruments on DeFi tokens.

**Missing:** Hedging instruments on DeFi tokens.

**Missing:** Limited impermanent loss pools that still generate trading fees from volume.

The options on Primitive fill these holes in the market. 

 


---
description: A simple overview of the risks when providing liquidity to option pools.
---

# Liquidity Provider's risks

### What are the primary risks of Option Pools?

Since option pools have a derivative token as one of the pool's assets, exposure to this derivative token can lead to losses, as well as gains. This idea could be termed "impermanent exposure" or "divergence exposure", in which the liquidity provider enters the pool with neutral option exposure, and then exits with a net positive or negative option exposure.

The primary risk of option pools is short option exposure. Short option exposure will accrue when more options are bought using the option pool's liquidity than are sold. Liquidity providers pick up this short exposure, effectively giving them a covered short position on the option.

Keep in mind that Primitive short option tokens are a combination of a short option and the collateral, effectively making them "covered short option tokens".

### What are the risks of covered short exposure?

If short options are held, they may not be redeemable for the underlying tokens:

* If the option is ITM and is exercised, the short option tokens will be redeemable for the **strike price of the strike asset**. For example, if an ETH $1000 Call is exercised, the short option token is redeemable for $1000.
* If the option is OTM and is not exercised, the short option tokens will be redeemable for the **underlying asset**. For example, if an ETH $1000 Call expires worthless and was not exercised, the short option token is redeemable for 1 ETH.

As a liquidity provider, underlying tokens are provided. The risk with short option tokens is that the liquidity provider is returned the **strike price of the strike asset** for a portion of their liquidity, instead of 100% of their original underlying tokens. Keep in mind, short option exposure does not exceed 50% of the total deposit's value. This is because there is no scenario for a liquidity provider to only remove short option tokens \(since underlying tokens are the other asset in the pool\).

### **What are the smart contract risks?**

Using the protocol does not come risk-free. A material loss of user funds can occur if a Primitive smart contract is exploited and drained of funds. In that scenario, the options would instantly become worthless since they would have no claim on any tokens \(there would be no collateral in the contracts to redeem the options for\).

Please visit the risks page on the interface to learn more: [Risks Page](https://app.primitive.finance/risks).

### Have your contracts been Audited?

The core option contracts were audited by [Open Zeppelin](https://blog.openzeppelin.com/primitive-audit/).


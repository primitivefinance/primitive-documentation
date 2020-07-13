---
description: A simple overview of the protocol.
---

# Primitive

Primitive is an options market protocol.

**What is an options market?**

An options market needs a way to create new option series, mint options, exercise or close option positions, and trade them. 

Primitive's first module of smart contracts includes these mechanisms.

**What is an options market protocol?**

Options on crypto-native assets need markets with sufficient liquidity and volume to justify the expense of trading them. Primitive architects smart contracts to create these markets natively and then support the health of them through ease-of-use, cost efficiency, security, and incentivisation mechanisms. 

**How are options traded?**

Options are a complex financial instrument with differing risk properties when compared to underlying token instruments. For this reason, the mechanism for trading options in a decentralized way is not as straightforward. Orderbooks and oracles introduce risk and potentially have limited liquidity, because of the centralized nature of them. Constant function market makers like Uniswap, or Balancer, are decentralized but assume an invariant that has **constant** value. Options are naturally decaying instruments due to their expiration date, which introduces problems to the **constant** invariant of popular CFMM systems.

**What options are trade-able?**

Primitive will initially have a list of **supported** underlying tokens. The goal is to prevent market fragmentation and to focus the liquidity into only a select few markets.

Regardless of what options Primitive will initially support, OTC option trades on any underlying token are technically feasible and will be a future feature!

**What are the risks of using Primitive?**

The smart contracts architected and built by Primitive are not, and can never be, 100% secure. The risk of total loss is always present. Security is our absolute priority, but risk in contracts is not zero.

### Resources

Primitive's code is open-source and is accessible on [Github](https://github.com/primitivefinance).

We actively discuss development on the Primitive protocol in the \#development channel in our [Discord](https://discord.gg/rzRwJ4K).

[Go back to the Primitive homepage](https://primitive.finance).


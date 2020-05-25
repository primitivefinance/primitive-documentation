---
description: A simple overview of the protocol.
---

# Primitive

Primitive is a permissionless protocol for creating option derivatives on ERC-20 tokens. These options can be traded on Primitive's Automated Market Maker \(PAMM\), which is designed to pool liquidity and act as a medium of exchange.

Each option is a standalone ERC-20 contract on Ethereum which gives the holder the ability to swap strike tokens for underlying tokens at a predefined exchange rate \(the strike ratio\) over a fixed lifetime \(the strike date\). The option token is burned in this process.

Option tokens are minted by depositing underlying tokens. Parties who mint option tokens are called writers, and they receive a second token called Redeem which is used to withdraw the remaining tokens in the option contract. Remainder tokens are \(1\) strike tokens which were used to purchase underlying tokens, or \(2\) underlying tokens which remain in the contract after the option has eclipsed its strike date \(expired\).

PAMM is designed to price option tokens on a curve and distribute earnings \(premium\) to liquidity providers. The options are priced with the following formula:

$$
\frac{Market}{Strike} \times ImpliedVol \times \sqrt{T} \times \frac{1}{SecondsInDay}
$$

The variable `ImpliedVol` is derived from the utilization of the liquidity pool. Larger orders which use more of the pool's funds will incur higher cost by increasing the `ImpliedVol`. 

The Primitive Underlying Liquidity Provider \(PULP\) token is minted to LPs who provide underlying tokens to PAMM. That's the last acronym we are introducing. This is a token for LPs to use to withdraw their tokens and premiums that have been earned which is proportional to their equity in the pool. 

Keep in mind, LPs in the pool are writing and selling options, which carries significant and material risk. LPs face up to 100% losses if options are exercised with strike tokens that decline in value towards zero. For example, if the underlying tokens are purchased with DAI as the strike token and DAI goes to 0.

### Resources

Primitive's code is open-source and is accessible on [Github](https://github.com/primitivefinance).

We actively discuss development on the Primitive protocol in the \#development channel in our [Discord](https://discord.gg/rzRwJ4K).

[Go back to the Primitive homepage](https://primitive.finance).

### Deployed contracts

#### Mainnet

| Status | Contract | Address | Link |
| :---: | :--- | :--- | :--- |
| Active | Prime Option | 0xced83f96AA38bFe34617ea1F699F9f0022548f61 | [Etherscan](https://etherscan.io/address/0xced83f96aa38bfe34617ea1f699f9f0022548f61) |
| Active | Prime Redeem | 0xB0A4d596939715f203Fa9E907935938FEdEa715F | [Etherscan](https://etherscan.io/address/0xb0a4d596939715f203fa9e907935938fedea715f) |
| Active | Prime Trader | 0xff5C103d76586BB55bb33CE01f3dEc9cEe55617f | [Etherscan](https://etherscan.io/address/0xff5c103d76586bb55bb33ce01f3dec9cee55617f) |
| Paused | Prime Pool | 0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830 | [Etherscan](https://etherscan.io/address/0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830) |


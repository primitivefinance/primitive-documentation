---
description: A simple overview of the Primitive Protocol.
---

# Getting Started

Primitive's code is open-source and is accessible on [Github](https://github.com/primitivefinance).

We actively discuss development on the Primitive protocol in the \#development channel in our [Discord](https://discord.gg/rzRwJ4K).

### Deployed contracts

#### Mainnet

| Status | Contract | Address | Link |
| :---: | :--- | :--- | :--- |
| Active | Prime Option | 0xced83f96AA38bFe34617ea1F699F9f0022548f61 | [Etherscan](https://etherscan.io/address/0xced83f96aa38bfe34617ea1f699f9f0022548f61) |
| Active | Prime Redeem | 0xB0A4d596939715f203Fa9E907935938FEdEa715F | [Etherscan](https://etherscan.io/address/0xb0a4d596939715f203fa9e907935938fedea715f) |
| Active | Prime Trader | 0xff5C103d76586BB55bb33CE01f3dEc9cEe55617f | [Etherscan](https://etherscan.io/address/0xff5c103d76586bb55bb33ce01f3dec9cee55617f) |
| Paused | Prime Pool | 0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830 | [Etherscan](https://etherscan.io/address/0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830) |

### Overview

The protocol's design is rooted in simplicity, strength, and security. We keep the basic logic separate from the complex logic, and favor efficient simple systems.

### Primitives and Extensions

The primitives we design serve as the seed to larger systems. These are smart token contracts that build on the ERC-20 standard with an additional specification.

We also build extension contracts to easily interact with the primitives. For example, our Prime Trader contract makes it easy for regular users to interact with the Prime options in the case they don't want to go through an entity like a pool.

The combination of primitives + extensions act as new tools to a larger application layer that will be built using the Primitive protocol.


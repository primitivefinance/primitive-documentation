---
description: The protocol's design.
---

# Architecture

Primitives act as the base units while extensions are designed with complex logic to utilize the base units. The flexibility in this model comes from the modularity of each contract. The primitives are designed to be unaware of external contracts, which lets any contract interact with it easily.

The first of these primitives is the Prime, a smart token with the specification of a vanillaoption.

Extensions are contracts with more complex logic that use the primitives to fulfill a goal. We've designed a contract that pools liquidity and sells short the Prime option primitives.


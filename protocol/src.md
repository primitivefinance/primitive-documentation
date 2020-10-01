---
description: The protocol's design.
---

# Overview

## Modules

The protocol is separated into **modules** of code, which have explicit purposes. For example, the **option module** has the smart contracts which manage the factory deployments of new option series, and the option contract itself with all its functionality.

This section needs to be updated.

## Parts

Each **module** of code has explicit directories which have purposes. 

**Primitives** are the tokens or specially designed based units which all the code in the module is either based around or uses. 

**Libraries** are immutable smart contracts which are used by more than one part of the system, or have the purpose of reducing gas in parts of the system, they are all defined as `Library` . 

**Extensions** are most likely stateless, **proxy** contracts, that are designed to combine multiple function calls and create one utility function. For example, wrapping a `mint` and `sell` operation into an extension function `mintThenSell` so the user only has to submit one transaction. 

**Applications** are most likely stateless and are using primitives, libraries, extensions, and even other protocol contracts.

**Interfaces** hold the interfaces for all contracts within the module.


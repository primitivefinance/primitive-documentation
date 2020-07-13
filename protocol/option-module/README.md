---
description: 'Getting started with the first of the Primitive modules: Option.'
---

# Option Module

## Option Primitive

The option module contains the **option contract primitive,** an ERC-20 token that is extended to match the specification of a vanilla option.

## Option Factory

The module has a factory system so that new option series are deployable on-chain in a decentralized way. This factory system uses several libraries in order to accomplish very gas cheap deployments of new option contracts. 

## Interactions with Option

The `Trader` is a proxy contract designed to be a simple entry point for a user into the option contract to call its individual functions. For example, a user who wants to mint options can call the `safeMint` function in the `Trader` contract and it will handle the appropriate checks and operations for interacting with the low-level **option contract primitive.** The `Trader` contract uses the `TraderLib` library and is stateless. It only handles transferring tokens and calling the appropriate functions.


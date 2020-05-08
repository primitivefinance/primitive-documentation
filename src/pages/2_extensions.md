---
name: Extensions
menu: Architecture
route: /extensions
---

# 2\_extensions

## Extension contracts

### Mainnet

* Active - [PrimeTrader - Extension contract for option](https://etherscan.io/address/0xff5c103d76586bb55bb33ce01f3dec9cee55617f)

  0xff5C103d76586BB55bb33CE01f3dEc9cEe55617f

* Paused - [PrimePool - Extension contract using option](https://etherscan.io/address/0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830)

  0xf7a7126C6eB9c2cC0dB9F936bA4d0D5685662830

## Overview

We have the first primitive so now we can build a more complex system around it.

Primitive designed a system that builds upon the Prime as an example of the possibilities avilable.

## A Liquidity Pool

Options are only traded fluidly with a market that is liquid. With this in mind, we designed a contract that pools liquidity and uses it to mint Primes!

#### Selling Primes from the Pool

We go a step further. So now we have a pool that can take liquidity and mint Primes, what if we can also sell those Primes?

The Primes can be sold for premium to generate returns for the pool's LPs. In this way, the proceeds and losses are attributed proportionally to the amount of liquidity tokens the LP owns.

With some added logic, the pool can now sell those Primes! The LPs get all the proceeds of those sales. Keep in mind, the assets the LPs deposited could be 'bought' when a user burns their Primes, so LPs might not be getting their original assets. This risk is what drives the price, "premium", of the option token.

How do we make sure the Primes are being sold for an amount that justifies the risk the LPs take on?

## An Oracle

### Pricing the Primes Accurately

The pool contract talks to an external contract called "Prime Oracle". This oracle can take in certain parameters, in this case the "underlying asset", "base", and "price" of the Prime option, and output the estimated premium it is worth.

This formula takes into account the time until expiration, and the demand of the option.

```text
-
-                      Strike Price                                                                              1
- Pricing Formula = ----------------- * Implied Volatility * sqrt(T remaining in seconds until expiry) * ------------------
-                      Market Price                                                                       Seconds in a Day
-
```

How do we get the demand for the option?

### Demand of the Primes

As a proxy for the demand we use the "utilization" of the pool. This is the amount of assets which are actively used in underwritten options divided by the total assets the pool controls.

* Assets used to underwrite
* Utilzation = ---------------------------
* Total Underlying Assets

A way we can derive how many underlying assets were used is by using the Redeem token. The pool gets 1 Redeem token per strike asset, and we know the ratio between the underlying and strike assets because of the "base" and "price" variables.

* Base    Underlying    Primes
* ----- = ---------- = ---------
* Price     Strike      Redeems

We can use this golden formula to determine how many underlying assets the pool used.

* Balance of Redeem     Balance of Redeem      Base
* Underwritten Assets = ----------------- = --------------------- \* -------
* Base                  Price              1
* Price


---
name: Extensions
menu: Architecture
route: /extensions
description: External contracts that use the primitives and other extensions.
---

# Extensions

## Overview

We have the first smart token primitive so now we can build a more complex system around it.

## A Liquidity Pool

Options are only traded fluidly with a market that is liquid. With this in mind, we designed a contract that pools liquidity and uses it to mint Primes.

#### Selling Primes from the Pool

We go a step further. So now we have a pool that can take liquidity and mint Primes, what if we can also sell those Primes?

The Primes can be sold for premium to generate returns for the pool's LPs. In this way, the proceeds and losses are attributed proportionally to the amount of liquidity tokens the LP owns.

With some added logic, the pool can now sell those Primes! The LPs get all the proceeds of those sales. Keep in mind, the assets the LPs deposited could be 'bought' when a user exercises their right to purchase the underlying token, so LPs might not be getting their original assets. This risk is what drives the price, "premium", of the option token.

How do we make sure the Primes are being sold for an amount that justifies the risk the LPs take on?

## An Oracle

### Pricing the Primes Accurately

The pool contract talks to an external contract called _Prime Oracle_. This oracle can take in certain parameters, the _underlying token_, _base_, and _price_ of the Prime option, and then output the estimated premium it is worth.

This formula takes into account the time until expiration, and the demand of the option.

$$
\frac{Strike}{Market} \times ImpliedVol \times \sqrt{T} \times \frac{1}{SecondsInDay}
$$



We use demand as a proxy for the Implied Volatility value. How do we get the demand for the option?

### Demand of the Primes

As a proxy for the demand we use the "utilization" of the pool. This is the amount of underlying tokens which are actively used in underwritten options divided by the total underlying tokens the pool controls.

$$
Utilization = \frac{TokensUsed}{Total Tokens}
$$

A way we can derive how many underlying assets were used is by using the Redeem token. The pool gets 1 Redeem token per strike asset, and we know the ratio between the underlying and strike assets because of the _base_ and _price_ variables.

$$
\frac{Base}{Price} = \frac{Underlying}{Strike} = \frac{Primes}{Redeems}
$$

We can use this Prime formula to determine how many underlying assets the pool used.

$$
Underwritten Assets = \frac{BalanceRedeem}{\frac {Base}{Price}}
$$


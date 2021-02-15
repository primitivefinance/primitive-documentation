---
description: A brief overview of Primitive options.
---

# What are Primitive Options?

The Primitive protocol can be used by anyone to deploy an **Option** smart contract. The **Option** contract controls the tokenization of long and short options, collateral management, and parameterization of terms. It also has the business logic to manage the minting, exercising, redemption, and closure of option tokens at a low-level. 

## FAQ

### Who deploys options? 

Anyone can use the Registry contract to deploy new options, but only protocol-endorsed option markets are tradeable from this interface. 

### What assets are supported by Primitive? 

We support an ever-expanding list of underlying assets, and currently use DAI as the strike asset. 

### How are strikes determined? 

Although governance controls the release of new options, option strikes are usually out-of-the-money upon deployment. 

### When do options expire? 

Governance currently prefers to deploy new options with a expiration of Friday at 8:00:00 UTC. 

### What type of options does Primitive support? 

American options with manual exercising and physical settlement. Options must be manually exercised, which requires action on behalf of the user before expiry. 

### How are options settled? 

Call options are settled in the underlying asset. Put options are settled in the strike asset. 

### Is there an option contract multiplier? 

There is a 1 multiplier for calls, and a \(1 / strike price\) multiplier for puts. 

### Is margin available? 

No. For each 1 call option, 1 underlying token must be provided as collateral. For each 1 put option, 1 DAI must be provided as collateral. 

### What is the fee structure? 

No fees are taken from the Primitive Protocol. There is a 0.30% fee per swap for using Uniswap. 

### How can I propose new option markets? 

New market proposals are submitted via Snapshot on Wednesdays before a series expires on Friday. 

### How do I vote on new option markets? 

Voting power is determined by the balance of LP tokens in the series which expires on the closest Friday.


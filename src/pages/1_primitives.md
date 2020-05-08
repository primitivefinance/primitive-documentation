---
name: Primitives
menu: Architecture
route: /primitives
---

# 1\_primitives

## Primitive contracts

### Mainnet

* Active - [PrimeOption - ETH $200 DAI Put Expiring May 30](https://etherscan.io/address/0xced83f96aa38bfe34617ea1f699f9f0022548f61)

  0xced83f96AA38bFe34617ea1F699F9f0022548f61

* Active - [PrimeRedeem - Redeem token for ETH 200 Put](https://etherscan.io/address/0xb0a4d596939715f203fa9e907935938fedea715f)

  0xB0A4d596939715f203Fa9E907935938FEdEa715F

## Overview

The protocol's design is rooted in simplicity, strength, and security. We keep the basic logic separate from the complex logic, and favor efficient simple systems.

The primitives we design serve as the seed to larger systems. These are contracts that are designed to be used in other systems as building blocks and mediums to exchange value.

## The Prime

The first of these core contract 'primitives' we've designed is the [Prime](1_primitives.md), a smarter ERC-20 token with embedded optionality.

The Prime is a token which gives the holder the ability to swap two assets at a fixed exchange rate for a fixed lifetime. In this way, it acts similarly to a traditional binary option from legacy finance. We've designed the Prime to match the specification of a binary option.

#### The binary option specification:

* Underlying asset.
* Strike Price denominated in $USD.
* Expiration date.

#### The Prime specification:

* Address of underlying token.
* Address of stike token.
* "Base" value \(Amount of underlying tokens\).
* "Price" value \(Amount of strike tokens\).
* Expiration Date, a UNIX timestamp.

#### Four Token Design

The Prime contract accepts certain tokens as inputs and knows what tokens to output. There are four critical tokens that are apart of this system:

* Prime
* Redeem
* Underlying
* Strike

The Prime is a token which lets the user swap strike tokens for underlying tokens.

This is possible because in order to create new Primes, there has to be deposited underlying tokens. The simplicity in the system comes from this four token design, which makes the input/output calculations simple accounting formulas.

## Accounting Formulae & Functions

### The Golden Ratio

* Base    Underlying    Primes
* ----- = ---------- = ---------
* Price     Strike      Redeems

### Mint

* Input Underlying Tokens = Output Prime Tokens.
* Input Underlying Tokens / Rate = Output Redeem Tokens.

### Swap \(Exercise\)

* Input Strike Tokens \* Rate = Output Underlying Tokens.

### Redeem

* Input Redeem Tokens = Output Strike Tokens.

### Close

* Input Redeem Tokens \* Rate + Prime Tokens = Output Underlying Tokens.

### What's the Rate?

The rate is the exchange rate, also called the strike price, between the two tokens that the Prime is defined with.

* Rate = "Base" / "Price", where Base is the amount of underlying tokens and price is the amount of strike tokens.

## Example \#1

#### Scenario

We want to make a Prime that lets the user buy WETH at some fixed price, how can we do that?

This is the full constructor of the Prime contract:

* constructor \(

  ```text
     string memory name,
     string memory symbol,
     uint256 _marketId,
     address tokenU,
     address tokenS,
     uint256 base,
     uint256 price,
     uint256 expiry
  ```

     \)

#### Choosing the Identifiers

The name, symbol, and marketId will be the identifiers for the option contract. There will be extension contracts which will track these identifiers in a global list of Prime options outstanding.

* string memory name, &lt;-----
* string memory symbol, &lt;-----
* uint256 \_marketId, &lt;-----
* address tokenU,
* address tokenS,
* uint256 base, 
* uint256 price, 
* uint256 expiry

#### Choosing the Assets

We choose the underlying asset based on what the user wants to buy, WETH, and we give it a strike price based on the strike asset, which we choose to be stablecoin like DAI.

* address tokenU, &lt;-----
* address tokenS, &lt;-----
* uint256 base, 
* uint256 price, 
* uint256 expiry

#### Choosing the rate between the assets

The user wants to buy the WETH at a rate of 1 WETH per 200 DAI. WETH is the underlying asset and the amount is 1, so that is the "Base" value. DAI is the strike asset, with an amount of 200, which is the "Price" value.

The rate for this Prime is:

* 1 WETH / 200 DAI
* Base / Price
* Buy 200 DAI for 1 WETH per 1 Prime you own

You are changing these values:

* address tokenU,
* address tokenS,
* uint256 base, &lt;-----
* uint256 price, &lt;-----
* uint256 expiry

#### Choosing the expiration date

Lets also make the Prime expire at some future point of time, say June of 2020. We can pass an 'expiration' date into the constructor's parameters.

* address tokenU,
* address tokenS,
* uint256 base,
* uint256 price,
* uint256 expiry &lt;-----

Now that we have all the ingredients to make a Prime, we can make one and use it.

#### Minting

To mint Primes we need to send it the underlying assets. The contract knows how many Primes to output, which depends on how many underlying assets were sent to it.

If we send 1 WETH to this contract, the amount of outputted Primes is equal to this input which is:

* 1 WETH Input = 1 Prime Output.

The contract also outputs redeem tokens. The amount of outputted Redeems is proportional to the inputted WETH and the rate of the Prime.

* 1 WETH \(Input\) / \(1 WETH \(Base\) / 200 DAI \(Price\)\) = 200 Redeems to Output. Where Base / Price = Rate.
* Input Underlying / Rate = Output Redeem.

#### Swapping, also called Exercising

When we want to use the Prime and buy the 1 WETH for 200 DAI \(swap 200 DAI into 1 WETH\), we have to send 200 DAI. We also need to burn a 1:1 amount of Primes based on how many underlying assets we are buying. In this case, we are buying 1 WETH so we need to burn 1 Prime.

The contract knows how to handle this.

* 200 DAI \* \(1 WETH / 200 DAI\) = 1 WETH.
* Input Strike Tokens \(DAI\) \* \(Base \(Quantity of WETH\) / Price \(Quantity of DAI\)\) = Output Underlying Tokens.

#### Redeeming

Since we just bought the 1 WETH for 200 DAI, where does the DAI go and who gets the DAI?

The DAI goes to the Prime contract and it is redeemable at a 1:1 ratio using the Redeem token.

* Input Redeem = Output Strike \(DAI\).

#### Closing

What about the case where we want to withdraw our underlying assets that we used in order to mint the Prime. The Prime and the Redeem token can be sent to the contract in exchange for the underlying tokens. In this case, it is a lot like the reverse of the minting process!

If you minted 1 Prime and 200 Redeems in exchange for 1 WETH, you need to send the contract 1 Prime and 200 Redeems in order to withdraw 1 WETH.

* Input Redeem Tokens \* Rate & Prime Tokens = Output Underlying Tokens.

### Expiration

A feature of binary options is that they are not usually perpetual instruments, they expire and render the 'option' to buy the underlying assets invalid. This feature of expiration is baked in to each Prime.

**When the expiration date arrives, the ability to 'mint' and 'swap' is automatically locked.**

```text
modifier notExpired {
    require(option.expiry >= block.timestamp, "ERR_EXPIRED");
    _;
}
```

This is a process where the contract begins to unwind, where the remaining assets left in the contract start to go back to users as they withdraw them.

Of course, its possible to make a perpetual option by passing in a very far our expiration date, like 2100...


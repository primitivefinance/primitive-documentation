---
name: Primitives
menu: Architecture
route: /primitives
description: The base components.
---

# Primitives

## Overview

We design smart tokens. These are tokens that inherit the ERC-20 standard and add extra functions to fulfill a specification.

Smart tokens can be designed to fulfill the specifications of more complex financial instruments like options, synthetics, and stablecoins.

We designed the first smart token with the options market of DeFi in mind.

## The Prime

The Prime is a smart token with embedded optionality.

This token gives the holder the ability to swap two assets at a fixed exchange rate for a fixed lifetime. In this way, it acts similarly to a traditional vanilla option from legacy finance. We've designed the Prime to match the specification of a vanilla option.

#### The vanilla option specification:

* Underlying asset.
* Strike Price denominated in $USD.
* Expiration date.
* Buy/Sell underlying asset for strike price.

#### The Prime specification:

* Address of underlying token.
* Address of strike token.
* "Base" value \(amount of underlying tokens\).
* "Price" value \(strike price\).
* Expiration Date, a UNIX timestamp.

#### Four Token Design

The Prime contract accepts certain tokens as inputs and knows what tokens to output. There are four critical tokens that are in this system:

| Name | Function  | Example |
| :--- | :--- | :--- |
| Prime | Vanilla Option | Right to sell ETH for DAI \(ETH Put\) |
| Redeem | Underwriter's receipt | Redeem for ETH |
| Underlying | Token that is purchasable | DAI |
| Strike | Token that is used to purchase underlying | ETH |

The simplicity in the system comes from this four token design, which makes the input/output calculations simple accounting formulas.

## Accounting Formulae & Functions

### The Prime Ratio

$$
Base / Price = Underlying / Strike = Primes / Redeems
$$

### Mint

$$
Input Underlying= Output Prime
$$

$$
Input Underlying / Rate = Output Redeem
$$

### Swap \(Exercise\)

$$
Input Strike * Rate = Output Underlying
$$

### Redeem

$$
Input Redeem = Output Strike
$$

### Close

$$
Input Redeem * Rate = Input Prime = Output Underlying
$$

### What's the Rate?

The rate is the exchange rate, also called the strike price, between the two tokens that the Prime is defined with.

$$
Rate = Base / Price
$$

Where _Base_ is the amount of underlying tokens and _Price_ is the amount of strike tokens.

## Example \#1

#### Scenario

We want to make a Prime that lets the user buy WETH at some fixed price, how can we do that?

This is the full constructor of the Prime contract:

```text
   constructor (
      string memory name,
      string memory symbol,
      uint256 _marketId,
      address tokenU,
      address tokenS,
      uint256 base,
      uint256 price,
      uint256 expiry
   )
```

#### Choosing the Identifiers

The name, symbol, and marketId will be the identifiers for the option contract. There will be extension contracts which will track these identifiers in a global list of Prime options outstanding.

* `string memory name, <-----`
* `string memory symbol, <-----`
* `uint256 _marketId, <-----`
* `address tokenU,`
* `address tokenS,`
* `uint256 base,` 
* `uint256 price,` 
* `uint256 expiry`

#### Choosing the Assets

We choose the underlying asset based on what the user wants to buy, WETH, and we give it a strike price based on the strike asset, which we choose to be stablecoin, like DAI.

* `address tokenU, <-----`
* `address tokenS, <-----`
* `uint256 base,` 
* `uint256 price,` 
* `uint256 expiry`

#### Choosing the ratio between the assets

The user wants to buy the WETH at a rate of 1 WETH per 200 DAI. WETH is the underlying asset and the amount is 1, so that is the _Base_ value. DAI is the strike asset, with an amount of 200, which is the _Price_ value.

The rate for this Prime is:

* `1 WETH / 200 DAI`
* `Base / Price`
* `Buy 200 DAI for 1 WETH per 1 Prime you own`

You are changing these values:

* `address tokenU,`
* `address tokenS,`
* `uint256 base, <-----`
* `uint256 price, <-----`
* `uint256 expiry`

#### Choosing the expiration date

Lets also make the Prime expire at some future point of time, say June of 2020. We can pass an _expiration_ date into the constructor's parameters.

* `address tokenU,`
* `address tokenS,`
* `uint256 base,`
* `uint256 price,`
* `uint256 expiry <-----`

Now that we have all the ingredients, we can make a Prime and then use it.

#### Minting

To mint Primes we need to send it the underlying assets. The contract knows how many Primes to output, and that depends on how many underlying assets were sent to it.

If we send 1 WETH to this contract, the amount of outputted Primes is equal to this input which is:

* `1 WETH Input = 1 Prime Output.`

The contract also outputs redeem tokens. The amount of Redeems to output is proportional to the input of WETH and the _rate_ of the Prime.

* `1 WETH (Input) / (1 WETH (Base) / 200 DAI (Price)) = 200 Redeems to Output.`
* `Rate = Base / Price.`
* `Input Underlying / Rate = Output Redeem.`

#### Swapping, also called Exercising

When we want to use the Prime and buy the 1 WETH for 200 DAI, we have to send 200 DAI. We also need to burn a 1:1 amount of Primes based on how many underlying assets we are buying. In this case, we are buying 1 WETH so we need to burn 1 Prime.

{% hint style="info" %}
A Prime has the right to swap to the underlying asset at a 1:1 ratio. If underlying is 200 Dai, you need 200 Primes. Just like when the underlying is 1 WETH, you need 1 Prime.
{% endhint %}

The contract knows how to handle this.

* `200 DAI * (1 WETH / 200 DAI) = 1 WETH.`
* `Input Strike Tokens (DAI) * (Base (Quantity of WETH) / Price (Quantity of DAI)) = Output Underlying Tokens.`

#### Redeeming

Since we just bought the 1 WETH for 200 DAI, where does the DAI go and who gets the DAI?

The DAI goes to the Prime contract and it is redeemable at a 1:1 ratio using the Redeem token.

* `Input Redeem = Output Strike (DAI).`

#### Closing

What about the case where we want to withdraw our underlying assets that we used in order to mint the Prime. The Prime and the Redeem token can be sent to the contract in exchange for the underlying tokens. In this case, it is a lot like the reverse of the minting process!

If you minted 1 Prime and 200 Redeems in exchange for 1 WETH, you need to send the contract 1 Prime and 200 Redeems in order to withdraw 1 WETH.

* `Input Redeem Tokens * Rate & Prime Tokens = Output Underlying Tokens.`

### Expiration

A feature of vanilla options is that they are not usually perpetual instruments, they expire and render the _option_ to buy the underlying assets invalid. This feature of expiration is baked in to each Prime.

**When the expiration date arrives, the ability to 'mint' and 'swap' is automatically locked.**

```text
modifier notExpired {
    require(option.expiry >= block.timestamp, "ERR_EXPIRED");
    _;
}
```

This is a process where the contract begins to unwind, where the remaining assets left in the contract start to go back to users as they withdraw them.

Of course, its possible to make a perpetual option by passing in a very far our expiration date, like 2100...


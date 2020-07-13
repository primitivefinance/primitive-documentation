---
name: Primitives
menu: Architecture
route: /primitives
description: The base components.
---

# Primitives

## Overview

Primitive designs smart tokens. These are tokens that inherit the ERC-20 standard and extend them to fulfill a specification.

## Option.sol

The Option is a smart token with embedded optionality.

This token gives the holder the ability to swap two assets at a fixed exchange rate for a fixed lifetime. In this way, it acts similarly to a traditional vanilla option from legacy finance.

#### The vanilla option specification:

1. Underlying asset.
2. Strike Price denominated in local currency.
3. Expiration date.
4. Buy/Sell underlying asset for strike price.

**The Option has five parameters. These include:**

1. Address of underlying token.
2. Address of strike token.
3. Base - the quantity of underlying tokens deposited per option token.
4. Quote- the quantity of strike tokens paid per unit of option token.
5. Expiry - the unix timestamp of when the option expires, called maturity or strike date.

**The options have four critical functions:**

1. Mint - mint new option and redeem tokens.
2. Exercise - pay strike tokens to receive underlying tokens.
3. Redeem - for exercised options, underwriters can use their redeem tokens to withdraw strike tokens. For expired options, underwriters can use their redeem tokens to withdraw the remaining strike and underlying tokens.
4. Close - for underwriters who wish to close a position by burning the option token and redeem tokens, in which they would receive their original underlying token deposits in return.

Each function follows a basic process. It comes down to an input of certain tokens and the respective output of other tokens. This basic outline of these operations is as follows:

1. Send input token A or token B, or both.
2. Call one of the functions.
3. Receive output token C or token D, or both.
4. Internal account balances of contracts are updated, called the ‘cached’ balances.

These processes assume tokens are sent to the contract prior to the function call’s execution.

## Redeem.sol

The redeem token is designed as an accounting token; it is a tokenized position. In traditional option trading, there can be the case that a position is assigned, in which the option was exercised and the party responsible for deliverying the underlying asset to the exericer needs to trade the underlying asset for the strike asset. 

In the case of Primitive's options, the `Option` contract is technically the party that is exercising the options, and therefore the strike tokens are paid to the `Option` contract in exchange for the underlying tokens held in the `Option` contract. The original minter of the option tokens, which were now burned in the exercise operation, can use their redeem tokens to withdraw the strike tokens in the contract.

This way, option exercisers are using the contract as the intermediary and have full control over when they exercise their positions. The counterparty who underwrote those options which were exercised always has the right to the strike tokens paid for the underlying tokens, through the use of their redeem token.

## Four Token Design

| Name | Function  | Example |
| :--- | :--- | :--- |
| Option | Vanilla Option | Right to sell ETH for DAI \(ETH Put\) |
| Redeem | Underwriter's receipt | Redeem for ETH |
| Underlying | Token that is purchasable | DAI |
| Strike | Token that is used to purchase underlying | ETH |

The simplicity in the system comes from this four token design, which makes the input/output calculations simple accounting formulas.

## Accounting Formulae Invariants

### The Primitive Ratios

$$
Base / Quote = Underlyings / Strikes = Options / Redeems
$$

### Mint

$$
Input Underlyings = Output Options
$$

$$
Input Underlyings / Strike Ratio = Output Redeems
$$

### Exercise

$$
Input Strikes * Strike Ratio = Output Underlyings
$$

### Redeem

$$
Input Redeems = Output Strikes
$$

### Close

$$
Input Redeems * Strike Ratio = Input Options = Output Underlyings
$$

### What's the strike price?

The strike price is the exchange rate, also called the strike ratio, between the two tokens that the Option is defined with.

$$
Strike Ratio = Base / Price
$$

Where _Base_ is the amount of underlying tokens and _Quote_ is the amount of strike tokens. This is for the case that the quote tokens are the price to pay for the underlying tokens.

## Example \#1

#### Scenario

We want to make an Option that lets the user buy WETH at some fixed price, how can we do that?

This is initialization function of the Option contract:

```text
   initialize(
      address underlyingToken,
      address strikeToken,
      uint256 base,
      uint256 quote,
      uint256 expiry
   )
```

#### Choosing the Assets

We choose the underlying asset based on what the user wants to buy, WETH, and we give it a strike price based on the strike asset, which we choose to be stablecoin, like DAI.

* `address underlyingToken, <-----`
* `address strikeToken, <-----`
* `uint256 base,` 
* `uint256 quote,` 
* `uint256 expiry`

#### Choosing the ratio between the assets

The user wants to buy the WETH at a rate of 1 WETH per 200 DAI. WETH is the underlying asset and the amount is 1, so that is the _Base_ value. DAI is the strike asset, with an amount of 200, which is the _Quote_ value.

The rate for this Option is:

* `1 WETH / 200 DAI`
* `Base / Quote`
* `Buy 200 DAI for 1 WETH per 1 Option you own`

You are changing these values:

* `address underlyingToken,`
* `address strikeToken,`
* `uint256 base, <-----`
* `uint256 quote, <-----`
* `uint256 expiry`

#### Choosing the expiration date

Lets also make the Option expire at some future point of time, say June of 2020. We can pass an _expiration_ date into the initialization function.

* `address underlyingToken,`
* `address strikeToken,`
* `uint256 base,`
* `uint256 quote,`
* `uint256 expiry <-----`

Now that we have all the ingredients, we can make an Option and then use it.

#### Minting

To mint Options we need to send it the underlying assets. The contract knows how many Options to output, and that depends on how many underlying assets were sent to it.

If we send 1 WETH to this contract, the amount of output Options is equal to this input which is:

* `1 WETH Input = 1 Option Output.`

The contract also outputs redeem tokens in the mint function. The amount of Redeems to output is proportional to the input of WETH and the _strike ratio_ of the Option.

* `1 WETH (Input) / (1 WETH (Base) / 200 DAI (Quote)) = 200 Redeems to Output.`
* `Strike Ratio = Base / Quote.`
* `Input Underlying / Strike Ratio = Output Redeem.`

#### Swapping, also called Exercising

When we want to use the Option and buy the 1 WETH for 200 DAI, we have to send 200 DAI. We also need to burn a 1:1 amount of Options based on how many underlying assets we are buying. In this case, we are buying 1 WETH \(1 unit of underyling token\) so we need to burn 1 Option.

{% hint style="info" %}
An Option has the right to swap to the underlying asset at a 1:1 ratio. If underlying is 200 Dai, you need 200 Options. Just like when the underlying is 1 WETH, you need 1 Option.
{% endhint %}

The contract knows how to handle this.

* `200 DAI * (1 WETH / 200 DAI) = 1 WETH.`
* `Input Strike Tokens (DAI) * (Base (Quantity of WETH) / Quote(Quantity of DAI)) = Output Underlying Tokens.`

#### Redeeming

Since we just bought the 1 WETH for 200 DAI, where does the DAI go and who gets the DAI?

The DAI goes to the Option contract and it is redeemable at a 1:1 ratio using the Redeem token. The user who originally minted the option and then sold it, still has their redeem tokens. In this way, options are assigned and any user who holds redeems can actually burn their redeem tokens for the strike tokens.

* `Input Redeem = Output Strike (DAI).`

#### Closing

What about the case where we want to withdraw our underlying assets that we used in order to mint the Option? The Option and the Redeem token can be sent to the contract in exchange for the underlying tokens. In this case, it is a lot like the reverse of the minting process!

If you minted 1 Option and 200 Redeems in exchange for 1 WETH, you need to send the contract 1 Option and 200 Redeems in order to withdraw 1 WETH.

* `Input Redeem Tokens * Strike Ratio && Option Tokens = Output Underlying Tokens.`

### Expiration

A feature of vanilla options is that they are not usually perpetual instruments, they expire and render the _option_ to buy the underlying assets invalid. This feature of expiration is baked in to each option.

**When the expiration date arrives, the ability to 'mint' and 'swap' is automatically locked.**

```text
modifier notExpired {
    require(option.expiry >= block.timestamp, "ERR_EXPIRED");
    _;
}
```

This is a process where the contract begins to unwind, where the remaining assets left in the contract start to go back to users as they withdraw them.

Of course, its possible to make a perpetual option by passing in a very far our expiration date, like 2100...



## Interfaces

### Option

{% code title="contracts/option/interfaces/IOption.sol:IOption" %}
```text
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

interface IOption {
    function mint(address receiver)
        external
        returns (uint256 inUnderlyings, uint256 outRedeems);

    function exercise(
        address receiver,
        uint256 outUnderlyings,
        bytes calldata data
    ) external returns (uint256 inStrikes, uint256 inOptions);

    function redeem(address receiver) external returns (uint256 inRedeems);

    function close(address receiver)
        external
        returns (
            uint256 inRedeems,
            uint256 inOptions,
            uint256 outUnderlyings
        );

    function redeemToken() external view returns (address);

    function strikeToken() external view returns (address);

    function underlyingToken() external view returns (address);

    function base() external view returns (uint256);

    function quote() external view returns (uint256);

    function expiry() external view returns (uint256);

    function underlyingCache() external view returns (uint256);

    function strikeCache() external view returns (uint256);

    function factory() external view returns (address);

    function caches()
        external
        view
        returns (uint256 _underlyingCache, uint256 _strikeCache);

    function tokens()
        external
        view
        returns (
            address _underlyingToken,
            address _strikeToken,
            address _redeemToken
        );

    function getParameters()
        external
        view
        returns (
            address _strikeToken,
            address _underlyingToken,
            address _redeemToken,
            uint256 _base,
            uint256 _quote,
            uint256 _expiry
        );

    function initRedeemToken(address _redeemToken) external;

    // solhint-disable-next-line
    function EXERCISE_FEE() external view returns (uint256);
}

```
{% endcode %}

### Redeem

{% code title="contracts/option/interfaces/IRedeem.sol:IRedeem" %}
```text
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

interface IRedeem {
    function optionToken() external view returns (address);

    function redeemableToken() external view returns (address);

    function factory() external view returns (address);

    function mint(address user, uint256 amount) external;

    function burn(address user, uint256 amount) external;
}

```
{% endcode %}


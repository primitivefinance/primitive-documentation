---
description: An overview of the key metrics and explanations for Primitive.
---

# Protocol Dashboard

## Overview

This is an overview page for how to get key information from the Primitive contracts.

## Events

### PrimeOption

| Contract Name | Event | Description |
| :--- | :--- | :--- |
| PrimeOption | Mint | Emits when Prime tokens are minted after an underlying token deposit is made. |
| PrimeOption | Swap | Emits when a Prime is exercised and strike tokens are swapped to underlying tokens. The exercised Primes are burned. |
| PrimeOption | Redeem | Emits when Redeem tokens are redeemed for strike tokens at a 1:1 ratio. |
| PrimeOption | Close | Emits when Prime and Redeem tokens are burned to withdraw underlying tokens. |
| PrimeOption | Fund | Emits when the internal token balance sheet is updated with new cached balances. |

{% tabs %}
{% tab title="Mint" %}
```javascript
event Mint(address indexed from, uint256 outTokenP, uint256 outTokenR);
```
{% endtab %}

{% tab title="Swap" %}
```
event Swap(address indexed from, uint256 outTokenU, uint256 inTokenS);
```
{% endtab %}

{% tab title="Redeem" %}
```
event Redeem(address indexed from, uint256 inTokenR);
```
{% endtab %}

{% tab title="Close" %}
```
event Close(address indexed from, uint256 inTokenP);
```
{% endtab %}

{% tab title="Fund" %}
```
event Fund(uint256 cacheU, uint256 cacheS, uint256 cacheR);
```
{% endtab %}
{% endtabs %}

#### Mint

> `from:` The msg.sender address.
>
> `outTokenP:` The amount of minted Primes sent to the from address.
>
> `outTokenR:` The amount of minted Redeem tokens sent to the from address.

#### Swap

> `from:` The msg.sender address.
>
> `outTokenU:` The amount of underlying tokens sent out from the contract.
>
> `inTokenS:` The amount of strike tokens sent into the contract.

#### Redeem

> `from:` The msg.sender address.
>
> `inTokenR:` The amount of redeem tokens sent into the contract AND the amount of strike tokens sent out.

#### Close

> `from:` The msg.sender address.
>
> `inTokenP:` The amount of Primes sent into the contract, which is also proportional to the amount of redeem tokens sent into the contract at a rate of inTokenP \* price / base. This is also the amount of underlying tokens sent out from the contract.

#### Fund

> `cacheU:` The internal balance sheet item for underlying tokens.
>
> `cacheS:` The internal balance sheet item for strike tokens.
>
> `cacheR:` The internal balance sheet item for redeem tokens.

### PrimeTrader

The Trader contract has the exact same events that the PrimeOption does. The Trader contract is used by users to directly interact with the PrimeOption contract. Users should not directly interact with the PrimeOption contract because its specifically designed to be as raw as possible. It needs the extra help from the Trader contract to do transfers in and checking balances.

### PrimePool

| Contract Name | Event | Description |
| :--- | :--- | :--- |
| PrimePool | Deposit | Emits when underlying tokens are deposited into the pool. |
| PrimePool | Withdraw | Emits when tokenPULP is burned and tokenU is requested to be withdrawn from the pool. |
| PrimePool | Buy | Emits when a Prime option is minted by the pool and sold to a buyer for premium. |

{% tabs %}
{% tab title="Deposit" %}
```javascript
event Deposit(address indexed from, uint256 inTokenU, uint256 outTokenPULP);
```
{% endtab %}

{% tab title="Withdraw" %}
```
event Withdraw(address indexed from, uint256 inTokenPULP, uint256 outTokenU);
```
{% endtab %}

{% tab title="Buy" %}
```
event Buy(address indexed from, uint256 inTokenS, uint256 outTokenU, uint256 premium);
```
{% endtab %}
{% endtabs %}

#### Deposit

> `from:` The msg.sender address.
>
> `inTokenU:` The amount of deposited underlying tokens.
>
> `outTokenPULP:` The amount of minted liquidity tokens sent to the from address.

#### Withdraw

> `from:` The msg.sender address.
>
> `inTokenPULP:` The amount of burned liquidity tokens.
>
> `outTokenU:` The amount of underling tokens sent to the msg.sender in exchange for the liquidity tokens.

#### Buy

> `from:` The msg.sender address.
>
> `inTokenS:` The amount of strike tokens sent into the contract.
>
> `outTokenU:` The amount of underlying tokens sent out from the contract to mint the Primes. Also is the value for the amount of Primes purchased by the buyer.
>
> `premium:` The price paid for all of the primes.

## Interfaces

### PrimeOption

```javascript
interface IPrime {
    function balanceOf(address user) external view returns (uint);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount)
        external returns (bool);

    function swap(address receiver) external returns (
        uint256 inTokenS,
        uint256 inTokenP,
        uint256 outTokenU
    );
    function mint(address receiver) external returns (
        uint256 inTokenU,
        uint256 outTokenR
    );
    function redeem(address receiver) external returns (
        uint256 inTokenR
    );
    function close(address receiver) external returns (
        uint256 inTokenR,
        uint256 inTokenP,
        uint256 outTokenU
    );

    function tokenR() external view returns (address);
    function tokenS() external view returns (address);
    function tokenU() external view returns (address);
    function base() external view returns (uint256);
    function price() external view returns (uint256);
    function expiry() external view returns (uint256);
    function cacheU() external view returns (uint256);
    function cacheS() external view returns (uint256);
    function factory() external view returns (address);
    function marketId() external view returns (uint256);
    function maxDraw() external view returns (uint256 draw);
    function getCaches() external view returns (
        uint256 _cacheU,
        uint256 _cacheS
    );
    function getTokens() external view returns (
        address _tokenU,
        address _tokenS,
        address _tokenR
    );
    function prime() external view returns (
            address _tokenS,
            address _tokenU,
            address _tokenR,
            uint256 _base,
            uint256 _price,
            uint256 _expiry
    );
}
```

### PrimeTrader

```javascript
interface IPrimeTrader {
    function safeRedeem(address tokenP, uint256 amount, address receiver)
        external returns (
        uint256 inTokenR
    );
    function safeSwap(address tokenP, uint256 amount, address receiver)
        external returns (
        uint256 inTokenS,
        uint256 inTokenP,
        uint256 outTokenU
    );
    function safeMint(address tokenP, uint256 amount, address receiver)
        external returns (
        uint256 inTokenU,
        uint256 outTokenR
    );
    function safeClose(address tokenP, uint256 amount, address receiver)
        external returns (
        uint256 inTokenR,
        uint256 inTokenP,
        uint256 outTokenU
    );
}
```

### PrimePool

```javascript
interface IPrimePool {

}
```

### PrimeOracle

```javascript
interface IPrimeOracle {
    function marketPrice(address tokenU) external view returns (uint256 market);
    function calculateIntrinsic(
        address tokenU,
        uint256 base,
        uint256 price
    ) external view returns (uint256 intrinsic);
    function calculateExtrinsic(
        address tokenU,
        uint256 volatility,
        uint256 base,
        uint256 price,
        uint256 expiry
    ) external view returns (uint256 extrinsic);
    function calculatePremium(
        address tokenU,
        uint256 volatility,
        uint256 base,
        uint256 price,
        uint256 expiry
    ) external view returns (uint256 premium);
}
```

### PrimeRedeem

```javascript
interface IPrimeRedeem {
    function balanceOf(address user) external view returns (uint);
    function mint(address user, uint256 amount) external payable returns (bool);
    function burn(address user, uint256 amount) external payable returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```




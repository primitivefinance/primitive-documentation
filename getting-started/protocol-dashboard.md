---
description: An overview of the key metrics and explanations for Primitive.
---

# Protocol Dashboard

## Overview

This is an overview page for how to get key information from the Primitive protocol.

## Stats

To be added..

## Contracts

To be added...

## Events

### Option

| Contract Name | Event | Description |
| :--- | :--- | :--- |
| Option | Mint | Emits when Prime tokens are minted after an underlying token deposit is made. |
| Option | Exercise | Emits when a Prime is exercised and strike tokens are swapped to underlying tokens. The exercised Primes are burned. |
| Option | Redeem | Emits when Redeem tokens are redeemed for strike tokens at a 1:1 ratio. |
| Option | Close | Emits when Prime and Redeem tokens are burned to withdraw underlying tokens. |
| Option | Fund | Emits when the internal token balance sheet is updated with new cached balances. |

{% tabs %}
{% tab title="Mint" %}
```javascript
event Mint(address indexed from, uint256 outOptions, uint256 outRedeems);
```
{% endtab %}

{% tab title="Exercise" %}
```
event Exercise(
        address indexed from,
        uint256 outUnderlyings,
        uint256 inStrikes
    );
```
{% endtab %}

{% tab title="Redeem" %}
```
event Redeem(address indexed from, uint256 inRedeems);
```
{% endtab %}

{% tab title="Close" %}
```
event Close(address indexed from, uint256 inOptions);
```
{% endtab %}

{% tab title="Fund" %}
```
event Fund(uint256 underlyingCache, uint256 strikeCache);
```
{% endtab %}
{% endtabs %}

#### Mint

> `from:` The msg.sender address.
>
> `outOptions:` The amount of minted Options sent to the from address.
>
> `outRedeems:` The amount of minted Redeem tokens sent to the from address.

#### Exercise

> `from:` The msg.sender address.
>
> `outUnderlyings:` The amount of underlying tokens sent out from the contract.
>
> `inSrikes:` The amount of strike tokens sent into the contract.

#### Redeem

> `from:` The msg.sender address.
>
> `inRedeems:` The amount of redeem tokens sent into the contract AND the amount of strike tokens sent out.

#### Close

> `from:` The msg.sender address.
>
> `inOptions:` The amount of Options sent into the contract, which is also proportional to the amount of redeem tokens sent into the contract at a rate of inOptions \* quote / base. This is also the amount of underlying tokens sent out from the contract.

#### Fund

> `underlyingCache:` The internal balance sheet item for underlying tokens.
>
> `strikeCache:` The internal balance sheet item for strike tokens.




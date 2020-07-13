---
description: The option primitive's flash-ability.
---

# Flash Exercises and Loans

## Flash Exercises

The exercise function in the option contract will swap strike tokens to underlying tokens at a rate called the strike ratio. The process of an exercise in a traditional context is:  


1. Send strike tokens as payment.
2. Receive underlying tokens.

The Primitive option does this in reverse, which means we are optimistically paying out the underlying token in the hopes that the strike token is paid by the end of the transaction \(one block of time\). If there are not enough tokens returned to the contract as payment, the transaction reverts. The process is as follows for an exercise of Primitive options:  


1. Receive underlying tokens.
2. Check to make sure strike tokens were sent into the contract as payment.
3. Or, if the underlying tokens were returned, charge a fee.

By designing the exercise function like this we can use the underlying token to pay for our strike token. In that case, we would be getting the underlying token, swapping it to the strike token, and then paying the strike price in one transaction. This can be abstracted away for the user, so they would be able to exercise options without paying upfront and with a single one-button transaction.  


This flash exercise also implicitly allows flash loans to be taken out on the underlying tokens. If the underlying tokens are taken out, then returned, the exercise function will only require a fee to be paid. This fee is denominated in strike tokens, and will become one piece of the protocol’s economics. 


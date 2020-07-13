---
description: The applications within the option module scope.
---

# Applications

The application for the option module is a factory system that enables an owner to deploy any new option contract series through an on-chain transaction.

The `Registry` contract is the highest order contract in the hierarchy, which is in control of the `OptionFactory` and `RedeemFactory`. These factories control the logic for deploying `clone` contracts of a template `Option` or `Redeem` contract.

The factories each have a respective `<Option or Redeem>TemplateLib` which is a library that contains the `creationCode` of the respective `Option` and `Redeem` contracts.

The `TemplateLib` libraries have a single function `deployTemplate` which will call the `create2` opcode using the `type(<Option or Redeem>).creationCode` as the bytecode and an `<Option or Redeem>_SALT` as the salt. The constant `<Option or Redeem>_SALT` is a keccak hash of `primitive-option` or `primitive-redeem` . 

## Registry

There is a deployed instance of the Registry on Rinkeby at [0x662B95efAbB900776C67238973B30fBd0E1B3276](https://rinkeby.etherscan.io/address/0x662B95efAbB900776C67238973B30fBd0E1B3276).

### Interface

```text
pragma solidity ^0.6.2;

interface IRegistry {
    function deployOption(
        address underlyingToken,
        address strikeToken,
        uint256 base,
        uint256 quote,
        uint256 expiry
    ) external returns (address);

    function kill(address option) external;

    function initialize(address _factory, address _factoryRedeem) external;

    function optionsLength() external view returns (uint256 len);

    function addSupported(address token) external;

    function optionFactory() external returns (address);

    function redeemFactory() external returns (address);

    function getOption(
        address underlyingToken,
        address strikeToken,
        uint256 base,
        uint256 quote,
        uint256 expiry
    ) external view returns (address option);
}
```

## Purpose

The `Registry` contract has the `deployOption` function which will deploy a new option series based on the passed in parameters. 

### Supported Tokens

It will check to make sure the `underlyingToken` and `strikeToken` are defined are supported by checking the `isSupported` mapping of addresses to a boolean. Supported tokens are added through the `addSupported` function, which will map the passed in address to `true`. If an address is supported, options can be created for it, if not, then the `deployOption` function will revert with the error `ERR_ADDRESS`.

### Option ID

The parameters are combined in a keccak hash to get an `id` parameter, and this `id` parameter is passed into the mapping `options` which maps an `id` to an address of an `Option`. If an option already exists with the exact same parameters, the `deployOption` function will revert with `ERR_OPTION_DEPLOYED`.

### Deploying Option and Redeem Contracts

After the checks have been made in the `deployOption` function, the `id` gets added to the `options` mapping, and the option's addressed gets `pushed` to the `activeOptions` address array. Then, a `Redeem` contract is deployed and its address is linked to the `Option` contract using the `OptionFactory` 's `initialize` function. 

Finally an event `Deploy` is emitted with the `msg.sender` , the `option` address and its `id`.



## Factories

The option and redeem factories use the same mechanism of deployment, the only difference is the amount of parameters the `Option` and `Redeem` contracts are respectively initialized with.

### Template Contract

The first step with setting up the `Registry` and factories is calling the `deployOptionTemplate` or the `deployRedeemTemplate` functions. These functions will deploy the full bytecode of the respective contracts using the `OptionTemplateLib` and `RedeemTemplateLib` libraries.

#### Deploy Template

{% code title="contracts/option/applications/factories/OptionFactory.sol:OptionFactory" %}
```text
function deployOptionTemplate() public override {
        optionTemplate = OptionTemplateLib.deployTemplate();
    }
```
{% endcode %}

These libraries use `type(Option).creationCode` or `type(Redeem).creationCode` as the bytecode, and the keccak hash of either `primitive-option` or `primitive-redeem` as the salt. The bytecode and salt are used in the `create2` opcode to deploy the template to an address. This template address is used by `clone` contracts, in which the clones `delegatecall` to the template.

### Template Libraries

{% code title="contracts/option/libraries/OptionTemplateLib.sol:OptionTemplateLib" %}
```text
library OptionTemplateLib {
    // solhint-disable-next-line max-line-length
    bytes32
        private constant _OPTION_SALT = 0x56f3a99c8e36689645460020839ea1340cbbb2e507b7effe3f180a89db85dd87; // keccak("primitive-option")

    // solhint-disable-next-line func-name-mixedcase
    function OPTION_SALT() internal pure returns (bytes32) {
        return _OPTION_SALT;
    }

    /**
     * @dev Deploys a clone of the deployed Option.sol contract.
     */
    function deployTemplate() external returns (address implementationAddress) {
        bytes memory creationCode = type(Option).creationCode;
        implementationAddress = Create2.deploy(0, _OPTION_SALT, creationCode);
    }
}

pragma solidity ^0.6.0;

import { Create2 } from "@openzeppelin/contracts/utils/Create2.sol";
import { Redeem } from "../primitives/Redeem.sol";

library RedeemTemplateLib {
    // solhint-disable-next-line max-line-length
    bytes32
        private constant _REDEEM_SALT = 0xe7383acf78b06b8f24cfa7359d041702736fa6a58e63dd38afea80889c4636e2; // keccak("primitive-redeem")

    // solhint-disable-next-line func-name-mixedcase
    function REDEEM_SALT() internal pure returns (bytes32) {
        return _REDEEM_SALT;
    }

    /**
     * @dev Deploys a clone of the deployed Redeem.sol contract.
     */
    function deployTemplate() external returns (address implementationAddress) {
        bytes memory creationCode = type(Redeem).creationCode;
        implementationAddress = Create2.deploy(0, _REDEEM_SALT, creationCode);
    }
}
```
{% endcode %}

### Deploying Clones

Once a template contract is deployed on the network, it can be used to construct clone contract bytecode. This bytecode combined with a salt is used to `create2` a clone contract, which is then initialized with the contract's `initialize` function. 

#### Getting the Salt

{% code title="contracts/option/applications/factories/OptionFactory.sol:OptionFactory" %}
```text
function deploy(
        address underlyingToken,
        address strikeToken,
        uint256 base,
        uint256 quote,
        uint256 expiry
    ) external override onlyOwner returns (address option) {
        require(optionTemplate != address(0x0), "ERR_NO_DEPLOYED_TEMPLATE");
        bytes32 salt = keccak256(
            abi.encodePacked(
                OptionTemplateLib.OPTION_SALT(),
                underlyingToken,
                strikeToken,
                base,
                quote,
                expiry
            )
        );
        option = CloneLib.create2Clone(optionTemplate, uint256(salt));
        Option(option).initialize(
            underlyingToken,
            strikeToken,
            base,
            quote,
            expiry
        );
    }
```
{% endcode %}

The salt is generated using the keccak hash of the option's parameters and the salt that is used to deploy the `Option` template contract.

#### Getting the Bytecode

The original implementation of this methodology is by [Gnosis](https://github.com/gnosis/conditional-tokens-market-makers/blob/master/contracts/Create2CloneFactory.sol).

The Primtive implementation is as follows:

### Clone Library

```text
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @title Create2 Clone Factory Library
 * @author Alan Lu, Gnosis.
 *         Raymond Pulver IV.
 */

import { Create2 } from "@openzeppelin/contracts/utils/Create2.sol";

library CloneLib {
    /**
     * @dev Calls internal creation computation function.
     */
    function computeCreationCode(address target)
        internal
        view
        returns (bytes memory clone)
    {
        clone = computeCreationCode(address(this), target);
    }

    /**
     * @dev Computes the Clone's creation code.
     */
    function computeCreationCode(address deployer, address target)
        internal
        pure
        returns (bytes memory clone)
    {
        bytes memory consData = abi.encodeWithSignature(
            "cloneConstructor(bytes)",
            new bytes(0)
        );
        clone = new bytes(99 + consData.length);
        // solhint-disable-next-line no-inline-assembly
        assembly {
            mstore(
                add(clone, 0x20),
                0x3d3d606380380380913d393d73bebebebebebebebebebebebebebebebebebebe
            )
            mstore(
                add(clone, 0x2d),
                mul(deployer, 0x01000000000000000000000000)
            )
            mstore(
                add(clone, 0x41),
                0x5af4602a57600080fd5b602d8060366000396000f3363d3d373d3d3d363d73be
            )
            mstore(add(clone, 0x60), mul(target, 0x01000000000000000000000000))
            mstore(
                add(clone, 116),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
        }
        for (uint256 i = 0; i < consData.length; i++) {
            clone[i + 99] = consData[i];
        }
    }

    /**
     * @dev Calls Open Zeppelin's Create2.computeAddress() to get an address for the clone.
     */
    function deriveInstanceAddress(address target, bytes32 salt)
        internal
        view
        returns (address)
    {
        return
            Create2.computeAddress(
                salt,
                keccak256(computeCreationCode(target))
            );
    }

    /**
     * @dev Calls Open Zeppelin's Create2.computeAddress() to get an address for the clone.
     */
    function deriveInstanceAddress(
        address from,
        address target,
        bytes32 salt
    ) internal pure returns (address) {
        return
            Create2.computeAddress(
                salt,
                keccak256(computeCreationCode(from, target)),
                from
            );
    }

    /**
     * @dev Computs creation code, and then instantiates it with create2.
     */
    function create2Clone(address target, uint256 saltNonce)
        internal
        returns (address result)
    {
        bytes memory clone = computeCreationCode(target);
        bytes32 salt = bytes32(saltNonce);

        // solhint-disable-next-line no-inline-assembly
        assembly {
            let len := mload(clone)
            let data := add(clone, 0x20)
            result := create2(0, data, len, salt)
        }

        require(result != address(0), "ERR_CREATE2_FAIL");
    }
}

```

### The Initialize Function

This sets the initial state for the respective `Option` or `Redeem` contract.

{% code title="contracts/option/primitives/Option.sol:Option" %}
```text
function initialize(
        address underlyingToken,
        address strikeToken,
        uint256 base,
        uint256 quote,
        uint256 expiry
    ) public {
        require(factory == address(0x0), "ERR_IS_INITIALIZED");
        factory = msg.sender;
        parameters = Primitives.Option(
            underlyingToken,
            strikeToken,
            base,
            quote,
            expiry
        );
    }
```
{% endcode %}

{% code title="contracts/option/primitives/Redeem.sol:Redeem" %}
```text
function initialize(
        address _factory,
        address _optionToken,
        address _redeemableToken
    ) public {
        require(factory == address(0x0), "ERR_IS_INITIALIZED");
        factory = _factory;
        optionToken = _optionToken;
        redeemableToken = _redeemableToken;
    }
```
{% endcode %}




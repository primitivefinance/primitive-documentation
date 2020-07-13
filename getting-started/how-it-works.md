---
description: A simple how-to guide.
---

# How It Works

## Getting Started

The primitive codebase is in a [monorepo](https://github.com/primitivefinance/primitive-protocol). Each package is under @primitivefi.

```bash
git clone https://github.com/primitivefinance/primitive-protocol.git
```

## Start

Run this command to download the codebase's dependencies

```text
yarn
```

## Contracts Package

This package contains the buidler project with the protocol's contracts and test suites: [@primitivefi/contracts](https://www.npmjs.com/package/@primitivefi/contracts).

Start with going into the contracts directory, starting up the buidler node for running the Buidler EVM. Then run the tests!

```text
cd packages/primitive-contracts
yarn bevm
yarn test
```

## Tasks

To be added.. Buidler tasks!

## Scripts

To be added... Customized scripts.


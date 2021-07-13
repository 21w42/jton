# jTON
![cover](docs/images/cover.svg)
Library for compiling, deploying and testing Free TON smart contracts.

## Content table
* [jTON](#jton)
  * [Content table](#content-table)
  * [Requirements](#requirements)
  * [Installation](#installation)
    * [yarn](#yarn)
    * [npm](#npm)
  * [Example](#example)

## Requirements
![requirements](docs/images/requirements.svg)
* [Node.js](https://nodejs.org) >= `16.x`
* [Yarn](https://classic.yarnpkg.com) >= `1.22.x`
* [Free TON Development Environment](https://github.com/tonlabs/tondev) >= `0.7.x`

## Installation
### yarn
```sh
yarn add jton
```

### npm
```sh
npm i jton
```

## Example
![SimpleWallet](docs/images/simple-wallet.svg)
[SimpleWallet](https://github.com/kokkekpek/simple-wallet-smart-contract)

## TODO
* Use [endpoints](https://github.com/tonlabs/TON-SDK/blob/master/docs/mod_client.md#NetworkConfig) instead network url.
* Scripts for test. [Example from SimpleWallet](https://github.com/kokkekpek/simple-wallet-smart-contract/blob/master/tests/__utils/prepareTest.ts).
* Tests coverage.
* Make possible use custom giver.
* More methods for SafeMultisigWallet and GiverV2.
* Create separate repository and move SafeMultisigWallet and GiverV2 into.
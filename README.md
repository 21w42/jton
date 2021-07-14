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
  * [Contracts](#contracts)
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

## Contracts
![jTON contracts](docs/images/jton-contracts.svg)
You can find popular contracts like SafeMultisigWallet that work with jTON in the [jton-contracts](https://github.com/kokkekpek/jton-contracts) repository. You can also add any contracts you want to this by **pull request** or **becoming a contributor**.

## Example
![SimpleWallet](docs/images/simple-wallet.svg)
You can find example how to use jTON with your own contracts in [simple-wallet-smart-contract](https://github.com/kokkekpek/simple-wallet-smart-contract) repository. 

## TODO
* Use [endpoints](https://github.com/tonlabs/TON-SDK/blob/master/docs/mod_client.md#NetworkConfig) instead network url
* Tests coverage
* Docs
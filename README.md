<a name="readme-top"></a>

![Logo](./docs/assets/banner.jpg)

# Kruuu Core

[![Build status](https://img.shields.io/gitlab/pipeline-status/kruuu1/kruuu-core)](https://gitlab.com/kruuu1/kruuu-core/-/pipelines/latest)
[![Coverage report](https://gitlab.com/kruuu1/kruuu-core/badges/main/coverage.svg?job=test)](http://kruuu1.gitlab.io/kruuu-core)
[![License: Apache 2.0](https://img.shields.io/gitlab/license/kruuu1/kruuu-core?color=green)](http://www.apache.org/licenses/LICENSE-2.0)

[Kruuu](https://www.kruuu.com/) empowers talent and talent seekers using the power of Web3!

Kruuu Core is the Blockchain Client for Kruuu Protocol. In other words, Kruuu Core is what every machine needs to set-up to run a node that allows for participation in the network.

Kruuu Core was bootstrapped with [Lisk SDK v6 Beta](https://github.com/LiskHQ/lisk-sdk). You can learn more in the [documentation](https://lisk.com/documentation/beta/index.html)

<!-- TABLE OF CONTENTS -->
<details>
   <summary><strong>Table of Contents</strong></summary>
   <ol>
      <li>
         <a href="#kruuu-core">About The Project</a>
      </li>
      <li>
         <a href="#usage">Usage</a>
         <ul>
            <li><a href="#dependencies">Dependencies</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#start">Start</a></li>
         </ul>
      </li>
      <li><a href="#license">License</a></li>
   </ol>
</details>

<!-- USAGE -->

## Usage

### Dependencies

Before running Kruuu Core, the following dependencies need to be installed:

| Dependencies | Version |
| ------------ | ------- |
| NodeJS       | 16+     |

If you are using [NVM](https://github.com/nvm-sh/nvm), (Node.js Version Manager), ensure you install the correct version as shown below:

```
nvm install v16.20.0
```

If you are on Ubuntu OS, to build `sodium-native` make sure your system already has `build-essential` installed:

```
sudo apt-get update
sudo apt-get install -y build-essential
```

For Mac M1 series, NodeJS must be above version 16. Additionally, to build `sodium-native` below tools are required:

```
brew install libtool cmake autoconf automake pyenv
pyenv install 2.7.18
pyenv global 2.7.18
# Add `eval "$(pyenv init --path)"` to ~/.zshrc etc
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

To install Kruuu Core from source, clone this repository, and run following command inside kruuu-core folder:

```
npm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Start

Make sure you have execute permission for `./bin/run` file:

```
chmod +x ./bin/run
```

Then, build the project using following command:

```
npm run build
```

If you modify any file in the future, make sure to rebuild the project using above command!

Finally, run the Kruuu Core using these command:

```
./bin/run start
```

### Restarting Blockchain

If you modify config/\*, or want to start from block height #1, then you need to restart the blockchain.

Blockchain can be restarted by deleting local data, using following commands:

```
sudo rm -rf ~/.lisk/kruuu-core
```

More info, read [Documentation](https://lisk.com/documentation/beta/build-blockchain/create-blockchain-client.html)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONFIGURING THE PLUGINS -->

## Configuring The Plugins

By default, Kruuu Core will only run the [on-chain modules](https://gitlab.com/kruuu1/kruuu-core/-/tree/main/src/app/modules). If you want to run Kruuu Core with [off-chain plugins](https://gitlab.com/kruuu1/kruuu-core/-/tree/main/src/app/plugins), which will serve additional data and service for frontend, you can follow this guide.

### Ports and Environment Variable

First, make sure the following ports are opened for your system:

| Plugins      | Ports |
| ------------ | ----- |
| kruuu_api    | 8080  |
| kruuu_faucet | 8881  |

Next need to add .env file for http api plugin configurations, you can get `.env` params from `.env.example` file

### Setup Environment

Http api plugin require next services: **postgresql** **minio** **imgproxy** **redis**.
Run services:

```
docker-compose up -d
```

### Start with Plugin

To run the Kruuu Core with Plugins enabled, please add `--enable-kruuu-plugins` flag to the `start` command:

```
./bin/run start --enable-kruuu-plugins
```

<!-- LICENSE -->

## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

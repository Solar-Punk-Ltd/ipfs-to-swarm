# IPFS to SWARM

## 1. Introduction

Swarm is a fully decentralized, censorship-resistant peer-to-peer storage network powered by Bee nodes. Unlike IPFS, it doesn't rely on any centralized third-party infrastructure. Swarm's mission is to empower a self-sovereign global society and open, permissionless markets by offering scalable decentralized storage for Web3. Its incentive system runs on smart contracts on the Gnosis Chain and is fueled by the xBZZ token, ensuring economic sustainability.

### 1.1 Why choose Swarm over IPFS

Swarm offers several advantages over IPFS, especially in decentralized storage and content distribution.

* **Atomic Unit**: Swarm uses 4 kB chunks (compared to IPFS’s 256 kB), enabling more efficient storage and faster retrieval of small files.
* **Mutable pointers**: Feeds allow dynamic content updates without changing the content address.
* **Download speed**: Unlike IPFS, even rarely accessed files download quickly; popular files are even faster.
* **Censorship Resistance**: Content is nearly impossible to remove, protecting against internal or external censorship.
* **DDOS Resistance**: The architecture resists DDoS attacks, ensuring content availability under stress.
* **Privacy/Anonymity**: Strong privacy and anonymity features make it ideal for sensitive data.
* **Storage Payment**: Integrated BZZ token system enables decentralized storage payments.
* **Incentives**: BZZ token rewards motivate users to contribute storage resources to the network.

### 1.2 Comparison of Swarm to IPF

| Feature                     | Swarm                                                 | IPFS                                                  |
|-----------------------------|-------------------------------------------------------|-------------------------------------------------------|
| Data Availability           | Guaranteed via incentivised storage and retrieval     | No guarantees – relies on external pinning services.  |
| Retrievability              | Native bandwidth market ensures persistent delivery   | No native incentives for retrieval                    |
| Persistence Guarantees      | Long-term through economic incentives                 | Ephemeral unless actively pinned                      |
| Privacy & Access Control    | Built-in encryption and on-chain ACT permissions.     | No native encryption or access management.            |
| Censorship Resistance       | High – fully decentralised with autonomous guarantees | Limited – centralised services can be pressure points |
| Architecture                | Decentralised storage service                         | Decentralised protocol                                |
| Infrastructure Dependencies | Self-sustaining network                               | Typically needs third-party infrastructure            |
| Target Use Case             | Production-grade dApps with long-term requirements    | File sharing and prototypes, not production storage.  |

### 1.3 Further reading about Swarm – official documentation

For a comprehensive understanding of Swarm, start with the following official resources:

* [**Book of Swarm**](https://papers.ethswarm.org/p/book-of-swarm/) – Foundational document covering Swarm's architecture, vision, and core concepts.
* [**Swarm Documentation Hub**](https://docs.ethswarm.org/) – Main entry point for users, developers, and node operators.
* [**Swarm Gateway**](https://gateway.ethswarm.org/) – Public interface for accessing content on the Swarm network.
* [**Bee Node Manual**](https://docs.ethswarm.org/docs/bee/installation/getting-started/) – for installing and configuring Bee nodes.
* [**Swarm Blog**](https://blog.ethswarm.org/) – News, release notes, and deep technical insights.
* [**Migrating from IPFS to Swarm: Your Guide to a More Resilient & Empowering Decentralized Web**](https://solarpunk.buzz/migrating-from-ipfs-to-swarm-decentralized-web/)
* [**Swarm GitHub Repositories**](https://github.com/ethersphere) – Source code, SDKs, and developer tools.

### 1.4 Setting up the infrastructure

* **Swarm Desktop App**
  The simplest way to start is by installing the [Swarm Desktop App](https://github.com/ethersphere/swarm-desktop/releases), available for macOS, Linux, and Windows.

  * Installs both the Bee node and a user-friendly interface in one step
  * Allows you to easily manage your node and access the network

* **Command-line Access**
  For Command-line interface (CLI) access to your Bee node, use the npm package [@ethersphere/swarm-cli](https://www.npmjs.com/package/@ethersphere/swarm-cli).

* **Bee-JS**
  The [Bee-JS](https://www.npmjs.com/package/@ethersphere/bee-js) provides a JavaScript/TypeScript library for interacting with Bee nodes, making it easy to integrate Swarm into your applications.

* **Manual Bee Node Setup**
  For advanced users, the Bee node can be installed manually.
  See the official [Bee Node Manual](https://docs.ethswarm.org/docs/bee/installation/getting-started/) for OS-specific setup instructions.

## 2. Recommended stamp capacity calculation upon initial purchase. – Table, Desktop screenshots

* We assume that we have all CIDs, and we can query the size of data stored on IPFS.
* We calculate the required stamp capacity for all of the available erasure coding levels.
* We make a capacity recommendation based on that.
* No actual purchase.

### 2.1 Stamp cost estimation based on current and predicted usage. Table, merged with previous

* The user enters the required TTL.
* We recommend a CLI call for purchasing that stamp.

### 2.2 Monitoring stamp validity and capacity

* Expiration can be monitored the same way as MSSD. [SCRIPT]
* Remaining capacity can be calculated only via communicating with the node. We should recommend the Swarm CLI (refer to Galaxis doc), and Desktop

### 2.3  Extending stamps in time or capacity

* Already existing Swarm CLI calls.
* Time has to be extended first, then capacity, but Swarm CLI has a call that does both in one call.

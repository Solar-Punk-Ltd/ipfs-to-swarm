# IPFS to Swarm

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

### 1.2 Comparison of Swarm to IPFS

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

* [Book of Swarm](https://papers.ethswarm.org/p/book-of-swarm/) – Foundational document covering Swarm's architecture, vision, and core concepts.
* [Swarm Documentation Hub](https://docs.ethswarm.org/) – Main entry point for users, developers, and node operators.
* [Swarm Gateway](https://gateway.ethswarm.org/) – Public interface for accessing content on the Swarm network.
* [Bee Node Manual](https://docs.ethswarm.org/docs/bee/installation/getting-started/) – for installing and configuring Bee nodes.
* [Swarm Blog](https://blog.ethswarm.org/) – News, release notes, and deep technical insights.
* [Migrating from IPFS to Swarm: Your Guide to a More Resilient & Empowering Decentralized Web](https://solarpunk.buzz/migrating-from-ipfs-to-swarm-decentralized-web/)
* [Swarm GitHub Repositories](https://github.com/ethersphere) – Source code, SDKs, and developer tools.

### 1.4 Setting up the infrastructure

* **Swarm Desktop App**
  The simplest way to start is by installing the [Swarm Desktop App](https://github.com/ethersphere/swarm-desktop/releases), available for macOS, Linux, and Windows.

  * Installs both the Bee node and a user-friendly interface in one step
  * Allows you to easily manage your node and access the network

* **Command-line Access**
  For command-line interface (CLI) access to your Bee node, use the npm package [@ethersphere/swarm-cli](https://www.npmjs.com/package/@ethersphere/swarm-cli).

* **Bee-JS**
  The [Bee-JS](https://www.npmjs.com/package/@ethersphere/bee-js) provides a JavaScript/TypeScript library for interacting with Bee nodes, making it easy to integrate Swarm into your applications.

* **Manual Bee Node Setup**
  For advanced users, the Bee node can be installed manually.
  See the official [Bee Node Manual](https://docs.ethswarm.org/docs/bee/installation/getting-started/) for OS-specific setup instructions.

## 2. Determining Swarm Stamp Capacity Before Initial Purchase

Postage stamps are used to pay for storing data on Swarm. They are purchased in batches, granting a prepaid right to store data on Swarm, similar to how real-world postage stamps pay for mail delivery. To select the appropriate stamp size, you first need to estimate the total amount of data you plan to upload. This data volume will determine the required capacity of the postage stamp.

### 2.1 Estimating the Size of Data to Upload

**1**. Start the **IPFS Desktop** application.

**2**. You can list the pinned files and their CIDs either via the application interface or using the command line:

```bash
ipfs pin ls --type=recursive
```

**3**. To calculate the total size of the pinned files, you can use the following Bash script: `examples/cli/download-from-ipfs.sh`
This script:

* downloads the pinned files to a temporary folder,
* saves them in a directory named `tmp_ipfs_download`,
* prints the total size of all downloaded files.

The script clears the temporary download folder before each run to ensure fresh and accurate size calculations.

**4**. Alternatively, you can estimate the data volume by checking the file sizes directly in the IPFS Desktop UI (see screenshot example).
![IPFS Desktop Pinned Files](./assets/ipfs-files.png)

### 2.2 Swarm Stamp Depth and Amount

Each stamp batch has two key parameters — **depth** and **amount** — which are recorded on the Gnosis Chain at the time of issuance.

* **Batch Depth**
  [Reference](https://docs.ethswarm.org/docs/concepts/incentives/postage-stamps/#batch-depth)
  The depth determines how much data a batch can store. A batch can hold `2^batch_depth` chunks, with each chunk being 4 kB.
  Total capacity = `2^batch_depth × 4 kB`.

* **Batch Amount**
  [Reference](https://docs.ethswarm.org/docs/concepts/incentives/postage-stamps/#batch-amount--batch-cost)
  This is the amount of xBZZ (in PLUR, where 1 xBZZ = 10¹⁶ PLUR) assigned per chunk.

* **Calculating the Required Amount for a Desired TTL**
  [Reference](https://docs.ethswarm.org/docs/concepts/incentives/postage-stamps/#calculating-amount-needed-for-desired-ttl)
  To calculate the required amount for a given storage time:

  ``` text
  (stamp_price ÷ block_time_in_seconds) × storage_duration_in_seconds
  ```

  For example, with a stamp price of 24,000 PLUR/chunk/block and a block time of 5 seconds:

  ``` text
  (24000 ÷ 5) × desired_seconds
  ```

> Stamp price is dynamic and depends on overall network utilisation.
> See the [utilisation tables](https://docs.ethswarm.org/docs/concepts/incentives/postage-stamps/#unencrypted---none) for guidance on expected storage capacity and efficiency.

### 2.3 Buying Swarm Stamps

You can buy Swarm stamps using either the Swarm Desktop app or the command-line interface (CLI).
![Swarm Desktop App - Buy Stamp](./assets/stamp-buy.png)
Or you can use swarm-cli to buy stamps directly from the command line:

```bash
swarm-cli stamp buy --depth <depth value> --amount <amount value>
```

### 2.4 Monitoring Stamp Validity and Capacity

You can monitor your Swarm stamps using the Swarm Desktop app or via the CLI:

```bash
swarm-cli stamp list
```

**Example output:**

```text
Stamp ID: f0a8788256368f5ca323905163d924981edf17f1b26954c9aae2d62fae341c12
Label: test22
Usage: 6%
Capacity (immutable): 589.603 MB remaining out of 628.910 MB
TTL: 7 days (2025-07-04)
```

This command lists all your stamps, including their ID, label, usage, remaining capacity, and time-to-live (TTL).

> Note: This command only works on the Bee node that originally issued (stamped) the batch.

You can also check the status of a specific stamp on the Gnosis Chain using the script in `examples/typescript/contract.ts`.

> Note: Smart contracts cannot provide information about remaining capacity — only on-chain data such as ownership and amount.

### 2.5 Extending stamps in time or capacity

To extend the time or capacity of a stamp, use the Swarm Desktop app or the CLI:

* `swarm-cli stamp dilute` – Increases the depth of an existing stamp (adds capacity)
* `swarm-cli stamp topup` – Increases the amount of an existing stamp (extends TTL)

## 3. Migrating Data from IPFS to Swarm

[This section should be added - describes the actual migration process]

## 4. Advanced Configuration and Troubleshooting

[This section should be added - covers advanced topics and common issues]

## 5. Getting started as a Developer

For using Swarm in your applications, you can use the [Bee-JS](https://www.npmjs.com/package/@ethersphere/bee-js) library, which provides a JavaScript/TypeScript interface for interacting with Bee nodes. An example app in the `src` directory demonstrates a simple CLI tool that downloads files from IPFS and uploads them to Swarm.

* [Bee-JS doc](https://bee-js.ethswarm.org/docs/)
* [Bee-JS npm package](https://www.npmjs.com/package/@ethersphere/bee-js)
* [swarm-cli](https://github.com/ethersphere/swarm-cli)
* [swarm-cli npm package](https://www.npmjs.com/package/@ethersphere/swarm-cli)

### 5.1 Features

* Downloads content from IPFS using a CID
* Uploads the downloaded content to a Swarm Bee node
* Command-line interface

### 5.2 Requirements

* Node.js v16 or newer
* [pnpm](https://pnpm.io/)
* A running [Bee](https://docs.ethswarm.org/docs/bee/installation/) node

### 5.3 Installation

```sh
pnpm install
```

### 5.4 Build

```sh
pnpm build
```

### 5.5 Usage

Replace `<ipfs-cid>` with the actual CID of the file you want to download from IPFS.

```sh
node dist/index.js <ipfs-cid>
```

### 5.6 Project Structure

* `src/index.ts`: Main entry point of the application
* `src/ipfs.ts`: Handles IPFS interactions
* `src/bee.ts`: Handles Swarm interactions

### 5.7 Configuration

* The Bee node URL and batch ID are currently hardcoded in `src/bee.ts`.
* Make sure your Bee node is running and the batch ID is valid.

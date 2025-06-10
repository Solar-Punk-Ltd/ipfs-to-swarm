# ipfs-to-swarm

A very simple TypeScript tool to download files from IPFS and upload them to Swarm (Bee).

## Features

- Downloads content from IPFS using a CID
- Uploads the downloaded content to a Swarm Bee node
- Command-line interface

## Requirements

- Node.js v16 or newer
- [pnpm](https://pnpm.io/)
- A running [Bee](https://docs.ethswarm.org/docs/bee/installation/) node

## Installation

```sh
pnpm install
```

## Build

```sh
pnpm build
```

## Usage

Replace `<ipfs-cid>` with the actual CID of the file you want to download from IPFS.

```sh
node dist/index.js <ipfs-cid>
```

## Project Structure

- `src/index.ts`: Main entry point of the application
- `src/ipfs.ts`: Handles IPFS interactions
- `src/bee.ts`: Handles Swarm interactions

## Configuration

- The Bee node URL and batch ID are currently hardcoded in `src/bee.ts`.
- Make sure your Bee node is running and the batch ID is valid.

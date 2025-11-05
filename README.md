# opnVote Ballot Decoder

CLI tool to decode and verify encrypted opnVote ballots.

## Setup

```bash
npm install
npm run build
```

Note: The opnvote package needs to be built after installation!

```bash
cd node_modules/opnvote/votingSystem && npm install && npm run build
```

## Usage

```bash
npm run decode
```

The tool will ask you for:

- **Encrypted votes**
  Get this from a vote transaction on Gnosisscan

- **Election private key**
  Found in the election contract on Gnosisscan (only published after election results are released)

- **Election description CID** (optional)
  Found in the election contract on Gnosisscan

## Configuration

Copy `.env.example` to `.env` to customize the IPFS gateway:

```bash
cp .env.example .env
```

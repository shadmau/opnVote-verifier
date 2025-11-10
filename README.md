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

Copy `.env.example` to `.env` to customize settings:

```bash
cp .env.example .env
```

Configuration options:

- `IPFS_GATEWAY` - IPFS gateway URL (default: https://ipfs.io/ipfs/)
- `VOTE_FORMAT_VERSION` - Vote format version (default: 1)
- `NUMBER_OF_QUESTIONS` - Questions per ballot (default: 4)

## Standalone Executables

Build standalone executable:

- `npm run compile:linux` - Linux x64
- `npm run compile:macos` - macOS x64
- `npm run compile:macos-arm` - macOS ARM64
- `npm run compile:windows` - Windows x64

Executables are found in `build/`

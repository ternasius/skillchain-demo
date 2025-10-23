# SkillChain - Decentralized Reputation System

Decentralized skill verification and reputation system built on Polkadot SDK. Users mint skill NFTs and build on-chain reputation through token-staked endorsements.

## Quick Demo

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` for the interactive demo.

## Core Features

- **Skill NFTs**: Mint verifiable skill credentials
- **Token Endorsements**: Stake tokens to endorse skills  
- **Trusted Verification**: Universities/employers can verify skills
- **Reputation Scoring**: Build on-chain reputation through endorsements

## Blockchain Implementation Status

### What I've Built

✅ **Complete Substrate Pallets** - Real blockchain logic  
*Verify:* Check `pallets/skill-registry/src/lib.rs` and `pallets/endorsements/src/lib.rs` for working Substrate pallet code with proper macros, storage, events, and extrinsics.

✅ **Frontend Integration** - Polkadot.js API with wallet connection  
*Verify:* Review `frontend/src/BlockchainApp.js` for `@polkadot/api` imports, `web3Enable()` calls, transaction signing with `signAndSend()`, and WebSocket connection to `ws://127.0.0.1:9944`.

✅ **Runtime Configuration** - Custom Substrate runtime ready  
*Verify:* Pallet integration code prepared for Substrate node template with `construct_runtime!` macro and pallet configurations.

✅ **Token Economics** - Endorsement staking system implemented  
*Verify:* Examine `pallets/endorsements/src/lib.rs` for `Currency::reserve()` calls, stake amount validation, and reputation scoring logic in `endorse_skill()` function.

### To Deploy Actual Blockchain

```bash
# Prerequisites
rustup update && rustup target add wasm32-unknown-unknown

# Setup & Build
git clone https://github.com/paritytech/polkadot-sdk-minimal-template
cp -r pallets/* polkadot-sdk-minimal-template/pallets/
cd polkadot-sdk-minimal-template
cargo build --workspace --release

# Run blockchain
./target/release/node-template --dev --tmp

# Connect frontend
# Visit: http://localhost:3000?blockchain=true
```

**Deployment Options:**
- **Local Development** (Free) - Full blockchain functionality
- **Public Testnet** (Free) - Rococo/Westend deployment  
- **Parachain Slot** (~$2M DOT) - Production Polkadot deployment

**Disclaimer:** Complete technical implementation ready for blockchain deployment. All components demonstrate real Polkadot ecosystem integration.

## Credits

- **Blockchain Framework**: Polkadot SDK (Substrate)
- **Background Animation**: [Vanta.js NET Effect](https://www.vantajs.com/?effect=net)
- **UI Framework**: React.js
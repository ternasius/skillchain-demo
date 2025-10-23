# SkillChain Blockchain Version

## Two Versions Available

### 1. Demo Version (Default)
```bash
npm start
# or visit: http://localhost:3000
```
- Mock data, no blockchain required
- Perfect for presentations and testing UX

### 2. Blockchain Version
```bash
npm start
# then visit: http://localhost:3000?blockchain=true
```
- Connects to real Substrate blockchain
- Requires running Substrate node

## Setup Blockchain Version

### 1. Install Substrate
```bash
git clone https://github.com/polkadot-developers/substrate-node-template
cd substrate-node-template
```

### 2. Add SkillChain Pallets
Copy pallets from `skillchain-mvp/pallets/` to `substrate-node-template/pallets/`

### 3. Update Runtime
Edit `runtime/src/lib.rs`:
```rust
construct_runtime!(
    pub struct Runtime {
        // ... existing pallets
        SkillRegistry: pallet_skill_registry,
        Endorsements: pallet_endorsements,
    }
);
```

### 4. Build & Run Node
```bash
cargo build --release
./target/release/node-template --dev --tmp
```

### 5. Install Polkadot.js Extension
- Install from Chrome/Firefox store
- Create test accounts (Alice, Bob, etc.)

### 6. Access Blockchain Version
Visit: `http://localhost:3000?blockchain=true`

## Features

### Blockchain Version
✅ Real transactions on Substrate
✅ Polkadot.js wallet integration  
✅ On-chain skill storage
✅ Token-based endorsements
✅ Block confirmations
✅ Event listening

### Demo Version  
✅ Full UI/UX experience
✅ No setup required
✅ Perfect for presentations
✅ All features simulated

## Switching Between Versions
- **Demo**: `http://localhost:3000`
- **Blockchain**: `http://localhost:3000?blockchain=true`
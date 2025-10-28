# SkillChain Pallets

Custom Substrate pallets implementing the core SkillChain functionality.

## Pallets

### Skill Registry (`skill-registry`)
Manages soulbound skill NFTs with verification system.

**Features:**
- Mint non-transferable skill tokens
- Skill verification by trusted entities
- Metadata storage for skill descriptions
- Soulbound token implementation

**Extrinsics:**
- `mint_skill(metadata)` - Create new skill NFT
- `verify_skill(skill_id)` - Verify skill (trusted entities only)

### Endorsements (`endorsements`)
Handles token-staked skill endorsements with reputation scoring.

**Features:**
- Cryptocurrency-backed endorsements
- Automatic reputation calculation
- Stake slashing for false endorsements
- Economic incentive alignment

**Extrinsics:**
- `endorse_skill(skill_id, stake_amount)` - Endorse with token stake
- `challenge_endorsement(endorsement_id)` - Challenge false endorsement

## Development

```bash
# Build pallets
cargo build --workspace

# Run tests
cargo test --workspace

# Check code
cargo check --workspace
```

## Integration

Add to your runtime `Cargo.toml`:
```toml
pallet-skill-registry = { path = "../pallets/skill-registry", default-features = false }
pallet-endorsements = { path = "../pallets/endorsements", default-features = false }
```

Configure in runtime:
```rust
impl pallet_skill_registry::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxMetadataLength = frame_support::traits::ConstU32<256>;
}

impl pallet_endorsements::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Currency = Balances;
}
```
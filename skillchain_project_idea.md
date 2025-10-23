## SkillChain – The On-Chain Reputation Layer for Work & Learning

### Problem
Freelancers, students, and contributors have fragmented reputations:
- Proof of skills exists across multiple platforms (GitHub, Coursera, Upwork, DAOs, etc.).
- Employers can’t easily verify skill authenticity or work history.
- Users don’t truly own their reputation — it’s trapped in centralized systems.

### Solution
**SkillChain** creates a portable, verifiable reputation system on Polkadot where:
- Users mint **Skill NFTs** that represent verified achievements, certifications, or contributions.
- DAOs, companies, or platforms can issue and endorse skills as verifiable credentials.
- Reputation is composable and cross-chain — usable across any Polkadot parachain app.

Each “Skill NFT” acts as a decentralized, tamper-proof credential tied to a user’s Polkadot identity.

### Core Features
| Feature | Description | Polkadot Component |
|----------|--------------|-------------------|
| Skill NFTs / Credentials | NFTs representing skills, experiences, or completed tasks, optionally soulbound (non-transferable). | Polkadot SDK NFT pallet (or custom pallet) |
| Endorsements | Other users or orgs can “endorse” a skill NFT by staking small tokens, creating a trust graph. | Custom endorsement pallet + XCM messaging |
| Verification Layer | DAOs or platforms can issue verified badges tied to off-chain data (via oracles). | Off-chain worker + oracles (via Substrate) |
| Profile Aggregation | One dashboard showing all your verifiable skills, endorsements, and DAO participation. | Frontend + Polkadot.js API |
| Cross-Chain Use | Skills can be read or referenced by other parachains (e.g., DeFi apps, DAOs, job portals). | XCM / Polkadot Cloud integration |

### Tech Stack
- **Frontend:** React + Polkadot.js + TailwindCSS  
- **Backend / Blockchain:**  
  - Polkadot SDK (Substrate) for core logic  
  - Custom pallets: `skill_registry`, `endorsements`, `verification`  
  - Optional: IPFS or Crust for metadata (e.g., certificates, badges)
- **Integration:**  
  - Use **Polkadot Cloud** to host and deploy your chain easily  
  - Optionally integrate with existing parachains (like Astar or Moonbeam for identity or DeFi use)

### Example User Flow
1. User signs up via Polkadot wallet (Polkadot.js or Talisman).  
2. They mint a Skill NFT, e.g., “Python” or “Data Science.”  
3. A certifying entity (school, DAO, or employer) verifies it by signing the NFT metadata.  
4. Other users endorse it with small token stakes to prove trustworthiness.  
5. Their on-chain profile now reflects cumulative skill reputation (e.g., “10 verified skills, 40 endorsements, 2 DAOs”).  
6. Third-party apps or DAOs can query SkillChain to filter candidates or contributors by on-chain reputation.

### Stretch Goals
- Zero-Knowledge Proofs: allow private verification (e.g., proving you have a skill without revealing the credential).  
- AI Skills Verifier: integrate with an LLM that checks code samples or GitHub commits to auto-verify skill NFTs.  
- Cross-Chain Reputation Bridge: mirror skills to external ecosystems (Ethereum, Solana) via bridges.

### Why It Fits the Hackathon
- **User-centric:** gives users control of their identity and reputation.  
- **Uses Polkadot SDK:** perfect for showcasing custom pallets and Polkadot Cloud deployment.  
- **High Impact:** connects Web3 identity, DAOs, and real-world work credentials.  
- **Expandable:** could become the “LinkedIn of Web3.”

---

# Technical Architecture (MVP blueprint)

This section provides a buildable technical architecture for an MVP SkillChain that an AI agent or developer team can use to scaffold and implement the project.

## High-level components
1. **Substrate-based chain (SkillChain parachain or parachain-collator)**
   - Runtime pallets: `skill_registry`, `endorsements`, `verification`, `metadata_storage`.
   - Token pallet (or reuse an existing token) for staking endorsements and small incentives.
   - Off-chain workers for verification jobs and oracle interactions.
2. **Frontend dApp**
   - React app using Polkadot.js API to sign extrinsics and query chain state.
   - Wallet integrations: Polkadot.js extension, Talisman.
3. **Metadata storage**
   - IPFS/Crust or centralized CDN for large artifacts (certificates, evidence links). Store IPFS CIDs in on-chain metadata.
4. **Oracles / Verifiers**
   - Off-chain verification services to confirm external artifacts (e.g., Coursera certs, GitHub commits). They sign attestations which are submitted to the chain.
5. **Optional bridge/XCM integration**
   - Enable other parachains to query skill data or listen to events.

## Pallet designs (core APIs & storage)

### `skill_registry` pallet
**Purpose:** Create and manage Skill NFTs / credentials.

**Storage:**
- `Skills: map SkillId => SkillInfo`  (SkillInfo = {owner: AccountId, metadata_cid: Vec<u8>, issued_by: AccountId, issued_at: BlockNumber, soulbound: bool, verified: bool})
- `AccountSkills: map AccountId => Vec<SkillId>`
- `NextSkillId: SkillId` (incrementing)

**Extrinsics:**
- `fn mint_skill(origin, metadata_cid, issued_by, soulbound: bool)` -> creates new SkillId, stores SkillInfo, emits `SkillMinted` event.
- `fn revoke_skill(origin, skill_id)` -> allows issuer to revoke (set verified=false or mark revoked).
- `fn update_skill_metadata(origin, skill_id, new_metadata_cid)` -> issuer or owner updated.

**Events:** `SkillMinted(SkillId, AccountId)`, `SkillRevoked(SkillId)`, `SkillVerified(SkillId)`

**Access model:**
- Any account can call `mint_skill` but `issued_by` field indicates issuer; optionally require issuer to be a registered verifier via `verification` pallet.

### `endorsements` pallet
**Purpose:** Allow accounts to endorse skills by staking tokens; compute endorsement score.

**Storage:**
- `Endorsements: map SkillId => Vec<(Endorser: AccountId, stake: Balance, comment_cid: Option<Cid>)>`
- `SkillScores: map SkillId => u128` (aggregated score)

**Extrinsics:**
- `fn endorse_skill(origin, skill_id, stake, comment_cid)` -> transfer stake to pallet escrow, add endorsement.
- `fn withdraw_endorsement(origin, skill_id)` -> allow endorser to withdraw after locking period.

**Events:** `SkillEndorsed(SkillId, AccountId, Balance)`

**Economic model:**
- Small stake discourages spam; part of stake could be slashed on evidence of fraud by verifiers.

### `verification` pallet
**Purpose:** Manage verified issuers and process signed attestations from off-chain verifiers.

**Storage:**
- `Verifiers: map AccountId => VerifierInfo` (metadata, trust score)
- `Attestations: map AttestationId => AttestationInfo` (signed by verifier)

**Extrinsics:**
- `fn register_verifier(origin, metadata_cid)` -> governance action or on-chain application process.
- `fn submit_attestation(origin, skill_id, attestation_blob, signature)` -> store attestation, mark `SkillInfo.verified=true` if valid.

**Off-chain worker:**
- Periodically fetch external proof or validate signed attestations.

**Events:** `VerifierRegistered(AccountId)`, `AttestationSubmitted(AttestationId, SkillId)`

## Metadata format (IPFS JSON schema)
Example JSON stored on IPFS and referenced by `metadata_cid`:
```
{
  "name": "Python Developer",
  "description": "Completed Data Science Capstone at Acme University",
  "evidence": [
    {"type": "certificate", "url": "ipfs://Qm..."},
    {"type": "github", "url": "https://github.com/user/repo/commit/.."}
  ],
  "issuer": {"name": "Acme University", "address": "5..."},
  "issued_at": "2025-10-01",
  "expiry": null
}
```

## Minimal on-chain interactions for MVP
- `mint_skill(metadata_cid, issued_by, soulbound=true)`
- `endorse_skill(skill_id, stake, comment_cid)`
- `submit_attestation(skill_id, attestation_blob, signature)`
- `query_account_skills(account_id)` (RPC/state query)

## Front-end components & flows
1. **Wallet/Auth**: connect via Polkadot.js extension; show account, balances.
2. **Profile Page**: list `AccountSkills` with badges, verification status, and endorsements.
3. **Mint Skill Modal**: upload evidence to IPFS, call `mint_skill` extrinsic.
4. **Endorse Flow**: pick skill, stake tokens, and add optional comment (stored on IPFS).
5. **Verifier Dashboard**: verifiers review pending attestations and submit `submit_attestation` extrinsic.

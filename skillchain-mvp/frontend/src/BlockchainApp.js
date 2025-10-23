import React, { useState, useEffect, useRef } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: '700'
  },
  status: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e1e5e9',
    fontSize: '16px',
    marginBottom: '16px'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#007bff',
    color: 'white',
    marginRight: '10px'
  }
};

function BlockchainApp() {
  const [api, setApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [status, setStatus] = useState('Connecting to blockchain...');
  const [skills, setSkills] = useState([]);
  const [metadata, setMetadata] = useState('');
  const [endorseId, setEndorseId] = useState('');
  const [stake, setStake] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initBlockchain();
  }, []);

  const initBlockchain = async () => {
    try {
      // Connect to local Substrate node
      const wsProvider = new WsProvider('ws://127.0.0.1:9944');
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
      setStatus('✅ Connected to Substrate node');

      // Enable Polkadot extension
      await web3Enable('SkillChain');
      const accounts = await web3Accounts();
      setAccounts(accounts);
      
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
        setStatus('✅ Blockchain connected, wallet ready');
      } else {
        setStatus('⚠️ Please install Polkadot.js extension');
      }

      // Listen for new blocks
      api.rpc.chain.subscribeNewHeads((header) => {
        console.log(`New block #${header.number}`);
      });

    } catch (error) {
      console.error('Blockchain connection failed:', error);
      setStatus('❌ Failed to connect to blockchain. Make sure Substrate node is running on ws://127.0.0.1:9944');
    }
  };

  const mintSkill = async () => {
    if (!api || !selectedAccount || !metadata.trim()) return;
    
    setLoading(true);
    try {
      const injector = await web3FromAddress(selectedAccount.address);
      
      // Call the skill registry pallet
      const tx = api.tx.skillRegistry.mintSkill(metadata.trim(), true);
      
      await tx.signAndSend(selectedAccount.address, { signer: injector.signer }, (status) => {
        if (status.isInBlock) {
          setStatus(`✅ Skill minted in block ${status.asInBlock}`);
          setMetadata('');
          fetchSkills();
        } else if (status.isFinalized) {
          setStatus(`✅ Skill finalized in block ${status.asFinalized}`);
        }
      });
    } catch (error) {
      console.error('Minting failed:', error);
      setStatus(`❌ Minting failed: ${error.message}`);
    }
    setLoading(false);
  };

  const endorseSkill = async () => {
    if (!api || !selectedAccount || !endorseId || !stake) return;
    
    setLoading(true);
    try {
      const injector = await web3FromAddress(selectedAccount.address);
      const stakeAmount = parseFloat(stake) * 1000000000000; // Convert to planck units
      
      const tx = api.tx.endorsements.endorseSkill(parseInt(endorseId), stakeAmount);
      
      await tx.signAndSend(selectedAccount.address, { signer: injector.signer }, (status) => {
        if (status.isInBlock) {
          setStatus(`✅ Endorsement made in block ${status.asInBlock}`);
          setEndorseId('');
          setStake('');
          fetchSkills();
        }
      });
    } catch (error) {
      console.error('Endorsement failed:', error);
      setStatus(`❌ Endorsement failed: ${error.message}`);
    }
    setLoading(false);
  };

  const fetchSkills = async () => {
    if (!api || !selectedAccount) return;
    
    try {
      // Fetch skills from blockchain
      const skillIds = await api.query.skillRegistry.accountSkills(selectedAccount.address);
      const skillPromises = skillIds.map(async (skillId) => {
        const skillInfo = await api.query.skillRegistry.skills(skillId);
        return {
          id: skillId.toNumber(),
          ...skillInfo.toJSON()
        };
      });
      
      const skillsData = await Promise.all(skillPromises);
      setSkills(skillsData);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔗 SkillChain - Blockchain Version</h1>
      
      <div style={styles.status}>
        <strong>Status:</strong> {status}
      </div>

      {selectedAccount && (
        <div style={styles.status}>
          <strong>Account:</strong> {selectedAccount.meta.name} ({selectedAccount.address.slice(0, 8)}...)
        </div>
      )}

      <div style={styles.card}>
        <h3>Mint Skill NFT</h3>
        <input
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="Enter skill name (e.g., Python Programming)"
          style={styles.input}
        />
        <button 
          onClick={mintSkill} 
          disabled={loading || !api || !selectedAccount}
          style={styles.button}
        >
          {loading ? 'Minting...' : 'Mint Skill'}
        </button>
      </div>

      <div style={styles.card}>
        <h3>Endorse Skill</h3>
        <input
          value={endorseId}
          onChange={(e) => setEndorseId(e.target.value)}
          placeholder="Skill ID to endorse"
          style={styles.input}
        />
        <input
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          placeholder="Stake amount (tokens)"
          style={styles.input}
        />
        <button 
          onClick={endorseSkill} 
          disabled={loading || !api || !selectedAccount}
          style={styles.button}
        >
          {loading ? 'Endorsing...' : 'Endorse Skill'}
        </button>
      </div>

      <div style={styles.card}>
        <h3>My Skills</h3>
        <button onClick={fetchSkills} style={styles.button}>Refresh Skills</button>
        {skills.length === 0 ? (
          <p>No skills found. Mint your first skill!</p>
        ) : (
          skills.map(skill => (
            <div key={skill.id} style={{padding: '10px', border: '1px solid #ddd', margin: '10px 0'}}>
              <strong>Skill #{skill.id}:</strong> {skill.metadataCid}
              <br />
              <small>Verified: {skill.verified ? 'Yes' : 'No'} | Soulbound: {skill.soulbound ? 'Yes' : 'No'}</small>
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <h3>Blockchain Info</h3>
        <p><strong>Node:</strong> ws://127.0.0.1:9944</p>
        <p><strong>Pallets:</strong> skill-registry, endorsements</p>
        <p><strong>Network:</strong> Local Development</p>
      </div>
    </div>
  );
}

export default BlockchainApp;
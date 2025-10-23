import React, { useState } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';

function MintSkill({ api, account }) {
  const [metadata, setMetadata] = useState('');
  const [soulbound, setSoulbound] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleMintSkill = async () => {
    if (!metadata.trim()) {
      alert('Please enter skill metadata');
      return;
    }

    setIsLoading(true);
    try {
      const injector = await web3FromAddress(account.address);
      
      const tx = api.tx.skillRegistry.mintSkill(
        metadata,
        soulbound
      );

      await tx.signAndSend(account.address, { signer: injector.signer }, (status) => {
        if (status.isInBlock) {
          console.log('Transaction in block');
        } else if (status.isFinalized) {
          console.log('Transaction finalized');
          setMetadata('');
          setIsLoading(false);
          alert('Skill minted successfully!');
        }
      });
    } catch (error) {
      console.error('Error minting skill:', error);
      setIsLoading(false);
      alert('Error minting skill');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Mint New Skill</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Skill Description/Metadata:</label>
        <input
          type="text"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="e.g., Python Developer, Data Science Certificate"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="checkbox"
            checked={soulbound}
            onChange={(e) => setSoulbound(e.target.checked)}
          />
          Soulbound (non-transferable)
        </label>
      </div>

      <button 
        onClick={handleMintSkill}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Minting...' : 'Mint Skill'}
      </button>
    </div>
  );
}

export default MintSkill;
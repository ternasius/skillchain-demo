import React, { useState } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';

function EndorseSkill({ api, account }) {
  const [skillId, setSkillId] = useState('');
  const [stake, setStake] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEndorseSkill = async () => {
    if (!skillId || !stake) {
      alert('Please enter skill ID and stake amount');
      return;
    }

    setIsLoading(true);
    try {
      const injector = await web3FromAddress(account.address);
      
      const tx = api.tx.endorsements.endorseSkill(
        parseInt(skillId),
        stake * 1000000000000 // Convert to planck units (assuming 12 decimals)
      );

      await tx.signAndSend(account.address, { signer: injector.signer }, (status) => {
        if (status.isInBlock) {
          console.log('Endorsement in block');
        } else if (status.isFinalized) {
          console.log('Endorsement finalized');
          setSkillId('');
          setStake('');
          setIsLoading(false);
          alert('Skill endorsed successfully!');
        }
      });
    } catch (error) {
      console.error('Error endorsing skill:', error);
      setIsLoading(false);
      alert('Error endorsing skill');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h3>Endorse a Skill</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Skill ID:</label>
        <input
          type="number"
          value={skillId}
          onChange={(e) => setSkillId(e.target.value)}
          placeholder="Enter skill ID to endorse"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Stake Amount (tokens):</label>
        <input
          type="number"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          placeholder="Amount to stake"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <button 
        onClick={handleEndorseSkill}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Endorsing...' : 'Endorse Skill'}
      </button>
    </div>
  );
}

export default EndorseSkill;
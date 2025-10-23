import React, { useState, useEffect, useRef } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
    position: 'relative'
  },

  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  accountSelector: {
    background: 'rgba(15, 15, 35, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    marginBottom: '30px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    color: 'white'
  },
  select: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: '2px solid rgba(0, 212, 255, 0.3)',
    background: 'rgba(15, 15, 35, 0.8)',
    color: 'white',
    fontSize: '16px',
    marginLeft: '10px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  card: {
    background: 'rgba(15, 15, 35, 0.9)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 10
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'white'
  },
  skillCard: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(0)',
    transition: 'all 0.3s ease'
  },
  skillTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '12px'
  },
  skillStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    opacity: '0.9'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid rgba(0, 212, 255, 0.3)',
    background: 'rgba(15, 15, 35, 0.8)',
    color: 'white',
    fontSize: '16px',
    marginBottom: '16px',
    transition: 'border-color 0.3s ease'
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  mintButton: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
  },
  endorseButton: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)'
  },
  allSkills: {
    background: 'rgba(15, 15, 35, 0.9)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 10,
    color: 'white'
  },
  skillItem: {
    background: 'rgba(0, 212, 255, 0.1)',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '8px',
    borderLeft: '4px solid #00d4ff'
  },
  emptyState: {
    textAlign: 'center',
    color: '#718096',
    fontSize: '1.1rem',
    padding: '40px 20px'
  },
  scrollContainer: {
    height: '350px',
    overflowY: 'auto',
    paddingRight: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '10px',
    marginTop: '10px'
  }
};

function DemoApp() {
  const [skills, setSkills] = useState([]);
  const [account, setAccount] = useState('Alice');
  const [metadata, setMetadata] = useState('');
  const [endorseId, setEndorseId] = useState('');
  const [stake, setStake] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showEndorseConfirm, setShowEndorseConfirm] = useState(false);
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [verifySkillId, setVerifySkillId] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  
  const trustedEntities = ['Carol', 'Dave'];

  useEffect(() => {
    if (!vantaEffect.current && window.VANTA) {
      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 1400.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x6b7280,
        backgroundColor: 0x0f0f23,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  const showError = (msg) => {
    setError(msg);
    setSuccess('');
    setTimeout(() => setError(''), 3000);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const previewSkill = () => {
    if (!metadata.trim()) {
      showError('Please enter skill description');
      return;
    }
    setShowPreview(true);
  };

  const confirmMint = () => {
    const newSkill = {
      id: skills.length,
      metadata: metadata.trim(),
      owner: account,
      verified: false,
      endorsements: 0,
      score: 0,
      soulbound: true
    };
    setSkills([...skills, newSkill]);
    setMetadata('');
    setShowPreview(false);
    showSuccess(`Skill NFT "${newSkill.metadata}" minted successfully!`);
  };

  const cancelPreview = () => {
    setShowPreview(false);
  };

  const verifySkill = () => {
    if (!verifySkillId.trim()) {
      showError('Please enter a skill ID to verify');
      return;
    }
    
    if (!trustedEntities.includes(account)) {
      showError('Only trusted entities (universities/employers) can verify skills');
      return;
    }
    
    const skillId = parseInt(verifySkillId);
    if (isNaN(skillId) || skillId < 0) {
      showError('Invalid skill ID');
      return;
    }
    
    const targetSkill = skills.find(skill => skill.id === skillId);
    if (!targetSkill) {
      showError(`Skill #${skillId} does not exist`);
      return;
    }
    
    if (targetSkill.verified) {
      showError(`Skill #${skillId} is already verified`);
      return;
    }
    
    setConfirmData({ skill: targetSkill });
    setShowVerifyConfirm(true);
  };

  const confirmVerify = () => {
    const { skill } = confirmData;
    setSkills(skills.map(s => 
      s.id === skill.id 
        ? { ...s, verified: true, verifiedBy: account }
        : s
    ));
    setVerifySkillId('');
    setShowVerifyConfirm(false);
    showSuccess(`Skill #${skill.id} "${skill.metadata}" successfully verified!`);
  };

  const endorseSkill = () => {
    if (!endorseId.trim()) {
      showError('Please enter a skill ID');
      return;
    }
    if (!stake.trim()) {
      showError('Please enter stake amount');
      return;
    }
    
    const skillId = parseInt(endorseId);
    const stakeAmount = parseFloat(stake);
    
    if (isNaN(skillId) || skillId < 0) {
      showError('Invalid skill ID');
      return;
    }
    if (isNaN(stakeAmount)) {
      showError('Stake amount must be a number, not text or symbols');
      return;
    }
    if (stakeAmount <= 0) {
      showError('Stake amount must be a positive number');
      return;
    }
    
    const targetSkill = skills.find(skill => skill.id === skillId);
    if (!targetSkill) {
      showError(`Skill #${skillId} does not exist`);
      return;
    }
    
    if (targetSkill.owner === account) {
      showError('Cannot endorse your own skill');
      return;
    }
    
    setConfirmData({ skill: targetSkill, stakeAmount });
    setShowEndorseConfirm(true);
  };

  const confirmEndorse = () => {
    const { skill, stakeAmount } = confirmData;
    setSkills(skills.map(s => 
      s.id === skill.id 
        ? { ...s, endorsements: s.endorsements + 1, score: s.score + stakeAmount }
        : s
    ));
    setEndorseId('');
    setStake('');
    setShowEndorseConfirm(false);
    showSuccess(`Successfully endorsed "${skill.metadata}" with ${stakeAmount} tokens!`);
  };

  const userSkills = skills.filter(s => s.owner === account);

  return (
    <div ref={vantaRef} style={styles.container}>
      <h1 style={{...styles.header, position: 'relative', zIndex: 10, color: 'white'}}>🔗 SkillChain</h1>
      <p style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', marginBottom: '30px', opacity: '1' }}>
        Decentralized Reputation System on Polkadot
      </p>
      
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4757',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: '600',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#2ed573',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: '600',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          ✅ {success}
        </div>
      )}
      
      <div style={styles.accountSelector}>
        <label style={{ fontSize: '1.1rem', fontWeight: '600' }}>Connected Account:</label>
        <select 
          value={account} 
          onChange={(e) => setAccount(e.target.value)}
          style={styles.select}
        >
          <option value="Alice">👩💻 Alice (Developer)</option>
          <option value="Bob">👨💼 Bob (Recruiter)</option>
          <option value="Carol">🏫 Carol (University) ✓</option>
          <option value="Dave">🏢 Dave (Employer) ✓</option>
        </select>
        {trustedEntities.includes(account) && (
          <p style={{marginTop: '10px', color: '#28a745', fontWeight: '600'}}>
            ✓ Trusted Entity - Can verify skills
          </p>
        )}
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{...styles.cardTitle, marginBottom: '0'}}>🎯 My Skills Portfolio</h2>
            {userSkills.length > 0 && (
              <input
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search my skills..."
                style={{...styles.input, marginBottom: '0', width: '200px'}}
              />
            )}
          </div>
          {userSkills.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No skills minted yet</p>
              <p>Create your first skill credential →</p>
            </div>
          ) : (
            <div style={styles.scrollContainer} className="scroll-container">
              {userSkills.filter(skill => 
                skill.metadata.toLowerCase().includes(skillSearch.toLowerCase())
              ).map(skill => (
                <div key={skill.id} style={styles.skillCard} className="skill-card">
                  <div style={styles.skillTitle}>
                    {skill.metadata}
                  </div>
                  <div style={styles.skillStats}>
                    <span>{skill.verified ? '✅ Verified' : '⏳ Pending'}</span>
                    <span>👥 {skill.endorsements} endorsements</span>
                    <span>⭐ {skill.score} reputation</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🚀 Mint New Skill</h3>
            <input
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder="e.g., Python Programming, Machine Learning, React Development"
              style={styles.input}
            />
            <button 
              onClick={previewSkill} 
              style={{...styles.button, ...styles.mintButton}}
            >
              Preview Skill NFT
            </button>
          </div>

          <div style={{...styles.card, marginTop: '20px'}}>
            <h3 style={styles.cardTitle}>💎 Endorse Skills</h3>
            <input
              value={endorseId}
              onChange={(e) => setEndorseId(e.target.value)}
              placeholder="Skill ID to endorse"
              style={styles.input}
            />
            <input
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="Stake amount (e.g., 10.5 tokens)"
              style={styles.input}
            />
            <button 
              onClick={endorseSkill} 
              style={{...styles.button, ...styles.endorseButton}}
            >
              Stake & Endorse
            </button>
          </div>

          {trustedEntities.includes(account) && (
            <div style={{...styles.card, marginTop: '20px'}}>
              <h3 style={styles.cardTitle}>✅ Verify Skills</h3>
              <input
                value={verifySkillId}
                onChange={(e) => setVerifySkillId(e.target.value)}
                placeholder="Skill ID to verify"
                style={styles.input}
              />
              <button 
                onClick={verifySkill} 
                style={{...styles.button, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', color: 'white'}}
              >
                Official Verify
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={styles.allSkills}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
          <h3 style={{...styles.cardTitle, marginBottom: '0'}}>🌐 Global Skills Network</h3>
          {skills.length > 0 && (
            <input
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search skills, owners, or IDs..."
              style={{...styles.input, marginBottom: '0', width: '300px'}}
            />
          )}
        </div>
        {skills.length === 0 ? (
          <div style={styles.emptyState}>
            No skills in the network yet. Be the first to mint!
          </div>
        ) : (
          <div style={styles.scrollContainer} className="scroll-container">
            {skills.filter(skill => {
              const search = globalSearch.toLowerCase();
              return skill.metadata.toLowerCase().includes(search) ||
                     skill.owner.toLowerCase().includes(search) ||
                     skill.id.toString().includes(search);
            }).map(skill => (
              <div key={skill.id} style={styles.skillItem}>
                <strong>#{skill.id} {skill.metadata}</strong> by {skill.owner} 
                • {skill.score} reputation • {skill.endorsements} endorsements
              </div>
            ))}
          </div>
        )}
      </div>

      {showPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{marginBottom: '20px', color: '#2d3748'}}>Preview Skill NFT</h3>
            
            <div style={{
              ...styles.skillCard,
              marginBottom: '20px'
            }}>
              <div style={styles.skillTitle}>
                {metadata.trim()}
              </div>
              <div style={styles.skillStats}>
                <span>⏳ Pending Verification</span>
                <span>👥 0 endorsements</span>
                <span>⭐ 0 reputation</span>
              </div>
            </div>
            
            <p style={{marginBottom: '20px', color: '#666', fontSize: '14px'}}>
              ⚠️ <strong>Warning:</strong> Once minted, this skill NFT cannot be edited. Please verify the information is correct.
            </p>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={confirmMint}
                style={{...styles.button, ...styles.mintButton, flex: 1}}
              >
                Confirm & Mint
              </button>
              <button 
                onClick={cancelPreview}
                style={{...styles.button, background: '#6c757d', color: 'white', flex: 1}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndorseConfirm && confirmData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{marginBottom: '20px', color: '#2d3748'}}>Confirm Endorsement</h3>
            
            <div style={{
              ...styles.skillCard,
              marginBottom: '20px'
            }}>
              <div style={styles.skillTitle}>
                #{confirmData.skill.id}: {confirmData.skill.metadata}
              </div>
              <div style={styles.skillStats}>
                <span>Owner: {confirmData.skill.owner}</span>
                <span>Current Score: {confirmData.skill.score}</span>
              </div>
            </div>
            
            <p style={{marginBottom: '20px', color: '#666', fontSize: '16px'}}>
              You are about to stake <strong>{confirmData.stakeAmount} tokens</strong> to endorse this skill.
            </p>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={confirmEndorse}
                style={{...styles.button, ...styles.endorseButton, flex: 1}}
              >
                Confirm Endorsement
              </button>
              <button 
                onClick={() => setShowEndorseConfirm(false)}
                style={{...styles.button, background: '#6c757d', color: 'white', flex: 1}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifyConfirm && confirmData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{marginBottom: '20px', color: '#2d3748'}}>Confirm Verification</h3>
            
            <div style={{
              ...styles.skillCard,
              marginBottom: '20px'
            }}>
              <div style={styles.skillTitle}>
                #{confirmData.skill.id}: {confirmData.skill.metadata}
              </div>
              <div style={styles.skillStats}>
                <span>Owner: {confirmData.skill.owner}</span>
                <span>Status: Pending Verification</span>
              </div>
            </div>
            
            <p style={{marginBottom: '20px', color: '#666', fontSize: '16px'}}>
              As a trusted entity, you are about to officially verify this skill.
            </p>
            
            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={confirmVerify}
                style={{...styles.button, background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', color: 'white', flex: 1}}
              >
                Confirm Verification
              </button>
              <button 
                onClick={() => setShowVerifyConfirm(false)}
                style={{...styles.button, background: '#6c757d', color: 'white', flex: 1}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemoApp;
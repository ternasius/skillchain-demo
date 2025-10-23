import React, { useState, useEffect } from 'react';

function SkillProfile({ api, account }) {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillIds = await api.query.skillRegistry.accountSkills(account.address);
        const skillPromises = skillIds.map(async (skillId) => {
          const skillInfo = await api.query.skillRegistry.skills(skillId);
          const endorsements = await api.query.endorsements.endorsements(skillId);
          const score = await api.query.endorsements.skillScores(skillId);
          
          return {
            id: skillId.toNumber(),
            info: skillInfo.toJSON(),
            endorsements: endorsements.length,
            score: score.toNumber()
          };
        });
        
        const skillsData = await Promise.all(skillPromises);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    if (api && account) {
      fetchSkills();
    }
  }, [api, account]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
      <h2>My Skills Profile</h2>
      <p>Account: {account.meta.name}</p>
      
      {skills.length === 0 ? (
        <p>No skills minted yet.</p>
      ) : (
        <div>
          {skills.map(skill => (
            <div key={skill.id} style={{ 
              border: '1px solid #eee', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '4px',
              backgroundColor: skill.info?.verified ? '#e8f5e8' : '#fff8e1'
            }}>
              <h4>Skill #{skill.id}</h4>
              <p>Metadata: {skill.info?.metadataCid || 'N/A'}</p>
              <p>Verified: {skill.info?.verified ? '✅ Yes' : '❌ No'}</p>
              <p>Endorsements: {skill.endorsements}</p>
              <p>Score: {skill.score}</p>
              <p>Soulbound: {skill.info?.soulbound ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillProfile;
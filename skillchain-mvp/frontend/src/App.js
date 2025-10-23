import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import SkillProfile from './components/SkillProfile';
import MintSkill from './components/MintSkill';
import EndorseSkill from './components/EndorseSkill';

function App() {
  const [api, setApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const initApi = async () => {
      const wsProvider = new WsProvider('ws://127.0.0.1:9944');
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
    };

    const initAccounts = async () => {
      await web3Enable('SkillChain');
      const accounts = await web3Accounts();
      setAccounts(accounts);
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }
    };

    initApi();
    initAccounts();
  }, []);

  if (!api || !selectedAccount) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SkillChain - Decentralized Reputation System</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Account: </label>
        <select 
          value={selectedAccount.address} 
          onChange={(e) => setSelectedAccount(accounts.find(acc => acc.address === e.target.value))}
        >
          {accounts.map(account => (
            <option key={account.address} value={account.address}>
              {account.meta.name} ({account.address.slice(0, 8)}...)
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <SkillProfile api={api} account={selectedAccount} />
        </div>
        <div>
          <MintSkill api={api} account={selectedAccount} />
          <EndorseSkill api={api} account={selectedAccount} />
        </div>
      </div>
    </div>
  );
}

export default App;
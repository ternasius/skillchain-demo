import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoApp from './DemoApp';
import BlockchainApp from './BlockchainApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
const isBlockchain = window.location.search.includes('blockchain=true');
root.render(isBlockchain ? <BlockchainApp /> : <DemoApp />);
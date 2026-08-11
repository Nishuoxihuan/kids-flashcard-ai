import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import NineGridPage from './NineGridPage.jsx';
import './index.css';

// 临时：直接渲染 9 宫格页面，如需切换回原 App，将 NineGridPage 改为 App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NineGridPage />
  </React.StrictMode>,
);

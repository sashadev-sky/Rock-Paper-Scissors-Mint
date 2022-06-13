import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

import App from './components/App';
import ScrollToTop from './components/Router/ScrollToTop';
import reportWebVitals from './reportWebVitals';
import theme from './theme';

import './App.css';
import './index.css';
import { chains, customTheme, wagmiClient } from './config/rainbowkit';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <ScrollToTop />
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
              chains={chains}
              showRecentTransactions={true}
              theme={customTheme}
            >
              <App />
            </RainbowKitProvider>
          </WagmiConfig>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

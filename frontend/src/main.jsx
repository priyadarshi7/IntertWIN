import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { Auth0Provider } from '@auth0/auth0-react';
import { UserProvider } from './context/UserContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Auth0Provider
    domain="dev-udqndn3ec1rcacr4.us.auth0.com"
    clientId="HROBda8b6E4pzlxfsBl4R0DkOecidHeB"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <UserProvider>
    <App />
    </UserProvider>
  </Auth0Provider>
    </BrowserRouter>
)

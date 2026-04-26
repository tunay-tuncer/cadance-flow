import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectUri = import.meta.env.PROD
  ? "https://cadance-flow.vercel.app/dashboard"
  : window.location.origin + "/dashboard";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: "https://agonsucbloeqjljofaof.supabase.co"
      }}
    >
      <App />
    </Auth0Provider>

  </BrowserRouter>,
)

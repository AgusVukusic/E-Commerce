import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './index.css'
import App from './App.jsx'

/**
 * Aplicación principal con Redux Provider
 * 
 * CAMBIO IMPORTANTE:
 * - Se reemplazó AuthProvider y CartWishlistProvider (Context API)
 * - Por Redux Provider (Redux Toolkit)
 * - TODO el estado ahora se maneja en Redux Store
 * - NO se usa localStorage para persistencia
 * - NO hay useContext() en ningún componente
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './app/store.js'
import App from './App.jsx'
import{ BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ClerkProvider } from '@clerk/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <ClerkProvider>
      <Provider store={store}>
        <App/>
      </Provider>
    </ClerkProvider>
   </BrowserRouter>
  </StrictMode>
)

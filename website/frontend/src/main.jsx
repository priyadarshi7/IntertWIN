import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { UserProvider } from './context/UserContext.jsx';
import { SearchedUserProvider } from './context/SearchedUserContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <UserProvider>
    <SearchedUserProvider>
    <App />
    </SearchedUserProvider>
    </UserProvider>
    </BrowserRouter>
)

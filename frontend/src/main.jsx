import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ProjectFlowProvider } from './context/ProjectFlowContext'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ProjectFlowProvider>
          <App />
        </ProjectFlowProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
import React from 'react'
import Remixer from './components/Remixer'
import { SavedTweetsProvider } from './context/SavedTweetsContext'

function App() {
  return (
    <SavedTweetsProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <Remixer />
      </div>
    </SavedTweetsProvider>
  )
}

export default App
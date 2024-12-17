import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center space-x-8 mb-8">
        <a href="https://vitejs.dev" target="_blank" className="hover:opacity-80">
          <img src={viteLogo} className="h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:opacity-80">
          <img src={reactLogo} className="h-16" alt="React logo" />
        </a>
      </div>
      
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          React + Vite + Tailwind Template
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Start</h2>
          <div className="text-left space-y-4 text-gray-600">
            <p>1. Clone this repository</p>
            <p>2. Install dependencies: <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></p>
            <p>3. Start development server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="https://tailwindcss.com" target="_blank" 
             className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tailwind CSS Docs</h3>
            <p className="text-gray-600">Learn about the utility-first CSS framework</p>
          </a>
          
          <a href="https://react.dev" target="_blank"
             className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">React Docs</h3>
            <p className="text-gray-600">Explore React components and hooks</p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default App

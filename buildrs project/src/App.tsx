import { BrowserRouter, Routes, Route } from 'react-router-dom'

function HomePage() {
  return (
    <div className="relative min-h-screen bg-bg-base dots-bg">
      <div className="ambient-glow absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-display italic text-5xl text-text-primary mb-4">
            Buildrs
          </h1>
          <p className="font-sans text-text-secondary text-base">
            Le Laboratoire des Builders SaaS IA
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

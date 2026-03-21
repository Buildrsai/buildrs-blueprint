import { Link } from 'react-router'
import { Lock } from 'lucide-react'

interface SignupGateProps {
  onClose?: () => void
}

function SignupGate({ onClose }: SignupGateProps) {
  return (
    <div className="mt-4 rounded-2xl border border-[#E6EAF0] bg-white p-6 flex flex-col items-center text-center gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-[#F8F9FC] border border-[#E6EAF0] flex items-center justify-center">
        <Lock size={16} strokeWidth={1.5} className="text-[#45474D]" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#121317]">Score et verdict masqués</p>
        <p className="text-xs text-[#B2BBC5] max-w-xs">
          Crée un compte gratuit pour voir les scores complets, sauvegarder tes résultats
          et faire des recherches illimitées.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Link
          to="/signup"
          className="inline-flex items-center justify-center rounded-full font-medium bg-[#121317] text-white px-6 py-2.5 text-[14px] hover:bg-[#212226] transition-colors"
        >
          Créer un compte gratuit
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full font-medium text-[#45474D] px-6 py-2.5 text-[14px] hover:bg-[rgba(33,34,38,0.04)] transition-colors"
          >
            Continuer sans compte
          </button>
        )}
      </div>
    </div>
  )
}

export { SignupGate }

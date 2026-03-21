import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SettingsPage() {
  return (
    <div className="max-w-[640px] mx-auto flex flex-col gap-6">
      <h1
        className="text-[#121317]"
        style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
      >
        Paramètres
      </h1>

      {/* Profil */}
      <Card variant="white" padding="lg" className="flex flex-col gap-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EAF0]">
          <h2 className="text-sm font-medium text-[#121317]">Profil</h2>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Prénom" defaultValue="Tony" />
          <Input label="Email" type="email" defaultValue="tony@stark.com" />
        </div>
        <Button variant="secondary" size="sm" className="self-start">
          Sauvegarder
        </Button>
      </Card>

      {/* Abonnement */}
      <Card variant="white" padding="lg" className="flex flex-col gap-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EAF0]">
          <h2 className="text-sm font-medium text-[#121317]">Abonnement</h2>
          <Badge variant="accent">Lab · Actif</Badge>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[#45474D]">
            Accès complet au Lab — 1 projet · Paiement unique
          </p>
          <p className="text-xs text-[#B2BBC5]">Acheté le 20 mars 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            Gérer la facturation
          </Button>
          <Button variant="ghost" size="sm" className="text-[#EF4444] hover:bg-[#EF4444]/10">
            Annuler l'abonnement
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card variant="white" padding="lg" className="flex flex-col gap-4 border-[#EF4444]/20">
        <h2 className="text-sm font-medium text-[#EF4444]">Zone dangereuse</h2>
        <p className="text-sm text-[#45474D]">
          La suppression de ton compte est irréversible. Tous tes projets seront perdus.
        </p>
        <Button variant="ghost" size="sm"
          className="self-start text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full">
          Supprimer mon compte
        </Button>
      </Card>
    </div>
  )
}

export { SettingsPage }

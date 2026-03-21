import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

const projectSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  description: z.string().min(10, 'Décris ton projet en quelques mots'),
  niche: z.string().min(3, 'Précise la niche ou le secteur'),
})

type ProjectForm = z.infer<typeof projectSchema>

function ProjectNewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState<ProjectForm>({ name: '', description: '', niche: '' })
  const [errors, setErrors] = useState<Partial<ProjectForm>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = projectSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<ProjectForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ProjectForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setServerError(null)
    setLoading(true)

    // Créer le projet
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user!.id,
        name: form.name,
        description: form.description,
        idea_data: { niche: form.niche },
      })
      .select('id')
      .single()

    if (projectError || !project) {
      setServerError('Erreur lors de la création. Réessaie.')
      setLoading(false)
      return
    }

    // Créer la phase 1 comme active
    await supabase.from('project_phases').insert({
      project_id: project.id,
      phase_number: 1,
      status: 'active',
    })

    navigate(`/project/${project.id}`, { replace: true })
  }

  return (
    <div className="max-w-[560px] mx-auto flex flex-col gap-8">
      <div>
        <h1
          className="text-[#121317]"
          style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          Nouveau projet
        </h1>
        <p className="text-sm text-[#45474D] mt-1">
          Quelques infos pour personnaliser ton Lab. 30 secondes.
        </p>
      </div>

      <Card variant="white" padding="lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nom du projet"
            type="text"
            placeholder="Ex: TaskFlow Pro, MediSync, BriefAI…"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            hint="Tu pourras le changer plus tard"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-medium text-[#45474D] tracking-[0.011em]">
              Description courte
            </label>
            <textarea
              className="bg-white border border-[#E6EAF0] text-[#121317] rounded-[10px]
                px-4 py-3 text-sm resize-none min-h-[96px]
                focus:outline-none focus:ring-2 focus:ring-[#3279F9]/40
                placeholder:text-[#B2BBC5]
                hover:border-[#E1E6EC] transition-all duration-200"
              placeholder="Ex: Un outil de gestion de tâches pour les freelances qui jonglent entre plusieurs clients…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && (
              <p className="text-xs text-[#EF4444]">{errors.description}</p>
            )}
          </div>

          <Input
            label="Niche / Secteur"
            type="text"
            placeholder="Ex: freelances, para-médicaux, restauration, RH…"
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
            error={errors.niche}
            hint="Qui sont tes clients cibles ?"
          />

          {serverError && (
            <p className="text-sm text-[#EF4444]">{serverError}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="gap-2 mt-1"
          >
            Lancer la Phase 1
            <ArrowRight size={15} />
          </Button>
        </form>
      </Card>

      <p className="text-xs text-center text-[#B2BBC5]">
        Le Lab analysera ton idée et te guidera étape par étape.
      </p>
    </div>
  )
}

export { ProjectNewPage }

import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "./testimonials-columns";

const testimonials: Testimonial[] = [
  {
    text: "Je voulais un logiciel de gestion pour mon cabinet. Les devis qu'on me faisait démarraient à 8 000€. Avec Blueprint, je l'ai construit moi-même en 5 jours. Mes associés pensent que j'ai embauché un dev.",
    name: "Marie",
    role: "Dirigeante de cabinet comptable",
  },
  {
    text: "Je suis consultant, pas dev. Je voulais créer un micro-SaaS de scoring pour les données financières de mes clients. Avec les prompts du module 4, j'avais une base complète en quelques heures. 23 clients payants aujourd'hui.",
    name: "Thomas",
    role: "Consultant → Fondateur SaaS",
  },
  {
    text: "J'ai 21 ans, je suis en école de commerce. J'ai lancé un SaaS de prise de rendez-vous pour les coiffeurs pendant mes cours. Il génère 300€/mois. Mes potes n'y croient toujours pas.",
    name: "Hugo",
    role: "Étudiant → Builder",
  },
  {
    text: "En 72h j'avais un outil fonctionnel en ligne. Pas parfait, mais live. Et ça, ça change tout mentalement.",
    name: "Romain",
    role: "Freelance → Product Builder",
  },
  {
    text: "J'avais essayé des bootcamps à 900€. Blueprint à 27€ m'a donné plus de clarté que tout le reste combiné.",
    name: "Camille",
    role: "Coach → Fondatrice",
  },
  {
    text: "Mon entreprise avait besoin d'un outil interne pour gérer les plannings. Au lieu de payer un prestataire, j'ai suivi Blueprint. L'outil tourne depuis 3 semaines, l'équipe l'adore.",
    name: "Lucas",
    role: "Dirigeant PME",
  },
  {
    text: "Supabase, Vercel, Stripe — je ne savais même pas ce que c'était. Maintenant mon app tourne dessus et génère du MRR.",
    name: "Inès",
    role: "Designer → VibeCoder",
  },
  {
    text: "J'avais une idée d'app pour les jeunes parents — suivi des biberons, couches, sommeil. Je pensais que c'était un projet à 6 mois. J'ai lancé le MVP en une semaine. J'ai déjà 40 utilisateurs.",
    name: "Sarah",
    role: "Maman en congé maternité",
  },
  {
    text: "Ce que j'aime dans Blueprint c'est qu'il ne te vend pas du rêve. Il te donne un système. Et les systèmes, ça marche.",
    name: "Nadia",
    role: "Fondatrice, outil no-code",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-[560px] mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.09em] uppercase text-muted-foreground mb-4">
            Ils ont lancé
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.06] text-foreground mb-4">
            Ils avaient une idée.<br />Maintenant ils ont des clients.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Des fondateurs solo comme toi. Pas de background dev, pas de budget agency.
          </p>
        </motion.div>

        {/* Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[680px] overflow-hidden"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={22}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={20}
            className="hidden lg:block"
          />
        </motion.div>
      </div>
    </section>
  );
}

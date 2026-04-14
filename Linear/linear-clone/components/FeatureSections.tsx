import FeatureSection from './FeatureSection';
import type { FeatureSection as FeatureSectionType } from '../types/index';

const sections: FeatureSectionType[] = [
  {
    number: '1.0',
    label: 'Intake',
    linkLabel: 'Intake',
    linkHref: '#',
    heading: 'Make product\noperations self-driving',
    description:
      'Turn conversations and customer feedback into actionable issues that are routed, labeled, and prioritized for the right team.',
    mockupImages: [
      {
        src: '/images/section1-intake-v2.png',
        alt: 'Linear Intake — issue triage and routing UI',
      },
    ],
  },
  {
    number: '2.0',
    label: 'Plan',
    linkLabel: 'Plan',
    linkHref: '#',
    heading: 'Define the\nproduct direction',
    description:
      'Plan and navigate from idea to launch. Align your team with product initiatives, strategic roadmaps, and clear, up-to-date PRDs.',
    mockupImages: [
      {
        src: '/images/section2-plan.png',
        alt: 'Linear Plan — roadmap view',
      },
    ],
  },
  {
    number: '3.0',
    label: 'Build',
    linkLabel: 'Build',
    linkHref: '#',
    heading: 'Move work forward\nacross teams and agents',
    description:
      'Build and deploy AI agents that work alongside your team. Work on complex tasks together or delegate entire issues end-to-end.',
    mockupImages: [
      {
        src: '/images/section3-build.png',
        alt: 'Linear Build — agent tasks',
      },
    ],
  },
  {
    number: '4.0',
    label: 'Diffs (Coming soon)',
    linkLabel: 'Diffs',
    linkHref: '#',
    heading: 'Review PRs and\nagent output',
    description:
      'Understand code changes at a glance with structural diffs for human and agent output. Review, discuss, and merge — all within Linear.',
    mockupImages: [
      {
        src: '/images/section4-diffs.png',
        alt: 'Linear Diffs — code diff viewer',
      },
    ],
  },
  {
    number: '5.0',
    label: 'Monitor',
    linkLabel: 'Monitor',
    linkHref: '#',
    heading: 'Understand\nprogress at scale',
    description:
      'Take the guesswork out of product development with project updates, analytics, and dashboards that surface what needs your attention.',
    mockupImages: [
      {
        src: '/images/section5-monitor.png',
        alt: 'Linear Monitor — analytics dashboard',
      },
    ],
  },
];

export default function FeatureSections() {
  return (
    <div>
      {sections.map((section) => (
        <FeatureSection key={section.number} section={section} />
      ))}
    </div>
  );
}

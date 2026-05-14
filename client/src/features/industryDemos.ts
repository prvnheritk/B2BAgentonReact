import {
  Banknote,
  HeartPulse,
  ShieldCheck,
  ShoppingBag,
  Signal,
  Factory,
  type LucideIcon,
} from 'lucide-react';
import type { IndustryKey, IndustryTemplate } from '@/types/conversation';

export const industryIcons: Record<IndustryKey, LucideIcon> = {
  banking: Banknote,
  insurance: ShieldCheck,
  retail: ShoppingBag,
  telecom: Signal,
  healthcare: HeartPulse,
  manufacturing: Factory,
};

export const industryTemplates: IndustryTemplate[] = [
  {
    key: 'banking',
    label: 'Banking',
    tagline: 'Cases, accounts, fraud signals, pipeline insights.',
    prompts: [
      'Show me the cases associated with Lauren Bailey.',
      'Summarise Q4 pipeline by stage and flag slipping deals.',
      'Which high-value customers had failed transactions this week?',
    ],
  },
  {
    key: 'insurance',
    label: 'Insurance',
    tagline: 'Claims triage, policy lookup, fast-track recommendations.',
    prompts: [
      'Review claim 4471-A and recommend next steps.',
      'What policy clauses apply to a Moderate auto-collision?',
      'Draft a customer update for claim 4471-A.',
    ],
  },
  {
    key: 'retail',
    label: 'Retail',
    tagline: 'Inventory, returns, loyalty, demand forecast.',
    prompts: [
      'Which SKUs are projected to stock-out in the next 14 days?',
      'Summarise return reasons for SKU 88-1031 last quarter.',
      'Suggest a promotion for slow-moving winter inventory.',
    ],
  },
  {
    key: 'telecom',
    label: 'Telecom',
    tagline: 'Network health, churn risk, NPS, ticket clustering.',
    prompts: [
      'Cluster open tickets for the South-West region.',
      'Which customers show high churn risk this month?',
      'Summarise the impact of yesterday\'s tower outage.',
    ],
  },
  {
    key: 'healthcare',
    label: 'Healthcare',
    tagline: 'Patient records, care plans, eligibility, summaries.',
    prompts: [
      'Summarise the latest care plan for patient P-90234.',
      'List medications with drug-drug interactions for patient P-90234.',
      'Check eligibility for follow-up imaging next Tuesday.',
    ],
  },
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    tagline: 'OEE, downtime, supplier risk, predictive maintenance.',
    prompts: [
      'Show OEE trend for line 3 last 7 days.',
      'Which suppliers missed their SLA in October?',
      'Predict next maintenance window for press #12.',
    ],
  },
];

export function industryByKey(k: IndustryKey | undefined): IndustryTemplate | undefined {
  if (!k) return undefined;
  return industryTemplates.find((t) => t.key === k);
}

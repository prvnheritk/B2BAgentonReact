import type { SendMessageResponse } from '@/types/agentforce';

const recipes: Array<{ match: RegExp; build: () => string }> = [
  {
    match: /(case|ticket).*(lauren|customer|account)/i,
    build: () => `Here are the open cases linked to **Lauren Bailey**:

| Case # | Subject | Priority | Status | Updated |
|---|---|---|---|---|
| 00102345 | Wire transfer reversal | High | In Progress | 2h ago |
| 00102301 | Loan eligibility query | Medium | Pending Review | 1d ago |
| 00102189 | Statement discrepancy | Low | Awaiting Customer | 3d ago |

\`\`\`kpi
[
  {"label":"Open Cases","value":3,"delta":"+1","trend":"up"},
  {"label":"Avg Resolution","value":"2.4d","delta":"-0.6d","trend":"down"},
  {"label":"CSAT","value":"4.6","delta":"+0.1","trend":"up"}
]
\`\`\`

\`\`\`actions
[
  {"label":"Open in Salesforce","intent":"link","href":"#"},
  {"label":"Summarise all 3","intent":"prompt","prompt":"Summarise the three open cases for Lauren Bailey"},
  {"label":"Draft customer reply","intent":"prompt","prompt":"Draft a polite customer update for case 00102345"}
]
\`\`\`

> _Sources_: \`Case\` object · \`Account\` object · last 30 days.`,
  },
  {
    match: /pipeline|forecast|revenue|q[1-4]/i,
    build: () => `## Q4 pipeline at a glance

\`\`\`kpi
[
  {"label":"Pipeline","value":"$48.2M","delta":"+12%","trend":"up"},
  {"label":"Weighted","value":"$21.7M","delta":"+8%","trend":"up"},
  {"label":"Avg Deal","value":"$184K","delta":"+4%","trend":"up"},
  {"label":"Slip Risk","value":"$3.1M","delta":"-2%","trend":"down"}
]
\`\`\`

\`\`\`chart
{"type":"bar","data":[
  {"label":"Prospect","value":12.4},
  {"label":"Qualify","value":18.6},
  {"label":"Propose","value":9.8},
  {"label":"Negotiate","value":5.1},
  {"label":"Closed Won","value":2.3}
]}
\`\`\`

**Recommendation** — three opportunities ≥ $1M are stuck in *Propose* for 18+ days. Want me to draft outreach for the deal owners?`,
  },
  {
    match: /(claim|policy).*insur/i,
    build: () => `### Claim 4471-A — fast-track review

\`\`\`timeline
[
  {"ts":"09:12","label":"Claim filed","detail":"Auto · collision"},
  {"ts":"09:38","label":"Photos received","detail":"4 images attached"},
  {"ts":"10:01","label":"AI severity score","detail":"Moderate — $4.2K est."},
  {"ts":"10:14","label":"Assigned to adjuster","detail":"Maya R. · auto-team"}
]
\`\`\`

**Recommended next step:** dispatch preferred-shop tow within SLA. _Confidence 87%._

\`\`\`citations
[
  {"title":"Policy 88-A clause 4.2","snippet":"Comprehensive coverage applies to collision under $25K."},
  {"title":"Auto-claims SOP v3","snippet":"Severity ≤ Moderate qualifies for fast-track."}
]
\`\`\``,
  },
  {
    match: /(onboarding|leave|policy|hr|employee)/i,
    build: () => `Hi — here's what I can do for you in HR:

- **Leave**: balance, apply, withdraw
- **Pay**: latest payslip, YTD totals
- **Policy**: travel, expense, code of conduct
- **Onboarding**: day-1 checklist for new joiners

\`\`\`actions
[
  {"label":"Show my leave balance","intent":"prompt","prompt":"Show my leave balance for this year"},
  {"label":"Apply for leave","intent":"prompt","prompt":"Help me apply for 3 days of casual leave next week"},
  {"label":"Latest payslip","intent":"prompt","prompt":"Show my most recent payslip summary"}
]
\`\`\``,
  },
];

export function mockResponseFor(prompt: string): SendMessageResponse {
  const recipe = recipes.find((r) => r.match.test(prompt));
  const text = recipe
    ? recipe.build()
    : `I'm in **mock mode** so I can describe what would happen.

For \`"${prompt.trim().slice(0, 80)}"\` the Agentforce session would normally:

1. Validate the prompt against grounded knowledge.
2. Call the relevant Apex / Flow / Data Cloud action.
3. Stream a grounded answer back with citations.

Try one of the suggested prompts on the left to see a richer rendered response.`;

  return {
    messages: [
      {
        type: 'Inform',
        message: text,
        citedReferences: [],
      },
    ],
  };
}

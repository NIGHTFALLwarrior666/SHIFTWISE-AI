# SHIFTWISE-AI
AI-powered eligibility change and fairness analysis platform

## Working prototype

SHIFTWISE compares fictional scholarship policies using a deterministic evidence-aware engine. “AI” is the project name; this version has no trained predictive model.

- PASS: valid current evidence satisfies a rule.
- FAIL: valid current evidence violates a rule.
- UNKNOWN: missing, invalid, stale, or unverified evidence.
- Any reliable FAIL establishes ineligibility. Otherwise UNKNOWN prevents a confirmed decision.
- Old and new policies are evaluated independently; uncertainty is never reported as a confirmed transition.

### Run
```sh
npm install
npm run dev
npm test
npm run build
```

### Demonstrate
Load the synthetic dataset, launch the interactive demo, and review Aditi Gowda. Correct her annual family income to 280000 and income verification date to today. Save to observe an actual old-eligible/new-ineligible transition and audit record. The relaxed policy preset demonstrates genuine eligibility gains.

Download a sample CSV in Data Integrity. Upload previews show accepted and quarantined rows before replacing the dataset. Duplicate identities are all quarantined; invalid field values remain visible as UNKNOWN evidence.

All data persists in local browser storage. Use synthetic records only. This prototype has no authentication, independent evidence verification, secure multiuser database, tamper-proof audit trail, or demographic fairness measurement. Freshness thresholds are configurable prototype assumptions.

See [HANDOFF.md](HANDOFF.md) for actual progress and deployment status, and [feedback/README.md](feedback/README.md) for the genuine-feedback workflow.

# SHIFTWISE AI handoff

Repository: https://github.com/NIGHTFALLwarrior666/SHIFTWISE-AI
Branch: main. Original README and MIT license preserved.
Vercel project: shiftwise-ai (`prj_WRVJfz6ly3RFApfTcAaiOqfJznRX`). Account scope: `team_ehaDOE8whead2q4m0D9QiMXS`.

## Working implementation
React/TypeScript/Vite application with 8 routes, deterministic PASS/FAIL/UNKNOWN rule engine, synthetic cohort (28 rows, 26 accepted and 2 duplicate rows quarantined), old/new policy editor and presets, field freshness settings, CSV import preview and quarantine inspection, applicant correction, review resolution guard, actual audit events, CSV/JSON exports, localStorage persistence, guided stale-income correction demo, feedback documentation and local real-feedback form.
Premium dark responsive interface implemented. No browser interaction QA has yet been performed.

## Verification
`npm test`: 38 tests passed (32 engine tests + 6 jsdom interaction tests).
`npm run build`: passed. Bundles split; no large chunk warning in final build.

## Deployment
Vercel production deployment READY: https://shiftwise-ai.vercel.app
Deployment ID: dpl_CoTbU2TD6Ms6EJpZQMHtdTGYJxvq
Deployed code checkpoint: 9b44cbc. Deployed directly from tested source files because GitHub publishing is blocked.
GitHub remote still contains the initial commit: terminal push had no credentials; GitHub app create-tree returned 403 Resource not accessible by integration.
Public alias verified with unauthenticated HTTP 200 at https://shiftwise-ai.vercel.app. Automatic approval review rejected changing `ssoProtection`; the setting was left unchanged. No setting change is needed for the working public alias.

## Remaining
1. Restore GitHub write authorization, then push the existing local commits to main. Do not overwrite or rebuild.
2. Address any observed UI issues; browser testing depends on available supported controls.
3. Verify the final visual/mobile experience in a real browser; no public-access setting changes are currently needed.
4. Collect genuine user feedback; implement and commit an actual feedback-driven improvement and screenshots.
Challenge Card 2 is **not complete**. No feedback or screenshots have been fabricated.

## Run
`npm install`
`npm run dev`
`npm test`
`npm run build`

Last tested application commit: 9b44cbc. Documentation-only updates may follow.

## Verification limits
Interaction tests use jsdom, including mocked native dialog and resize APIs. No real-browser visual/mobile inspection was available in this environment. CSS has responsive breakpoints but visual correctness is not independently verified.

## Continue from downloadable source
The source archive includes a Git bundle preserving local commits. In an empty folder use `git clone shiftwise-checkpoints.bundle SHIFTWISE-AI`, then set origin to the intended GitHub repository. Alternatively copy the source files into the existing checkout, preserving its `.git`, README and license, inspect changes, commit and push.
Do not create a second GitHub repository or Vercel project. The intended Vercel project already exists.

## Urgent cinematic stabilization checkpoint
User reduced scope because only 20% weekly usage remained. Preserve the stable app; no new product features.

Completed visual changes:
- Existing dashboard hero now displays dimensional layered policy sheets using the actual saved policy values.
- Gentle pointer-responsive CSS perspective and reversible scroll-linked depth; no scroll hijacking.
- Refined graphite surfaces, pointer-follow card highlights, metric entrances, chart/table presentation, navigation and dialog/toast styling.
- Responsive simplification and prefers-reduced-motion support.
- All eight routes and existing engine/CSV/review/persistence/feedback functionality preserved.
- Original app recoverable at `snapshot/pre-cinematic-ee59436` and included in the complete Git bundle.

Validation: 38 tests passed; production build passed after visual changes.
No real-browser desktop/mobile visual inspection was available. Automated workflows use jsdom.

Unfinished / intentionally deferred per urgent scope:
- Dedicated /experience route and full five-scene pinned cinematic story.
- Flagship WebGL / React Three Fiber scene; current dimensional artifact uses lightweight CSS perspective.
- Advanced camera choreography, particle system and scene-to-scene mask transitions.
- Genuine-feedback challenge still requires authentic tester evidence and a resulting code improvement.

The five supplied reference videos were inspected via sampled frame contact sheets; their imagery was not copied into the application.
New heavy animation dependencies were removed from the deliverable; the current dependency manifest matches the original working app.
Visual checkpoint 39312f9 deployed to the EXISTING Vercel project. Production status READY.
URL: https://shiftwise-ai.vercel.app
Deployment ID: dpl_3aAT8HSCNiV4ZG4RQVtBvkM13pio
Prior production deployment remains recoverable: dpl_CoTbU2TD6Ms6EJpZQMHtdTGYJxvq.

GitHub upload: extract the source ZIP into the existing SHIFTWISE-AI checkout, preserve its .git directory, inspect with git status, then git add ., git commit -m "Apply stable cinematic visual upgrade", and git push origin main using your own authorized GitHub sign-in. Do not create another repository or Vercel project.
The bundled Git history also contains snapshot/pre-cinematic-ee59436 for rollback.

## Current 3D upgrade — supersedes earlier visual limitations
Implemented a full-viewport homepage with large masked typography entrances, lazy React Three Fiber/Drei/Three.js data core, pointer-responsive rotation, illuminated layered geometry and orbit nodes. Scroll progress drives core depth and a sticky policy story with moving previous/updated policy cards and a masked heading reveal. Values use saved policies and computed transitions. Includes a bright data-quality scene and the preserved live dashboard. Applicants has a redesigned header, computed summary cards, filters, table/status styling and a right-side record drawer.
Reduced-motion and WebGL fallback paths implemented; mobile unpins the long story. No engine or CSV/review/audit behavior was replaced.
Validation: npm test — 38 tests passed. npm run build — passed. Lazy 3D bundle produces a nonblocking size warning (approximately 948 KB, 256 KB gzip).
Deployment and live-browser verification pending for this checkpoint. GitHub write access remains blocked as documented above.
Unfinished: advanced five-scene camera choreography and optional particle/mask effects; real feedback evidence and feedback-driven improvement. No fabricated feedback.

## Verified production release
Application commit: bdf459e. Existing project shiftwise-ai deployed successfully: dpl_BVc8UVQqGkVzShXu2XvRxBw1vqry (READY). Public URL: https://shiftwise-ai.vercel.app
Live desktop browser inspection confirmed the new full-viewport hero, scrolling policy scene, redesigned Applicants page, working applicant search and record drawer. Browser has no usable WebGL context and displayed the explicit fallback. Real R3F rendering/pointer behavior cannot be claimed visually verified in this environment. Test on a WebGL-capable device before calling the 3D experience fully verified. Mobile visual inspection remains pending.
No new app runtime error appeared during inspection; an unrelated browser-extension metadata error was present.
The complete source ZIP contains source, lockfile, production dist, this handoff and a Git bundle with local history. GitHub publishing is still blocked by missing write authorization; deployment used the tested files directly.

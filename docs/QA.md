# ScriptNet 1.1.0 QA and security notes

Verified locally on Apple Silicon macOS, 7 October 2026:

- TypeScript checks and production build pass.
- Four unit tests cover input validation, the public world-tile check, HTTP-200
  watermark detection, 403 website restrictions, quota errors, network errors,
  and preventing keys from appearing in returned errors.
- Three Electron UI tests pass in a temporary profile with synthetic cases,
  keys, and tile responses. They cover missing/malformed/rejected/restricted keys,
  persistence across restart, reset, key changes while a map is open, three repeated
  map toggles, node/edge preservation in saves and CSV export, and the restricted
  preload bridge and blocked external navigation.
- A separate production build with a synthetic included key passes the included
  key -> personal override -> included key reset flow. The build script restores
  the personal-key-only build afterward.
- Registry versions verified: Electron 44.6.0, electron-builder 26.15.3,
  Vite 7.3.7, React plugin 5.2.0, Axios 1.20.0, Lodash 4.18.1,
  PapaParse 5.7.0, UUID 11.1.1, Leaflet 1.9.4, TypeScript 5.9.3.
- Final registry audit reports zero critical, high, low, or informational paths.
  The only remaining advisory is moderate
  [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c),
  sprintf-js precision-specifier denial of service, in two electron-builder
  dependency paths via @electron/get -> global-agent -> roarr. No patched release
  is published. This is an installer build-tool dependency, excluded from the
  shipped application's dependency graph. The audit counts two paths for one
  advisory. This does not establish absence of other security problems.

## Release limitations

The current installers are personal-key-only. No real maintainer key was read,
embedded, validated or uploaded during these checks. Their tile-service success
responses were mocked; live licensed-key acceptance, real street-map appearance,
account quota, and restrictions still require the maintainer's credential step.

Distribution signing/notarization credentials are not configured. Exact artifact
architecture, signing observations, native packaged-app results, installer payload
checks, and downloaded-asset hash verification are recorded below after builds.
Windows SmartScreen and macOS Gatekeeper installation approval are not bypassed.

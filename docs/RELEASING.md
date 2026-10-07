# ScriptNet 1.1.0 release preparation

Use Node 24 and Yarn 1.22.22. Run `yarn install --frozen-lockfile`, `yarn test`,
`yarn build`, `yarn test:e2e`, and `yarn test:included-key`. The desktop tests use synthetic cases and keys,
mocked provider responses, and a separate temporary profile. They do not access
an existing user profile or private case files.

## Personal keys and included keys

Map settings accepts a personal CARTO basemap key. It is checked against a public
world tile, saved on the device, and takes priority over the release's included
key. Reset returns to the included key. Keys are outside the Redux state and are
excluded from case saves and CSV exports. A key in the app is observable in its
tile requests and packaged JavaScript; it is not a confidential server secret.

Current draft installers are **personal-key-only**. Their filenames and build
metadata say so. They do not restore maps until a user enters a valid key.
The included-key feature is implemented but its credential handoff is pending.

A maintainer must enter the actual included key themselves. Do not paste it into
chat, source code, command-line arguments, screenshots, issue/PR text, or logs.
To configure without building, run `python3 scripts/configure-carto-key.py`.
Its hidden prompt writes `.carto-key.local`, which is ignored by Git and has
owner-only permissions. Ordinary tests/builds do not read that file. An assistant
must not open it. The maintainer can add `--use-local-key` to the following
explicit local build command to consume it themselves.

For a local build, run `python3 scripts/build-with-carto-key.py --platform mac
--arch arm64` (or `mac --arch x64`, or `win --arch x64` on Windows). This prompts
with hidden input, passes the key in the child build environment, and creates no
key file. It does not upload or publish anything.

For all three native CI builds, a maintainer can run `gh secret set
CARTO_BASEMAPS_KEY --repo scriptnet-project/scriptnet` and enter the key at its
hidden prompt themselves. Then explicitly dispatch the `Build desktop
installers` workflow on the reviewed branch with `bundle_key=true`. That action
transmits the credential to GitHub and includes it in downloadable build
artifacts. Ordinary branch builds do not access that secret. No workflow
publishes a release. The maintainer reviews the outputs and manually uploads them
to the draft before publishing. Do not allow an assistant to retrieve the key or
dispatch credential-bearing builds during the pending handoff.

## Provider terms

[CARTO's basemap FAQ](https://docs.carto.com/faqs/carto-basemaps) explains the
missing-key raster watermark and website restriction behavior. Native `file://`
apps lack a website Referer, so a website-restricted key may return 403. CARTO
[key registration](https://carto.com/basemaps/apikey/) and
[basemap terms](https://carto.com/legal/basemap-terms/) govern the maintainer's
allowance and distribution. The free noncommercial allowance is shared by users
of an included key; each user's personal key has its own allowance. Retain the
visible CARTO and OpenStreetMap attribution. Register and approve the appropriate
usage category before distributing an included key. Do not replace the service
with an unapproved public tile endpoint or bypass the provider watermark.

## Native installers and verification

The workflow builds Windows x64 NSIS, macOS Intel x64 DMG, and macOS Apple Silicon
arm64 DMG on matching native runners. Electron 44 requires Windows 10+ or macOS
13+. `scripts/write-release-metadata.mjs` verifies the packaged application's
PE/Mach-O architecture before the upload. Artifact names include architecture.

Build with `yarn package:win:x64`, `yarn package:mac:x64`, or
`yarn package:mac:arm64`. Distribution signing and notarization credentials are
not configured. Mac builds carry a verified ad-hoc app signature, but that
does not mean ScriptNet is Developer ID signed or notarized. Document the actual
signing state and OS warnings before distribution. Do not change Gatekeeper,
SmartScreen, or other system security settings to bypass them.

Create/update a **draft** GitHub release only, attach all three installers,
their build-info files, a SHA256SUMS manifest, and QA/security notes. Download
the uploaded assets and compare hashes. Confirm `draft=true` afterward. A
maintainer reviews the credential, license/allowance, platform QA, and signing
before publishing.

## Dependency patch

`cytoscape-leaf` remains pinned to upstream commit
`b79715dfaf4669874420fb2ee8ba955a47d2e89d`. Its published entry point hardcodes
an unkeyed CARTO URL. `scripts/apply-map-layer-patch.mjs` applies one idempotent
change to the source and compiled entry point so ScriptNet can pass `tileUrl`
before map construction. It fails if upstream code drifts. No package fork is
required for this release. The lockfile changed for the immutable pin and the
security upgrades. Installer rebuilds are required because packaged desktop
applications load their own renderer bundle.

## Security validation

Electron 44.6.0 is the current stable major line as of 7 October 2026; see
[official releases](https://releases.electronjs.org/) and the
[support policy](https://www.electronjs.org/docs/latest/tutorial/electron-timelines).
The update includes electron-builder 26.15.3, Vite 7.3.7, and refreshed vulnerable
dependencies. Re-run `yarn audit --json` before final publication. Audits cover
known registry advisories and do not establish absence of all vulnerabilities.

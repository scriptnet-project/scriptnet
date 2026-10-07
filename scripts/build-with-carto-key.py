#!/usr/bin/env python3
"""Maintainer-run only: enter a key locally without command-line or file storage."""
import argparse
import getpass
import os
import re
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--platform', choices=['mac', 'win'], required=True)
parser.add_argument('--arch', choices=['x64', 'arm64'], required=True)
parser.add_argument('--use-local-key', action='store_true', help='Read maintainer-entered ignored local configuration instead of prompting.')
args = parser.parse_args()
if args.platform == 'win' and args.arch != 'x64': parser.error('Windows installer targets x64.')
root = Path(__file__).resolve().parent.parent
if args.use_local_key:
    key = (root / '.carto-key.local').read_text().strip()
else:
    key = getpass.getpass('CARTO basemap key (hidden; distributed app will contain it): ').strip()
if not re.fullmatch(r'[A-Za-z0-9._~-]{16,2048}', key): raise SystemExit('Invalid key format.')
env = os.environ.copy()
env['VITE_CARTO_BASEMAPS_KEY'] = key
env['SCRIPTNET_REQUIRE_BUNDLED_KEY'] = '1'
env['CSC_IDENTITY_AUTO_DISCOVERY'] = 'false'
for command in [['yarn', 'build'], ['yarn', f'package:{args.platform}:{args.arch}'],
                ['node', 'scripts/write-release-metadata.mjs', args.platform, args.arch]]:
    subprocess.run(command, cwd=root, env=env, check=True)
print('Built locally. Review the application and signing before manually uploading or publishing.')

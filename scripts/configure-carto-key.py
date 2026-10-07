#!/usr/bin/env python3
"""Maintainer-run only: save a CARTO key locally with hidden input."""
import getpass
import os
import re
from pathlib import Path

key = getpass.getpass('CARTO basemap key (hidden input): ').strip()
if not re.fullmatch(r'[A-Za-z0-9._~-]{16,2048}', key): raise SystemExit('Invalid key format.')
path = Path(__file__).resolve().parent.parent / '.carto-key.local'
flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC
if hasattr(os, 'O_NOFOLLOW'): flags |= os.O_NOFOLLOW
fd = os.open(path, flags, 0o600)
os.fchmod(fd, 0o600)
with os.fdopen(fd, 'w') as output: output.write(key + '\n')
print('Key saved in ignored local configuration with owner-only permissions. Nothing was built, uploaded or published.')

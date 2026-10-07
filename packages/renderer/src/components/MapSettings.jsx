import { useEffect, useState } from 'react';
import { Dialog, DialogFooter, DialogType, TextField, PrimaryButton, DefaultButton,
  MessageBar, MessageBarType, Link, Spinner } from '@fluentui/react';
import { useSelector } from 'react-redux';
import { useMapSettings } from '../hooks/MapSettings';
import { isValidMapKey } from '../../../shared/mapKey.mjs';
import { getShowMap } from '../store/selectors/visualisation';

export function MapStatus() {
  const showMap = useSelector(getShowMap);
  const { mapKey, error, setSettingsOpen } = useMapSettings();
  if (!showMap || (mapKey && !error)) return null;
  return <MessageBar messageBarType={MessageBarType.warning}>
    {error || 'Add a CARTO basemap key to display the map.'}{' '}
    <Link onClick={() => setSettingsOpen(true)}>Open map settings</Link>
  </MessageBar>;
}

export default function MapSettings() {
  const { settingsOpen, setSettingsOpen, personalKey, hasIncludedKey, savePersonalKey, resetKey } = useMapSettings();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (settingsOpen) { setDraft(personalKey); setError(''); }
  }, [settingsOpen]);
  const close = () => { if (!busy) { setDraft(''); setSettingsOpen(false); } };
  const save = async () => {
    setError('');
    if (!isValidMapKey(draft)) { setError('Enter a CARTO basemap API key without spaces.'); return; }
    setBusy(true);
    try {
      const result = await window.api.validateMapKey(draft);
      if (!result.ok) { setError(result.message); return; }
      savePersonalKey(draft);
      setDraft('');
      setSettingsOpen(false);
    } catch { setError('Could not save the key on this device. Try again.'); }
    finally { setBusy(false); }
  };
  const reset = () => {
    try { resetKey(); setDraft(''); setSettingsOpen(false); }
    catch { setError('Could not remove the saved key on this device. Try again.'); }
  };
  return <Dialog hidden={!settingsOpen} onDismiss={close}
    dialogContentProps={{ type: DialogType.normal, title: 'Map settings', closeButtonAriaLabel: 'Close map settings' }}
    modalProps={{ isBlocking: busy }} minWidth={440} maxWidth={540}>
    <p>{personalKey ? 'Using your personal CARTO key.' : hasIncludedKey ? 'Using the key included with ScriptNet.' : 'This build has no included CARTO key.'}</p>
    <p>Your personal key is saved on this device and takes priority over the included key. It is never saved in case files or exports.</p>
    <TextField label="Personal CARTO basemap API key" type="password" value={draft}
      autoComplete="off" disabled={busy} onChange={(_, value) => setDraft(value || '')}
      description="Desktop apps need a key without website restrictions." />
    <p><Link href="https://carto.com/basemaps/apikey/" target="_blank" rel="noopener noreferrer">Get a CARTO basemap key</Link>. CARTO usage limits and terms apply to each key.</p>
    {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
    {busy && <Spinner label="Checking the key with CARTO…" />}
    <DialogFooter>
      <PrimaryButton text="Save personal key" onClick={save} disabled={busy} />
      <DefaultButton text={hasIncludedKey ? 'Use included key' : 'Remove personal key'} onClick={reset} disabled={busy || !personalKey} />
      <DefaultButton text="Cancel" onClick={close} disabled={busy} />
    </DialogFooter>
  </Dialog>;
}

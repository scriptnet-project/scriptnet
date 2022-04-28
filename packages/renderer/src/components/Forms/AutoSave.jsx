import { useState, useCallback, useEffect } from 'react';
import { useFormikContext } from "formik";
import { debounce } from 'lodash';

const AutoSave = ({ debounceMs }) => {
  const formik = useFormikContext();
  const [lastSaved, setLastSaved] = useState(null);
  const debouncedSubmit = useCallback(
    debounce(
      () =>
        formik.submitForm().then(() => setLastSaved(new Date().toISOString())),
      debounceMs
    ),
    [debounceMs, formik.submitForm]
  );

  useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, formik.values]);

  return (
    <>
      {!!formik.isSubmitting
        ? 'saving...'
        : lastSaved !== null
        ? `Last Saved: ${lastSaved}`
        : null}
    </>
  );
};

export default AutoSave;

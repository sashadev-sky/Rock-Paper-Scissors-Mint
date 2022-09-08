import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

import { CONGRATULATIONS } from '../../constants/index';

export enum Severity {
  ERROR = 'error',
  SUCCESS = 'success',
}

interface Props {
  /**
   * Callback function to run after the snackbar closes
   * */
  closeSnackbar: () => void;
  /**
   * Error returned by transaction
   * */
  error?: any | undefined | null;
  /**
   * Loading state of transaction
   * */
  loading?: boolean;
  /**
   * Sets the Alert severity
   * */
  severity?: Severity;
  /**
   * Message to display on success
   * */
  successMessage?: string;
}

const Notify = ({
  closeSnackbar,
  error = null,
  loading = false,
  severity = Severity.SUCCESS,
  successMessage = CONGRATULATIONS,
}: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setOpen(true);
    }
  }, [loading]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackbar();
    setOpen(false);
  };

  return !loading ? (
    <>
      <Snackbar
        {...(!error && { autoHideDuration: 6000 })}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={open}
        onClose={handleClose}
        sx={{
          px: 3,
          width: '100vw',
          top: {
            xsmobile: 58,
            mobile: 74,
            tablet: 66,
          },
        }}
      >
        <Alert
          elevation={6}
          onClose={handleClose}
          severity={severity}
          variant='filled'
          sx={{ filter: 'saturate(1.5)', maxWidth: '100vw' }}
        >
          {error || successMessage}
          {!error && (
            <span role='img' aria-label='celebration emoji'>
              🎉
            </span>
          )}
        </Alert>
      </Snackbar>
    </>
  ) : (
    <></>
  );
};

export default Notify;

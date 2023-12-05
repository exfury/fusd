import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import { ActionButton } from './ActionButton';
import { useTheme } from 'styled-components';

type FormReturn = boolean;

export interface AlertParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
}

export function useAlert(): [OpenDialog<AlertParams, boolean>, ReactNode] {
  return useDialog(Component);
}

export function Component({
  closeDialog,
  title,
  description,
  agree = 'Agree',
}: DialogProps<AlertParams, FormReturn>) {
  const theme = useTheme();

  return (
    <Dialog
      open
      PaperProps={{
        style: {
          backgroundColor: theme.sectionBackgroundColor,
          padding: 10,
        },
      }}
      onClose={() => closeDialog(true)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 100 }}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <ActionButton
          style={{ width: '100%' }}
          onClick={() => closeDialog(true)}
        >
          {agree}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}

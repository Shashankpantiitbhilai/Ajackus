// DeleteDialog.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'; // Importing the necessary components from @mui/material

const DeleteDialog = ({ open, onClose, handleDeleteConfirmed }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirmed}
          color="error"
          variant="contained"
          sx={{ borderRadius: 2 }}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;

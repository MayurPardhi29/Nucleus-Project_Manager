import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
const EntityModal: React.FC<any> = ({ open, title, fields, values, onChange, onSave, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent><Stack spacing={2} sx={{mt:1}}>{fields.map((f:any)=>(<TextField key={f.key} label={f.label} type={f.type||'text'} value={values[f.key]||''} onChange={(e)=>onChange(f.key,e.target.value)} fullWidth />))}</Stack></DialogContent>
    <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={onSave}>Save</Button></DialogActions>
  </Dialog>
);
export default EntityModal;

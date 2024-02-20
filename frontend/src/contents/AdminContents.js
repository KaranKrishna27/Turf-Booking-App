import React from 'react';
import { Button } from '@mui/material';

function AdminContent() {
  return (
    <>
      <Button size="small" href={`/viewturf`}>
        Edit
      </Button>
      <Button size="small" href={`/viewturf`}>
        Delete
      </Button>
    </>
  );
}

export default AdminContent;

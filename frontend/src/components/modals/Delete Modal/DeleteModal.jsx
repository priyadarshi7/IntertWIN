// src/components/modals/DeleteModal.js
import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

export const DeleteModal = ({ open, onClose, onDelete, eventTitle }) => {
  return (
    <Modal open={open} onClose={onClose} center styles={{ background: "transparent", zIndex: 1 }}>
      <h2>Are you sure you want to delete "{eventTitle}"?</h2>
      <button onClick={onDelete}>Yes, delete</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

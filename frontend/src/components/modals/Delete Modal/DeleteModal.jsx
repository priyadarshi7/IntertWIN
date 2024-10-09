// src/components/modals/DeleteModal.js
import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import"./DeleteModal.css"

export const DeleteModal = ({ open, onClose, onDelete, eventTitle }) => {
  return (
    <Modal open={open} onClose={onClose} center classNames={{
        overlay: 'customOverlay',
        modal: 'customModal',
      }}>
      <h2>Are you sure you want to delete"{eventTitle}"?</h2>
      <div className="buttons">
      <button onClick={onDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

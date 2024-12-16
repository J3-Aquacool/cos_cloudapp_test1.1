import React from 'react';
import './modal.css';

const Modal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal">
      <p>{message}</p>
      <div className="modal-buttons">
        <button className="ok" onClick={onConfirm}>OK</button>
        <button className ="cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

export default Modal;

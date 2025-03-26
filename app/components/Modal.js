'use client';
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 bg-surface rounded-lg shadow-xl max-w-[90vw] sm:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
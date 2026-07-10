"use client";

import React, { useEffect } from "react";

/**
 * Modal Component
 * A reusable modal dialog component with backdrop and focus management
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {React.ReactNode} props.children - Modal content
 */
const Modal = ({ isOpen, onClose, children }) => {
    // Handle escape key press to close modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent background scrolling when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title">
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div
                className="relative z-50 bg-surface rounded-lg shadow-xl max-w-[90vw] sm:max-w-[50vw] max-h-[90vh] overflow-y-auto"
                role="document">
                {children}
            </div>
        </div>
    );
};

export default Modal;

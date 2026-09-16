"use client";

import React from "react";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="alertModalBackdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        id="alertModalCard"
        className="w-full max-w-sm bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xl space-y-3 transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
          <h3 id="alertModalTitle" className="font-display font-bold text-sm text-neutral-900">
            {title}
          </h3>
        </div>
        <p id="alertModalBody" className="text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-brand-red text-white text-xs font-mono font-bold rounded-lg transition"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

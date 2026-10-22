import React, { useEffect } from 'react';

const h = React.createElement;

export default function ConfirmDialog({ title, text, confirmLabel, cancelLabel = 'Stay', onConfirm, onCancel }) {
  // Escape closes the popup, same as pressing the cancel button
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);

  return h('div', { className: 'modal', role: 'dialog', 'aria-label': title, onClick: e => { if (e.target === e.currentTarget) onCancel(); } },
    h('div', { className: 'card' },
      h('div', { className: 'hd2' }, title),
      h('div', { className: 'sub' }, text),
      h('div', { className: 'btns' },
        h('button', { className: 'b', onClick: onCancel }, cancelLabel),
        h('button', { className: 'b pri', onClick: onConfirm, autoFocus: true }, confirmLabel))));
}
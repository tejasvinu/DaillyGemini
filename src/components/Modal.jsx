import { createPortal } from 'react-dom';

function Modal({ children, onClose }) {
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-auto">
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

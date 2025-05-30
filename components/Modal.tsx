import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-gray-800 rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} text-gray-100 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-teal-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
      {/* The <style jsx global> block was removed from here to fix TypeScript error. 
          Animation classes like 'animate-modalShow' would need their keyframes 
          defined in a global CSS file or Tailwind configuration. */}
    </div>
  );
};
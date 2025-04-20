import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-96">{children}</div>
    </div>
  );
}

interface ModalHeaderProps {
  children: React.ReactNode;
}

export function ModalHeader({ children }: ModalHeaderProps) {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
}

interface ModalBodyProps {
  children: React.ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
  return <div className="mb-4">{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return <div className="flex justify-end">{children}</div>;
}
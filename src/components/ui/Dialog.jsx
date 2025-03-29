import React, { useState } from 'react'
import { cn } from '../../lib/utils'

// Componente de Diálogo
function Dialog({ open, onOpenChange, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative z-50 w-full max-w-lg">
            {children}
          </div>
        </div>
      )}
    </>
  )
}

// Conteúdo do Diálogo
function DialogContent({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        "relative bg-white rounded-lg shadow-xl p-6 mx-4",
        "animate-in fade-in-90 slide-in-from-bottom-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Cabeçalho do Diálogo
function DialogHeader({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left mb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Título do Diálogo
function DialogTitle({ children, className, ...props }) {
  return (
    <h2 
      className={cn(
        "text-xl font-semibold text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

// Descrição do Diálogo
function DialogDescription({ children, className, ...props }) {
  return (
    <p 
      className={cn(
        "text-sm text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

// Botão de Fechar
function DialogClose({ onClose, children }) {
  return (
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
    >
      {children || '×'}
    </button>
  )
}

export { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle, 
  DialogDescription, 
  DialogClose 
}
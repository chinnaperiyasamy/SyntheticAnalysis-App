import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

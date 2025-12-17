import React, { useRef } from 'react';
import { ICONS } from '../constants';
import { Button } from './ui/Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onFileSelect(file);
      } else {
        alert("Please upload a CSV file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-600 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={inputRef}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-700 rounded-full group-hover:bg-blue-900/50 transition-colors">
          <ICONS.HardDrive className="w-8 h-8 text-slate-300 group-hover:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-slate-100 mb-1">Upload Metrics CSV</h3>
          <p className="text-slate-400 text-sm">Drag and drop or click to browse</p>
        </div>
        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          Select File
        </Button>
        <p className="text-xs text-slate-500 mt-2">Expected format: timestamp, metric1, metric2...</p>
      </div>
    </div>
  );
};

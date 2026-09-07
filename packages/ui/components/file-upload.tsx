'use client';

import { useId, useState, type ChangeEvent } from 'react';

export interface FileUploadProps { label: string; hint?: string; accept?: string; maxSizeMB?: number; onFileSelected?: (file: File | null) => void; }

export function FileUpload({ label, hint, accept, maxSizeMB = 10, onFileSelected }: FileUploadProps) {
  const inputId = useId();
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setFileName(null);
      setError(null);
      onFileSelected?.(null);
      return;
    }
    const acceptedTypes = accept?.split(',').map(type => type.trim()).filter(Boolean) ?? [];
    const matchesAcceptedType = acceptedTypes.length === 0 || acceptedTypes.some(type => {
      if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
      if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type.toLowerCase());
      return file.type === type;
    });
    if (!matchesAcceptedType) {
      setError('This file type is not supported.');
      setFileName(null);
      event.target.value = '';
      onFileSelected?.(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      setFileName(null);
      event.target.value = '';
      onFileSelected?.(null);
      return;
    }
    setError(null);
    setFileName(file.name);
    onFileSelected?.(file);
  };
  return (
    <label className={`file-upload ${error ? 'file-upload-invalid' : ''}`.trim()} htmlFor={inputId}>
      <input className="file-upload-input" id={inputId} type="file" accept={accept} onChange={handleChange} />
      <span className="file-upload-icon" aria-hidden="true">⬆</span>
      <span className="file-upload-text">{fileName ?? label}</span>
      {error && <span className="file-upload-error">{error}</span>}
      {!error && hint && !fileName && <span className="file-upload-hint">{hint}</span>}
      {!error && fileName && <span className="file-upload-hint">Selected - click to replace</span>}
    </label>
  );
}
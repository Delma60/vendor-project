'use client';

import { useId, useState, type ChangeEvent } from 'react';

export interface FileUploadProps { label: string; hint?: string; accept?: string; onFileSelected?: (file: File | null) => void; }

export function FileUpload({ label, hint, accept, onFileSelected }: FileUploadProps) {
  const inputId = useId();
  const [fileName, setFileName] = useState<string | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFileName(file?.name ?? null);
    onFileSelected?.(file);
  };
  return (
    <label className="file-upload" htmlFor={inputId}>
      <input className="file-upload-input" id={inputId} type="file" accept={accept} onChange={handleChange} />
      <span className="file-upload-icon" aria-hidden="true">⬆</span>
      <span className="file-upload-text">{fileName ?? label}</span>
      {hint && !fileName && <span className="file-upload-hint">{hint}</span>}
      {fileName && <span className="file-upload-hint">Selected - click to replace</span>}
    </label>
  );
}
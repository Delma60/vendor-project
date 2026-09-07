'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from './button';

export interface ImageCropperProps {
  file: File;
  aspectRatio?: number;
  outputWidth?: number;
  onCancel: () => void;
  onCropped: (file: File) => void;
}

const VIEWPORT_WIDTH = 320;

export function ImageCropper({ file, aspectRatio = 4 / 3, outputWidth = 800, onCancel, onCropped }: ImageCropperProps) {
  const viewportHeight = VIEWPORT_WIDTH / aspectRatio;
  const [imageUrl] = useState(() => URL.createObjectURL(file));
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const baseScale = naturalSize ? Math.max(VIEWPORT_WIDTH / naturalSize.width, viewportHeight / naturalSize.height) : 1;
  const scale = baseScale * zoom;
  const displayWidth = naturalSize ? naturalSize.width * scale : 0;
  const displayHeight = naturalSize ? naturalSize.height * scale : 0;

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  function clampPos(next: { x: number; y: number }) {
    const minX = Math.min(0, VIEWPORT_WIDTH - displayWidth);
    const minY = Math.min(0, viewportHeight - displayHeight);
    return { x: Math.min(0, Math.max(minX, next.x)), y: Math.min(0, Math.max(minY, next.y)) };
  }
  function handleImageLoad() {
    if (imgRef.current) setNaturalSize({ width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight });
    setPos({ x: 0, y: 0 });
  }
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, originX: pos.x, originY: pos.y };
  }
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    setPos(clampPos({ x: dragState.current.originX + event.clientX - dragState.current.startX, y: dragState.current.originY + event.clientY - dragState.current.startY }));
  }
  function handleZoomChange(nextZoom: number) { setZoom(nextZoom); setPos(current => clampPos(current)); }
  async function handleConfirm() {
    if (!naturalSize || !imgRef.current) return;
    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = Math.round(outputWidth / aspectRatio);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is not supported in this browser.');
      context.drawImage(imgRef.current, -pos.x / scale, -pos.y / scale, VIEWPORT_WIDTH / scale, viewportHeight / scale, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if (!blob) throw new Error('Could not process the image.');
      onCropped(new File([blob], `${file.name.replace(/\.[^.]+$/, '')}-cropped.jpg`, { type: 'image/jpeg' }));
    } finally { setProcessing(false); }
  }
  return (
    <div className="image-cropper">
      <div className="image-cropper-viewport" style={{ width: VIEWPORT_WIDTH, height: viewportHeight }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => { dragState.current = null; }} onPointerLeave={() => { dragState.current = null; }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={imageUrl} alt="Photo being cropped" onLoad={handleImageLoad} className="image-cropper-image" style={{ width: displayWidth, height: displayHeight, transform: `translate(${pos.x}px, ${pos.y}px)` }} draggable={false} />
      </div>
      <label className="image-cropper-zoom"><span>Zoom</span><input type="range" min={1} max={3} step={0.05} value={zoom} onChange={event => handleZoomChange(Number(event.target.value))} /></label>
      <div className="image-cropper-actions"><Button variant="ghost" type="button" onClick={onCancel} disabled={processing}>Cancel</Button><Button type="button" onClick={handleConfirm} disabled={processing || !naturalSize}>{processing ? 'Processing...' : 'Use this photo'}</Button></div>
    </div>
  );
}
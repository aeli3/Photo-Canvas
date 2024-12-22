import { useRef, useState, useCallback } from 'react';
import type { Point } from '../types';

interface UseCanvasProps {
  onStateChange?: () => void;
}

export function useCanvas({ onStateChange }: UseCanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasStates, setCanvasStates] = useState<string[]>([]);
  const lastPoint = useRef<Point | null>(null);

  /**
   * Converts mouse event coordinates to canvas coordinates accounting for scaling
   */
  const getCanvasPoint = useCallback((
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  /**
   * Saves the current canvas state to the history stack
   */
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newState = canvas.toDataURL();
    setCanvasStates(prevStates => [...prevStates, newState]);
    onStateChange?.();
  }, [onStateChange]);

  /**
   * Applies a canvas state from the history
   */
  const applyCanvasState = useCallback((stateImage: string) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
    img.src = stateImage;
  }, []);

  /**
   * Undoes the last drawing action
   */
  const undo = useCallback(() => {
    setCanvasStates(prevStates => {
      if (prevStates.length <= 1) return prevStates;
      
      // Remove the last state and apply the previous one
      const newStates = prevStates.slice(0, -1);
      const previousState = newStates[newStates.length - 1];
  
      // Apply the previous state
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return prevStates;
      
      // Reset composite operation before applying state
      context.globalCompositeOperation = 'source-over';
      applyCanvasState(previousState);

      applyCanvasState(previousState);
      return newStates;
    });
  }, [applyCanvasState]);

  /**
   * Clears the canvas and resets the history
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasStates([]);
  }, []);

  /**
   * Exports the canvas content as a PNG file
   */
  const exportImage = useCallback((filename = 'drawing.png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    canvasRef,
    isDrawing,
    setIsDrawing,
    lastPoint,
    saveState,
    clearCanvas,
    getCanvasPoint,
    exportImage,
    undo,
    canUndo: canvasStates.length > 0
  };
}
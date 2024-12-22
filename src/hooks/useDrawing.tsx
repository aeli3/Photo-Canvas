import { useState, useCallback } from 'react';
import type { DrawingMode, Point } from '../types';

export function useDrawing() {
  const [mode, setMode] = useState<DrawingMode>('draw');
  const [lineWidth, setLineWidth] = useState(2);
  const [lineColor, setLineColor] = useState('black');

  const getDrawingSettings = useCallback((context: CanvasRenderingContext2D) => {
    if (mode === 'erase') {
      // erase settings
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = lineWidth * 2; // Larger eraser
    } else {
      // drawing settings
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = lineColor;
      context.lineWidth = lineWidth;
    }
    context.lineCap = 'round'; // smoother appearance 
  }, [mode, lineColor, lineWidth]);

  const drawLine = useCallback((context: CanvasRenderingContext2D, from: Point, to: Point) => {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }, []);

  return {
    mode,
    setMode,
    lineWidth,
    setLineWidth,
    lineColor,
    setLineColor,
    getDrawingSettings,
    drawLine
  };
}
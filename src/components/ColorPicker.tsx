import React from 'react';
import { DrawingMode } from '../types';

interface ColorPickerProps {
  className: string | undefined
  currentColor: string;
  onColorChange: (color: string) => void;
  setMode: React.Dispatch<React.SetStateAction<DrawingMode>>;
}

const ColorPicker: React.FC<ColorPickerProps> = ({  className = '' ,currentColor, onColorChange, setMode }) => {
  const colors = [
    // First row - darker/basic colors
    '#000000', // Black
    '#FF0000', // Red
    '#008000', // Green
    '#0000FF', // Blue
    '#800080', // Purple
    '#FFA500', // Orange
    '#A52A2A', // Brown
    '#808080', // Gray
    // Second row - lighter/additional colors
    '#FFFFFF', // White
    '#FF69B4', // Hot Pink
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#98FB98', // Pale Green
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#CD853F', // Peru
  ];

  return (
    <div className={`p-2 bg-gray-100 rounded-lg shadow-sm min-w-fit ${className}`}>
      <div className="grid grid-cols-8 xl:grid-cols-2 gap-1 w-fit">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {onColorChange(color); setMode('draw');}}
            className={`
              w-8 h-8 
              rounded-lg
              border-2
              transition-transform
              hover:scale-110
              ${currentColor === color ? 'border-blue-500' : 'border-gray-200'}
            `}
            style={{
              backgroundColor: color,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
            }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
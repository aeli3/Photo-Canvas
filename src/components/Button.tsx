import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  label?: string;
}


const Button: React.FC<ButtonProps> = ({
  onClick,
  className = '',
  isActive = false,
  disabled = false,
  icon: Icon,
  label: Label = '',
}, props) => {
  
    const baseStyles = `
    inline-flex
    items-center
    justify-center
    transition-all
    duration-200
    rounded-lg
    focus:outline-none
    disabled:opacity-50
    disabled:cursor-not-allowed
    active:scale-95
  `;

  const activeStyles = isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${activeStyles} ${className}`}
      type="button"
      {...props}
    >
        <div className='flex flex-col items-center justify-center w-fit'>
            {Icon && <Icon className="w-5 h-5" />}
            {Label && <span>{ Label }</span>}
        </div>
    </button>
  );
};

export default Button;
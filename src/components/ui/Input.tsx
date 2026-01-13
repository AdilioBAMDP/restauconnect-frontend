import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      w-full px-4 py-3 border rounded-xl transition-all duration-200
      focus:ring-2 focus:ring-orange-500 focus:border-transparent
      ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'}
      ${icon ? 'pl-10' : ''}
      ${className}
    `;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-gray-400">
              {icon}
            </div>
          )}
          <motion.div whileFocus={{ scale: 1.01 }}>
            <input
              ref={ref}
              className={inputClasses}
              {...props}
            />
          </motion.div>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

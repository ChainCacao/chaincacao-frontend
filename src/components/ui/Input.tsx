import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full p-4 bg-gray-50 rounded-xl border-2 transition-all outline-none
            ${error ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3B1E08] focus:bg-white'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

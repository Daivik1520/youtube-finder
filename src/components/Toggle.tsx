import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-purple-600' : 'bg-gray-600'
        }`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          } mt-0.5`} />
        </div>
      </div>
      <span className="text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
};
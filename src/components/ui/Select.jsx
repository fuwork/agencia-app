// src/components/ui/Select.jsx
import React from 'react';

const Select = ({ 
  name, 
  label, 
  value, 
  onChange, 
  options, 
  disabled = false,
  required = false,
  className = '',
  style = {}
}) => {
  return (
    <div className={`select-container ${className}`} style={style}>
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="select-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
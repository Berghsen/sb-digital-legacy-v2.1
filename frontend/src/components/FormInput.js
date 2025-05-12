import React from 'react';

function FormInput({ type, placeholder, value, onChange }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
  );
}

export default FormInput;
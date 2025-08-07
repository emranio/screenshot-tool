import React from 'react';
import { Text } from '@mantine/core';

const FormField = ({ 
  label, 
  description, 
  error, 
  success, 
  required = false,
  children 
}) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-field__label">
          {label}
          {required && <span style={{ color: 'var(--error-color)' }}> *</span>}
        </label>
      )}
      
      {children}
      
      {description && (
        <Text className="form-field__description">
          {description}
        </Text>
      )}
      
      {error && (
        <Text className="form-field__error">
          {error}
        </Text>
      )}
      
      {success && (
        <Text className="form-field__success">
          {success}
        </Text>
      )}
    </div>
  );
};

export default FormField;

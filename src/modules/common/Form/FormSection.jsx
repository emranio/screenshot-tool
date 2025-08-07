import React from 'react';
import { Switch, Text } from '@mantine/core';

const FormSection = ({ 
  title, 
  description, 
  children, 
  toggle = null,
  onToggleChange = null,
  enabled = true
}) => {
  return (
    <section className="form-section">
      <div className="form-section__header">
        <div>
          <h3 className="form-section__title">{title}</h3>
          {description && (
            <Text className="form-section__description">
              {description}
            </Text>
          )}
        </div>
        
        {toggle !== null && (
          <div className="form-section__toggle">
            <Switch
              checked={toggle}
              onChange={(event) => onToggleChange && onToggleChange(event.currentTarget.checked)}
              size="md"
            />
          </div>
        )}
      </div>
      
      <div style={{ opacity: enabled ? 1 : 0.6 }}>
        {children}
      </div>
    </section>
  );
};

export default FormSection;

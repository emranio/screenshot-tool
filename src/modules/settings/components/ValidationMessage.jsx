import React from 'react';
import { Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

const ValidationMessage = ({ type, message, ...props }) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <IconAlertCircle size={16} />;
      case 'success':
        return <IconCheck size={16} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'warning':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <Alert
      icon={getIcon()}
      color={getColor()}
      {...props}
    >
      {message}
    </Alert>
  );
};

export default ValidationMessage;

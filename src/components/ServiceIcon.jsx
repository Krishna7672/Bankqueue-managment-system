import React from 'react';
import * as Icons from 'lucide-react';

export const ServiceIcon = ({ name, className = 'w-5 h-5', ...props }) => {
  const IconComponent = Icons[name] || Icons.CircleDot || Icons.HelpCircle;
  return <IconComponent className={className} {...props} />;
};

export default ServiceIcon;

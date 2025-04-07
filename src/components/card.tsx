import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-xl shadow-card mb-6';
  
  // Variant classes
  const variantClasses = {
    default: '',
    bordered: 'border border-gray-200',
    highlight: 'border-l-4 border-primary-500',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  
  // Combine classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Subcomponent
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

// Card Title Subcomponent
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h3 className={`text-lg font-medium ${className}`}>{children}</h3>
  );
};

// Card Content Subcomponent
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Card Footer Subcomponent
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
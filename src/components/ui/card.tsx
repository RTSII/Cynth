import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  isFullWidth?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      variant = 'default',
      padding = 'md',
      isInteractive = false,
      isFullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    // Tailwind classes for different variants
    const variantClasses = {
      default: 'bg-white border border-neutral-200',
      outlined: 'bg-transparent border border-neutral-300',
      elevated: 'bg-white border border-neutral-200 shadow-md',
    };

    // Tailwind classes for different padding sizes
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    // Base classes that apply to all cards
    const baseClasses = 'rounded-xl overflow-hidden';
    
    // Interactive hover and focus states
    const interactiveClasses = isInteractive
      ? 'hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-shadow duration-200 cursor-pointer'
      : '';
    
    // Width classes
    const widthClasses = isFullWidth ? 'w-full' : '';
    
    // Combine classes based on props
    const cardClasses = [
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      interactiveClasses,
      widthClasses,
      className,
    ].join(' ');

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
        tabIndex={isInteractive ? 0 : undefined}
      >
        {children}
      </div>
    );
  }
);

// Card subcomponents
const CardHeader = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-xl font-semibold text-neutral-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={`text-neutral-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    {...props}
  >
    {children}
  </div>
);

const CardFooter = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-4 flex items-center justify-end ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardImage = ({
  className = '',
  src,
  alt = '',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <div className="relative w-full h-0 pb-[56.25%] overflow-hidden">
    <img
      src={src}
      alt={alt}
      className={`absolute top-0 left-0 w-full h-full object-cover ${className}`}
      loading="lazy"
      {...props}
    />
  </div>
);

Card.displayName = 'Card';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
};

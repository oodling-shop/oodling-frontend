import { cn } from '@/helpers/cn';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Container = ({ 
  children, 
  className, 
  as: Component = 'div', 
  ...props 
}: ContainerProps) => {
  return (
    <Component
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

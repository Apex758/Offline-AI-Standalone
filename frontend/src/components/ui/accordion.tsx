import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextValue {
  value: string[];
  onValueChange: (value: string[]) => void;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ 
  type = 'single',
  defaultValue = [],
  collapsible = false,
  children,
  className = '',
  ...props 
}) => {
  const [value, setValue] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  );

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      setValue(value.includes(itemValue) && collapsible ? [] : [itemValue]);
    } else {
      setValue(
        value.includes(itemValue)
          ? value.filter(v => v !== itemValue)
          : [...value, itemValue]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`border-b ${className}`}
        data-state={value}
        {...props}
      />
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionTrigger must be used within Accordion');

    const isOpen = context.value.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        className={`flex w-full items-center justify-between py-4 font-medium transition-all hover:underline ${className}`}
        onClick={() => context.onValueChange(value)}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ value, className = '', children, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionContent must be used within Accordion');

    const isOpen = context.value.includes(value);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={`overflow-hidden text-sm transition-all ${className}`}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
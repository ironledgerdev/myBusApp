import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  touched?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      containerClassName,
      className,
      touched = true,
      ...props
    },
    ref
  ) => {
    const showError = touched && error;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "h-12 text-base transition-colors touch-target",
              showError &&
                "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
            )}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${props.name}-error` : undefined}
            {...props}
          />
          {showError && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
        </div>
        {showError && (
          <p id={`${props.name}-error`} className="text-xs text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !showError && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;

/**
 * Form field with label as input type
 */
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string | null;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  touched?: boolean;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      required,
      containerClassName,
      className,
      touched = true,
      placeholder,
      ...props
    },
    ref
  ) => {
    const showError = touched && error;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full h-12 px-3 border border-input rounded-md bg-background text-base transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "touch-target cursor-pointer",
              showError &&
                "border-red-500 focus:ring-red-500/50 focus:border-red-500 bg-red-50/50"
            )}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${props.name}-error` : undefined}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {showError && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
          )}
        </div>
        {showError && (
          <p id={`${props.name}-error`} className="text-xs text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !showError && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

/**
 * Form field for textarea
 */
interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  touched?: boolean;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      containerClassName,
      className,
      touched = true,
      ...props
    },
    ref
  ) => {
    const showError = touched && error;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "w-full px-3 py-3 border border-input rounded-md bg-background text-base transition-colors resize-none",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "min-h-24 touch-target",
              showError &&
                "border-red-500 focus:ring-red-500/50 focus:border-red-500 bg-red-50/50",
              className
            )}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${props.name}-error` : undefined}
            {...props}
          />
        </div>
        {showError && (
          <p id={`${props.name}-error`} className="text-xs text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !showError && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

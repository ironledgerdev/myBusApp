// Custom hook for form validation

import { useState, useCallback } from "react";
import type { ValidationError, ValidationResult } from "@/lib/validation";

interface UseFormValidationOptions<T> {
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (error: Error) => void;
  validate?: (data: T) => ValidationResult;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormValidationOptions<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      // Handle different input types
      let finalValue: any = value;
      if (type === "number") {
        finalValue = value === "" ? "" : parseFloat(value);
      } else if (type === "checkbox") {
        finalValue = (e.target as HTMLInputElement).checked;
      }

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Clear error for this field when user starts typing
      setErrors((prev) => prev.filter((e) => e.field !== name));
    },
    []
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  /**
   * Validate form
   */
  const validate = useCallback((): boolean => {
    if (!options.validate) {
      return true;
    }

    const result = options.validate(values);
    setErrors(result.errors);
    return result.valid;
  }, [values, options.validate]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setTouched(allTouched);

      // Validate
      if (!validate()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await options.onSubmit(values);
      } catch (error) {
        if (error instanceof Error) {
          options.onError?.(error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, options]
  );

  /**
   * Reset form
   */
  const reset = useCallback((newValues?: T) => {
    setValues(newValues || initialValues);
    setErrors([]);
    setTouched({});
  }, [initialValues]);

  /**
   * Set field error manually
   */
  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => [
      ...prev.filter((e) => e.field !== field),
      { field, message },
    ]);
  }, []);

  /**
   * Clear field error
   */
  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }, []);

  /**
   * Get field error
   */
  const getFieldError = useCallback(
    (field: string): string | null => {
      const error = errors.find((e) => e.field === field);
      return error ? error.message : null;
    },
    [errors]
  );

  /**
   * Check if field has error and is touched
   */
  const showFieldError = useCallback(
    (field: string): boolean => {
      return touched[field] && !!getFieldError(field);
    },
    [touched, getFieldError]
  );

  return {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldError,
    clearFieldError,
    getFieldError,
    showFieldError,
    validate,
  };
}

/**
 * Hook for simple field-level validation
 */
export function useFieldValidation(
  initialValue: any = "",
  validator?: (value: any) => string | null
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setError(null);

      if (validator) {
        const validationError = validator(newValue);
        if (validationError) {
          setError(validationError);
        }
      }
    },
    [validator]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validator && value) {
      const validationError = validator(value);
      setError(validationError);
    }
  }, [value, validator]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    setValue,
    error,
    touched,
    handleChange,
    handleBlur,
    reset,
    showError: touched && !!error,
  };
}

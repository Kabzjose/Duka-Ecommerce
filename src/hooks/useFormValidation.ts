import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

export function useFormValidation<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T | 'form', string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const extractErrors = useCallback((error: ZodError): Partial<Record<keyof T, string>> => {
    const errMap: Partial<Record<keyof T, string>> = {};
    for (const issue of error.issues) {
      const pathKey = issue.path[0] as keyof T;
      if (pathKey && !errMap[pathKey]) {
        errMap[pathKey] = issue.message;
      }
    }
    return errMap;
  }, []);

  const validateValues = useCallback(
    (currentValues: T): { isValid: boolean; errors: Partial<Record<keyof T, string>>; data?: T } => {
      const result = schema.safeParse(currentValues);
      if (result.success) {
        return { isValid: true, errors: {}, data: result.data };
      } else {
        const errMap = extractErrors(result.error);
        return { isValid: false, errors: errMap };
      }
    },
    [schema, extractErrors]
  );

  const validateField = useCallback(
    (field: keyof T, newValues?: T) => {
      const valuesToTest = newValues ?? values;
      const { errors: allErrors } = validateValues(valuesToTest);
      setErrorsState((prev) => {
        const next = { ...prev };
        if (allErrors[field]) {
          next[field] = allErrors[field];
        } else {
          delete next[field];
        }
        return next;
      });
    },
    [values, validateValues]
  );

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      const updatedValues = { ...values, [field]: value };
      setValues(updatedValues);

      if (touched[field]) {
        const { errors: allErrors } = validateValues(updatedValues);
        setErrorsState((prev) => {
          const next = { ...prev };
          if (allErrors[field]) {
            next[field] = allErrors[field];
          } else {
            delete next[field];
          }
          return next;
        });
      }
    },
    [values, touched, validateValues]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouchedState((prev) => ({ ...prev, [field]: true }));
      validateField(field);
    },
    [validateField]
  );

  const validateForm = useCallback((): { isValid: boolean; errors: Partial<Record<keyof T, string>>; data?: T } => {
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((k) => {
      allTouched[k as keyof T] = true;
    });
    setTouchedState(allTouched);

    const result = validateValues(values);
    setErrorsState(result.errors);
    return result;
  }, [values, validateValues]);

  const setErrors = useCallback((newErrors: Partial<Record<keyof T | 'form', string>>) => {
    setErrorsState(newErrors);
  }, []);

  const setError = useCallback((field: keyof T | 'form', message: string) => {
    setErrorsState((prev) => ({ ...prev, [field]: message }));
  }, []);

  const resetForm = useCallback(
    (newValues?: T) => {
      setValues(newValues ?? initialValues);
      setErrorsState({});
      setTouchedState({});
    },
    [initialValues]
  );

  return {
    values,
    setValues,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setError,
    setErrors,
    resetForm,
  };
}

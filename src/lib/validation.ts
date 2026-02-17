// Validation Utilities and Schemas

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Common regex patterns
export const patterns = {
  phone: /^[0-9]{10}$/,
  pin: /^[0-9]{4}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  latitude: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
  longitude: /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Validation functions
export const validators = {
  /**
   * Validate required field
   */
  required: (value: any, fieldName: string): ValidationError | null => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
      };
    }
    return null;
  },

  /**
   * Validate phone number
   */
  phone: (value: string, fieldName: string = "Phone"): ValidationError | null => {
    if (!value) return null;
    if (!patterns.phone.test(value)) {
      return {
        field: fieldName,
        message: "Phone number must be 10 digits (e.g., 0712345678)",
      };
    }
    return null;
  },

  /**
   * Validate PIN
   */
  pin: (value: string, fieldName: string = "PIN"): ValidationError | null => {
    if (!value) return null;
    if (!patterns.pin.test(value)) {
      return {
        field: fieldName,
        message: "PIN must be 4 digits",
      };
    }
    return null;
  },

  /**
   * Validate email
   */
  email: (value: string, fieldName: string = "Email"): ValidationError | null => {
    if (!value) return null;
    if (!patterns.email.test(value)) {
      return {
        field: fieldName,
        message: "Please enter a valid email address",
      };
    }
    return null;
  },

  /**
   * Validate password strength
   */
  password: (value: string, fieldName: string = "Password"): ValidationError | null => {
    if (!value) return null;
    if (value.length < 8) {
      return {
        field: fieldName,
        message: "Password must be at least 8 characters",
      };
    }
    if (!patterns.password.test(value)) {
      return {
        field: fieldName,
        message: "Password must contain uppercase, lowercase, and numbers",
      };
    }
    return null;
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, minLength: number, fieldName: string): ValidationError | null => {
    if (!value) return null;
    if (value.length < minLength) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${minLength} characters`,
      };
    }
    return null;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, maxLength: number, fieldName: string): ValidationError | null => {
    if (!value) return null;
    if (value.length > maxLength) {
      return {
        field: fieldName,
        message: `${fieldName} must not exceed ${maxLength} characters`,
      };
    }
    return null;
  },

  /**
   * Validate latitude
   */
  latitude: (value: any, fieldName: string = "Latitude"): ValidationError | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || !patterns.latitude.test(value.toString())) {
      return {
        field: fieldName,
        message: "Invalid latitude (-90 to 90)",
      };
    }
    return null;
  },

  /**
   * Validate longitude
   */
  longitude: (value: any, fieldName: string = "Longitude"): ValidationError | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || !patterns.longitude.test(value.toString())) {
      return {
        field: fieldName,
        message: "Invalid longitude (-180 to 180)",
      };
    }
    return null;
  },

  /**
   * Validate rating (1-5)
   */
  rating: (value: any, fieldName: string = "Rating"): ValidationError | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 5) {
      return {
        field: fieldName,
        message: "Rating must be between 1 and 5",
      };
    }
    return null;
  },

  /**
   * Validate number range
   */
  range: (value: any, min: number, max: number, fieldName: string): ValidationError | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return {
        field: fieldName,
        message: `${fieldName} must be between ${min} and ${max}`,
      };
    }
    return null;
  },

  /**
   * Validate URL
   */
  url: (value: string, fieldName: string = "URL"): ValidationError | null => {
    if (!value) return null;
    if (!patterns.url.test(value)) {
      return {
        field: fieldName,
        message: "Please enter a valid URL",
      };
    }
    return null;
  },
};

// Schema definitions for common forms
export const schemas = {
  /**
   * Driver login schema
   */
  driverLogin: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const phoneError = validators.required(data.phone, "Phone number");
    if (phoneError) errors.push(phoneError);
    else {
      const phoneFormatError = validators.phone(data.phone, "Phone number");
      if (phoneFormatError) errors.push(phoneFormatError);
    }

    const pinError = validators.required(data.pin, "PIN");
    if (pinError) errors.push(pinError);
    else {
      const pinFormatError = validators.pin(data.pin, "PIN");
      if (pinFormatError) errors.push(pinFormatError);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Admin login schema
   */
  adminLogin: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const passwordError = validators.required(data.password, "Password");
    if (passwordError) errors.push(passwordError);

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Create driver schema
   */
  createDriver: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const nameError = validators.required(data.name, "Name");
    if (nameError) errors.push(nameError);
    else {
      const minLengthError = validators.minLength(data.name, 2, "Name");
      if (minLengthError) errors.push(minLengthError);
    }

    const phoneError = validators.required(data.phone, "Phone number");
    if (phoneError) errors.push(phoneError);
    else {
      const phoneFormatError = validators.phone(data.phone, "Phone number");
      if (phoneFormatError) errors.push(phoneFormatError);
    }

    const pinError = validators.required(data.pin, "PIN");
    if (pinError) errors.push(pinError);
    else {
      const pinFormatError = validators.pin(data.pin, "PIN");
      if (pinFormatError) errors.push(pinFormatError);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Create route schema
   */
  createRoute: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const nameError = validators.required(data.name, "Route name");
    if (nameError) errors.push(nameError);

    const fromError = validators.required(data.from, "Origin");
    if (fromError) errors.push(fromError);

    const toError = validators.required(data.to, "Destination");
    if (toError) errors.push(toError);

    const busNumberError = validators.required(data.busNumber, "Bus number");
    if (busNumberError) errors.push(busNumberError);

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Add stop schema
   */
  addStop: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const nameError = validators.required(data.name, "Stop name");
    if (nameError) errors.push(nameError);

    const latError = validators.required(data.lat, "Latitude");
    if (latError) {
      errors.push(latError);
    } else {
      const latFormatError = validators.latitude(data.lat, "Latitude");
      if (latFormatError) errors.push(latFormatError);
    }

    const lngError = validators.required(data.lng, "Longitude");
    if (lngError) {
      errors.push(lngError);
    } else {
      const lngFormatError = validators.longitude(data.lng, "Longitude");
      if (lngFormatError) errors.push(lngFormatError);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Create arrival alert schema
   */
  createAlert: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const routeError = validators.required(data.routeId, "Route");
    if (routeError) errors.push(routeError);

    const stopError = validators.required(data.stopId, "Stop");
    if (stopError) errors.push(stopError);

    const minutesError = validators.required(data.minutesBefore, "Alert time");
    if (minutesError) {
      errors.push(minutesError);
    } else {
      const rangeError = validators.range(data.minutesBefore, 1, 30, "Alert time");
      if (rangeError) errors.push(rangeError);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Submit rating schema
   */
  submitRating: (data: any): ValidationResult => {
    const errors: ValidationError[] = [];

    const busError = validators.required(data.busId, "Bus");
    if (busError) errors.push(busError);

    const ratingError = validators.rating(data.rating, "Rating");
    if (ratingError) errors.push(ratingError);

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Sanitize string input
 */
export const sanitize = {
  text: (value: string): string => {
    return value.trim().replace(/[<>]/g, "");
  },

  number: (value: any): number | null => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  },

  phone: (value: string): string => {
    return value.replace(/\D/g, "").slice(-10);
  },

  pin: (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 4);
  },
};

/**
 * Get first error for a field
 */
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
};

/**
 * Check if field has error
 */
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((e) => e.field === fieldName);
};

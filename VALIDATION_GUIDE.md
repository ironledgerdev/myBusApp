# Data Validation Layer Documentation

## Overview

The validation layer provides:
- **Form validation** with error messages
- **Field-level validation** with real-time feedback
- **Data sanitization** to prevent bad data
- **Reusable validation schemas** for common forms
- **Custom React hooks** for easy integration
- **Pre-built validated form components**

## Quick Start

### 1. Using FormField Component (Easiest)

```typescript
import FormField from "@/components/forms/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { schemas } from "@/lib/validation";

function LoginForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, getFieldError, showFieldError } = 
    useFormValidation(
      { phone: "", pin: "" },
      {
        validate: (data) => schemas.driverLogin(data),
        onSubmit: async (data) => {
          // Handle successful validation
          console.log("Valid data:", data);
        },
      }
    );

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        name="phone"
        label="Phone Number"
        placeholder="0712345678"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("phone")}
        touched={showFieldError("phone")}
        required
      />

      <FormField
        name="pin"
        type="password"
        label="PIN"
        maxLength={4}
        value={values.pin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError("pin")}
        touched={showFieldError("pin")}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

### 2. Using Custom Validator on Single Fields

```typescript
import { useFieldValidation } from "@/hooks/useFormValidation";
import { validators } from "@/lib/validation";

function PhoneInput() {
  const { value, error, handleChange, handleBlur, showError } = useFieldValidation(
    "",
    (val) => validators.phone(val, "Phone") ? validators.phone(val, "Phone")?.message : null
  );

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0712345678"
      />
      {showError && <p className="error">{error}</p>}
    </div>
  );
}
```

## Validation Utilities

### Built-in Validators

All validators return a `ValidationError` or `null`:

```typescript
import { validators } from "@/lib/validation";

// Phone validation
validators.phone("0712345678", "Phone Number")
// Returns: null (valid)

validators.phone("123", "Phone Number")
// Returns: { field: "Phone Number", message: "Phone number must be 10 digits..." }

// PIN validation
validators.pin("1234", "PIN")
// Returns: null (valid)

// Email validation
validators.email("test@example.com", "Email")
// Returns: null (valid)

// Password strength
validators.password("SecurePass123", "Password")
// Returns: null (valid)

// Length validation
validators.minLength("hello", 3, "Name")
// Returns: null (valid)

validators.maxLength("hello world", 10, "Description")
// Returns: { field: "Description", message: "..." }

// Coordinates
validators.latitude("-26.2285", "Latitude")
// Returns: null (valid)

validators.longitude("27.8965", "Longitude")
// Returns: null (valid)

// Rating (1-5)
validators.rating(4, "Rating")
// Returns: null (valid)

// Range validation
validators.range(15, 1, 30, "Alert Minutes")
// Returns: null (valid)
```

## Pre-built Validation Schemas

Ready-to-use schemas for common forms:

```typescript
import { schemas } from "@/lib/validation";

// Driver Login
const result = schemas.driverLogin({
  phone: "0712345678",
  pin: "1234"
});
// Returns: { valid: true, errors: [] }

// Admin Login
const result = schemas.adminLogin({
  password: "password"
});

// Create Driver
const result = schemas.createDriver({
  name: "John Doe",
  phone: "0712345678",
  pin: "1234"
});

// Create Route
const result = schemas.createRoute({
  name: "Route 1",
  from: "Meadowlands",
  to: "Johannesburg CBD",
  busNumber: "P-101",
  busName: "PUTCO Express"
});

// Add Stop
const result = schemas.addStop({
  name: "Bus Stop",
  lat: -26.2285,
  lng: 27.8965
});

// Create Alert
const result = schemas.createAlert({
  routeId: "route-1",
  stopId: "s1",
  minutesBefore: 5
});

// Submit Rating
const result = schemas.submitRating({
  busId: "bus-1",
  rating: 5
});
```

## Data Sanitization

Sanitize user input before processing:

```typescript
import { sanitize } from "@/lib/validation";

// Sanitize text (remove HTML tags, trim)
const clean = sanitize.text("  hello <script>alert('xss')</script>  ");
// Returns: "hello alert('xss')"

// Sanitize phone (keep only digits, limit to 10)
const phone = sanitize.phone("07-123-456-78");
// Returns: "0712345678"

// Sanitize PIN (keep only digits, limit to 4)
const pin = sanitize.pin("1-2-3-4");
// Returns: "1234"

// Convert to safe number
const num = sanitize.number("123.45");
// Returns: 123.45

const invalid = sanitize.number("abc");
// Returns: null
```

## Form Hook - useFormValidation

Complete form state management with validation:

```typescript
const { 
  values,           // Current form values
  setValues,        // Update all values
  errors,           // Array of validation errors
  touched,          // Which fields have been touched
  isSubmitting,     // Is form being submitted
  handleChange,     // Change handler for inputs
  handleBlur,       // Blur handler for inputs
  handleSubmit,     // Form submission handler
  reset,            // Reset form to initial state
  setFieldError,    // Manually set a field error
  clearFieldError,  // Clear a field error
  getFieldError,    // Get error for a field
  showFieldError,   // Check if should show error (touched + has error)
  validate,         // Run validation manually
} = useFormValidation(initialValues, options);
```

### Options

```typescript
{
  // Validation function
  validate?: (data: T) => ValidationResult;
  
  // Called on successful validation
  onSubmit: (data: T) => Promise<void> | void;
  
  // Called if validation fails
  onError?: (error: Error) => void;
}
```

### Example: Multi-step Form

```typescript
const form = useFormValidation(
  { name: "", email: "", phone: "" },
  {
    validate: (data) => schemas.createDriver(data),
    onSubmit: async (data) => {
      await driversService.createDriver(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }
);

// Manual validation
const isValid = form.validate();

// Reset specific values
form.reset({ name: "", email: "", phone: "" });

// Update single field
form.setValues({ ...form.values, name: "John" });
```

## Form Components

### FormField

Validated input with error display:

```typescript
<FormField
  name="phone"              // Field name (required)
  label="Phone Number"      // Label text
  type="tel"               // Input type
  placeholder="0712345678"
  value={values.phone}
  onChange={handleChange}
  onBlur={handleBlur}
  error={getFieldError("phone")}
  touched={showFieldError("phone")}
  required={true}
  helperText="10 digits"
  disabled={isSubmitting}
  containerClassName="mb-4"  // Wrapper class
/>
```

### SelectField

Validated select input:

```typescript
import { SelectField } from "@/components/forms/FormField";

<SelectField
  name="routeId"
  label="Route"
  placeholder="Select a route"
  value={values.routeId}
  onChange={handleChange}
  onBlur={handleBlur}
  error={getFieldError("routeId")}
  touched={showFieldError("routeId")}
  required
  options={[
    { value: "route-1", label: "Route 1" },
    { value: "route-2", label: "Route 2" },
  ]}
/>
```

### TextAreaField

Validated textarea:

```typescript
import { TextAreaField } from "@/components/forms/FormField";

<TextAreaField
  name="comment"
  label="Comment"
  value={values.comment}
  onChange={handleChange}
  onBlur={handleBlur}
  error={getFieldError("comment")}
  touched={showFieldError("comment")}
  rows={4}
/>
```

## Real-World Examples

### Example 1: Driver Registration Form

```typescript
import { useFormValidation } from "@/hooks/useFormValidation";
import { schemas } from "@/lib/validation";
import FormField from "@/components/forms/FormField";
import { SelectField } from "@/components/forms/FormField";
import { driversService } from "@/services";

function RegisterDriver() {
  const form = useFormValidation(
    { name: "", phone: "", pin: "", routeId: "" },
    {
      validate: (data) => schemas.createDriver(data),
      onSubmit: async (data) => {
        const result = await driversService.createDriver(data);
        if (result.success) {
          toast.success("Driver registered successfully!");
          form.reset();
        }
      },
    }
  );

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <FormField
        name="name"
        label="Full Name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("name")}
        touched={form.showFieldError("name")}
        required
      />

      <FormField
        name="phone"
        label="Phone"
        type="tel"
        value={form.values.phone}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("phone")}
        touched={form.showFieldError("phone")}
        required
      />

      <FormField
        name="pin"
        label="PIN"
        type="password"
        maxLength={4}
        value={form.values.pin}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("pin")}
        touched={form.showFieldError("pin")}
        required
      />

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
```

### Example 2: Add Bus Stop Form

```typescript
function AddStop({ routeId, onSuccess }) {
  const form = useFormValidation(
    { name: "", lat: "", lng: "" },
    {
      validate: (data) => schemas.addStop(data),
      onSubmit: async (data) => {
        const result = await routesService.addStop(routeId, {
          name: data.name,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        });
        if (result.success) {
          onSuccess();
          form.reset();
        }
      },
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField
        name="name"
        label="Stop Name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("name")}
        touched={form.showFieldError("name")}
        required
      />

      <FormField
        name="lat"
        label="Latitude"
        type="number"
        step="0.0001"
        value={form.values.lat}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("lat")}
        touched={form.showFieldError("lat")}
        required
      />

      <FormField
        name="lng"
        label="Longitude"
        type="number"
        step="0.0001"
        value={form.values.lng}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("lng")}
        touched={form.showFieldError("lng")}
        required
      />

      <button type="submit">Add Stop</button>
    </form>
  );
}
```

## Creating Custom Validators

Add custom validation logic:

```typescript
import { validators, ValidationError } from "@/lib/validation";

// Custom validator function
const validatePhone = (phone: string, fieldName: string): ValidationError | null => {
  if (!phone) return null;
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  
  if (digits.length !== 10) {
    return {
      field: fieldName,
      message: "Phone must be 10 digits",
    };
  }
  
  // Additional check: phone shouldn't start with 0 (optional)
  if (!phone.startsWith("0")) {
    return {
      field: fieldName,
      message: "Phone must start with 0",
    };
  }
  
  return null;
};

// Use in custom schema
const schema = (data: any) => {
  const errors: ValidationError[] = [];
  
  const phoneError = validatePhone(data.phone, "Phone");
  if (phoneError) errors.push(phoneError);
  
  return { valid: errors.length === 0, errors };
};
```

## Best Practices

1. **Always use schemas** for common forms - they're pre-built and tested
2. **Validate on blur** for real-time feedback, not just on submit
3. **Sanitize user input** before processing or sending to backend
4. **Show errors only for touched fields** to avoid overwhelming users
5. **Use helper text** to guide users on expected format
6. **Test edge cases**: empty values, long strings, special characters
7. **Provide clear error messages** that explain what's wrong and how to fix it

## Integration with API Layer

Validation should happen BEFORE calling API services:

```typescript
const form = useFormValidation(data, {
  validate: (data) => schemas.createDriver(data),
  onSubmit: async (validatedData) => {
    // Data is validated at this point
    const response = await driversService.createDriver(validatedData);
    
    // Handle API errors separately
    if (!response.success) {
      form.setFieldError("phone", "Phone already registered");
    }
  },
});
```

## Testing Validation

Test validators independently:

```typescript
import { validators, schemas } from "@/lib/validation";

// Test individual validator
test("validates phone", () => {
  const result = validators.phone("0712345678", "Phone");
  expect(result).toBeNull();
  
  const error = validators.phone("123", "Phone");
  expect(error?.message).toContain("10 digits");
});

// Test schema
test("validates driver login", () => {
  const result = schemas.driverLogin({
    phone: "0712345678",
    pin: "1234"
  });
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});
```

## Environment-Specific Validation

Add different validation rules per environment:

```typescript
const isDev = process.env.NODE_ENV === "development";

export const schemas = {
  createDriver: (data: any) => {
    const errors: ValidationError[] = [];
    
    // Stricter validation in production
    if (!isDev && data.pin.length !== 4) {
      errors.push({
        field: "pin",
        message: "PIN must be exactly 4 digits",
      });
    }
    
    return { valid: errors.length === 0, errors };
  },
};
```

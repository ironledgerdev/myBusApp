import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/mobile";
import { useState } from "react";
import { drivers } from "@/data/mockData";
import { useFormValidation } from "@/hooks/useFormValidation";
import { schemas } from "@/lib/validation";
import FormField from "@/components/forms/FormField";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, getFieldError, showFieldError } = useFormValidation(
    { phone: "", pin: "" },
    {
      validate: (data) => schemas.driverLogin(data),
      onSubmit: async (data) => {
        setApiError("");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate credentials against drivers database
        const driver = drivers.find((d) => d.phone === data.phone && d.pin === data.pin);

        if (driver) {
          // Store driver session
          sessionStorage.setItem("driverId", driver.id);
          navigate("/driver/dashboard");
        } else {
          setApiError("Invalid phone number or PIN. Please try again.");
        }
      },
    }
  );

  return (
    <div className="h-screen flex flex-col bg-secondary overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader
        title="Driver Login"
        onBack={() => navigate("/")}
        showBackButton={true}
        sticky={false}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-accent blur-3xl" />
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Bus className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-display text-primary-foreground tracking-tight">
                Driver Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-secondary-foreground/80 font-body">
              Sign in to access your dashboard
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-background/95 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Login</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Enter your phone number and PIN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{apiError}</span>
                    </motion.div>
                  )}
                  <FormField
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="0712345678"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getFieldError("phone")}
                    touched={showFieldError("phone")}
                    disabled={isSubmitting}
                    required
                    helperText="Format: 10 digits (e.g., 0712345678)"
                  />
                  <FormField
                    name="pin"
                    type="password"
                    label="PIN"
                    placeholder="••••"
                    maxLength={4}
                    value={values.pin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getFieldError("pin")}
                    touched={showFieldError("pin")}
                    disabled={isSubmitting}
                    required
                    helperText="4-digit PIN provided by admin"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Demo credentials hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
                >
                  <p className="font-semibold text-xs sm:text-sm mb-2">Demo Credentials:</p>
                  <div className="space-y-1 font-mono text-blue-600 text-xs">
                    <p>0712345678 | 1234</p>
                    <p>0723456789 | 5678</p>
                    <p>0734567890 | 9012</p>
                    <p>0745678901 | 3456</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-secondary-foreground/50 text-xs sm:text-sm font-body"
          >
            © {new Date().getFullYear()} Ironledger Group PTY LTD. All rights reserved.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;

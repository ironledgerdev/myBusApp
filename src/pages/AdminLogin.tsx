import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/mobile";
import { useState } from "react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple admin password (in production, this would be validated against a backend)
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("adminId", "admin-001");
        setIsLoading(false);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid password. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-secondary overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader
        title="Admin Login"
        onBack={() => navigate("/")}
        showBackButton={true}
        sticky={false}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-accent blur-3xl" />
      </div>

      {/* Scrollable content */}
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
              <Lock className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-display text-primary-foreground tracking-tight">
                Admin Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-secondary-foreground/80 font-body">
              Manage drivers, routes, and system settings
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
                  Enter your admin password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{error}</span>
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
                    disabled={isLoading || !password}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Demo password hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
                >
                  <p className="font-semibold text-xs sm:text-sm mb-1">Demo Password:</p>
                  <p className="font-mono text-blue-600 text-xs">admin123</p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-secondary-foreground/50 text-xs sm:text-sm font-body"
          >
            © {new Date().getFullYear()} Ironledger Group PTY LTD. All rights reserved.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

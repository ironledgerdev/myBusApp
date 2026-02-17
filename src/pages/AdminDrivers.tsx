import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { drivers as initialDrivers, routes } from "@/data/mockData";
import type { Driver } from "@/data/mockData";

const AdminDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pin: "",
    routeId: "",
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId");
    if (!adminId) {
      navigate("/admin/login");
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleAddDriver = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({ name: "", phone: "", pin: generatePin(), routeId: "" });
  };

  const handleEditDriver = (driver: Driver) => {
    setShowForm(true);
    setEditingId(driver.id);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      pin: driver.pin,
      routeId: driver.routeId || "",
    });
  };

  const handleSaveDriver = () => {
    if (!formData.name || !formData.phone || !formData.pin) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // Edit existing driver
      setDrivers(
        drivers.map((d) =>
          d.id === editingId
            ? { ...d, name: formData.name, phone: formData.phone, pin: formData.pin, routeId: formData.routeId || null }
            : d
        )
      );
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        pin: formData.pin,
        routeId: formData.routeId || null,
        status: "active",
        tripHistory: [],
      };
      setDrivers([...drivers, newDriver]);
    }

    setShowForm(false);
    setFormData({ name: "", phone: "", pin: "", routeId: "" });
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const getRouteName = (routeId: string | null) => {
    if (!routeId) return "Unassigned";
    const route = routes.find((r) => r.id === routeId);
    return route ? route.name : "Unknown";
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary text-primary-foreground shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/dashboard")} className="hover:opacity-80">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-display">Driver Management</h1>
              <p className="text-sm opacity-90 mt-1">{drivers.length} drivers in system</p>
            </div>
          </div>
          <Button onClick={handleAddDriver} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Driver
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-background/95 border-primary/20">
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit Driver" : "Add New Driver"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Driver name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0712345678"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PIN</label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        placeholder="4-digit PIN"
                        maxLength={4}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, pin: generatePin() })}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign Route</label>
                    <select
                      value={formData.routeId}
                      onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="">-- Unassigned --</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.name} ({route.from} → {route.to})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveDriver} className="flex-1">
                      {editingId ? "Update" : "Create"} Driver
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Drivers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {drivers.map((driver) => (
            <Card key={driver.id} className="bg-background/95 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg">{driver.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-mono font-semibold">{driver.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">PIN</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-semibold">••••</p>
                          <button
                            onClick={() => handleCopyPin(driver.pin)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedPin === driver.pin ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-semibold">{getRouteName(driver.routeId)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold text-green-600">{driver.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditDriver(driver)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDrivers;

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Building2,
  Globe,
  Check,
  Loader2,
  ArrowLeft,
  Home,
} from "lucide-react";

interface Address {
  id: string;
  userId: string;
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

interface AddressFormData {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const emptyForm: AddressFormData = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router, fetchAddresses]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AddressFormData, string>> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.line1.trim()) errors.line1 = "Street address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.zip.trim()) errors.zip = "ZIP code is required";
    if (!form.country.trim()) errors.country = "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateDialog = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setForm({
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setDialogOpen(false);
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address deleted");
      } else {
        toast.error("Failed to delete address");
      }
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const address = addresses.find((a) => a.id === id);
      if (!address) return;
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      } else {
        toast.error("Failed to set default address");
      }
    } catch {
      toast.error("Failed to set default address");
    }
  };

  const updateField = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-48 mb-1" />
        <Skeleton className="h-5 w-60 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-primary transition-colors">
          My Account
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Addresses</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Addresses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={openCreateDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-destructive">{formErrors.fullName}</p>
                )}
              </div>

              {/* Street Address */}
              <div className="space-y-2">
                <Label htmlFor="line1">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="line1"
                  placeholder="123 Main Street"
                  value={form.line1}
                  onChange={(e) => updateField("line1", e.target.value)}
                />
                {formErrors.line1 && (
                  <p className="text-xs text-destructive">{formErrors.line1}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-2">
                <Label htmlFor="line2">Apartment, suite, etc.</Label>
                <Input
                  id="line2"
                  placeholder="Apt 4B"
                  value={form.line2}
                  onChange={(e) => updateField("line2", e.target.value)}
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                  {formErrors.city && (
                    <p className="text-xs text-destructive">{formErrors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                  {formErrors.state && (
                    <p className="text-xs text-destructive">{formErrors.state}</p>
                  )}
                </div>
              </div>

              {/* ZIP & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">
                    ZIP Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                  />
                  {formErrors.zip && (
                    <p className="text-xs text-destructive">{formErrors.zip}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />
                  {formErrors.country && (
                    <p className="text-xs text-destructive">{formErrors.country}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              {/* Default Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Set as default address
                  </Label>
                </div>
                <Switch
                  id="isDefault"
                  checked={form.isDefault}
                  onCheckedChange={(checked) => updateField("isDefault", checked)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingAddress ? (
                    "Update Address"
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No saved addresses</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add a shipping address to speed up your checkout process next
                time you shop.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={openCreateDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Address
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Add New Address Card */}
          <Card
            className="border-dashed border-2 cursor-pointer hover:border-primary/40 hover:bg-orange-50/30 transition-all group"
            onClick={openCreateDialog}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Add New Address
              </p>
            </CardContent>
          </Card>

          {/* Existing Address Cards */}
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`relative transition-all ${
                address.isDefault
                  ? "border-primary/50 ring-1 ring-primary/20"
                  : "hover:shadow-md"
              }`}
            >
              {address.isDefault && (
                <Badge className="absolute top-3 right-3 bg-primary text-white text-xs">
                  <Check className="mr-1 h-3 w-3" />
                  Default
                </Badge>
              )}
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-sm">{address.fullName}</h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground ml-10">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {address.country}
                    </p>
                    {address.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {address.phone}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 ml-10">
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-primary"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Home className="mr-1 h-3 w-3" />
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-primary"
                      onClick={() => openEditDialog(address)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                    >
                      {deletingId === address.id ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="mr-1 h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Back to Account */}
      <div className="mt-8">
        <Link href="/account">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Button>
        </Link>
      </div>
    </div>
  );
}

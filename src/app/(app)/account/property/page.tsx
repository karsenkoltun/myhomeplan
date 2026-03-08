"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, Plus, Home, Trash2, Pencil, MapPin } from "lucide-react";
import { usePropertyStore, type HomeType, type HeatingType, type PropertyProfile } from "@/stores/property-store";
import { useAuth } from "@/components/auth/auth-provider";
import { getAllProperties, createProperty, updatePropertyById, deleteProperty } from "@/lib/supabase/queries";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";
import Link from "next/link";

interface DbProperty {
  id: string;
  address: string;
  home_sqft: number;
  lot_sqft: number;
  year_built: number;
  home_type: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  heating_type: string;
  has_ac: boolean;
  has_garage: boolean;
  has_driveway: boolean;
  has_deck: boolean;
  has_fence: boolean;
  has_pets: boolean;
  roof_type: string;
  exterior_material: string;
  foundation: string;
  window_count: number;
  landscaping_complexity: string;
  mature_trees: number;
  garden_beds: number;
  garden_bed_sqft: number;
  deck_patio_sqft: number;
  has_pool: boolean;
  has_irrigation: boolean;
  driveway_material: string;
  driveway_length: string;
  fence_type: string;
  fence_linear_feet: number;
  created_at: string;
}

function propertyToDbFields(property: PropertyProfile) {
  return {
    address: property.address,
    home_sqft: property.homeSqft,
    lot_sqft: property.lotSqft,
    year_built: property.yearBuilt,
    home_type: property.homeType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    floors: property.floors,
    heating_type: property.heatingType,
    has_ac: property.hasAC,
    has_garage: property.hasGarage,
    has_driveway: property.hasDriveway,
    has_deck: property.hasDeck,
    has_fence: property.hasFence,
    has_pets: property.hasPets,
    roof_type: property.roofType,
    exterior_material: property.exteriorMaterial,
    foundation: property.foundation,
    window_count: property.windowCount,
    landscaping_complexity: property.landscapingComplexity,
    mature_trees: property.matureTrees,
    garden_beds: property.gardenBeds,
    garden_bed_sqft: property.gardenBedSqft,
    deck_patio_sqft: property.deckPatioSqft,
    has_pool: property.hasPool,
    has_irrigation: property.hasIrrigation,
    driveway_material: property.drivewayMaterial,
    driveway_length: property.drivewayLength,
    fence_type: property.fenceType,
    fence_linear_feet: property.fenceLinearFeet,
  };
}

export default function PropertyPage() {
  const { user } = useAuth();
  const { property, setProperty } = usePropertyStore();
  const router = useRouter();

  const [properties, setProperties] = useState<DbProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadProperties();
  }, [user]);

  async function loadProperties() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllProperties(user.id);
      setProperties(data as DbProperty[]);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(prop: DbProperty) {
    setEditingId(prop.id);
    setAddingNew(false);
    setProperty({
      address: prop.address || "",
      homeSqft: prop.home_sqft || 1500,
      lotSqft: prop.lot_sqft || 5000,
      yearBuilt: prop.year_built || 2000,
      homeType: (prop.home_type || "detached") as HomeType,
      bedrooms: prop.bedrooms || 3,
      bathrooms: prop.bathrooms || 2,
      floors: prop.floors || 2,
      heatingType: (prop.heating_type || "furnace") as HeatingType,
      hasAC: prop.has_ac ?? false,
      hasGarage: prop.has_garage ?? true,
      hasDriveway: prop.has_driveway ?? true,
      hasDeck: prop.has_deck ?? false,
      hasFence: prop.has_fence ?? false,
      hasPets: prop.has_pets ?? false,
    });
  }

  function startAddNew() {
    setEditingId(null);
    setAddingNew(true);
    setProperty({
      address: "",
      homeSqft: 1500,
      lotSqft: 5000,
      yearBuilt: 2000,
      homeType: "detached",
      bedrooms: 3,
      bathrooms: 2,
      floors: 2,
      heatingType: "furnace",
      hasAC: false,
      hasGarage: true,
      hasDriveway: true,
      hasDeck: false,
      hasFence: false,
      hasPets: false,
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const fields = propertyToDbFields(property);
      if (editingId) {
        await updatePropertyById(editingId, fields);
        toast.success("Property updated!");
      } else {
        await createProperty(user.id, fields);
        toast.success("Property added!");
      }
      setEditingId(null);
      setAddingNew(false);
      await loadProperties();
    } catch (error) {
      console.error("Failed to save property:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(propId: string) {
    setDeleting(propId);
    try {
      await deleteProperty(propId);
      toast.success("Property removed");
      await loadProperties();
    } catch {
      toast.error("Failed to delete property");
    } finally {
      setDeleting(null);
    }
  }

  const isEditing = editingId !== null || addingNew;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="mt-1 text-muted-foreground">Manage all your properties and addresses.</p>
          </div>
          {!isEditing && (
            <Button onClick={startAddNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {/* Property List */}
        {!isEditing && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : properties.length === 0 ? (
              <FadeIn>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Home className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add your first property to get started with service plans.</p>
                    <Button onClick={startAddNew} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" /> Add Your First Property
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ) : (
              properties.map((prop, i) => (
                <FadeIn key={prop.id} delay={i * 0.05}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Home className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{prop.address || "No address"}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span>{(prop.home_sqft || 0).toLocaleString()} sqft</span>
                              <span className="text-muted-foreground/30">|</span>
                              <span>{prop.bedrooms || 0} bed / {prop.bathrooms || 0} bath</span>
                              <span className="text-muted-foreground/30">|</span>
                              <span className="capitalize">{prop.home_type || "home"}</span>
                            </div>
                            {i === 0 && (
                              <Badge className="mt-2 bg-primary/10 text-primary text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(prop)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {properties.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(prop.id)}
                              disabled={deleting === prop.id}
                            >
                              {deleting === prop.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))
            )}
          </>
        )}

        {/* Edit / Add Form */}
        {isEditing && (
          <>
            <FadeIn>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Property" : "Add New Property"}</h2>
                <Button variant="ghost" onClick={() => { setEditingId(null); setAddingNew(false); }}>
                  Cancel
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader><CardTitle className="text-base">Property Basics</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Address</Label>
                    <Input value={property.address} onChange={(e) => setProperty({ address: e.target.value })} placeholder="123 Main St, Kelowna, BC" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Home Size (sq ft)</Label>
                    <Input type="number" value={property.homeSqft} onChange={(e) => setProperty({ homeSqft: Number(e.target.value) || 0 })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Lot Size (sq ft)</Label>
                    <Input type="number" value={property.lotSqft} onChange={(e) => setProperty({ lotSqft: Number(e.target.value) || 0 })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Year Built</Label>
                    <Input type="number" value={property.yearBuilt} onChange={(e) => setProperty({ yearBuilt: Number(e.target.value) || 2000 })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Home Type</Label>
                    <Select value={property.homeType} onValueChange={(v: HomeType) => setProperty({ homeType: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["detached", "townhouse", "duplex", "condo", "other"].map((t) => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Bedrooms", key: "bedrooms" as const },
                    { label: "Bathrooms", key: "bathrooms" as const },
                    { label: "Floors", key: "floors" as const },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label>{field.label}</Label>
                      <Input type="number" value={property[field.key]} onChange={(e) => setProperty({ [field.key]: Number(e.target.value) || 1 })} className="h-11" min={1} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label>Heating Type</Label>
                    <Select value={property.heatingType} onValueChange={(v: HeatingType) => setProperty({ heatingType: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[
                          { value: "furnace", label: "Furnace" },
                          { value: "heat-pump", label: "Heat Pump" },
                          { value: "baseboard", label: "Baseboard" },
                          { value: "boiler", label: "Boiler" },
                          { value: "other", label: "Other" },
                        ].map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Window Count</Label>
                    <Input type="number" value={property.windowCount} onChange={(e) => setProperty({ windowCount: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader><CardTitle className="text-base">Features</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { key: "hasAC" as const, label: "Air Conditioning" },
                    { key: "hasGarage" as const, label: "Garage" },
                    { key: "hasDriveway" as const, label: "Driveway" },
                    { key: "hasDeck" as const, label: "Deck/Patio" },
                    { key: "hasFence" as const, label: "Fence" },
                    { key: "hasPets" as const, label: "Pets" },
                    { key: "hasPool" as const, label: "Pool" },
                    { key: "hasIrrigation" as const, label: "Irrigation" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <Label className="text-sm">{item.label}</Label>
                      <Switch checked={property[item.key]} onCheckedChange={(v) => setProperty({ [item.key]: v })} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card>
                <CardHeader><CardTitle className="text-base">Outdoor Details</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Mature Trees</Label>
                    <Input type="number" value={property.matureTrees} onChange={(e) => setProperty({ matureTrees: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Garden Beds</Label>
                    <Input type="number" value={property.gardenBeds} onChange={(e) => setProperty({ gardenBeds: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Deck/Patio Size (sq ft)</Label>
                    <Input type="number" value={property.deckPatioSqft} onChange={(e) => setProperty({ deckPatioSqft: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fence Length (linear ft)</Label>
                    <Input type="number" value={property.fenceLinearFeet} onChange={(e) => setProperty({ fenceLinearFeet: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <Button onClick={handleSave} className="w-full gap-2" size="lg" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Property"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

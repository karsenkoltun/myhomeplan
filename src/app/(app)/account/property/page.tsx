"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { usePropertyStore, type HomeType, type HeatingType } from "@/stores/property-store";
import { useAuth } from "@/components/auth/auth-provider";
import { upsertProperty } from "@/lib/supabase/queries";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";
import Link from "next/link";

export default function PropertyEditorPage() {
  const router = useRouter();
  const { property, setProperty } = usePropertyStore();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user) {
        await upsertProperty(user.id, {
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
        });
      }
      toast.success("Property details saved!");
      router.push("/account");
    } catch (error) {
      console.error("Failed to save property:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
        </Button>

        <h1 className="text-2xl font-bold">Edit Property Details</h1>
        <p className="mt-1 text-muted-foreground">Changes may affect your service pricing.</p>
      </FadeIn>

      <div className="mt-8 space-y-6">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader><CardTitle className="text-base">Property Basics</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Home Size (sq ft)</Label>
                <Input type="number" value={property.homeSqft} onChange={(e) => setProperty({ homeSqft: Number(e.target.value) })} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Lot Size (sq ft)</Label>
                <Input type="number" value={property.lotSqft} onChange={(e) => setProperty({ lotSqft: Number(e.target.value) })} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Year Built</Label>
                <Input type="number" value={property.yearBuilt} onChange={(e) => setProperty({ yearBuilt: Number(e.target.value) })} className="h-11" />
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
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address</Label>
                <Input value={property.address} onChange={(e) => setProperty({ address: e.target.value })} placeholder="123 Main St, Kelowna, BC" className="h-11" />
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
                  <Input type="number" value={property[field.key]} onChange={(e) => setProperty({ [field.key]: Number(e.target.value) })} className="h-11" min={1} />
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
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Label className="text-sm">{item.label}</Label>
                  <Switch checked={property[item.key]} onCheckedChange={(v) => setProperty({ [item.key]: v })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        <Button onClick={handleSave} className="w-full gap-2" size="lg" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

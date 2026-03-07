"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyStore, type PMContact } from "@/stores/property-store";
import { Users, Plus, Trash2 } from "lucide-react";

const roleOptions = [
  { value: "owner", label: "Owner / Principal" },
  { value: "manager", label: "Property Manager" },
  { value: "operations", label: "Operations Manager" },
  { value: "accounting", label: "Accounting / Finance" },
  { value: "maintenance", label: "Maintenance Coordinator" },
  { value: "admin", label: "Administrative" },
];

export function StepPMContacts() {
  const { pm, setPM } = usePropertyStore();

  const addContact = () => {
    if (pm.contacts.length >= 5) return;
    setPM({
      contacts: [
        ...pm.contacts,
        { name: "", email: "", phone: "", role: "manager", isPrimary: false, canApproveReports: false, canApproveInvoices: false, receivesNotifications: true },
      ],
    });
  };

  const removeContact = (index: number) => {
    if (pm.contacts.length <= 1) return;
    setPM({ contacts: pm.contacts.filter((_, i) => i !== index) });
  };

  const updateContact = (index: number, updates: Partial<PMContact>) => {
    const updated = [...pm.contacts];
    updated[index] = { ...updated[index], ...updates };
    setPM({ contacts: updated });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Team Contacts</h2>
        <p className="mt-2 text-center text-muted-foreground">Add up to 5 team members who will interact with My Home Plan.</p>
      </div>

      <div className="mt-8 space-y-6">
        <AnimatePresence>
          {pm.contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={contact.isPrimary ? "border-violet-500/30" : ""}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">
                      Contact {index + 1}
                      {contact.isPrimary && <span className="ml-2 text-xs text-violet-600">(Primary)</span>}
                    </h3>
                    {pm.contacts.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeContact(index)} className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name <span className="text-red-500">*</span></Label>
                      <Input value={contact.name} onChange={(e) => updateContact(index, { name: e.target.value })} placeholder="Full name" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={contact.role} onValueChange={(v) => updateContact(index, { role: v })}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>{roleOptions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input type="email" value={contact.email} onChange={(e) => updateContact(index, { email: e.target.value })} placeholder="email@company.com" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input type="tel" value={contact.phone} onChange={(e) => updateContact(index, { phone: e.target.value })} placeholder="250-555-0123" className="h-11" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
                      <Label className="text-[11px]">Primary</Label>
                      <Switch checked={contact.isPrimary} onCheckedChange={(v) => updateContact(index, { isPrimary: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
                      <Label className="text-[11px]">Reports</Label>
                      <Switch checked={contact.canApproveReports} onCheckedChange={(v) => updateContact(index, { canApproveReports: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
                      <Label className="text-[11px]">Invoices</Label>
                      <Switch checked={contact.canApproveInvoices} onCheckedChange={(v) => updateContact(index, { canApproveInvoices: v })} />
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
                      <Label className="text-[11px]">Notifications</Label>
                      <Switch checked={contact.receivesNotifications} onCheckedChange={(v) => updateContact(index, { receivesNotifications: v })} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {pm.contacts.length < 5 && (
          <Button variant="outline" onClick={addContact} className="w-full gap-2 border-dashed">
            <Plus className="h-4 w-4" /> Add Contact ({pm.contacts.length}/5)
          </Button>
        )}
      </div>
    </div>
  );
}

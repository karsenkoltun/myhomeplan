"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Users,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  KeyRound,
  PawPrint,
  StickyNote,
} from "lucide-react";
import { getContractorClients } from "@/lib/supabase/queries";

type ClientProperty = Awaited<ReturnType<typeof getContractorClients>>[number];

export function ContractorClients({
  contractorProfileId,
}: {
  contractorProfileId: string;
}) {
  const [clients, setClients] = useState<ClientProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContractorClients(contractorProfileId);
      setClients(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [contractorProfileId]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const getProfile = (client: ClientProperty) => {
    const profiles = (client as Record<string, unknown>).profiles as {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
    } | null;
    return profiles;
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Your Clients
            </CardTitle>
            <Badge variant="secondary">{clients.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading clients...
            </p>
          ) : clients.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No clients yet. Complete jobs to build your client list.
            </p>
          ) : (
            <StaggerContainer className="space-y-2">
              {clients.map((client) => {
                const profile = getProfile(client);
                const ownerName = profile
                  ? `${profile.first_name} ${profile.last_name}`.trim()
                  : "Unknown";
                const isOpen = openId === client.id;

                return (
                  <StaggerItem key={client.id}>
                    <Collapsible
                      open={isOpen}
                      onOpenChange={(open) =>
                        setOpenId(open ? client.id : null)
                      }
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{ownerName}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {client.address || "No address on file"}
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-3 rounded-b-lg border border-t-0 bg-muted/30 p-4">
                          {/* Contact Info */}
                          {profile && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Contact
                              </p>
                              {profile.phone && (
                                <p className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  {profile.phone}
                                </p>
                              )}
                              {profile.email && (
                                <p className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  {profile.email}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Access Instructions */}
                          {client.access_instructions && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                <KeyRound className="h-3 w-3" />
                                Access Instructions
                              </p>
                              <p className="text-sm">
                                {client.access_instructions}
                              </p>
                            </div>
                          )}

                          {/* Pet Details */}
                          {client.pet_details && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                <PawPrint className="h-3 w-3" />
                                Pets
                              </p>
                              <p className="text-sm">{client.pet_details}</p>
                            </div>
                          )}

                          {/* Special Instructions / Notes */}
                          {client.special_instructions && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                <StickyNote className="h-3 w-3" />
                                Notes
                              </p>
                              <p className="text-sm">
                                {client.special_instructions}
                              </p>
                            </div>
                          )}

                          {/* Fallback if no details */}
                          {!client.access_instructions &&
                            !client.pet_details &&
                            !client.special_instructions &&
                            !profile && (
                              <p className="text-xs text-muted-foreground">
                                No additional details available.
                              </p>
                            )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}

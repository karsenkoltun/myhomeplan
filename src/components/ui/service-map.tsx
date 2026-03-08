"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Kelowna", lat: 49.888, lng: -119.496 },
  { name: "West Kelowna", lat: 49.862, lng: -119.583 },
  { name: "Vernon", lat: 50.267, lng: -119.272 },
  { name: "Penticton", lat: 49.49, lng: -119.59 },
  { name: "Lake Country", lat: 50.043, lng: -119.414 },
  { name: "Summerland", lat: 49.605, lng: -119.672 },
  { name: "Peachland", lat: 49.774, lng: -119.729 },
] as const;

// Custom marker icon using inline SVG to avoid Leaflet's default icon issues with bundlers
function createMarkerIcon() {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
            fill="oklch(0.55 0.18 250)" filter="url(#shadow)"/>
      <circle cx="12" cy="11" r="5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "leaflet-marker-custom",
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });
}

interface ServiceMapProps {
  className?: string;
  compact?: boolean;
  zoom?: number;
}

export default function ServiceMap({
  className,
  compact = false,
  zoom = 9,
}: ServiceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [49.888, -119.496],
      zoom,
      scrollWheelZoom: false,
      zoomControl: !compact,
      attributionControl: !compact,
    });

    // OpenStreetMap tiles with a clean, neutral style
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: compact
        ? ""
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const markerIcon = createMarkerIcon();

    // Add markers for each city
    CITIES.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], { icon: markerIcon }).addTo(
        map
      );

      marker.bindPopup(
        `<div style="text-align:center;padding:4px 2px;font-family:system-ui,sans-serif;">
          <strong style="font-size:14px;color:#1a1a2e;">${city.name}</strong>
          <div style="margin-top:4px;display:inline-block;background:oklch(0.55 0.18 250);color:white;font-size:11px;font-weight:600;padding:2px 10px;border-radius:9999px;">
            Now Serving
          </div>
        </div>`,
        {
          closeButton: false,
          className: "service-map-popup",
        }
      );
    });

    mapInstanceRef.current = map;

    // Force a resize after mount to fix any tile rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [compact, zoom]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-lg",
        compact ? "h-[300px]" : "h-[400px] sm:h-[500px]",
        className
      )}
    >
      <div ref={mapRef} className="h-full w-full" />
      <style jsx global>{`
        .leaflet-marker-custom {
          background: transparent !important;
          border: none !important;
        }
        .service-map-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .service-map-popup .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

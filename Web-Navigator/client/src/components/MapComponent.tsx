import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { GpsPoint } from "@shared/schema";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  points: GpsPoint[];
}

export default function MapComponent({ points }: MapComponentProps) {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    if (points && points.length > 0) {
      setCenter([points[0].latitude, points[0].longitude]);
    }
  }, [points]);

  const getDensityColor = (density?: string | null) => {
    switch (density) {
      case "high": return "#ef4444"; // Red
      case "medium": return "#f59e0b"; // Amber
      case "low": return "#22c55e"; // Green
      default: return "#22d3ee"; // Cyan
    }
  };

  // Group points into segments by traffic density for visualization
  const segments: { positions: [number, number][], density: string | null }[] = [];
  if (points.length > 0) {
    let currentSegment: [number, number][] = [[points[0].latitude, points[0].longitude]];
    let currentDensity = points[0].trafficDensity;

    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      if (p.trafficDensity === currentDensity) {
        currentSegment.push([p.latitude, p.longitude]);
      } else {
        segments.push({ positions: currentSegment, density: currentDensity });
        currentSegment = [[points[i-1].latitude, points[i-1].longitude], [p.latitude, p.longitude]];
        currentDensity = p.trafficDensity;
      }
    }
    segments.push({ positions: currentSegment, density: currentDensity });
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", background: "#1e293b" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {segments.map((segment, idx) => (
          <Polyline 
            key={idx}
            positions={segment.positions} 
            pathOptions={{ color: getDensityColor(segment.density), weight: 6, opacity: 0.8 }} 
          />
        ))}

        {/* Alternative Routes Rendering */}
        {points[0]?.alternativeRoutes && (points[0].alternativeRoutes as any[]).map((route: any, i: number) => (
          <Polyline
            key={`alt-${i}`}
            positions={route.points}
            pathOptions={{ 
              color: route.density === 'low' ? '#22c55e' : '#f59e0b', 
              weight: 4, 
              dashArray: '10, 10', 
              opacity: 0.5 
            }}
          >
            <Popup>
              <strong>{route.name}</strong><br/>
              Traffic: {route.density}
            </Popup>
          </Polyline>
        ))}

        {points.length > 0 && (
          <>
            <Marker position={[points[0].latitude, points[0].longitude]}>
              <Popup>
                <div className="text-sm">
                  <strong>Start Point</strong><br/>
                  {points[0].roadName && <span>Road: {points[0].roadName}</span>}
                </div>
              </Popup>
            </Marker>
            <Marker position={[points[points.length - 1].latitude, points[points.length - 1].longitude]}>
              <Popup>
                <div className="text-sm">
                  <strong>End Point</strong><br/>
                  {points[points.length - 1].roadName && <span>Road: {points[points.length - 1].roadName}</span>}
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

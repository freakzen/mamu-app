'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue } from '@/lib/supabase';

interface IssuesMapProps {
  issues: Issue[];
  onIssueClick?: (issueId: string) => void;
}

// Custom icon for map markers
const createMarkerIcon = (category: string) => {
  const colors: Record<string, string> = {
    pothole: '#EF4444',
    streetlight: '#FBBF24',
    water: '#3B82F6',
    garbage: '#10B981',
    pollution: '#A855F7',
    traffic: '#F97316',
    other: '#6B7280',
  };

  const color = colors[category] || '#6B7280';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function IssuesMap({ issues, onIssueClick }: IssuesMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([15.8642, 75.6318], 12); // Belgavi coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current!.removeLayer(layer);
      }
    });

    // Add markers for issues with location data
    const validIssues = issues.filter((issue) => issue.latitude && issue.longitude);

    validIssues.forEach((issue) => {
      const marker = L.marker([issue.latitude!, issue.longitude!], {
        icon: createMarkerIcon(issue.category),
      }).addTo(map.current!);

      const popup = L.popup().setContent(`
        <div style="min-width: 200px; padding: 8px; font-family: sans-serif;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${issue.title}</h4>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #666;">
            ${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">
            Status: <span style="font-weight: 600;">${issue.status.replace('_', ' ')}</span>
          </p>
          <button onclick="window.location.href='/issues/${issue.id}'" style="
            width: 100%;
            padding: 6px;
            background-color: #FF9933;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 600;
          ">View Details</button>
        </div>
      `);

      marker.bindPopup(popup);

      marker.on('click', () => {
        if (onIssueClick) {
          onIssueClick(issue.id);
        }
      });
    });

    // Fit bounds if there are issues
    if (validIssues.length > 0) {
      const bounds = L.latLngBounds(
        validIssues.map((issue) => [issue.latitude!, issue.longitude!])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [issues, onIssueClick]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '0.625rem',
        border: '1px solid rgba(232, 213, 192, 0.5)',
      }}
    />
  );
}

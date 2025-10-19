"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SimpleMapProps {
  city?: string;
  address?: string;
  height?: string;
}

let googleMapsLoading = false;
let googleMapsLoaded = false;

export function SimpleMap({ city, address, height = "300px" }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLocation, setLastLocation] = useState<string>('');

  useEffect(() => {
    // Clean and normalize location (remove trailing slashes, extra spaces, commas)
    const cleanAddress = address?.trim().replace(/\/+$/, '').replace(/,+$/, '') || '';
    const cleanCity = city?.trim().replace(/\/+$/, '').replace(/,+$/, '') || '';
    
    // Combine address and city into one location string
    let currentLocation = '';
    if (cleanAddress && cleanCity) {
      currentLocation = `${cleanAddress}, ${cleanCity}`;
    } else {
      currentLocation = cleanAddress || cleanCity;
    }
    
    // Only reload if location actually changed
    if (currentLocation === lastLocation && mapInstanceRef.current) {
      return; // Don't reload if location hasn't changed
    }
    setLastLocation(currentLocation);
    
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (googleMapsLoaded && typeof window.google !== 'undefined' && window.google.maps) {
          initMap();
          return;
        }

        // If already loading, wait for it
        if (googleMapsLoading) {
          const checkInterval = setInterval(() => {
            if (googleMapsLoaded && typeof window.google !== 'undefined' && window.google.maps) {
              clearInterval(checkInterval);
              initMap();
            }
          }, 100);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!googleMapsLoaded) {
              setError('Google Maps loading timeout');
              setIsLoading(false);
            }
          }, 10000);
          return;
        }

        // Get API key from environment variable
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
        
        if (!apiKey) {
          setError('Google Maps API key not configured');
          setIsLoading(false);
          return;
        }

        googleMapsLoading = true;

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          // Wait for Google Maps to be fully ready
          const checkReady = () => {
            if (typeof window.google !== 'undefined' && 
                window.google.maps && 
                window.google.maps.Map) {
              googleMapsLoaded = true;
              googleMapsLoading = false;
              setTimeout(() => initMap(), 300);
            } else {
              setTimeout(checkReady, 100);
            }
          };
          checkReady();
        };
        
        script.onerror = () => {
          googleMapsLoading = false;
          setError('Failed to load Google Maps');
          setIsLoading(false);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        googleMapsLoading = false;
        setError('Error loading map');
        setIsLoading(false);
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;
      
      // Wait for Google Maps to be fully loaded
      if (typeof window.google === 'undefined' || 
          !window.google.maps || 
          !window.google.maps.Map) {
        setTimeout(initMap, 200);
        return;
      }

      try {
        // Default location (Adelaide, Australia)
        const defaultLocation = { lat: -34.9285, lng: 138.6007 };

        // Create map only if it doesn't exist
        let map = mapInstanceRef.current;
        if (!map) {
          map = new window.google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });
          mapInstanceRef.current = map;
        }

        // IMPORTANT: Remove old marker BEFORE creating a new one
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }

        // Use the combined location for geocoding
        if (currentLocation && window.google.maps.Geocoder) {
          try {
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address: currentLocation }, (results, status) => {
              // Remove marker again in case geocoding is async
              if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
              }

              if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                map.setCenter(location);
                map.setZoom(15); // Zoom in for specific addresses
                
                // Create ONE new marker
                markerRef.current = new window.google.maps.Marker({
                  map: map,
                  position: location,
                  title: currentLocation,
                  animation: window.google.maps.Animation.DROP,
                });
              } else {
                console.warn('Geocoding failed:', status);
                // Add default marker
                markerRef.current = new window.google.maps.Marker({
                  map: map,
                  position: defaultLocation,
                  title: currentLocation || 'Default Location',
                });
              }
            });
          } catch (error) {
            console.error('Geocoding error:', error);
            // Add default marker on error
            markerRef.current = new window.google.maps.Marker({
              map: map,
              position: defaultLocation,
              title: currentLocation || 'Default Location',
            });
          }
        } else {
          // Add default marker
          markerRef.current = new window.google.maps.Marker({
            map: map,
            position: defaultLocation,
            title: 'Adelaide',
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Error initializing map');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [city, address, lastLocation]);

  if (error) {
    return (
      <div 
        className="w-full bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs mt-2">Please configure NEXT_PUBLIC_GOOGLE_MAPS_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}


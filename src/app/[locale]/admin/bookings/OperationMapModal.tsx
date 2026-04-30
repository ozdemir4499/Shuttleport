import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';

type Booking = {
  id: number;
  customer_name: string;
  customer_phone: string;
  origin: string;
  destination: string;
  transfer_datetime: string;
  vehicle_type: string;
  passengers?: number;
};

type OperationMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function OperationMapModal({ isOpen, onClose, booking }: OperationMapModalProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

  const calculateRoute = useCallback(async () => {
    if (!booking) return;
    try {
      // @ts-ignore
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: booking.origin,
        destination: booking.destination,
        // @ts-ignore
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(Date.now()), // Gives time with traffic
          // @ts-ignore
          trafficModel: window.google.maps.TrafficModel.BEST_GUESS
        }
      });
      setDirectionsResponse(results);
      if (results.routes[0].legs[0]) {
        const leg = results.routes[0].legs[0];
        setDistance(leg.distance?.text || '');
        const durationText = leg.duration_in_traffic?.text || leg.duration?.text || '';
        setDuration(durationText);
        
        // Calculate estimated dropoff time based on transfer_datetime + duration
        const pickupDate = new Date(booking.transfer_datetime);
        const durationSeconds = leg.duration_in_traffic?.value || leg.duration?.value || 0;
        const dropoffDate = new Date(pickupDate.getTime() + durationSeconds * 1000);
        setDropoffTime(dropoffDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      console.error("Directions error:", error);
    }
  }, [booking]);

  useEffect(() => {
    if (isLoaded && isOpen && booking) {
      calculateRoute();
    }
  }, [isLoaded, isOpen, booking, calculateRoute]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-white/20 relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-indigo-900 flex justify-between items-center shrink-0 z-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">Canlı Operasyon & Trafik Analizi</h3>
              <p className="text-indigo-200 text-xs font-medium">Ref: #{booking.id} | {booking.origin} ➔ {booking.destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all relative z-10">
            ✕
          </button>
        </div>

        {/* Content (Map + Overlays) */}
        <div className="flex-1 relative flex bg-slate-50">
          
          {/* Map Area */}
          <div className="absolute inset-0 z-0">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: 41.0082, lng: 28.9784 }} // Default Istanbul
                zoom={10}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  mapTypeControl: false,
                  styles: [
                    {
                      "featureType": "all",
                      "elementType": "geometry.fill",
                      "stylers": [{"weight": "2.00"}]
                    },
                    {
                      "featureType": "all",
                      "elementType": "geometry.stroke",
                      "stylers": [{"color": "#9c9c9c"}]
                    },
                    {
                      "featureType": "all",
                      "elementType": "labels.text",
                      "stylers": [{"visibility": "on"}]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "all",
                      "stylers": [{"color": "#f2f2f2"}]
                    },
                    {
                      "featureType": "landscape",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#ffffff"}]
                    },
                    {
                      "featureType": "landscape.man_made",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#ffffff"}]
                    },
                    {
                      "featureType": "poi",
                      "elementType": "all",
                      "stylers": [{"visibility": "off"}]
                    },
                    {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [{"saturation": -100},{"lightness": 45}]
                    },
                    {
                      "featureType": "road",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#eeeeee"}]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.fill",
                      "stylers": [{"color": "#7b7b7b"}]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.stroke",
                      "stylers": [{"color": "#ffffff"}]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "all",
                      "stylers": [{"visibility": "simplified"}]
                    },
                    {
                      "featureType": "road.arterial",
                      "elementType": "labels.icon",
                      "stylers": [{"visibility": "off"}]
                    },
                    {
                      "featureType": "transit",
                      "elementType": "all",
                      "stylers": [{"visibility": "off"}]
                    },
                    {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [{"color": "#46bcec"},{"visibility": "on"}]
                    },
                    {
                      "featureType": "water",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#c8d7d4"}]
                    },
                    {
                      "featureType": "water",
                      "elementType": "labels.text.fill",
                      "stylers": [{"color": "#070707"}]
                    },
                    {
                      "featureType": "water",
                      "elementType": "labels.text.stroke",
                      "stylers": [{"color": "#ffffff"}]
                    }
                  ]
                }}
              >
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      polylineOptions: {
                        strokeColor: '#4f46e5',
                        strokeWeight: 6,
                        strokeOpacity: 0.8
                      },
                      suppressMarkers: false,
                    }}
                  />
                )}
                <TrafficLayer />
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Overlay Panels */}
          <div className="relative z-10 w-full h-full pointer-events-none p-6 flex flex-col justify-between">
            
            {/* Top Cards Row */}
            <div className="flex flex-wrap gap-4 items-start pointer-events-auto">
              
              {/* Traffic & Time Stats Card */}
              <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 min-w-[240px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Trafik & Süre</h4>
                    <p className="text-sm font-black text-gray-900">{duration || 'Hesaplanıyor...'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Mesafe</span>
                    <span className="font-bold text-gray-900">{distance || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Yolcu Alım (Sefer)</span>
                    <span className="font-bold text-indigo-600">
                      {new Date(booking.transfer_datetime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">Tahmini Teslim & Boşa Çıkış</span>
                    <span className="font-black text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                      {dropoffTime || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather Status Card */}
              <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 min-w-[200px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hava Durumu</h4>
                    <p className="text-sm font-black text-gray-900">Güzergah Boyunca</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-3xl font-black text-gray-800 tracking-tighter">19°</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-600">Açık / Güneşli</span>
                    <span className="text-xs text-gray-400 font-medium">Rüzgar: 12 km/s</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Cards Row */}
            <div className="flex flex-wrap gap-4 items-end pointer-events-auto">
              
              {/* Passenger Info */}
              <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 flex-1 min-w-[280px] max-w-sm">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Yolcu Durumu
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {booking.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 capitalize">{booking.customer_name}</div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">{booking.customer_phone}</div>
                  </div>
                  <div className="ml-auto text-center px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Kişi</div>
                    <div className="font-black text-gray-700">{booking.passengers || 1}</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 flex-1 min-w-[280px] max-w-sm">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                  Araç & Sürücü Bilgileri
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 uppercase">{booking.vehicle_type.replace('_', ' ')}</div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">Sürücü Ataması Bekleniyor</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}



// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';

// // ডেলিভারি ফি ক্যালকুলেশন ফাংশন
// const getDeliveryFee = (dist) => {
//   const d = Number(dist) || 0;
//   if (d <= 2) return 20;
//   if (d <= 5) return 30;
//   if (d <= 8) return 40;
//   if (d <= 12) return 50;
//   if (d <= 15) return 60;
//   return 60 + Math.ceil(d - 15) * 10;
// };

// // কাস্টম মার্কার আইকন
// const createCustomIcon = (emoji, bgColor) => {
//   return L.divIcon({
//     className: 'custom-map-marker',
//     html: `<div style="
//       background-color: ${bgColor};
//       color: white;
//       width: 36px;
//       height: 36px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 18px;
//       border: 3px solid white;
//       box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
//     ">${emoji}</div>`,
//     iconSize: [36, 36],
//     iconAnchor: [18, 18],
//     popupAnchor: [0, -20],
//   });
// };

// const riderIcon = createCustomIcon('🛵', '#10B981');
// const sellerIcon = createCustomIcon('🏪', '#3B82F6');
// const customerIcon = createCustomIcon('📍', '#EF4444');

// // ম্যাপ ভিউ অটো-সেন্টার ও ফিট করা
// const AutoFitBounds = ({ points }) => {
//   const map = useMap();

//   useEffect(() => {
//     const validPoints = points.filter(
//       (p) => p && typeof p.lat === 'number' && typeof p.lng === 'number'
//     );

//     if (validPoints.length === 1) {
//       map.setView([validPoints[0].lat, validPoints[0].lng], 14);
//     } else if (validPoints.length > 1) {
//       const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [points, map]);

//   return null;
// };

// const DeliveryLiveMap = ({ riderLoc, sellerLoc, customerLoc, distanceKm }) => {
//   const defaultCenter = [
//     riderLoc?.lat || sellerLoc?.lat || customerLoc?.lat || 22.6306,
//     riderLoc?.lng || sellerLoc?.lng || customerLoc?.lng || 88.6646,
//   ];

//   const routeLine =
//     sellerLoc && customerLoc && sellerLoc.lat && customerLoc.lat
//       ? [
//           [sellerLoc.lat, sellerLoc.lng],
//           [customerLoc.lat, customerLoc.lng],
//         ]
//       : [];

//   return (
//     <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
//       {/* ফ্লোটিং ইনফো কার্ড */}
//       {distanceKm !== undefined && (
//         <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-xs flex items-center gap-3">
//           <div>
//             <p className="text-slate-400 font-bold">Distance</p>
//             <p className="text-slate-800 font-black text-sm">{distanceKm} km</p>
//           </div>
//           <div className="h-6 w-px bg-slate-200"></div>
//           <div>
//             <p className="text-slate-400 font-bold">Delivery Fee</p>
//             <p className="text-emerald-600 font-black text-sm">
//               ₹{getDeliveryFee(distanceKm)}
//             </p>
//           </div>
//         </div>
//       )}

//       <MapContainer
//         center={defaultCenter}
//         zoom={13}
//         scrollWheelZoom={false}
//         className="w-full h-full"
//       >
//         {/* Google Maps টাইলস লেয়ার */}
//         <TileLayer
//           attribution="Google Maps"
//           url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
//           subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
//           maxZoom={20}
//         />

//         {/* সেলার পিকআপ মার্কার */}
//         {sellerLoc?.lat && sellerLoc?.lng && (
//           <Marker position={[sellerLoc.lat, sellerLoc.lng]} icon={sellerIcon}>
//             <Popup>
//               <strong>🏪 Store Pickup</strong>
//               <br />
//               {sellerLoc.name || 'Seller Store'}
//             </Popup>
//           </Marker>
//         )}

//         {/* কাস্টমার ডেলিভারি পয়েন্ট */}
//         {customerLoc?.lat && customerLoc?.lng && (
//           <Marker position={[customerLoc.lat, customerLoc.lng]} icon={customerIcon}>
//             <Popup>
//               <strong>📍 Delivery Address</strong>
//               <br />
//               {customerLoc.address || 'Customer Location'}
//             </Popup>
//           </Marker>
//         )}

//         {/* রাইডার লাইভ মার্কার */}
//         {riderLoc?.lat && riderLoc?.lng && (
//           <Marker position={[riderLoc.lat, riderLoc.lng]} icon={riderIcon}>
//             <Popup>
//               <strong>🛵 Rider Live Location</strong>
//             </Popup>
//           </Marker>
//         )}

//         {/* রুট লাইন */}
//         {routeLine.length > 0 && (
//           <Polyline positions={routeLine} color="#059669" weight={4} dashArray="6, 8" />
//         )}

//         <AutoFitBounds points={[riderLoc, sellerLoc, customerLoc]} />
//       </MapContainer>
//     </div>
//   );
// };

// export default DeliveryLiveMap;

















// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css'; // সিএসএস নিশ্চিত করতে এখানে সরাসরি ইমপোর্ট

// // কাস্টম মার্কার আইকন ডিজাইন
// const createCustomIcon = (emoji, bgColor) => {
//   return L.divIcon({
//     className: 'custom-leaflet-icon',
//     html: `<div style="
//       background-color: ${bgColor};
//       color: white;
//       width: 36px;
//       height: 36px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 18px;
//       border: 3px solid white;
//       box-shadow: 0 4px 8px rgba(0,0,0,0.4);
//       transform: translate(-50%, -50%);
//     ">${emoji}</div>`,
//     iconSize: [36, 36],
//     iconAnchor: [0, 0],
//     popupAnchor: [0, -20],
//   });
// };

// const riderIcon = createCustomIcon('🛵', '#10B981');
// const sellerIcon = createCustomIcon('🏪', '#3B82F6');
// const customerIcon = createCustomIcon('📍', '#EF4444');

// // ডেলিভারি চার্জ ক্যালকুলেশন
// const getDeliveryFee = (dist) => {
//   const d = Number(dist) || 0;
//   if (d <= 2) return 20;
//   if (d <= 5) return 30;
//   if (d <= 8) return 40;
//   if (d <= 12) return 50;
//   if (d <= 15) return 60;
//   return 60 + Math.ceil(d - 15) * 10;
// };

// // ম্যাপ ভিউ অটো ফিট ও ভাঙা টাইলস ফিক্স কম্পোনেন্ট
// const MapController = ({ points }) => {
//   const map = useMap();

//   useEffect(() => {
//     // ভাঙা টাইলস ফিক্স করার জন্য ম্যাপ সাইজ রিফ্রেশ
//     const timer = setTimeout(() => {
//       map.invalidateSize();
//     }, 200);

//     const validPoints = points.filter(
//       (p) => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng)
//     );

//     if (validPoints.length === 1) {
//       map.setView([validPoints[0].lat, validPoints[0].lng], 14);
//     } else if (validPoints.length > 1) {
//       const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
//       map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
//     }

//     return () => clearTimeout(timer);
//   }, [points, map]);

//   return null;
// };

// const DeliveryLiveMap = ({ riderLoc, sellerLoc, customerLoc, distanceKm }) => {
//   // ফলব্যাক কোঅর্ডিনেট
//   const sLat = Number(sellerLoc?.lat) || 22.6306;
//   const sLng = Number(sellerLoc?.lng) || 88.6646;
  
//   const cLat = Number(customerLoc?.lat) || 22.6390;
//   const cLng = Number(customerLoc?.lng) || 88.6750;

//   const rLat = riderLoc?.lat ? Number(riderLoc.lat) : null;
//   const rLng = riderLoc?.lng ? Number(riderLoc.lng) : null;

//   // কানেক্টিং রুট লাইন (সেলার থেকে কাস্টমার)
//   const routePoints = [
//     [sLat, sLng],
//     [cLat, cLng],
//   ];

//   return (
//     <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
//       {/* ফ্লোটিং দূরত্ব ও চার্জ ইনফো */}
//       {distanceKm !== undefined && (
//         <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs flex items-center gap-3">
//           <div>
//             <p className="text-[10px] text-slate-400 font-bold uppercase">Distance</p>
//             <p className="text-slate-800 font-black text-sm">{distanceKm} km</p>
//           </div>
//           <div className="h-6 w-px bg-slate-200"></div>
//           <div>
//             <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery Fee</p>
//             <p className="text-emerald-600 font-black text-sm">
//               ₹{getDeliveryFee(distanceKm)}
//             </p>
//           </div>
//         </div>
//       )}

//       <MapContainer
//         center={[sLat, sLng]}
//         zoom={13}
//         scrollWheelZoom={false}
//         style={{ height: '100%', width: '100%', zIndex: 1 }}
//       >
//         {/* Google Maps টাইলস লেয়ার */}
//         <TileLayer
//           attribution="Google Maps"
//           url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
//           subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
//           maxZoom={20}
//         />

//         {/* সেলার মার্কার */}
//         <Marker position={[sLat, sLng]} icon={sellerIcon}>
//           <Popup>
//             <strong>🏪 Pickup Store</strong>
//             <br />
//             {sellerLoc?.name || 'Seller Store'}
//           </Popup>
//         </Marker>

//         {/* কাস্টমার মার্কার */}
//         <Marker position={[cLat, cLng]} icon={customerIcon}>
//           <Popup>
//             <strong>📍 Delivery Point</strong>
//             <br />
//             {customerLoc?.address || 'Customer Location'}
//           </Popup>
//         </Marker>

//         {/* রাইডার লাইভ মার্কার */}
//         {rLat && rLng && (
//           <Marker position={[rLat, rLng]} icon={riderIcon}>
//             <Popup>
//               <strong>🛵 Rider Live Location</strong>
//             </Popup>
//           </Marker>
//         )}

//         {/* সেলার ও কাস্টমারের মধ্যকার রুট লাইন */}
//         <Polyline
//           positions={routePoints}
//           pathOptions={{ color: '#10B981', weight: 4, dashArray: '6, 8', opacity: 0.9 }}
//         />

//         {/* অটো ফোকাস ও সাইজ ফিক্স */}
//         <MapController
//           points={[
//             { lat: sLat, lng: sLng },
//             { lat: cLat, lng: cLng },
//             rLat && rLng ? { lat: rLat, lng: rLng } : null,
//           ]}
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default DeliveryLiveMap;
























// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // কাস্টম মার্কার আইকন
// const createCustomIcon = (emoji, bgColor) => {
//   return L.divIcon({
//     className: 'custom-leaflet-icon',
//     html: `<div style="
//       background-color: ${bgColor};
//       color: white;
//       width: 38px;
//       height: 38px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 19px;
//       border: 3px solid white;
//       box-shadow: 0 4px 10px rgba(0,0,0,0.35);
//       transform: translate(-50%, -50%);
//     ">${emoji}</div>`,
//     iconSize: [38, 38],
//     iconAnchor: [0, 0],
//     popupAnchor: [0, -20],
//   });
// };

// const riderIcon = createCustomIcon('🛵', '#10B981');
// const sellerIcon = createCustomIcon('🏪', '#2563EB');
// const customerIcon = createCustomIcon('📍', '#DC2626');

// // ডেলিভারি চার্জ ক্যালকুলেশন
// const getDeliveryFee = (dist) => {
//   const d = Number(dist) || 0;
//   if (d <= 2) return 20;
//   if (d <= 5) return 30;
//   if (d <= 8) return 40;
//   if (d <= 12) return 50;
//   if (d <= 15) return 60;
//   return 60 + Math.ceil(d - 15) * 10;
// };

// // ম্যাপ ভিউ অটো-ফিট কম্পোনেন্ট
// const MapController = ({ points, roadRoute }) => {
//   const map = useMap();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       map.invalidateSize();
//     }, 200);

//     const validPoints = points.filter(
//       (p) => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng)
//     );

//     if (roadRoute && roadRoute.length > 0) {
//       const bounds = L.latLngBounds(roadRoute);
//       map.fitBounds(bounds, { padding: [40, 40] });
//     } else if (validPoints.length > 1) {
//       const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
//       map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
//     } else if (validPoints.length === 1) {
//       map.setView([validPoints[0].lat, validPoints[0].lng], 14);
//     }

//     return () => clearTimeout(timer);
//   }, [points, roadRoute, map]);

//   return null;
// };

// const DeliveryLiveMap = ({ riderLoc, sellerLoc, customerLoc, distanceKm }) => {
//   const [roadCoordinates, setRoadCoordinates] = useState([]);
//   const [calculatedDistance, setCalculatedDistance] = useState(distanceKm);

//   const sLat = Number(sellerLoc?.lat) || 22.6306;
//   const sLng = Number(sellerLoc?.lng) || 88.6646;
  
//   const cLat = Number(customerLoc?.lat) || 22.6390;
//   const cLng = Number(customerLoc?.lng) || 88.6750;

//   const rLat = riderLoc?.lat ? Number(riderLoc.lat) : null;
//   const rLng = riderLoc?.lng ? Number(riderLoc.lng) : null;

//   // আসল রাস্তার রুট এবং ড্রাইভ দূরত্ব ফেচ করা (OSRM Free API)
//   useEffect(() => {
//     const fetchRoadRoute = async () => {
//       try {
//         const url = `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${cLng},${cLat}?overview=full&geometries=geojson`;
//         const res = await fetch(url);
//         const data = await res.json();

//         if (data.routes && data.routes.length > 0) {
//           // রুট কোঅর্ডিনেট [lat, lng] ফরম্যাটে সাজানো
//           const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
//           setRoadCoordinates(coords);

//           // রিয়েল রাস্তার দূরত্ব (কিলোমিটার)
//           const roadDist = (data.routes[0].distance / 1000).toFixed(1);
//           setCalculatedDistance(Number(roadDist));
//         }
//       } catch (err) {
//         console.warn('Could not fetch road route, falling back to direct line:', err);
//         setRoadCoordinates([[sLat, sLng], [cLat, cLng]]);
//       }
//     };

//     fetchRoadRoute();
//   }, [sLat, sLng, cLat, cLng]);

//   const displayDistance = calculatedDistance || distanceKm || 1.8;

//   return (
//     <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
//       {/* ফ্লোটিং দূরত্ব ও চার্জ ইনফো */}
//       <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs flex items-center gap-3">
//         <div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Driving Distance</p>
//           <p className="text-slate-900 font-black text-sm">{displayDistance} km</p>
//         </div>
//         <div className="h-6 w-px bg-slate-200"></div>
//         <div>
//           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delivery Fee</p>
//           <p className="text-emerald-600 font-black text-sm">
//             ₹{getDeliveryFee(displayDistance)}
//           </p>
//         </div>
//       </div>

//       <MapContainer
//         center={[sLat, sLng]}
//         zoom={13}
//         scrollWheelZoom={false}
//         style={{ height: '100%', width: '100%', zIndex: 1 }}
//       >
//         {/* Google Maps রোডম্যাপ টাইলস */}
//         <TileLayer
//           attribution="Google Maps"
//           url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
//           subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
//           maxZoom={20}
//         />

//         {/* সেলার স্টোর মার্কার */}
//         <Marker position={[sLat, sLng]} icon={sellerIcon}>
//           <Popup>
//             <div className="text-xs space-y-1 p-0.5">
//               <strong className="text-blue-600 block text-sm">🏪 {sellerLoc?.name || 'Pickup Store'}</strong>
//               <p className="text-slate-600 font-medium">📍 {sellerLoc?.address || 'Store address not available'}</p>
//               {sellerLoc?.phone && <p className="text-slate-500">📞 {sellerLoc.phone}</p>}
//             </div>
//           </Popup>
//         </Marker>

//         {/* কাস্টমার ডেলিভারি ড্রপ মার্কার */}
//         <Marker position={[cLat, cLng]} icon={customerIcon}>
//           <Popup>
//             <div className="text-xs space-y-1 p-0.5">
//               <strong className="text-red-600 block text-sm">📍 Delivery Location</strong>
//               <p className="text-slate-600 font-medium">{customerLoc?.address || 'Customer Address'}</p>
//             </div>
//           </Popup>
//         </Marker>

//         {/* রাইডার লাইভ মার্কার */}
//         {rLat && rLng && (
//           <Marker position={[rLat, rLng]} icon={riderIcon}>
//             <Popup>
//               <div className="text-xs font-bold text-emerald-600">
//                 🛵 Delivery Boy (You)
//               </div>
//             </Popup>
//           </Marker>
//         )}

//         {/* আসল বাঁকা রাস্তার রুট লাইন */}
//         {roadCoordinates.length > 0 && (
//           <Polyline
//             positions={roadCoordinates}
//             pathOptions={{ color: '#2563EB', weight: 5, opacity: 0.85, lineJoin: 'round' }}
//           />
//         )}

//         {/* অটো ভিউ ফিট */}
//         <MapController
//           points={[
//             { lat: sLat, lng: sLng },
//             { lat: cLat, lng: cLng },
//             rLat && rLng ? { lat: rLat, lng: rLng } : null,
//           ]}
//           roadRoute={roadCoordinates}
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default DeliveryLiveMap;






















import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// কাস্টম মার্কার আইকন
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      background-color: ${bgColor};
      color: white;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      transform: translate(-50%, -50%);
    ">${emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [0, 0],
    popupAnchor: [0, -20],
  });
};

const riderIcon = createCustomIcon('🛵', '#10B981');
const sellerIcon = createCustomIcon('🏪', '#2563EB');
const customerIcon = createCustomIcon('📍', '#DC2626');

const getDeliveryFee = (dist) => {
  const d = Number(dist) || 0;
  if (d <= 2) return 20;
  if (d <= 5) return 30;
  if (d <= 8) return 40;
  if (d <= 12) return 50;
  if (d <= 15) return 60;
  return 60 + Math.ceil(d - 15) * 10;
};

const MapController = ({ points, roadRoute }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const validPoints = points.filter(
      (p) => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng)
    );

    if (roadRoute && roadRoute.length > 0) {
      const bounds = L.latLngBounds(roadRoute);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (validPoints.length > 1) {
      const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    return () => clearTimeout(timer);
  }, [points, roadRoute, map]);

  return null;
};

const DeliveryLiveMap = ({ riderLoc, sellerLoc, customerLoc, distanceKm }) => {
  const [roadCoordinates, setRoadCoordinates] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(distanceKm);
  const [finalCustomerCoords, setFinalCustomerCoords] = useState({
    lat: customerLoc?.lat || null,
    lng: customerLoc?.lng || null,
  });

  const sLat = Number(sellerLoc?.lat) || 22.6306;
  const sLng = Number(sellerLoc?.lng) || 88.6646;

  // ১. ঠিকানার টেক্সট থেকে সঠিক Lat/Lng খুঁজে বের করা (Geocoding)
  useEffect(() => {
    const findExactCoords = async () => {
      // যদি ডাটাবেজেই আসল কোঅর্ডিনেট থাকে তবে সেটাই ব্যবহার হবে
      if (customerLoc?.lat && customerLoc?.lng && customerLoc.lat !== 22.6390) {
        setFinalCustomerCoords({ lat: Number(customerLoc.lat), lng: Number(customerLoc.lng) });
        return;
      }

      // টেক্সট অ্যাড্রেস দিয়ে সঠিক লোকেশন সার্চ
      if (customerLoc?.address) {
        try {
          const searchQuery = encodeURIComponent(customerLoc.address);
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1`
          );
          const geoData = await geoRes.json();

          if (geoData && geoData.length > 0) {
            setFinalCustomerCoords({
              lat: parseFloat(geoData[0].lat),
              lng: parseFloat(geoData[0].lon),
            });
            return;
          }
        } catch (e) {
          console.warn('Geocoding search failed:', e);
        }
      }

      // না পাওয়া গেলে ডিফল্ট
      setFinalCustomerCoords({ lat: 22.6390, lng: 88.6750 });
    };

    findExactCoords();
  }, [customerLoc]);

  // ২. আসল বাঁকা রাস্তার রুট তৈরি
  useEffect(() => {
    if (!finalCustomerCoords.lat || !finalCustomerCoords.lng) return;

    const fetchRoadRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${finalCustomerCoords.lng},${finalCustomerCoords.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoadCoordinates(coords);
          const roadDist = (data.routes[0].distance / 1000).toFixed(1);
          setCalculatedDistance(Number(roadDist));
        }
      } catch (err) {
        setRoadCoordinates([[sLat, sLng], [finalCustomerCoords.lat, finalCustomerCoords.lng]]);
      }
    };

    fetchRoadRoute();
  }, [sLat, sLng, finalCustomerCoords]);

  const displayDistance = calculatedDistance || distanceKm || 1.8;

  return (
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200 text-xs flex items-center gap-3">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Driving Distance</p>
          <p className="text-slate-900 font-black text-sm">{displayDistance} km</p>
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Delivery Fee</p>
          <p className="text-emerald-600 font-black text-sm">
            ₹{getDeliveryFee(displayDistance)}
          </p>
        </div>
      </div>

      <MapContainer
        center={[sLat, sLng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />

        {/* সেলার মার্কার */}
        <Marker position={[sLat, sLng]} icon={sellerIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-blue-600">🏪 {sellerLoc?.name || 'Pickup Store'}</strong>
              <p className="text-slate-600">{sellerLoc?.address || 'Store address'}</p>
            </div>
          </Popup>
        </Marker>

        {/* কাস্টমার মার্কার (সঠিক জায়গায়) */}
        {finalCustomerCoords.lat && finalCustomerCoords.lng && (
          <Marker position={[finalCustomerCoords.lat, finalCustomerCoords.lng]} icon={customerIcon}>
            <Popup>
              <div className="text-xs">
                <strong className="text-red-600">📍 Customer Location</strong>
                <p className="text-slate-600">{customerLoc?.address}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* রাইডার লাইভ মার্কার */}
        {riderLoc?.lat && (
          <Marker position={[riderLoc.lat, riderLoc.lng]} icon={riderIcon}>
            <Popup>
              <span className="text-xs font-bold text-emerald-600">🛵 Delivery Boy</span>
            </Popup>
          </Marker>
        )}

        {/* রুট লাইন */}
        {roadCoordinates.length > 0 && (
          <Polyline positions={roadCoordinates} pathOptions={{ color: '#2563EB', weight: 5 }} />
        )}

        <MapController
          points={[
            { lat: sLat, lng: sLng },
            finalCustomerCoords.lat ? finalCustomerCoords : null,
            riderLoc?.lat ? riderLoc : null,
          ]}
          roadRoute={roadCoordinates}
        />
      </MapContainer>
    </div>
  );
};

export default DeliveryLiveMap;
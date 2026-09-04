import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
    const [nearbyDist, setNearbyDist] = useState(5);

    // Component to handle map movement and auto-refresh items
    const MapEvents = () => {
        useMapEvents({
            moveend: (e) => {
                const center = e.target.getCenter();
                setMapCenter([center.lat, center.lng]);
                fetchNearbyItems(center.lng, center.lat);
            },
        });
        return null;
    };

    const fetchNearbyItems = async (lng, lat) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/items/nearby?lng=${lng}&lat=${lat}&dist=${nearbyDist}`);
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching nearby items', err);
        }
    };

    useEffect(() => {
        fetchNearbyItems(mapCenter[1], mapCenter[0]);
    }, []);

    return (
        <div className="relative h-[calc(100vh-73px)] w-full">
            {/* Search/Filter Overlay */}
            <div className="absolute top-4 left-4 z-[1000] flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 px-2 border-r">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="number"
                        value={nearbyDist}
                        onChange={(e) => setNearbyDist(e.target.value)}
                        className="w-16 outline-none text-sm"
                        placeholder="km"
                    />
                    <span className="text-xs text-gray-500">km</span>
                </div>
            </div>

            {/* Add Item Button */}
            {user && (
                <button
                    className="absolute bottom-8 right-8 z-[1000] bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110"
                    onClick={() => alert('Add item functionality coming in the next part!')}
                >
                    <Plus size={28} />
                </button>
            )}

            <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents />
                {items.map(item => (
                    <Marker key={item._id} position={[item.location.coordinates[1], item.location.coordinates[0]]}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-xs font-medium text-blue-600 mt-2">Owner: {item.owner?.username}</p>
                                <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">
                                    Request to Borrow
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Home;

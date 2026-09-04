import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { MapPin, Package } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddItem = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tools',
        images: [],
        coordinates: [0, 0]
    });
    const [locationSet, setLocationSet] = useState(false);
    const [loading, setLoading] = useState(false);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setFormData({ ...formData, coordinates: [e.latlng.lng, e.latlng.lat] });
                setLocationSet(true);
            },
        });

        return formData.coordinates && (
            <Marker position={[formData.coordinates[1], formData.coordinates[0]]} />
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!locationSet) {
            addToast('Please click on the map to set the location!', 'error');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/items', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Item listed successfully!', 'success');
            navigate('/');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to list item', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Package className="text-blue-600" /> List New Item
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Power Drill"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Tools">Tools</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            placeholder="Describe your item..."
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <MapPin size={16} /> Location
                        </label>
                        <div className={`p-3 rounded-lg border text-sm ${locationSet ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                            {locationSet
                                ? `Location set to: ${formData.coordinates[1].toFixed(4)}, ${formData.coordinates[0].toFixed(4)}`
                                : 'Please click on the map to set the location'}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                    >
                        {loading ? 'Listing Item...' : 'List Item Now'}
                    </button>
                </form>
            </div>

            <div className="h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                <div className="absolute top-4 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium text-gray-600 border">
                    Click map to set item location 📍
                </div>
                <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    className="h-full w-full"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    );
};

export default AddItem;

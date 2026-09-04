import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, User, MapPin, Calendar, MessageCircle } from 'lucide-react';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/items/${id}`);
                setItem(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load item details');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleRequestBorrow = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        setRequestLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/bookings', {
                itemId: id,
                startDate,
                endDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Request sent successfully! Wait for the owner to approve.');
            navigate('/my-bookings');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        } finally {
            setRequestLoading(false);
        }
    };

    const handleStartChat = async () => {
        setChatLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/conversations', {
                participantId: item.owner._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/chat/${res.data._id}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start chat');
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!item) return <div className="flex justify-center items-center h-screen">Item not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
            >
                <ArrowLeft size={20} /> Back to Map
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <Package size={64} />
                    )}
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>
                            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mt-2">
                                {item.category}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className={`font-bold ${item.status === 'available' ? 'text-green-500' : 'text-orange-500'}`}>
                                {item.status.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrow Item</h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                                        <Calendar size={12} /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                                        <Calendar size={12} /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-lg border border-gray-200">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {item.owner?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-gray-800 truncate">{item.owner?.username}</p>
                                    <p className="text-[10px] text-gray-500">Owner</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleRequestBorrow}
                                    disabled={requestLoading || item.status !== 'available'}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${
                                        requestLoading || item.status !== 'available'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                    }`}
                                >
                                    {requestLoading ? 'Sending...' : 'Request to Borrow'}
                                </button>
                                <button
                                    onClick={handleStartChat}
                                    disabled={chatLoading}
                                    className="w-full py-3 rounded-xl font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    {chatLoading ? 'Connecting...' : (
                                        <>
                                            <MessageCircle size={18} /> Chat with Owner
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;

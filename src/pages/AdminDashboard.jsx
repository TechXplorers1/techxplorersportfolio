
import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, push, set, remove, update, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut, Save, X, LayoutDashboard, Database } from 'lucide-react';
import { initialServices } from '../seedData';

const AdminDashboard = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'identity', // identity, engineering
        features: '',
        icon: 'Star',
        highlight: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        const servicesRef = ref(database, 'services');
        const unsubscribe = onValue(servicesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const servicesList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setServices(servicesList);
            } else {
                setServices([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            category: 'identity',
            features: '',
            icon: 'Star',
            highlight: false
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serviceData = {
            ...formData,
            features: typeof formData.features === 'string'
                ? formData.features.split(',').map(f => f.trim()).filter(f => f)
                : formData.features
        };

        try {
            if (editingId) {
                const serviceRef = ref(database, `services/${editingId}`);
                await update(serviceRef, serviceData);
            } else {
                const servicesRef = ref(database, 'services');
                const newServiceRef = push(servicesRef);
                await set(newServiceRef, serviceData);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Error saving service");
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            ...service,
            features: Array.isArray(service.features) ? service.features.join(', ') : service.features
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            const serviceRef = ref(database, `services/${id}`);
            await remove(serviceRef);
        }
    };

    const handleSeedData = async () => {
        if (window.confirm("This will add initial data to your database. Continue?")) {
            try {
                const servicesRef = ref(database, 'services');

                for (const service of initialServices) {
                    const newServiceRef = push(servicesRef);
                    await set(newServiceRef, service);
                }
                alert("Database seeded successfully!");
            } catch (error) {
                console.error("Error seeding database:", error);
                alert("Failed to seed database: " + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="bg-slate-900 text-white p-6 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-indigo-400" />
                        <h1 className="text-xl font-black uppercase tracking-widest">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSeedData}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition"
                        >
                            <Database size={16} /> Seed Data
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-12">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-32">
                            <h2 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                {editingId ? <Edit2 size={18} className="text-indigo-600" /> : <Plus size={18} className="text-indigo-600" />}
                                {editingId ? 'Edit Service' : 'Add New Service'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="identity">Professional Identity (Identity)</option>
                                        <option value="engineering">Engineering (Product)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Smart Resume"
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Service description..."
                                        rows="3"
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (Opt)</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="$30"
                                            className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Icon Name</label>
                                        <input
                                            type="text"
                                            name="icon"
                                            value={formData.icon}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Star, Terminal"
                                            className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Features (comma separated)</label>
                                    <input
                                        type="text"
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        placeholder="Feature 1, Feature 2..."
                                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="highlight"
                                        checked={formData.highlight}
                                        onChange={handleInputChange}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label className="text-xs font-bold uppercase text-slate-500">Highlight Card (Dark Style)</label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition"
                                    >
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {loading ? (
                            <div className="text-center py-12 text-slate-400 font-medium">Loading services...</div>
                        ) : (
                            <>
                                {/* Identity Section */}
                                <div>
                                    <h3 className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4 border-b border-indigo-100 pb-2">Professional Identity Services</h3>
                                    <div className="space-y-4">
                                        {services.filter(s => s.category === 'identity').map(service => (
                                            <ServiceItem key={service.id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
                                        ))}
                                        {services.filter(s => s.category === 'identity').length === 0 && <p className="text-sm text-slate-400 italic">No services added yet.</p>}
                                    </div>
                                </div>

                                {/* Engineering Section */}
                                <div>
                                    <h3 className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4 border-b border-indigo-100 pb-2">Engineering Services</h3>
                                    <div className="space-y-4">
                                        {services.filter(s => s.category === 'engineering').map(service => (
                                            <ServiceItem key={service.id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
                                        ))}
                                        {services.filter(s => s.category === 'engineering').length === 0 && <p className="text-sm text-slate-400 italic">No services added yet.</p>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

const ServiceItem = ({ service, onEdit, onDelete }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start group hover:border-indigo-200 transition-all">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg text-slate-900">{service.title}</h4>
                {service.highlight && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">Highlighted</span>}
            </div>
            <p className="text-sm text-slate-500 mb-2 line-clamp-2">{service.description}</p>
            <div className="flex gap-2">
                {service.price && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{service.price}</span>}
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">{service.icon} Icon</span>
            </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(service)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(service.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);

export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import {
    FileText, Globe, Briefcase, Linkedin, ShieldCheck,
    Code, Rocket, Users, CheckCircle, ArrowRight,
    Terminal, Monitor, Mail, ChevronRight, Play, Star,
    Cpu, Award, HelpCircle
} from 'lucide-react';
import { database } from '../firebase';
import { ref, get, child } from 'firebase/database';

// Helper to resolve icon name to component
const IconMap = {
    FileText, Globe, Briefcase, Linkedin, ShieldCheck,
    Code, Rocket, Users, CheckCircle, ArrowRight,
    Terminal, Monitor, Mail, ChevronRight, Play, Star,
    Cpu, Award
};

const DynamicIcon = ({ name, className, size = 24 }) => {
    const IconComponent = IconMap[name] || HelpCircle;
    return <IconComponent className={className} size={size} />;
};

const Home = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, `services`));

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Convert object to array for mapping
                    const servicesList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setServices(servicesList);
                } else {
                    console.log("No data available");
                    setServices([]);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoadingError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);


    const identityServices = services.filter(s => s.category === 'identity');
    const engineeringServices = services.filter(s => s.category === 'engineering');

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] text-slate-500">Loading experience... (Please wait)</div>;
    }

    if (loadingError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F4] text-slate-500 p-4 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
                <p className="text-red-500 mb-4">{loadingError}</p>
                <p className="text-sm mb-6 max-w-md">Ensure your Firebase configuration in <code>src/firebase.js</code> is correct and Firestore Database is enabled in the Firebase Console.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 transition"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans selection:bg-indigo-100">

            {/* PAGE 1: THE COVER */}
            <section className="h-screen flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-7xl h-full bg-white border border-slate-200 shadow-2xl rounded-[2rem] flex flex-col md:flex-row overflow-hidden">
                    <div className="flex-1 p-12 md:p-24 flex flex-col justify-between">
                        <div>
                            <div className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-8">Service Portfolio // 2025</div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                                TECH<br />XPLORERS.
                            </h1>
                            <p className="text-xl text-slate-500 max-w-md font-medium leading-snug">
                                Accelerating professional identity, career management, and digital product engineering.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="h-px w-20 bg-slate-900"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Section 01: Identity</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-900 relative">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                            className="w-full h-full object-cover opacity-60 grayscale"
                            alt="Corporate"
                        />
                        <div className="absolute bottom-12 left-12 right-12 text-white">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-light italic opacity-50 underline decoration-indigo-500 underline-offset-8">Consultancy.</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Page 01</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PAGE 2: PROFESSIONAL IDENTITY (THE "WHAT") */}
            <section className="py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

                    {/* Dynamic Identity Services */}
                    {identityServices.map((service) => (
                        service.highlight ? (
                            <div key={service.id} className="bg-indigo-600 text-white p-12 rounded-[2.5rem] flex flex-col justify-between h-[500px] shadow-2xl shadow-indigo-100">
                                <DynamicIcon name={service.icon} size={32} />
                                <div>
                                    <h2 className="text-4xl font-black mb-6 leading-none italic uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 italic underline underline-offset-4 decoration-indigo-400">
                                        {service.description}
                                    </p>
                                    {service.features && service.features.length > 0 && (
                                        <ul className="text-[10px] font-black uppercase tracking-widest space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx}>— {feature}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div key={service.id} className="bg-white p-12 border border-slate-200 rounded-[2.5rem] flex flex-col justify-between h-[500px]">
                                <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Managed Content</span>
                                <div>
                                    <h2 className="text-4xl font-black mb-6 leading-none uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <span className="font-bold text-lg">{service.price}</span>
                                        <span className="text-[10px] font-black uppercase text-indigo-600 underline">Get Started</span>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}

                    {/* Fallback if no services loaded (optional, helpful for first run) */}
                    {identityServices.length === 0 && (
                        <div className="lg:col-span-3 text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                            <p className="text-slate-400 font-medium">No Identity Services Found. Add them in the Admin Dashboard.</p>
                        </div>
                    )}

                </div>
            </section>

            {/* PAGE 3: THE TECHNICAL STACK (ENGINEERING) */}
            <section className="py-24 px-6 md:px-12 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 flex items-center justify-between border-b border-slate-900 pb-10">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Engineering.</h2>
                        <div className="text-right hidden md:block">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Section 02 // Product & Growth</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-20">
                        {/* Dynamic Engineering Services */}
                        {engineeringServices.map((service) => (
                            service.highlight ? (
                                <div key={service.id} className="bg-indigo-600 text-white p-12 rounded-[2.5rem] flex flex-col justify-between h-[500px] shadow-2xl shadow-indigo-100">
                                    <DynamicIcon name={service.icon} size={32} />
                                    <div>
                                        <h2 className="text-4xl font-black mb-6 leading-none italic uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                        <p className="text-indigo-100 text-sm leading-relaxed mb-6 italic underline underline-offset-4 decoration-indigo-400">
                                            {service.description}
                                        </p>
                                        {service.features && service.features.length > 0 && (
                                            <ul className="text-[10px] font-black uppercase tracking-widest space-y-2">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx}>— {feature}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div key={service.id} className="bg-[#F8F9FA] p-12 border border-slate-200 rounded-[2.5rem] flex flex-col justify-between h-[500px]">
                                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Product Service</span>
                                    <div>
                                        <h2 className="text-4xl font-black mb-6 leading-none uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                                            <DynamicIcon name={service.icon} size={20} className="text-indigo-600" />
                                            <span className="text-[10px] font-black uppercase text-indigo-600 underline">Learn More</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}

                        {/* Fallback if no services loaded */}
                        {engineeringServices.length === 0 && (
                            <div className="lg:col-span-3 text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                                <p className="text-slate-400 font-medium">No Engineering Services Found. Add them in the Admin Dashboard.</p>
                            </div>
                        )}
                    </div>

                    {/* Business Idea Lab Banner */}
                    <div className="bg-slate-900 p-12 rounded-[3rem] relative group overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <Rocket className="text-indigo-400" />
                                    <h4 className="text-3xl font-black text-white uppercase leading-none italic">Business Idea Lab.</h4>
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                    Do you have a concept? Let's build it together. Join our projects as an intern to learn Scrum, Product Ownership, and Tech Strategy.
                                </p>
                            </div>
                            <button className="whitespace-nowrap bg-white text-slate-900 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300">
                                Start Collaborating
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10 scale-150 rotate-12">
                            <Cpu size={300} className="text-white" />
                        </div>
                    </div>
                </div>
            </section>

            {/* PAGE 4: THE PARTNERSHIP */}
            <section className="py-32 px-6 md:px-12 bg-slate-900 text-white text-center rounded-t-[4rem] mx-4 md:mx-10 mt-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="inline-block px-6 py-2 border border-white/20 rounded-full font-bold text-[10px] uppercase tracking-widest">
                        Refer & Earn Commissions
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">Join Our <br /> Network.</h2>
                    <p className="text-indigo-100 text-lg leading-relaxed italic opacity-80">
                        "Refer a software project and get rewarded. Stay involved in the build to gain real-world experience while you earn."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-4 group cursor-pointer hover:bg-white/10 transition">
                            <Users size={32} className="text-indigo-400" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Refer a Project</span>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-4 group cursor-pointer hover:bg-white/10 transition">
                            <Linkedin size={32} className="text-indigo-400" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Profile Strategy</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="p-12 text-center bg-slate-900 border-t border-white/5">
                <div className="font-black text-white uppercase tracking-tighter text-3xl mb-4">TechXplorers.</div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Precision Engineered Career Growth // 2025 Edition</p>
            </footer>
        </div>
    );
};

export default Home;

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

const WhatsAppIcon = ({ size = 24, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const Home = () => {
    const WHATSAPP_NUMBER = "9618108329"; // TODO: Replace with actual number
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
            <section className="min-h-screen flex items-center justify-center p-6 md:p-12 py-20">
                <div className="w-full max-w-7xl min-h-[80vh] bg-white border border-slate-200 shadow-2xl rounded-[2rem] flex flex-col md:flex-row overflow-hidden">
                    <div className="flex-1 p-8 py-12 md:p-20 flex flex-col justify-between">
                        <div>
                            <div className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-8">Service Portfolio // 2025</div>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
                                TECH<br />XPLORERS.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 max-w-md font-medium leading-snug">
                                Accelerating professional identity, career management, and digital product engineering.
                            </p>
                        </div>

                    </div>
                    <div className="flex-1 bg-slate-900 relative min-h-[50vh] md:min-h-0">
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

            {/* PAGE 2: SERVICES */}
            <section className="py-16 md:py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 md:mb-20 flex items-center justify-between border-b border-slate-900 pb-10">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter">Our Services.</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* All Services */}
                        {services.map((service) => (
                            service.highlight ? (
                                <div key={service.id} className="bg-indigo-600 text-white p-6 md:p-8 rounded-[2rem] flex flex-col h-auto md:h-[380px] shadow-2xl shadow-indigo-100 relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-6">
                                            <DynamicIcon name={service.icon} size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-black mb-4 leading-none italic uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                            <p className="text-indigo-100 text-sm leading-relaxed mb-4 italic underline underline-offset-4 decoration-indigo-400">
                                                {service.description}
                                            </p>
                                            {service.features && service.features.length > 0 && (
                                                <ul className="text-[10px] font-black uppercase tracking-widest space-y-2 mt-4">
                                                    {service.features.map((feature, idx) => (
                                                        <li key={idx}>— {feature}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div key={service.id} className="bg-white p-6 md:p-8 border border-slate-200 rounded-[2rem] flex flex-col h-auto md:h-[380px]">
                                    <div className="flex-1">
                                        <span className="block text-indigo-600 font-bold uppercase tracking-widest text-[10px] mb-6">Managed Content</span>
                                        <h2 className="text-3xl font-black mb-4 leading-none uppercase" dangerouslySetInnerHTML={{ __html: service.title.replace(/\n/g, '<br/>') }} />
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                            {service.description}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <span className="font-bold text-lg">{service.price}</span>
                                        <a
                                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in the ${service.title} service.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black uppercase text-indigo-600 underline"
                                        >
                                            Contact Us
                                        </a>
                                    </div>
                                </div>
                            )
                        ))}



                        {/* Fallback if no services loaded */}
                        {services.length === 0 && (
                            <div className="lg:col-span-3 text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                                <p className="text-slate-400 font-medium">No Services Found. Add them in the Admin Dashboard.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PAGE 3: COLLABORATION (Previously Engineering Section Wrapper was here) */}
            <section className="py-16 md:py-24 px-6 md:px-12 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto">

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
            <section className="py-20 md:py-32 px-6 md:px-12 bg-slate-900 text-white text-center rounded-t-[3rem] md:rounded-t-[4rem] mx-4 md:mx-10 mt-12 md:mt-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="inline-block px-6 py-2 border border-white/20 rounded-full font-bold text-[10px] uppercase tracking-widest">
                        Refer & Earn Commissions
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter italic">Join Our <br /> Network.</h2>
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

            {/* WhatsApp Floating Action Button */}
            <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I have a query.`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 z-50 hover:scale-110"
                title="Chat on WhatsApp"
            >
                <WhatsAppIcon size={32} />
            </a>
        </div >
    );
};

export default Home;

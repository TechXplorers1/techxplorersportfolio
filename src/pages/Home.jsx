import React, { useState, useEffect } from 'react';
import {
    FileText, Globe, Briefcase, Linkedin, ShieldCheck,
    Code, Rocket, Users, CheckCircle, ArrowRight,
    Terminal, Monitor, Mail, ChevronRight, ChevronLeft, Play, Star,
    Cpu, Award, HelpCircle, X
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

// Create a map of filename -> image module
const imagesGlob = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true });
const imageMap = Object.keys(imagesGlob).reduce((acc, path) => {
    const filename = path.split('/').pop();
    acc[filename] = imagesGlob[path].default;
    return acc;
}, {});

// Fallback for Gallery (if needed for background)
const galleryImages = Object.values(imageMap);

const Home = () => {
    const WHATSAPP_NUMBER = "9618108329"; // TODO: Replace with actual number
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null);

    // Gallery State
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Modal State
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (galleryImages.length > 0 && !isHovered) {
            const timer = setInterval(() => {
                setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [galleryImages.length, isHovered]);

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

    const openModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };


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

            {/* PAGE 1: SPLIT HERO (Text Left, Gallery Right) */}
            <section className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-12">
                <div className="w-full max-w-7xl min-h-[85vh] bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden relative">

                    {/* LEFT: Content */}
                    <div className="flex-1 p-8 py-12 md:p-16 lg:p-20 flex flex-col justify-between z-10 bg-white">
                        <div>
                            <div className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-8">Service Portfolio // 2025</div>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-900">
                                TECH<br />XPLORERS.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 max-w-lg font-medium leading-relaxed mb-8">
                                Accelerating professional identity through elite CV & LinkedIn branding. We drive business growth with custom software, digital marketing, and cybersecurity solutions, while empowering careers via practical internships and expert training.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scroll to Explore</span>
                            <ArrowRight size={16} className="text-indigo-600" />
                        </div>
                    </div>

                    {/* RIGHT: Gallery Showcase */}
                    <div className="flex-1 bg-slate-900 relative min-h-[50vh] lg:min-h-0 overflow-hidden group">
                        {galleryImages.length > 0 ? (
                            <>
                                {/* Blurred Background */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={galleryImages[galleryIndex]}
                                        className="w-full h-full object-cover blur-md opacity-40 scale-110"
                                        alt="Background"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                                </div>

                                {/* Main Image Container - CENTERED & UNCROPPED */}
                                <div
                                    className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-10 cursor-pointer"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I am interested in this service: Asset ${galleryIndex + 1}`, '_blank')}
                                >
                                    <div className="relative w-full h-full flex items-center justify-center group/image">
                                        <img
                                            src={galleryImages[galleryIndex]}
                                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-500 ease-out group-hover/image:scale-105"
                                            alt={`Gallery Image ${galleryIndex + 1}`}
                                        />

                                        {/* Hover Overlay - No Blur, Just Button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                            <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300 border border-slate-100">
                                                Contact Us
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <button
                                    onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <button
                                    onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Footer Info / Decoration */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent pt-16">
                                    <div className="text-white">
                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Services</span>
                                        <div className="text-2xl font-black">{galleryIndex + 1 < 10 ? `0${galleryIndex + 1}` : galleryIndex + 1}</div>
                                    </div>

                                    {/* Dots */}
                                    <div className="flex gap-1.5">
                                        {galleryImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setGalleryIndex(idx)}
                                                className={`h-1 rounded-full transition-all duration-300 ${idx === galleryIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-white/30 hover:bg-white'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                                <p>No Images</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PAGE 2: SERVICES - ADMIN MANAGED MASONRY */}
            <section className="py-16 md:py-24 px-6 md:px-12" id="services">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 md:mb-20 flex items-center justify-between border-b border-slate-900 pb-10">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter">Our Services.</h2>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

                        {/* Map over SERVICES from DB, extracting Image via imagePath */}
                        {services.filter(s => s.imagePath && imageMap[s.imagePath]).map((service) => {
                            const imageSrc = imageMap[service.imagePath];
                            return (
                                <div
                                    key={service.id}
                                    className="break-inside-avoid group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                    onClick={() => openModal(service)}
                                >
                                    <div className="p-2">
                                        <div className="rounded-2xl overflow-hidden relative">
                                            <img
                                                src={imageSrc}
                                                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                alt={service.title}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-lg">
                                            <span className="text-slate-900 font-bold text-xs uppercase tracking-widest">View Details</span>
                                            <div className="bg-indigo-600 p-2 rounded-full text-white">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {services.length === 0 && (
                            <div className="lg:col-span-3 text-center py-20">
                                <p className="text-slate-400">Loading Services from Admin...</p>
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
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'd like to refer a software project.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-4 group cursor-pointer hover:bg-white/10 transition"
                        >
                            <Users size={32} className="text-indigo-400" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Refer a Project</span>
                        </a>
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

            {/* SERVICE DETAIL MODAL */}
            {isModalOpen && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />

                    {/* Modal Content */}
                    <div className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row animate-fadeIn">

                        {/* Left: Image */}
                        <div className="flex-1 bg-slate-100 relative min-h-[40vh] md:min-h-[70vh] p-8 flex items-center justify-center">
                            {selectedService.imagePath && imageMap[selectedService.imagePath] && (
                                <img
                                    src={imageMap[selectedService.imagePath]}
                                    alt={selectedService.title}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            )}
                            <button onClick={closeModal} className="absolute top-6 left-6 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white transition md:hidden">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto bg-white flex flex-col">
                            <div className="flex justify-end mb-4 hidden md:block">
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition">
                                    <span className="sr-only">Close</span>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-6">
                                    Service Details
                                </span>

                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight uppercase">
                                    {selectedService.title}
                                </h2>

                                <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8">
                                    {selectedService.description}
                                </p>

                                {selectedService.features && selectedService.features.length > 0 && (
                                    <div className="mb-10">
                                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Key Highlights</h4>
                                        <ul className="space-y-3">
                                            {selectedService.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                                                    <CheckCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price Estimate</div>
                                    <div className="text-2xl font-black text-slate-900">{selectedService.price || "Custom"}</div>
                                </div>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in ${selectedService.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-indigo-600 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <span>Enquire Now</span>
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Activity, Map, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', path: '/#features' },
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Insights', path: '/insights' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-deep-navy/80 backdrop-blur-lg border-white/5" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-teal to-blue-600 shadow-[0_0_20px_rgba(20,241,217,0.3)] group-hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all duration-300">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-neon-teal transition-colors">
                            Crime<span className="text-neon-teal">Lense</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-neon-teal transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-teal transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 rounded-lg bg-neon-teal/10 text-neon-teal border border-neon-teal/50 font-semibold hover:bg-neon-teal hover:text-deep-navy transition-all duration-300 shadow-[0_0_15px_rgba(20,241,217,0.2)] hover:shadow-[0_0_25px_rgba(20,241,217,0.4)]"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-deep-navy/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-neon-teal transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 rounded-xl bg-neon-teal text-deep-navy font-bold text-center shadow-[0_0_20px_rgba(20,241,217,0.3)] hover:shadow-[0_0_30px_rgba(20,241,217,0.5)] transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

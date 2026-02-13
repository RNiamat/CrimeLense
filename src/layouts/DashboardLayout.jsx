import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-deep-navy">
            <Sidebar />
            <main className="pl-20 md:pl-64 transition-all duration-300 min-h-screen">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={useLocation().pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

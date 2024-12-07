import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        // Show button when page is scrolled down half the viewport height
        const halfViewportHeight = window.innerHeight / 2;
        if (window.scrollY > halfViewportHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        // Add scroll event listener
        window.addEventListener('scroll', toggleVisibility);
        
        // Clean up the event listener
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                    }}
                    whileHover={{ 
                        scale: 1.1,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)'
                    }}
                    whileTap={{ scale: 0.9 }}
                >
                    <KeyboardArrowUpIcon fontSize="large" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopButton;
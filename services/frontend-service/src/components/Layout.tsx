
import React from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col"
    >
      <div className="flex-1 container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.div>
  );
};

export default Layout;

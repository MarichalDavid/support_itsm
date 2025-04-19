
import React from "react";
import { motion } from "framer-motion";
import LoginButton from "../components/LoginButton";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-8 max-w-2xl mx-auto"
        >
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Authentication Demo
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Secure Access with Keycloak
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-lg mx-auto">
              Experience seamless authentication with our premium, Apple-inspired interface.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <LoginButton className="mt-8" />
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Index;

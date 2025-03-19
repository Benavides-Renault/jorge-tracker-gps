
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import TrackingIdForm from '@/components/TrackingIdForm';

const TrackPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader className="border-b-0" />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 py-20 md:py-32">
          <motion.div 
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Search size={24} className="text-primary" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold">Rastrear servicio</h1>
              
              <p className="text-muted-foreground">
                Ingrese su número de rastreo para ver la ubicación actual de su servicio
                y el tiempo estimado de llegada.
              </p>
              
              <TrackingIdForm />
              
              <div className="pt-4 pb-2 px-4 border rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  Si no tiene un número de rastreo, puede generarlo desde la página principal.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default TrackPage;

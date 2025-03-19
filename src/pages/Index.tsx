
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import GenerateTrackingButton from '@/components/GenerateTrackingButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
          
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <motion.div 
                className="flex-1 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary">
                  <span className="animate-pulse-subtle mr-1">●</span> Servicio de emergencia en tiempo real
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                  Baterías Costa Rica
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-[600px]">
                  Ofrecemos servicios de emergencia en carretera con la capacidad de rastrear 
                  en tiempo real la ubicación de tu asistencia.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <GenerateTrackingButton />
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1 max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative aspect-square md:aspect-auto md:h-[500px] bg-gradient-to-br from-primary/20 to-background rounded-2xl overflow-hidden shadow-xl flex items-center justify-center p-8">
                  <Truck size={180} className="text-primary/40" strokeWidth={1} />
                  <div className="absolute inset-0 border border-primary/10 rounded-2xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Cómo funciona nuestro servicio</h2>
              <p className="text-muted-foreground">
                Simplificamos el proceso de asistencia en carretera con nuestro sistema de rastreo en tiempo real.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Truck className="h-10 w-10 text-primary" />,
                  title: "Solicita tu asistencia",
                  description: "Genera un número de rastreo único que te permitirá seguir la ubicación de tu servicio."
                },
                {
                  icon: <ChevronRight className="h-10 w-10 text-primary" />,
                  title: "Rastrea en tiempo real",
                  description: "Visualiza en el mapa la ubicación exacta de la grúa o asistencia que va en camino."
                },
                {
                  icon: <ChevronRight className="h-10 w-10 text-primary" />,
                  title: "Tiempo estimado de llegada",
                  description: "Conoce el tiempo aproximado que tardará la asistencia en llegar a tu ubicación."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-card border rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 bg-primary/10 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Index;

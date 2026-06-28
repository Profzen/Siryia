"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Briefcase, Map, Car, Sparkles } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Golden Accent Line at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-accent z-50" />

      {/* Navbar */}
      <nav className="fixed top-1 w-full z-40 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary-600">Siryia</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="/marketplace" className="hover:text-[#D49A25] transition-colors">Marketplace</a>
            <a href="/services" className="hover:text-[#D49A25] transition-colors">Services</a>
            <a href="/annuaire" className="hover:text-[#D49A25] transition-colors">Annuaire</a>
          </div>
          <a href="/login" className="px-5 py-2.5 rounded bg-primary-600 text-white hover:bg-primary-900 text-sm font-medium transition-all">
            Connexion
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24 lg:pt-52 lg:pb-32 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#D49A25] text-sm font-medium mb-8 border border-orange-100"
        >
          <span className="w-2 h-2 rounded-full bg-[#D49A25] animate-pulse" />
          <span>Lancement au Togo prochainement</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-slate-900"
        >
          Le Hub Africain du <br className="hidden md:block" />
          <span className="text-primary-600">Commerce & Services</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Une plateforme SaaS unique regroupant marketplace, recrutement, services professionnels et annuaire. Fluide, sécurisée et pensée pour l'Afrique.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a href="/annuaire" className="w-full sm:w-auto px-8 py-4 rounded bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all">
            Explorer l'écosystème
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/login" className="w-full sm:w-auto px-8 py-4 rounded border border-slate-200 text-slate-700 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            Devenir partenaire
          </a>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {[
          { icon: ShoppingBag, title: "Marketplace", desc: "Achetez et vendez facilement avec paiement sécurisé (Escrow)." },
          { icon: Briefcase, title: "Services", desc: "Trouvez des prestataires qualifiés pour toutes vos missions." },
          { icon: Map, title: "Annuaire", desc: "Trouvez les meilleurs spécialistes de votre région." },
          { icon: Car, title: "Véhicules", desc: "Location et achat de véhicules avec état des lieux numérique." }
        ].map((feat, i) => (
          <motion.div key={i} variants={itemVariants} className="pro-card p-8 rounded-xl group hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
              <feat.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">{feat.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}

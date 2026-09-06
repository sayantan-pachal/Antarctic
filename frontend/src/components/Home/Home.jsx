// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Cpu, 
  Network, 
  Zap, 
  Snowflake, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  Code2, 
  Server,
  Gauge,
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
  Wind
} from 'lucide-react';
import Logo from '../../../public/Logo';
import ThemeToggle from '../context/ThemeToggle';

// ==========================================
// 1. PUBLIC HEADER
// ==========================================
function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => scrollToSection('engine')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Simulation Engine
            </button>
            <button 
              onClick={() => scrollToSection('architecture')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button 
              onClick={() => scrollToSection('modules')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Subsystems
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/auth" 
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(8,145,178,0.2)] dark:shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.3)]"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">System Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 2. PUBLIC FOOTER
// ==========================================
function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t-4 border-orange-500 font-sans pt-16 pb-8 transition-colors duration-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">About Polar Twin</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A comprehensive digital twin simulation engine modeling interdependent telemetry and supply chain workflows for extreme-environment research stations in Antarctica.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#engine" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Simulation Engine</a></li>
              <li><a href="#architecture" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">System Architecture</a></li>
              <li><a href="#modules" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Subsystems</a></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Organization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <strong>National Centre for Polar and Ocean Research (NCPOR)</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ministry of Earth Sciences, India
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-300 dark:border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-500">
            <span>&copy; {currentYear} Polar Twin Systems. All rights reserved.</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-500">SIH26060 | SYS_V1.0.0</span>
            <span>Project Showcase for Smart India Hackathon 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// 3. HERO SECTION
// ==========================================
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      
      {/* Gradient Blur Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-8 shadow-sm hover:shadow-md transition-shadow">
          <Code2 className="w-3.5 h-3.5" />
          Full-Stack Architecture
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
          Digital Twin <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
            Simulation Engine
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          This is not just a frontend. <strong>Polar Twin</strong> is a robust software engine designed to mathematically simulate telemetry, interdependent logic, and supply chain workflows for extreme-environment research stations in Antarctica.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            to="/auth" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-cyan-50 transition-all hover:shadow-lg flex items-center justify-center gap-2 shadow-lg"
          >
            Access Simulation <ArrowRight className="w-4 h-4" />
          </Link>
          <a 
            href="#engine" 
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:shadow-md text-center"
          >
            View Architecture
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">2</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Research Stations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">30+</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Live Metrics</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">4</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Core Subsystems</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. SIMULATION ENGINE SECTION
// ==========================================
function SimulationEngineSection() {
  const features = [
    {
      icon: Server,
      title: "Data Simulation Layer",
      desc: "A custom mock-API infrastructure generates realistic telemetry points—from atmospheric pressure to diesel generator load—creating a living dataset for the platform."
    },
    {
      icon: Network,
      title: "Interdependent Logic",
      desc: "Subsystems talk to each other. If external temperature drops to -40°C, the software automatically increases HVAC power load and reduces estimated fuel runway."
    },
    {
      icon: ShieldAlert,
      title: "Logistics & Alerts",
      desc: "A fully functional supply chain system with Role-Based Access Control. Station managers request items, authorities approve them, and logistics tracks delivery in real-time."
    }
  ];

  return (
    <section id="engine" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 md:flex md:justify-between md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Behind the Simulation</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Without access to classified hardware at Antarctic research stations, we engineered a comprehensive software layer to mathematically model it. The platform dynamically generates JSON payloads that mimic physical sensors and backend logistical databases.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 dark:hover:border-cyan-500/30 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors shadow-sm">
                <feature.icon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 5. ARCHITECTURE SECTION
// ==========================================
function ArchitectureSection() {
  const features = [
    { text: "Protected routing with JWT/LocalStorage session management", icon: Shield },
    { text: "Global Event Bus for cross-module alert propagation", icon: Activity },
    { text: "Simulated asynchronous backend operations", icon: Gauge },
    { text: "Responsive, high-performance React architecture", icon: TrendingUp }
  ];

  return (
    <section id="architecture" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest">
              System Design
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Built for Scale and Reliability</h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              The software is architected to handle complex state management seamlessly. Using a centralized context provider, alarms triggered in the Infrastructure module instantly notify operators viewing the Energy or Logistics dashboards.
            </p>
            
            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="font-medium leading-relaxed">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* Additional Info */}
            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-6">
              <p className="text-sm text-cyan-900 dark:text-cyan-200">
                <strong>Real-time Updates:</strong> All data updates every 1-2 seconds without page refresh, ensuring operators always have current station status.
              </p>
            </div>
          </div>

          {/* Right: Visual Architecture */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
            
            <div className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col items-center justify-center shadow-lg p-12 min-h-[400px]">
              
              {/* Architecture Diagram */}
              <div className="w-full space-y-6">
                
                {/* Simulation Engine */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                  <Database className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Simulation Engine</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Environment, Energy, Infrastructure, Logistics</p>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 rotate-90" />
                </div>

                {/* Express Backend */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                  <Cpu className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Express Backend</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">REST APIs, Alert Logic, Health Scoring</p>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center">
                  <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 rotate-90" />
                </div>

                {/* React Dashboard */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <Activity className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                  <p className="font-bold text-slate-900 dark:text-white text-sm">React Frontend</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Real-time Visualization, Alerts, Charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 6. MODULES/SUBSYSTEMS SECTION
// ==========================================
function ModulesSection() {
  const modules = [
    { 
      name: "Infrastructure", 
      icon: ShieldAlert, 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-900/20",
      desc: "Module temperatures, HVAC status, fire alarms, structural health"
    },
    { 
      name: "Energy & Power", 
      icon: Zap, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-100 dark:bg-amber-900/20",
      desc: "Generator status, fuel levels, power load, battery backup"
    },
    { 
      name: "Environment", 
      icon: Snowflake, 
      color: "text-cyan-600 dark:text-cyan-400", 
      bg: "bg-cyan-100 dark:bg-cyan-900/20",
      desc: "Temperature, wind speed, visibility, blizzard warnings"
    },
    { 
      name: "Logistics", 
      icon: Network, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-900/20",
      desc: "Supply tracking, inventory management, personnel status"
    }
  ];

  return (
    <section id="modules" className="py-24 bg-white dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Core Subsystems</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Polar Twin simulates four interconnected subsystems, each with 7-10 real-time metrics that affect station operations.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, i) => (
            <div 
              key={i} 
              className="group bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 dark:hover:border-cyan-500/30 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`inline-block p-4 rounded-lg ${mod.bg} mb-6 group-hover:scale-110 transition-transform`}>
                <mod.icon className={`w-8 h-8 ${mod.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{mod.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Real-time Monitoring</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Flow Info */}
        <div className="mt-16 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Interdependent System</h4>
              <p className="text-slate-700 dark:text-slate-300">
                Changes in one subsystem cascade to others. For example: if external temperature drops below -50°C, the HVAC system increases power load, which depletes the battery faster, which triggers fuel consumption alerts. This interconnectedness is what makes Polar Twin a true digital twin simulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 7. MAIN HOME COMPONENT
// ==========================================
export default function Home() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      
      <PublicHeader />

      <main className="pt-20">
        <HeroSection />
        <SimulationEngineSection />
        <ArchitectureSection />
        <ModulesSection />
      </main>

      <PublicFooter />
    </div>
  );
}
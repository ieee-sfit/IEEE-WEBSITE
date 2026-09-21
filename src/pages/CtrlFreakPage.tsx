import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const CtrlFreakPage = () => {
  return (
    <div className="relative bg-[#050505] text-white min-h-[400vh] font-mono selection:bg-[#FF3333] selection:text-white overflow-x-hidden">
      
      {/* HEADER NAV */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-1">
          <span className="text-xs font-bold tracking-[0.2em] uppercase">IEEE × WIE</span>
          <a href="https://issb.sfit.ac.in" target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
            ISSB.SFIT.AC.IN ↗
          </a>
        </div>
        
        <div className="pointer-events-auto">
          <Link to="/ctrl-freak/info" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
            EVENT INFO ↗
          </Link>
        </div>
      </div>

      {/* 
        3D CANVAS BACKGROUND 
        The object does the visual heavy lifting. It occupies the right 45-50% of the viewport.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-end">
        <div className="w-full md:w-1/2 h-full opacity-40 flex items-center justify-center">
          {/* 3D Model goes here */}
        </div>
      </div>

      {/* NARRATIVE HTML OVERLAY */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HERO */}
        <section className="h-screen flex flex-col justify-center items-start w-full md:w-1/2">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase font-sans leading-none">
            Ctrl Freak
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mt-6 tracking-widest uppercase mb-16">
            Critical Point<br/>Or Mission
          </p>

          <div className="border-t border-gray-800 w-full max-w-sm pt-8 mb-16">
            <p className="text-sm text-gray-300 uppercase tracking-widest leading-loose">
              Four technical systems.
              <br/>
              Something is wrong.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <div 
              className="w-full flex items-center justify-between border border-white hover:bg-white hover:text-black transition-colors cursor-pointer px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase group"
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
            >
              <span>Begin Investigation</span>
              <span className="transform group-hover:translate-y-1 transition-transform">↓</span>
            </div>
          </div>
        </section>

        {/* ANOMALY 01 */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-6">
            <div className="text-[10px] text-gray-500 tracking-[0.2em]">ANOMALY 01 // ACOUSTIC INTERFERENCE</div>
            <h2 className="text-3xl font-sans tracking-tight uppercase">Phase cancellation failure.</h2>
            
            <div className="w-full h-px bg-gray-800 my-8"></div>
            
            <div className="font-mono text-sm max-w-md space-y-4">
              <div className="flex justify-between text-gray-400">
                <span className="tracking-widest">EXPECTED</span>
                <span>180.0° ± 2.0°</span>
              </div>
              <div className="flex justify-between text-[#FF3333]">
                <span className="tracking-widest">OBSERVED</span>
                <span>137.2°</span>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-800 text-[10px] text-[#FF3333] tracking-[0.2em]">
                STATUS: OUT OF RANGE
              </div>
            </div>
          </div>
        </section>

        {/* ANOMALY 02 */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-6">
            <div className="text-[10px] text-gray-500 tracking-[0.2em]">ANOMALY 02 // NETWORK SATURATION</div>
            <h2 className="text-3xl font-sans tracking-tight uppercase">Node overload detected.</h2>
            
            <div className="w-full h-px bg-gray-800 my-8"></div>
            
            <div className="font-mono text-sm max-w-md space-y-8">
              <div className="text-gray-500 text-xs">
                <div>Frankfurt ●</div>
                <div className="pl-8">╲</div>
                <div className="pl-12">● London</div>
                <div className="pl-8">╱</div>
                <div>Mumbai ●</div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-gray-400">
                  <span className="tracking-widest">TARGET LATENCY</span>
                  <span>&lt; 1.50 s</span>
                </div>
                <div className="flex justify-between text-[#FF3333]">
                  <span className="tracking-widest">CURRENT LATENCY</span>
                  <span>2.84 s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANOMALY 03 */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-6">
            <div className="text-[10px] text-gray-500 tracking-[0.2em]">ANOMALY 03 // OPTICAL RECOGNITION</div>
            <h2 className="text-3xl font-sans tracking-tight uppercase">Vision threshold impaired.</h2>
            
            <div className="w-full h-px bg-gray-800 my-8"></div>
            
            <div className="font-mono text-sm max-w-md space-y-4">
              <div className="flex justify-between text-gray-400">
                <span className="tracking-widest">REQUIRED CONFIDENCE</span>
                <span>&gt; 90.0%</span>
              </div>
              <div className="flex justify-between text-[#FF3333]">
                <span className="tracking-widest">CURRENT CONFIDENCE</span>
                <span>34.1%</span>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-800 text-[10px] text-gray-500 tracking-[0.2em]">
                FILTER: CONTRAST / BINARIZATION REQUIRED
              </div>
            </div>
          </div>
        </section>

        {/* ANOMALY 04 */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-6">
            <div className="text-[10px] text-gray-500 tracking-[0.2em]">ANOMALY 04 // LOGIC INTEGRITY</div>
            <h2 className="text-3xl font-sans tracking-tight uppercase">Emergency lockdown active.</h2>
            
            <div className="w-full h-px bg-gray-800 my-8"></div>
            
            <div className="font-mono text-sm max-w-md space-y-6">
              <div className="text-gray-500 text-xs leading-relaxed">
                <div>KEYCARD ──────┐</div>
                <div>              │</div>
                <div>PRESSURE ─────┼── [ AND ] ──┐</div>
                <div>              │             │</div>
                <div>SWITCH ───────┘           [ XOR ] ──► ?</div>
              </div>

              <div className="flex justify-between text-[#FF3333] pt-4 border-t border-gray-800">
                <span className="tracking-widest">CURRENT OUTPUT</span>
                <span>0 (LOCKED)</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYER 2: UNDERSTANDING */}
        <section className="min-h-screen py-32 flex flex-col justify-center items-center text-center w-full max-w-3xl mx-auto">
          <div className="border border-gray-800 p-12 md:p-24 bg-black/50 backdrop-blur-sm w-full">
            <h3 className="text-xs text-[#FF3333] tracking-[0.3em] mb-12">HOW THE SHIFT WORKS</h3>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 text-sm text-gray-400">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE A</span>
                <span className="text-xs">Rapid Checks</span>
                <span className="text-[10px] mt-2">1:30</span>
              </div>
              <div className="text-gray-700 hidden md:block">→</div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE B</span>
                <span className="text-xs">Core Incident</span>
                <span className="text-[10px] mt-2">4:30</span>
              </div>
              <div className="text-gray-700 hidden md:block">→</div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE C</span>
                <span className="text-xs">Launch Protocol</span>
                <span className="text-[10px] mt-2">6:00</span>
              </div>
            </div>

            <div className="text-4xl font-sans font-bold text-white mb-12">
              12:00
            </div>
            
            <div className="text-xs text-gray-500 tracking-widest leading-loose max-w-md mx-auto mb-16">
              FOUR STATIONS. A BROWSER-BASED SIMULATION.<br/>NO CODING BARRIERS. NO PASSIVE QUIZZES.
            </div>

            <Link to="/ctrl-freak/info" className="inline-block border border-white hover:bg-white hover:text-black transition-colors px-8 py-4 font-bold text-xs tracking-[0.2em] uppercase">
              View Event Details
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CtrlFreakPage;

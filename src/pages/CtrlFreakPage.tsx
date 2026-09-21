import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const CtrlFreakPage = () => {
  return (
    <div className="relative bg-[#050505] text-white min-h-[800vh] font-mono selection:bg-[#FF3333] selection:text-white overflow-x-hidden">
      
      {/* HEADER NAV */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">IEEE × WIE</span>
          <a href="https://issb.sfit.ac.in" target="_blank" rel="noreferrer" className="text-[10px] text-gray-700 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
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
        <div className="w-full md:w-1/2 h-full opacity-40 flex items-center justify-center border-l border-gray-900/30">
          {/* Persistent Three.js scene will go here, driven by scroll position */}
        </div>
      </div>

      {/* NARRATIVE HTML OVERLAY */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 00 - ARRIVAL (Hero) */}
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

        {/* 01 - WHAT ARE YOU LOOKING AT? */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2 pr-8">
          <h2 className="text-3xl font-sans tracking-tight uppercase mb-8">This isn't a quiz.</h2>
          <div className="w-12 h-px bg-[#FF3333] mb-8"></div>
          <p className="text-gray-400 leading-relaxed text-sm tracking-wide">
            Ctrl Freak puts your team inside four browser-based technical scenarios. 
            Each station gives you a system that isn't behaving as expected.
          </p>
          <p className="text-gray-400 leading-relaxed text-sm tracking-wide mt-4">
            Your job is to identify what is wrong, intervene, and get it back within its required limits.
          </p>
        </section>

        {/* 02 - ANC (Situation -> Intervention -> Result) */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-12">
            <div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-4">01 // GoAT ANC</div>
              <h2 className="text-3xl font-sans tracking-tight uppercase text-white">Active Noise Cancellation</h2>
              <p className="text-gray-400 text-sm mt-4">Two waves are failing to cancel.</p>
            </div>
            
            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-gray-800 pl-4">
              <div className="flex justify-between text-gray-500">
                <span>PHASE TARGET</span><span>180°</span>
              </div>
              <div className="flex justify-between text-[#FF3333]">
                <span>CURRENT</span><span>[ ILLUSTRATIVE: 137° ]</span>
              </div>
              <div className="flex justify-between text-gray-400 pt-2 border-t border-gray-800/50">
                <span>OUTPUT</span><span>82 dB</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              Phase shifts → Waveform aligns → Interference decreases
            </div>

            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-[#FF3333] pl-4">
              <div className="flex justify-between text-white">
                <span>OUTPUT</span><span>61 dB</span>
              </div>
              <div className="text-[#FF3333] tracking-widest pt-2">WITHIN LIMIT</div>
            </div>
          </div>
        </section>

        {/* 03 - NETWORK (Situation -> Intervention -> Result) */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-12">
            <div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-4">02 // F1 0-LAG STREAM</div>
              <h2 className="text-3xl font-sans tracking-tight uppercase text-white">Network Saturation</h2>
              <p className="text-gray-400 text-sm mt-4">Traffic is taking the wrong path.</p>
            </div>
            
            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-gray-800 pl-4">
              <div className="flex justify-between text-gray-500">
                <span>TARGET LATENCY</span><span>&lt; 1.50 s</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>TARGET LOAD</span><span>&lt; 80%</span>
              </div>
              <div className="flex justify-between text-[#FF3333] pt-2 border-t border-gray-800/50">
                <span>CURRENT LATENCY</span><span>[ ILLUSTRATIVE: 2.84 s ]</span>
              </div>
              <div className="flex justify-between text-[#FF3333]">
                <span>SERVER LOAD</span><span>78%</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              Reroute connection → Downgrade 4K to 1080p → Latency falls
            </div>

            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-[#FF3333] pl-4">
              <div className="flex justify-between text-white">
                <span>CURRENT LATENCY</span><span>1.21 s</span>
              </div>
              <div className="text-[#FF3333] tracking-widest pt-2">WITHIN LIMIT</div>
            </div>
          </div>
        </section>

        {/* 04 - VISION (Situation -> Intervention -> Result) */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-12">
            <div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-4">03 // eCHALLAN POLICE</div>
              <h2 className="text-3xl font-sans tracking-tight uppercase text-white">Optical Recognition</h2>
              <p className="text-gray-400 text-sm mt-4">The camera can't read the plate.</p>
            </div>
            
            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-gray-800 pl-4">
              <div className="flex justify-between text-gray-500">
                <span>REQUIRED CONFIDENCE</span><span>&gt; 90%</span>
              </div>
              <div className="flex justify-between text-[#FF3333] pt-2 border-t border-gray-800/50">
                <span>CONFIDENCE</span><span>[ ILLUSTRATIVE: 63% ]</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              Contrast ↑ → Binarization ↑ → Confidence climbs
            </div>

            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-[#FF3333] pl-4">
              <div className="flex justify-between text-gray-400">
                <span>CONFIDENCE</span><span>78%</span>
              </div>
              <div className="flex justify-between text-white">
                <span>CONFIDENCE</span><span>91%</span>
              </div>
              <div className="text-[#FF3333] tracking-widest pt-2 border-t border-gray-800/50">IDENTIFIED</div>
            </div>
          </div>
        </section>

        {/* 05 - LOGIC (Situation -> Intervention -> Result) */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <div className="space-y-12">
            <div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-4">04 // AREA 51</div>
              <h2 className="text-3xl font-sans tracking-tight uppercase text-white">Facility Lockdown</h2>
              <p className="text-gray-400 text-sm mt-4">The circuit output is wrong.</p>
            </div>
            
            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-gray-800 pl-4 text-gray-500 leading-relaxed">
              <div>INPUT ↓</div>
              <div>[ AND ] ↓</div>
              <div>[ XOR ] ↓</div>
              <div className="text-[#FF3333] pt-2 border-t border-gray-800/50">OUTPUT 0</div>
            </div>

            <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              One gate changes → Signal propagates → Output flips
            </div>

            <div className="font-mono text-xs max-w-sm space-y-4 border-l border-[#FF3333] pl-4">
              <div className="flex justify-between text-white">
                <span>OUTPUT</span><span>1</span>
              </div>
              <div className="text-[#FF3333] tracking-widest pt-2 border-t border-gray-800/50">SAFE STATE</div>
            </div>
          </div>
        </section>

        {/* 06 - THE COMMON THREAD */}
        <section className="min-h-screen py-32 flex flex-col justify-center w-full md:w-1/2">
          <h2 className="text-3xl font-sans tracking-tight uppercase mb-8">Different systems.<br/>Same problem.</h2>
          <div className="w-12 h-px bg-[#FF3333] mb-12"></div>
          
          <div className="space-y-6 text-sm tracking-widest uppercase font-bold text-gray-400">
            <div>OBSERVE <span className="text-gray-800 ml-4">↓</span></div>
            <div>IDENTIFY <span className="text-gray-800 ml-4">↓</span></div>
            <div>INTERVENE <span className="text-gray-800 ml-4">↓</span></div>
            <div className="text-white">VERIFY</div>
          </div>
        </section>

        {/* 07 - THE CLOCK */}
        <section className="min-h-screen py-32 flex flex-col justify-center items-center text-center w-full max-w-3xl mx-auto z-20 relative">
          <div className="bg-black/90 p-12 md:p-24 border border-[#FF3333]/20 w-full">
            <div className="text-6xl md:text-8xl font-sans font-bold text-[#FF3333] mb-4">
              12:00
            </div>
            <div className="text-sm tracking-[0.3em] uppercase text-white mb-16">
              12 Minutes.
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16 text-xs text-gray-400 uppercase tracking-widest">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE A</span>
                <span>Rapid Checks</span>
                <span className="text-[10px] mt-2 text-gray-600">01:30</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE B</span>
                <span>Core Incident</span>
                <span className="text-[10px] mt-2 text-gray-600">04:30</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold mb-2">MODULE C</span>
                <span>Launch Protocol</span>
                <span className="text-[10px] mt-2 text-gray-600">06:00</span>
              </div>
            </div>

            {/* 08 - CTA */}
            <Link to="/ctrl-freak/info" className="inline-block border border-white hover:bg-white hover:text-black transition-colors px-12 py-4 font-bold text-xs tracking-[0.2em] uppercase">
              Enter Ctrl Freak
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CtrlFreakPage;

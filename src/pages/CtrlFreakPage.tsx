import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SystemCore } from '../components/ctrl-freak/SystemCore';
import { AncStationUI } from '../components/ctrl-freak/AncStationUI';
import { NetworkStationUI } from '../components/ctrl-freak/NetworkStationUI';
import { VisionStationUI } from '../components/ctrl-freak/VisionStationUI';
import { LogicStationUI } from '../components/ctrl-freak/LogicStationUI';

import { useCtrlFreakStore } from '../store/useCtrlFreakStore';

const CtrlFreakPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hideUI } = useCtrlFreakStore(s => s.devSettings);
  
  // Track the scroll progress of the entire page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white h-[800vh] font-mono selection:bg-[#FF3333] selection:text-white overflow-x-hidden">
      {/* PORTRAIT OVERLAY FOR MOBILE */}
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center p-8 hidden portrait:flex md:portrait:hidden">
        <div className="w-16 h-16 mb-8 border-4 border-[#FF3333] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-sans tracking-tight uppercase text-white mb-4">Rotate Device</h2>
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase leading-relaxed max-w-xs mb-8">
          Ctrl Freak requires a landscape viewport for optimal system visibility and interaction.
        </p>
        <button
          className="px-8 py-4 bg-[#FF3333] text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors"
          onClick={async () => {
            try {
              if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
              }
              // @ts-ignore
              if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
                // @ts-ignore
                await window.screen.orientation.lock("landscape");
              }
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Enable Fullscreen
        </button>
      </div>

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
        This is now the unified System Core that evolves over the 8 scroll beats.
        It sits fixed under the scrolling narrative HTML.
      */}
      <div className="fixed inset-0 z-0">
        <SystemCore scrollProgress={scrollYProgress} />
      </div>

      {/* NARRATIVE HTML OVERLAYS (Heads Up Display) */}
      {!hideUI && (
      <div className="relative z-10 w-full px-8 md:px-24 pointer-events-none">
        
        {/* 00 - ARRIVAL (Hero) */}
        <section className="h-[100svh] flex flex-col justify-center items-start w-full md:w-1/2 pointer-events-auto">
          <div className="w-full max-h-[90svh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase font-sans leading-none mix-blend-difference">
              Ctrl Freak
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 mt-4 md:mt-6 tracking-widest uppercase mb-8 md:mb-16 mix-blend-difference">
              Incident Detected
            </p>

          <div className="border-t border-gray-800 w-full max-w-sm pt-4 md:pt-8 mb-8 md:mb-16 mix-blend-difference">
            <p className="text-sm text-gray-300 uppercase tracking-widest leading-loose">
              Systems: 4
              <br/>
              Status: UNSTABLE
            </p>
          </div>

          <div className="w-full max-w-sm">
            <div 
              className="w-full flex items-center justify-between border border-white bg-black/50 backdrop-blur-sm hover:bg-white hover:text-black transition-colors cursor-pointer px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase group"
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }}
            >
              <span>Begin Investigation</span>
              <span className="transform group-hover:translate-y-1 transition-transform">↓</span>
            </div>
          </div>
          </div>
        </section>

        {/* 01 - WHAT ARE YOU LOOKING AT? */}
        <section className="h-screen flex flex-col justify-center items-center w-full">
          <div className="text-center mix-blend-difference">
            <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tight uppercase mb-8">
              OBSERVE. IDENTIFY.<br/>INTERVENE. VERIFY.
            </h2>
          </div>
        </section>

        {/* 02 - ANC (LEFT) */}
        <section className="h-[100svh] w-full pointer-events-none relative z-20">
          <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2 scale-[0.65] md:scale-100 origin-left w-full max-w-md">
            <AncStationUI />
          </div>
        </section>

        {/* 03 - NETWORK (RIGHT) */}
        <section className="h-[100svh] w-full pointer-events-none relative z-20">
          <div className="absolute top-1/2 right-8 md:right-24 -translate-y-1/2 scale-[0.65] md:scale-100 origin-right w-full max-w-md flex justify-end">
            <NetworkStationUI />
          </div>
        </section>

        {/* 04 - VISION (LEFT) */}
        <section className="h-[100svh] w-full pointer-events-none relative z-20">
          <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2 scale-[0.65] md:scale-100 origin-left w-full max-w-md">
            <VisionStationUI />
          </div>
        </section>

        {/* 05 - LOGIC (RIGHT) */}
        <section className="h-[100svh] w-full pointer-events-none relative z-20">
          <div className="absolute top-1/2 right-8 md:right-24 -translate-y-1/2 scale-[0.65] md:scale-100 origin-right w-full max-w-md flex justify-end">
            <LogicStationUI />
          </div>
        </section>

        {/* 06 - THE CLOCK */}
        <section className="h-[100svh] w-full z-20 relative pointer-events-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.65] md:scale-100 origin-center bg-black/90 backdrop-blur-lg p-6 md:p-24 border border-[#FF3333]/20 w-full max-w-3xl text-center">
            <div className="text-6xl md:text-8xl font-sans font-bold text-[#FF3333] mb-4">
              12:00
            </div>
            
            <div className="text-xs text-white tracking-widest leading-loose mb-16 uppercase">
              SYSTEM STATUS <span className="text-gray-500">████████████████</span> NOMINAL<br/>
              READY FOR OPERATORS
            </div>

            <Link to="/ctrl-freak/info" className="inline-block border border-white hover:bg-white hover:text-black transition-colors px-12 py-4 font-bold text-xs tracking-[0.2em] uppercase">
              Enter Ctrl Freak
            </Link>
          </div>
        </section>

        {/* 07 - THE VOID (To let the 3D Clock stand alone) */}
        <section className="h-screen w-full pointer-events-none relative z-20"></section>

      </div>
      )}
      
      {/* DEV MENU (Hidden for production) 
      <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md border border-gray-800 p-4 font-mono text-[10px] text-gray-400 flex flex-col gap-2">
        <div className="font-bold text-white mb-2 uppercase tracking-widest border-b border-gray-800 pb-2">Dev Tools</div>
        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
          <input type="checkbox" checked={hideUI} onChange={(e) => setDevSetting('hideUI', e.target.checked)} className="accent-[#FF3333]" />
          Hide UI Overlay
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
          <input type="checkbox" checked={hideCore} onChange={(e) => setDevSetting('hideCore', e.target.checked)} className="accent-[#FF3333]" />
          Hide System Core
        </label>
      </div>
      */}

    </div>
  );
};

export default CtrlFreakPage;

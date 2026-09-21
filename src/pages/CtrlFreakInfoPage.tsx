import React from 'react';
import { Link } from 'react-router-dom';

const CtrlFreakInfoPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-[#FF3333] selection:text-white">
      
      {/* HEADER NAV */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-1">
          <span className="text-xs font-bold tracking-[0.2em] uppercase">IEEE × WIE</span>
          <a href="https://issb.sfit.ac.in" target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
            ISSB.SFIT.AC.IN ↗
          </a>
        </div>
        
        <div className="pointer-events-auto">
          <Link to="/ctrl-freak" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
            ← RETURN TO INVESTIGATION
          </Link>
        </div>
      </div>

      <div className="pt-32 px-6 pb-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-sans uppercase font-bold tracking-tighter mb-4">Event Data</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase mb-16">Mosaic Technical Arena // Ctrl Freak</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* THE FACTS */}
          <div className="space-y-6 text-sm">
            <h2 className="text-xs text-[#FF3333] tracking-[0.2em] uppercase mb-8 border-b border-gray-800 pb-2">Logistics</h2>
            
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">VENUE</span>
              <span className="text-right">Lab 620 (Ground Floor Booth Entry)</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">TEAM SIZE</span>
              <span className="text-right">2 - 3 Players</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">FORMAT</span>
              <span className="text-right">Browser-based Simulation<br/><span className="text-gray-600 text-xs">Zero coding. Physical cheat sheets provided.</span></span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">PARTICIPATION FEE</span>
              <span className="text-right">₹50</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">THROUGHPUT</span>
              <span className="text-right">12 minutes per station</span>
            </div>
          </div>

          {/* THE RULES & REWARDS */}
          <div className="space-y-6 text-sm">
            <h2 className="text-xs text-[#FF3333] tracking-[0.2em] uppercase mb-8 border-b border-gray-800 pb-2">Protocols & Rewards</h2>
            
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p><strong className="text-white">Arcade Rewards:</strong> Post-shift scores earn instant scratch-off tickets. Prizes include stickers, origami shades, Hot Wheels, see-through mice, and paper crowns.</p>
              <p><strong className="text-white">Leaderboard:</strong> Unified cumulative leaderboard combining base accuracy and speed bonus (remaining seconds / 5).</p>
              <p><strong className="text-white">Grand Prize:</strong> Flagship Arduino Starter Kit and trophy for the #1 team.</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                Registration is handled via the central MOSAIC portal. 
                Login to acquire your entry QR.
              </p>
              <a 
                href="https://issb.sfit.ac.in" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-white text-black py-4 font-bold tracking-widest hover:bg-[#FF3333] hover:text-white transition-colors uppercase"
              >
                Proceed to MOSAIC Portal ↗
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CtrlFreakInfoPage;

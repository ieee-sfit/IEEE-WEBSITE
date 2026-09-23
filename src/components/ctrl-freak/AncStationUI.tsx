import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';
import { useEffect } from 'react';

export const AncStationUI = () => {
  const { phase, solved } = useCtrlFreakStore((state) => state.anc);
  const setAncPhase = useCtrlFreakStore((state) => state.setAncPhase);
  const checkAncSolved = useCtrlFreakStore((state) => state.checkAncSolved);

  useEffect(() => {
    checkAncSolved();
  }, [phase, checkAncSolved]);

  const error = Math.abs(phase - 180);
  
  let status = 'UNSTABLE';
  if (solved) status = 'NOMINAL';
  else if (error < 45) status = 'ALIGNING';

  return (
    <div className="space-y-12 bg-black/40 backdrop-blur-md p-8 border-l border-[#FF3333] pointer-events-auto">
      <div>
        <div className="text-[10px] text-[#FF3333] tracking-[0.2em] mb-4">01 // GoAT ANC</div>
        <h2 className="text-2xl font-sans tracking-tight uppercase text-white">Signal Integrity</h2>
      </div>
      
      <div className="font-mono text-xs max-w-sm space-y-4">
        <div className="text-gray-400 mb-6 uppercase tracking-widest leading-relaxed">
          OBSERVATION:<br/>Two periodic signals detected.
        </div>
        
        {/* TELEMETRY */}
        <div className="flex justify-between text-gray-500">
          <span>EXPECTED</span><span>180°</span>
        </div>
        <div className={`flex justify-between ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>OBSERVED</span><span>{phase}°</span>
        </div>
        <div className={`flex justify-between ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>ERROR</span><span>{error}°</span>
        </div>
        
        <div className={`flex justify-between pt-4 border-t border-gray-800/80 ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>STATUS</span><span className={solved ? '' : 'animate-pulse'}>{status}</span>
        </div>

        {/* INTERVENTION (Slider) */}
        <div className="pt-8">
          <label className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-4 block">Phase Offset Intervention</label>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={phase}
            onChange={(e) => setAncPhase(parseInt(e.target.value))}
            className="w-full appearance-none h-1 bg-gray-800 outline-none
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
          />
        </div>
      </div>
    </div>
  );
};

import { useEffect } from 'react';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

export const NetworkStationUI = () => {
  const { frankfurt, london, mumbai, solved, resolution, latency } = useCtrlFreakStore((state) => state.network);
  const setNetworkLoad = useCtrlFreakStore((state) => state.setNetworkLoad);
  const checkSolved = useCtrlFreakStore((state) => state.checkNetworkSolved);
  const setResolution = useCtrlFreakStore((state) => state.setNetworkResolution);

  useEffect(() => {
    checkSolved();
  }, [frankfurt, london, mumbai, resolution, checkSolved]);

  const total = frankfurt + london + mumbai;
  let status = 'UNSTABLE';
  if (solved) status = 'NOMINAL';
  else if (total > 110) status = 'OVERLOADED';
  else if (total < 90) status = 'UNDER-ALLOCATED';
  else if (mumbai > 40) status = 'MUMBAI CRITICAL';

  return (
    <div className="space-y-8 bg-black/60 backdrop-blur-md p-8 border-l border-[#FF3333] w-full max-w-lg pointer-events-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] text-[#FF3333] tracking-[0.2em] mb-4">05 // F1 0-LAG STREAM</div>
          <h2 className="text-2xl font-sans tracking-tight uppercase text-white">Bandwidth Matrix</h2>
        </div>
        
        {/* 4K / 1080p Toggle */}
        <div className="flex bg-gray-900 border border-gray-700 p-1 rounded-sm">
          <button 
            onClick={() => setResolution('1080p')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${resolution === '1080p' ? 'bg-[#FF3333] text-white' : 'text-gray-500 hover:text-white'}`}
          >
            1080p
          </button>
          <button 
            onClick={() => setResolution('4K')}
            className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${resolution === '4K' ? 'bg-[#FF3333] text-white' : 'text-gray-500 hover:text-white'}`}
          >
            4K
          </button>
        </div>
      </div>
      
      <div className="font-mono text-xs space-y-4">
        <div className="text-gray-400 mb-4 uppercase tracking-widest leading-relaxed">
          OBSERVATION:<br/>Direct global uplink failure. Regional relay nodes require manual load balancing.
        </div>
        
        <div className="text-[#FF3333] mb-6 uppercase tracking-widest leading-relaxed border border-[#FF3333]/30 bg-[#FF3333]/5 p-3 text-[10px]">
          [!] ACTION REQUIRED:<br/>Adjust region traffic sliders to drop latency below 1.5s.<br/>
          {resolution === '1080p' 
            ? '1080p stream requires balanced distribution across all nodes.' 
            : '4K stream requires massive bandwidth through Frankfurt. Keep Mumbai load low!'}
        </div>
        
        {/* TELEMETRY */}
        <div className={`flex justify-between ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>LATENCY</span><span>{latency.toFixed(1)}ms</span>
        </div>
        
        <div className={`flex justify-between ${total > 110 || total < 90 ? 'text-[#FF3333]' : 'text-gray-500'}`}>
          <span>TOTAL LOAD</span><span>{total}%</span>
        </div>

        <div className={`flex justify-between pt-4 border-t border-gray-800/80 ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>STATUS</span><span className={solved ? '' : 'animate-pulse'}>{status}</span>
        </div>

        {/* CONTROLS */}
        <div className="pt-8 space-y-6">
          
          <div>
            <div className="flex justify-between items-end text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">
              <div className="flex flex-col">
                <span>Frankfurt Relay</span>
                {frankfurt > 70 && <span className="text-[#FF3333] tracking-widest text-[8px]">[OVERLOADED]</span>}
                {resolution === '4K' && frankfurt < 60 && <span className="text-yellow-500 tracking-widest text-[8px]">[INSUFFICIENT INGEST]</span>}
                {resolution === '1080p' && Math.abs(frankfurt - 33) > 10 && frankfurt <= 70 && <span className="text-yellow-500 tracking-widest text-[8px]">[IMBALANCED]</span>}
              </div>
              <span>{frankfurt}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={frankfurt}
              onChange={(e) => setNetworkLoad('frankfurt', parseInt(e.target.value))}
              className="w-full appearance-none h-1 bg-gray-800 outline-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-end text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">
              <div className="flex flex-col">
                <span>London Relay</span>
                {london > 70 && <span className="text-[#FF3333] tracking-widest text-[8px]">[SATURATED]</span>}
                {resolution === '1080p' && Math.abs(london - 33) > 10 && london <= 70 && <span className="text-yellow-500 tracking-widest text-[8px]">[IMBALANCED]</span>}
              </div>
              <span>{london}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={london}
              onChange={(e) => setNetworkLoad('london', parseInt(e.target.value))}
              className="w-full appearance-none h-1 bg-gray-800 outline-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-end text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-2">
              <div className="flex flex-col">
                <span>Mumbai Relay (Corrupted)</span>
                {resolution === '4K' && mumbai > 15 && <span className="text-[#FF3333] tracking-widest text-[8px]">[OVERHEATING]</span>}
                {resolution === '1080p' && mumbai > 40 && <span className="text-[#FF3333] tracking-widest text-[8px]">[CRITICAL]</span>}
                {resolution === '1080p' && Math.abs(mumbai - 34) > 10 && mumbai <= 40 && <span className="text-yellow-500 tracking-widest text-[8px]">[IMBALANCED]</span>}
              </div>
              <span className={mumbai > 40 || (resolution === '4K' && mumbai > 15) ? 'text-[#FF3333]' : ''}>{mumbai}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={mumbai}
              onChange={(e) => setNetworkLoad('mumbai', parseInt(e.target.value))}
              className="w-full appearance-none h-1 bg-gray-800 outline-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

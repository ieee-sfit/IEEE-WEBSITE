import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCtrlFreakStore, GateType } from '../../store/useCtrlFreakStore';

export const LogicStationUI = () => {
  const { slot1, slot2, solved } = useCtrlFreakStore((state) => state.logic);
  const setSlot = useCtrlFreakStore((state) => state.setLogicSlot);
  const checkSolved = useCtrlFreakStore((state) => state.checkLogicSolved);

  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkSolved();
  }, [slot1, slot2, checkSolved]);

  const handleDragStart = (e: React.DragEvent, gate: GateType) => {
    e.dataTransfer.setData('gate', gate || '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, slotNum: 1 | 2) => {
    e.preventDefault();
    const gate = e.dataTransfer.getData('gate') as GateType;
    if (gate && ['AND', 'OR', 'NAND', 'XOR'].includes(gate)) {
      setSlot(slotNum, gate);
    }
  };

  const gates: GateType[] = ['AND', 'OR', 'NAND', 'XOR'];

  return (
    <div className="space-y-8 bg-black/60 backdrop-blur-md p-8 border-l border-[#FF3333] w-full max-w-lg pointer-events-auto">
      <div>
        <div className="text-[10px] text-[#FF3333] tracking-[0.2em] mb-4">04 // AREA 51 LOGIC</div>
        <h2 className="text-2xl font-sans tracking-tight uppercase text-white">Facility Lockdown</h2>
      </div>
      
      <div className="font-mono text-xs space-y-4">
        <div className="text-gray-400 mb-4 uppercase tracking-widest leading-relaxed">
          OBSERVATION:<br/>Main vault sealed. Logic circuit incomplete.
        </div>
        
        <div className="text-[#FF3333] mb-6 uppercase tracking-widest leading-relaxed border border-[#FF3333]/30 bg-[#FF3333]/5 p-3 text-[10px]">
          [!] ACTION REQUIRED:<br/>Insert correct hardware gates to bypass security lockout.
        </div>
        
        {/* TELEMETRY */}
        <div className={`flex justify-between pt-4 border-t border-gray-800/80 ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>SECURITY STATUS</span><span className={solved ? '' : 'animate-pulse'}>{solved ? 'UNLOCKED' : 'LOCKED'}</span>
        </div>

        {/* SLOTS & BREADBOARD */}
        <div className="pt-8">
          <div className="relative w-full h-[320px] border border-gray-800 bg-gray-900/50 overflow-hidden">
            {/* Decorative Breadboard grid */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
            />

            {/* SVG WIRING OVERLAY */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              {/* Keycard -> Gate 1 L-input */}
              <path d="M 16.6 15 L 16.6 35 L 28 35 L 28 42" stroke="#555" strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Pressure -> Gate 1 R-input */}
              <path d="M 50 15 L 50 30 L 38 30 L 38 42" stroke="#555" strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Gate 1 -> Gate 2 (Left Center to Left Center) */}
              <path d="M 43.3 50 L 56.6 50" stroke="#555" strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Switch -> Gate 2 (Top to Top Center) */}
              <path d="M 83.3 15 L 83.3 35 L 66.6 35 L 66.6 42" stroke="#555" strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke"/>
              {/* Gate 2 -> Output */}
              <path d="M 66.6 58 L 66.6 80" stroke="#555" strokeWidth={3} fill="none" vectorEffect="non-scaling-stroke"/>
            </svg>

            {/* HTML OVERLAY (Inputs, Gates, Output) */}
            
            {/* INPUTS */}
            <div className="absolute top-[8%] left-[16.6%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-[9px] tracking-widest uppercase text-gray-500 whitespace-nowrap">
              <span className="text-[#33FF33] font-bold">SIG_1</span>
              <span>(KEYCARD)</span>
            </div>
            
            <div className="absolute top-[8%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-[9px] tracking-widest uppercase text-gray-500 whitespace-nowrap">
              <span className="text-[#FF3333] font-bold">SIG_0</span>
              <span>(PRESSURE)</span>
            </div>

            <div className="absolute top-[8%] left-[83.3%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-[9px] tracking-widest uppercase text-gray-500 whitespace-nowrap">
              <span className="text-[#33FF33] font-bold">SIG_1</span>
              <span>(SWITCH)</span>
            </div>

            {/* GATES */}
            <div className="absolute top-[50%] left-[33.3%] -translate-x-1/2 -translate-y-1/2 space-y-2 text-center pointer-events-auto">
              <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">GATE 1</div>
              <div 
                ref={slot1Ref}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 1)}
                className={`w-20 h-12 border-2 flex items-center justify-center transition-colors text-sm font-bold bg-gray-900 cursor-pointer
                  ${slot1 ? 'border-[#33FF33] text-[#33FF33]' : 'border-dashed border-gray-600 text-gray-600'}`}
                onClick={() => slot1 && setSlot(1, null)}
              >
                {slot1 || 'EMPTY'}
              </div>
            </div>

            <div className="absolute top-[50%] left-[66.6%] -translate-x-1/2 -translate-y-1/2 space-y-2 text-center pointer-events-auto">
              <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">GATE 2</div>
              <div 
                ref={slot2Ref}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 2)}
                className={`w-20 h-12 border-2 flex items-center justify-center transition-colors text-sm font-bold bg-gray-900 cursor-pointer
                  ${slot2 ? 'border-[#33FF33] text-[#33FF33]' : 'border-dashed border-gray-600 text-gray-600'}`}
                onClick={() => slot2 && setSlot(2, null)}
              >
                {slot2 || 'EMPTY'}
              </div>
            </div>

            {/* OUTPUT */}
            <div className="absolute top-[85%] left-[66.6%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              <div className={`px-4 py-2 text-[10px] tracking-widest font-bold uppercase border bg-gray-900 ${solved ? 'border-[#33FF33] text-[#33FF33]' : 'border-[#FF3333] text-[#FF3333]'}`}>
                {solved ? 'OUTPUT: 1 (OPEN)' : 'OUTPUT: 0 (LOCKED)'}
              </div>
            </div>

          </div>
        </div>

        {/* INVENTORY */}
        <div className="pt-8">
          <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-4 text-center">Available Hardware</div>
          <div className="flex justify-center gap-4 flex-wrap">
            {gates.map((gate) => (
              <motion.div
                key={gate}
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, gate)}
                className="w-16 h-12 border border-[#FF3333] bg-[#FF3333]/10 flex items-center justify-center text-[#FF3333] cursor-grab active:cursor-grabbing hover:bg-[#FF3333]/20"
              >
                {gate}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

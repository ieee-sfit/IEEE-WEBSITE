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

  const handleDragEnd = (gate: GateType, _event: any, info: any) => {
    const { point } = info;
    const checkDrop = (ref: React.RefObject<HTMLDivElement>, slotNum: 1 | 2) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      if (point.x >= rect.left && point.x <= rect.right &&
          point.y >= rect.top && point.y <= rect.bottom) {
        setSlot(slotNum, gate);
        return true;
      }
      return false;
    };

    if (checkDrop(slot1Ref, 1)) return;
    if (checkDrop(slot2Ref, 2)) return;
  };

  const gates: GateType[] = ['AND', 'OR', 'NOT', 'XOR'];

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
        <div className="pt-8 border border-gray-800 p-4 bg-gray-900/50 relative overflow-hidden">
          {/* Decorative Breadboard grid */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
          />
          
          <div className="relative z-10 flex flex-col gap-6">
            {/* Input Layer */}
            <div className="flex justify-between px-4 text-[9px] text-gray-500 tracking-widest uppercase">
              <div className="flex flex-col items-center">
                <span className="text-[#33FF33]">SIG_1</span>
                <span>(KEYCARD)</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#FF3333]">SIG_0</span>
                <span>(PRESSURE)</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#33FF33]">SIG_1</span>
                <span>(SWITCH)</span>
              </div>
            </div>

            {/* Wires down to Slot 1 */}
            <div className="flex justify-start px-12 opacity-30">
              <div className="w-px h-8 bg-white" />
              <div className="w-24 border-t border-r border-white h-8" />
            </div>

            {/* Gate Layer */}
            <div className="flex justify-center gap-12 items-center">
              <div className="space-y-2 text-center relative">
                <div className="absolute -left-12 top-1/2 w-12 h-px bg-white opacity-30" />
                <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">GATE 1</div>
                <div 
                  ref={slot1Ref}
                  className={`w-20 h-12 border-2 border-dashed flex items-center justify-center transition-colors text-sm font-bold
                    ${slot1 ? 'border-white text-black bg-white' : 'border-gray-700 text-gray-600'}`}
                  onClick={() => slot1 && setSlot(1, null)}
                >
                  {slot1 || 'EMPTY'}
                </div>
              </div>
              
              <div className="w-12 h-px bg-white opacity-30" />

              <div className="space-y-2 text-center relative">
                <div className="absolute -top-12 right-1/2 w-px h-12 bg-white opacity-30" />
                <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">GATE 2</div>
                <div 
                  ref={slot2Ref}
                  className={`w-20 h-12 border-2 border-dashed flex items-center justify-center transition-colors text-sm font-bold
                    ${slot2 ? 'border-white text-black bg-white' : 'border-gray-700 text-gray-600'}`}
                  onClick={() => slot2 && setSlot(2, null)}
                >
                  {slot2 || 'EMPTY'}
                </div>
              </div>
            </div>

            {/* Output Layer */}
            <div className="flex justify-end px-16 opacity-30">
              <div className="w-px h-8 bg-white" />
            </div>
            <div className="flex justify-end px-12 text-center">
              <div className={`px-4 py-2 text-[10px] tracking-widest font-bold uppercase border ${solved ? 'border-[#33FF33] text-[#33FF33] bg-[#33FF33]/10' : 'border-[#FF3333] text-[#FF3333] bg-[#FF3333]/10'}`}>
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
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => handleDragEnd(gate, e, info)}
                whileDrag={{ scale: 1.1, zIndex: 10 }}
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

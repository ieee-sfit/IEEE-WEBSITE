import { useEffect, useRef } from 'react';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

export const VisionStationUI = () => {
  const { pitch, yaw, solved } = useCtrlFreakStore((state) => state.vision);
  const setRotation = useCtrlFreakStore((state) => state.setVisionRotation);
  const checkSolved = useCtrlFreakStore((state) => state.checkVisionSolved);
  const isDragging = useRef(false);

  useEffect(() => {
    checkSolved();
  }, [pitch, yaw, checkSolved]);

  // Trackpad Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    if (solved) return;
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || solved) return;
    
    // Sensitivity
    const sensitivity = 0.01;
    let newPitch = pitch + e.movementY * sensitivity;
    let newYaw = yaw + e.movementX * sensitivity;
    
    // Clamp to prevent spinning totally out of bounds infinitely, 
    // but keep it wide enough for a good puzzle.
    newPitch = Math.max(-Math.PI, Math.min(Math.PI, newPitch));
    newYaw = Math.max(-Math.PI, Math.min(Math.PI, newYaw));

    // Auto-snap if close enough
    if (Math.abs(newPitch) < 0.05 && Math.abs(newYaw) < 0.05) {
      newPitch = 0;
      newYaw = 0;
    }
    
    setRotation(newPitch, newYaw);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const errP = Math.abs(pitch);
  const errY = Math.abs(yaw);
  const totalError = errP + errY;
  
  // Max error is roughly 2 * Math.PI (~6.28), but practically less.
  const alignmentPercentage = solved ? 100 : Math.max(0, 100 - (totalError * 20));
  
  let status = 'UNALIGNED';
  if (solved) status = 'NOMINAL';
  else if (alignmentPercentage > 80) status = 'LOCKING';

  return (
    <div className="space-y-8 bg-black/60 backdrop-blur-md p-8 border-l border-[#FF3333] w-full max-w-lg pointer-events-auto">
      <div>
        <div className="text-[10px] text-[#FF3333] tracking-[0.2em] mb-4">03 // eCHALLAN VISION</div>
        <h2 className="text-2xl font-sans tracking-tight uppercase text-white">Optical Recognition</h2>
      </div>
      
      <div className="font-mono text-xs space-y-4">
        <div className="text-gray-400 mb-4 uppercase tracking-widest leading-relaxed">
          OBSERVATION:<br/>Spatial distortion detected. Voxel coordinates are scrambled across projection axes.
        </div>
        
        <div className="text-[#FF3333] mb-6 uppercase tracking-widest leading-relaxed border border-[#FF3333]/30 bg-[#FF3333]/5 p-3 text-[10px]">
          [!] ACTION REQUIRED:<br/>Adjust axial rotation to align the spatial cloud with the camera's orthogonal projection.
        </div>
        
        {/* TELEMETRY */}
        <div className={`flex justify-between ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>ALIGNMENT</span><span>{alignmentPercentage.toFixed(1)}%</span>
        </div>
        
        <div className={`flex justify-between pt-4 border-t border-gray-800/80 ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>STATUS</span><span className={solved ? '' : 'animate-pulse'}>{status}</span>
        </div>

        {/* TRACKPAD */}
        <div className="pt-6">
          <div 
            className={`w-full h-40 border transition-colors duration-300 relative select-none touch-none overflow-hidden ${
              solved 
                ? 'border-[#33FF33]/50 bg-[#33FF33]/10 cursor-default' 
                : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800/80 cursor-move'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none text-gray-400 uppercase tracking-widest text-[10px]">
              {solved ? 'ALIGNMENT LOCKED' : '[ DRAG TO ROTATE ]'}
            </div>
            
            {/* Visual Crosshair Indicator */}
            {!solved && (
              <div 
                className="absolute w-2 h-2 bg-[#FF3333] rounded-full pointer-events-none transition-transform duration-75"
                style={{ 
                  left: '50%', 
                  top: '50%',
                  transform: `translate(calc(-50% + ${yaw * 30}px), calc(-50% + ${pitch * 30}px))`
                }}
              />
            )}
            
            {/* Center Target */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-gray-600 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

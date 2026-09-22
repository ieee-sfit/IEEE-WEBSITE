import { useState, useEffect } from 'react';
import { useCtrlFreakStore } from '../../store/useCtrlFreakStore';

// Fixed 2D layout for the tactical routing display
const NODES = [
  { id: 0, x: 20, y: 150, label: 'SRC', type: 'source' },
  { id: 1, x: 280, y: 150, label: 'DST', type: 'dest' },
  { id: 2, x: 100, y: 40, label: 'RLY-1', type: 'relay' },
  { id: 3, x: 150, y: 150, label: 'RLY-2', type: 'corrupted' },
  { id: 4, x: 200, y: 260, label: 'RLY-3', type: 'relay' }
];

export const NetworkStationUI = () => {
  const { routes, solved } = useCtrlFreakStore((state) => state.network);
  const addRoute = useCtrlFreakStore((state) => state.addNetworkRoute);
  const removeRoute = useCtrlFreakStore((state) => state.removeNetworkRoute);
  const clearRoutes = useCtrlFreakStore((state) => state.clearNetworkRoutes);
  const checkSolved = useCtrlFreakStore((state) => state.checkNetworkSolved);

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    checkSolved();
  }, [routes, checkSolved]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeNode === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleNodeClick = (nodeId: number) => {
    if (activeNode === null) {
      // Start drawing
      setActiveNode(nodeId);
      const node = NODES.find(n => n.id === nodeId);
      if (node) setMousePos({ x: node.x, y: node.y });
    } else {
      // Complete line
      if (activeNode !== nodeId) {
        const routeId = [activeNode, nodeId].sort().join('-');
        if (routes.includes(routeId)) {
          removeRoute(activeNode, nodeId);
        } else {
          addRoute(activeNode, nodeId);
        }
      }
      setActiveNode(null);
    }
  };

  // Calculate telemetry
  const isCorrupted = routes.some(r => r.includes('3'));
  let status = 'SATURATED';
  if (solved) status = 'NOMINAL';
  else if (routes.length > 0 && !isCorrupted) status = 'RE-ROUTING';
  else if (isCorrupted) status = 'CORRUPTED NODE DETECTED';

  const latency = solved ? '0.01s' : (isCorrupted ? '9.99s' : (routes.length === 0 ? '2.84s' : '0.84s'));

  return (
    <div className="space-y-8 bg-black/60 backdrop-blur-md p-8 border-l border-[#FF3333] w-full max-w-lg pointer-events-auto">
      <div>
        <div className="text-[10px] text-[#FF3333] tracking-[0.2em] mb-4">02 // GoAT NETWORK</div>
        <h2 className="text-2xl font-sans tracking-tight uppercase text-white">Network Saturation</h2>
      </div>
      
      <div className="font-mono text-xs space-y-4">
        <div className="text-gray-400 mb-6 uppercase tracking-widest leading-relaxed">
          OBSERVATION:<br/>Node overload detected. Traffic stalled at RLY-2.
        </div>
        
        {/* TELEMETRY */}
        <div className={`flex justify-between ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>LATENCY</span><span>{latency}</span>
        </div>
        
        <div className={`flex justify-between pt-4 border-t border-gray-800/80 ${solved ? 'text-[#33FF33]' : 'text-[#FF3333]'}`}>
          <span>STATUS</span><span className={solved ? '' : 'animate-pulse'}>{status}</span>
        </div>

        {/* ROUTING HUD */}
        <div className="pt-8 relative select-none">
          <div className="flex justify-between items-end mb-4">
            <label className="text-[10px] text-gray-500 tracking-[0.2em] uppercase block">Tactical Routing Matrix</label>
            <button onClick={clearRoutes} className="text-[10px] text-[#FF3333] hover:text-white uppercase tracking-wider underline">Clear Routes</button>
          </div>
          
          <div className="w-full aspect-[4/3] bg-[#050505] border border-gray-800 relative rounded-sm overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <svg 
              className="absolute inset-0 w-full h-full cursor-crosshair"
              viewBox="0 0 300 300"
              onMouseMove={handleMouseMove}
              onClick={() => { if(activeNode !== null) setActiveNode(null); }}
            >
              {/* Existing Routes */}
              {routes.map(route => {
                const [id1, id2] = route.split('-').map(Number);
                const n1 = NODES.find(n => n.id === id1);
                const n2 = NODES.find(n => n.id === id2);
                if (!n1 || !n2) return null;
                const isBad = route.includes('3');
                
                return (
                  <line 
                    key={route}
                    x1={n1.x} y1={n1.y}
                    x2={n2.x} y2={n2.y}
                    stroke={solved ? '#33FF33' : (isBad ? '#FF3333' : 'white')}
                    strokeWidth={solved ? 3 : 2}
                    className={isBad ? 'animate-pulse' : ''}
                  />
                );
              })}

              {/* Active Drawing Route */}
              {activeNode !== null && (
                <line 
                  x1={NODES.find(n => n.id === activeNode)?.x} 
                  y1={NODES.find(n => n.id === activeNode)?.y} 
                  x2={mousePos.x} 
                  y2={mousePos.y} 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  className="opacity-50"
                />
              )}

              {/* Nodes */}
              {NODES.map(node => {
                const isActive = activeNode === node.id;
                const isCorrupted = node.type === 'corrupted';
                
                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                    className="cursor-pointer group"
                  >
                    <circle 
                      r="16" 
                      fill="transparent"
                      stroke={isActive ? 'white' : (isCorrupted ? '#FF3333' : '#333')} 
                      strokeWidth="1"
                      className="group-hover:stroke-white transition-colors"
                    />
                    <circle 
                      r="4" 
                      fill={isActive ? 'white' : (isCorrupted ? '#FF3333' : '#666')} 
                      className={isCorrupted && !solved ? 'animate-ping' : ''}
                    />
                    <text 
                      y="26" 
                      textAnchor="middle" 
                      className={`text-[8px] font-mono tracking-widest ${isCorrupted ? 'fill-[#FF3333]' : 'fill-gray-500'}`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

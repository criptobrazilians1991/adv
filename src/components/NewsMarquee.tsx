import { useRef, useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

const newsItems = [
  {
    title: "Acompanhe as últimas notícias e investigações do Ministério Público Militar no portal G1.",
    source: "Fonte: G1",
    sourceUrl: "https://g1.globo.com/busca/?q=ministerio+publico+militar",
    press: "Ver Cobertura",
    pressUrl: "https://g1.globo.com/busca/?q=ministerio+publico+militar"
  },
  {
    title: "Cobertura completa sobre a Justiça Militar e as ações do MPM na CNN Brasil.",
    source: "Fonte: CNN Brasil",
    sourceUrl: "https://www.cnnbrasil.com.br/?s=ministerio+publico+militar",
    press: "Ver Cobertura",
    pressUrl: "https://www.cnnbrasil.com.br/?s=ministerio+publico+militar"
  },
  {
    title: "Notícias oficiais, atualizações e decisões do Superior Tribunal Militar (STM).",
    source: "Fonte: STM",
    sourceUrl: "https://www.stm.jus.br/informacao/agencia-de-noticias",
    press: "Portal do STM",
    pressUrl: "https://www.stm.jus.br/informacao/agencia-de-noticias"
  },
  {
    title: "Decisões, jurisprudência e artigos envolvendo o Ministério Público Militar no ConJur.",
    source: "Fonte: ConJur",
    sourceUrl: "https://www.conjur.com.br/?s=ministerio+publico+militar",
    press: "Ver Artigos",
    pressUrl: "https://www.conjur.com.br/?s=ministerio+publico+militar"
  },
  {
    title: "Ações, operações e denúncias do Ministério Público Militar na Agência Brasil.",
    source: "Fonte: Agência Brasil",
    sourceUrl: "https://agenciabrasil.ebc.com.br/tags/ministerio-publico-militar",
    press: "Ver Notícias",
    pressUrl: "https://agenciabrasil.ebc.com.br/tags/ministerio-publico-militar"
  }
];

export const NewsMarquee = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        // Renderizamos 3 blocos idênticos. A largura de 1 bloco é 1/3 do total.
        const singleWidth = containerRef.current.scrollWidth / 3;
        setContentWidth(singleWidth);
        // Inicia no bloco do meio para permitir arrastar para ambos os lados
        if (x.get() === 0) {
          x.set(-singleWidth);
        }
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [x]);

  useAnimationFrame((t, delta) => {
    if (isDragging || isHovered || contentWidth === 0) return;
    
    // Velocidade de rolagem (pixels por segundo)
    const moveBy = (40 * delta) / 1000;
    let newX = x.get() - moveBy;
    
    // Se rolou todo o bloco do meio para a esquerda, volta um bloco para a direita
    if (newX <= -contentWidth * 2) {
      newX += contentWidth;
    }
    
    x.set(newX);
  });

  const handleDrag = () => {
    if (contentWidth === 0) return;
    const currentX = x.get();
    
    // Se arrastou muito para a esquerda
    if (currentX <= -contentWidth * 2) {
      x.set(currentX + contentWidth);
    } 
    // Se arrastou muito para a direita
    else if (currentX >= 0) {
      x.set(currentX - contentWidth);
    }
  };

  // 3 cópias para garantir que sempre haja conteúdo visível ao arrastar
  const displayNews = [...newsItems, ...newsItems, ...newsItems];

  return (
    <div 
      className="bg-slate-900 text-slate-300 py-2 overflow-hidden flex border-b border-slate-800 relative z-20 cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => setIsHovered(true)}
      onPointerUp={() => setIsHovered(false)}
    >
      {/* Gradientes para suavizar as bordas */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex whitespace-nowrap w-max items-center"
        ref={containerRef}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -contentWidth * 3, right: contentWidth }} // Limites folgados, o wrap manual cuida do loop
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={handleDrag}
      >
        {displayNews.map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <Newspaper className="w-4 h-4 text-emerald-500 mr-3 shrink-0" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tracking-wide">
                <span className="text-emerald-400 font-bold mr-2">ÚLTIMAS DO MPM:</span>
                <span className="text-slate-200">{item.title}</span>
              </span>
              
              <div className="flex items-center gap-2 ml-2">
                {item.sourceUrl ? (
                  <a 
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 rounded-full border border-slate-700 uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    {item.source}
                  </a>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700 uppercase tracking-wider font-semibold">
                    {item.source}
                  </span>
                )}
                
                {item.press && (
                  item.pressUrl ? (
                    <a 
                      href={item.pressUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-0.5 bg-indigo-950/50 hover:bg-indigo-900/60 transition-colors text-indigo-300 rounded-full border border-indigo-800/50 flex items-center gap-1 uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {item.press}
                    </a>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-950/50 text-indigo-300 rounded-full border border-indigo-800/50 flex items-center gap-1 uppercase tracking-wider font-semibold">
                      <ExternalLink className="w-3 h-3" />
                      {item.press}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

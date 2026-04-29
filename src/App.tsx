import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mountain, 
  Watch, 
  TrainFront, 
  Flag, 
  CircleDashed, 
  LayoutGrid, 
  Info,
  RotateCcw,
  Trophy,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SYMBOLS = [
  { id: 'mountain', icon: Mountain, label: 'Matterhorn', color: 'text-slate-500', points: 10, fact: "Matterhorn este unul dintre cele mai înalte vârfuri din Alpi." },
  { id: 'cheese', icon: CircleDashed, label: 'Cașcaval', color: 'text-yellow-500', points: 20, fact: "Elveția produce peste 450 de varietăți de brânză!" },
  { id: 'watch', icon: Watch, label: 'Ceas', color: 'text-blue-600', points: 30, fact: "Elveția este cel mai mare exportator de ceasuri de lux din lume." },
  { id: 'chocolate', icon: LayoutGrid, label: 'Ciocolată', color: 'text-amber-800', points: 40, fact: "Un elvețian mănâncă în medie 11kg de ciocolată pe an." },
  { id: 'train', icon: TrainFront, label: 'Tren Alpin', color: 'text-red-600', points: 50, fact: "Elveția are cea mai densă rețea feroviară din Europa." },
  { id: 'flag', icon: Flag, label: 'Steagul', color: 'text-red-500', points: 200, fact: "Steagul Elveției este unul dintre singurele două steaguri pătrate din lume." },
];

const GEOGRAPHY_FACTS = [
  "Elveția are 4 limbi naționale: germana, franceza, italiana și retoromana.",
  "Există mai mult de 1.500 de lacuri în Elveția.",
  "Elveția găzduiește cel mai lung tunel din lume, tunelul de bază Gotthard (57 km).",
  "Berna este capitala Elveției, nu Zurich sau Geneva.",
  "Elveția este o țară fără ieșire la mare din Europa Centrală.",
  "Alpii acoperă aproximativ 60% din suprafața totală a Elveției.",
];

const INSPIRATIONAL_QUOTES = [
  "Călătoria este singurul lucru pe care îl cumperi și te face mai bogat.",
  "Munții ne cheamă și trebuie să mergem.",
  "Fiecare sfârșit este un nou început.",
  "Elveția nu este doar o destinație, este o stare de spirit.",
  "Limitele există doar în mintea noastră.",
  "Priveliștea de sus merită întotdeauna efortul."
];

const RIDDLES = [
  { q: "Sunt muntele în formă de piramidă, simbolul Alpilor. Cine sunt?", a: "Matterhorn" },
  { q: "Sunt orașul păcii, sediul ONU și am un jet de apă celebru. Cine sunt?", a: "Geneva" },
  { q: "Am multe găuri, dar sunt deliciul oricărei mese elvețiene. Ce sunt?", a: "Cașcavalul (Emmental)" },
  { q: "Sunt capitala Elveției, faimoasă pentru urșii mei. Cine sunt?", a: "Berna" },
  { q: "Sunt dulce, fină și Elveția e campioană la producția mea. Ce sunt?", a: "Ciocolata" },
  { q: "Am 57 de kilometri și sunt cel mai lung din lume sub munți. Ce sunt?", a: "Tunelul Gotthard" },
  { q: "Sunt cel mai faimos lac elvețian, împărțit cu Franța. Cine sunt?", a: "Lacul Geneva (Leman)" },
  { q: "Sunt instrumentul muzical lung din lemn folosit în munți. Ce sunt?", a: "Alphorn (Cornul Alpilor)" },
  { q: "Am 26 de unități administrative în Elveția. Cum se numesc ele?", a: "Cantoane" },
  { q: "Sunt orașul cel mai mare din țară, centru financiar. Cine sunt?", a: "Zurich" },
  { q: "Sunt moneda oficială a Elveției. Cum mă numesc?", a: "Francul Elvețian" },
  { q: "Sunt faimosul câine de salvare din Alpi cu un butoiaș la gât. Cine sunt?", a: "Saint Bernard" }
];

const CodeRain = () => {
  const columns = Array.from({ length: 15 });
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {columns.map((_, i) => (
        <div 
          key={i} 
          className="matrix-column" 
          style={{ 
            left: `${i * 7}%`, 
            animationDuration: `${5 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          {Array.from({ length: 20 }).map(() => "01∑πΔ∫√x").join("")}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [reels, setReels] = useState([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState("Bun venit în Elveția! Învârte pentru a câștiga.");
  const [currentFact, setCurrentFact] = useState(GEOGRAPHY_FACTS[0]);
  const [currentRiddle, setCurrentRiddle] = useState(RIDDLES[0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(INSPIRATIONAL_QUOTES[0]);
  const [xp, setXp] = useState(0);
  const [unlockedStamps, setUnlockedStamps] = useState<string[]>([]);
  const [showMathQuiz, setShowMathQuiz] = useState(false);
  const [mathProblem, setMathProblem] = useState({ q: "", a: "" });
  const [userAnswer, setUserAnswer] = useState("");

  const generateMathProblem = () => {
    const problems = [
      { q: "lim(x→0) sin(x)/x = ?", a: "1" },
      { q: "ln(e) = ?", a: "1" },
      { q: "√144 + √25 = ?", a: "17" },
      { q: "d/dx (x²) la x=3 ?", a: "6" },
      { q: "Suma unghiurilor unui triunghi?", a: "180" },
      { q: "Cod binar pentru '2'?", a: "10" }
    ];
    const pick = problems[Math.floor(Math.random() * problems.length)];
    setMathProblem(pick);
    setUserAnswer("");
    setShowMathQuiz(true);
  };

  const handleMathSubmit = () => {
    if (userAnswer.trim() === mathProblem.a) {
      setAttempts(1);
      setShowMathQuiz(false);
      setMessage("Acces garantat! Ai o încercare bonus.");
      playSound('level');
    } else {
      setShowMathQuiz(false);
      setShowResetModal(true);
    }
  };

  // Simple Audio Synthesis for feedback
  const playSound = (type: 'spin' | 'win' | 'click' | 'level') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'spin') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'win') {
        osc.type = 'triangle';
        [440, 554, 659, 880].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        });
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'level') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF0000', '#FFFFFF', '#FFD700']
    });
  }, []);

  const checkWin = useCallback((finalReels: typeof SYMBOLS) => {
    const [r1, r2, r3] = finalReels;
    let winAmount = 0;

    if (r1.id === r2.id && r2.id === r3.id) {
      winAmount = r1.points * 10;
      setMessage(`FELICITĂRI! Ai câștigat ${winAmount} puncte cu ${r1.label}!`);
      triggerConfetti();
    } else {
      setMessage("Mai încearcă! Ai nevoie de 3 simboluri identice.");
    }

    if (winAmount > 0) {
      setLastWin(winAmount);
      playSound('win');
      
      // Unlock a random stamp if win is big
      if (winAmount >= 100) {
        const newStamp = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].label;
        if (!unlockedStamps.includes(newStamp)) {
          setUnlockedStamps(prev => [...prev, newStamp]);
          setMessage(`Senzational! Ai deblocat stambila: ${newStamp}`);
          playSound('level');
        }
      }
    }
  }, [triggerConfetti, unlockedStamps]);

  const spin = useCallback(() => {
    if (isSpinning || attempts <= 0) return;
    
    playSound('spin');
    const nextAttempts = attempts - 1;
    setAttempts(nextAttempts);
    
    setIsSpinning(true);
    setLastWin(0);
    setShowAnswer(false);
    setMessage("Se învârte...");
    
    // Add XP per spin
    setXp(prev => Math.min(prev + 34, 100));

    const finalReels = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ];

    const stopTimes = [1500, 2000, 2500];
    
    stopTimes.forEach((time, idx) => {
      const intervalId = setInterval(() => {
        setReels(prev => {
          const next = [...prev];
          next[idx] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return next;
        });
      }, 70 + idx * 20);

      setTimeout(() => {
        clearInterval(intervalId);
        playSound('click');
        setReels(prev => {
          const next = [...prev];
          next[idx] = finalReels[idx];
          return next;
        });
        
        if (idx === 2) {
          setIsSpinning(false);
          checkWin(finalReels);
          setCurrentFact(GEOGRAPHY_FACTS[Math.floor(Math.random() * GEOGRAPHY_FACTS.length)]);
          
          if (nextAttempts === 0) {
            setTimeout(() => {
              if (finalReels[0].id !== finalReels[1].id || finalReels[1].id !== finalReels[2].id) {
                generateMathProblem();
              } else {
                setCurrentQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
                setShowResetModal(true);
              }
              // Reset XP on game end
              setXp(0);
            }, 1200);
          }
        }
      }, time);
    });
  }, [isSpinning, attempts, checkWin]);

  const restartGame = () => {
    playSound('click');
    setShowResetModal(false);
    setAttempts(3);
    setLastWin(0);
    setXp(0);
    setMessage("Călătoria continuă! Succes.");
    setCurrentRiddle(RIDDLES[Math.floor(Math.random() * RIDDLES.length)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-4 md:p-8" id="game-container">
      <CodeRain />
      {/* Math Quiz Modal */}
      <AnimatePresence>
        {showMathQuiz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-red-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-slate-900 border-2 border-red-500 p-8 rounded-3xl max-w-sm w-full text-center"
            >
              <h2 className="text-red-500 font-mono text-xs uppercase tracking-widest mb-4">Security Check: Logic Unit</h2>
              <p className="text-white font-mono text-xl mb-6">{mathProblem.q}</p>
              <input 
                type="text" 
                value={userAnswer}
                onKeyDown={(e) => e.key === 'Enter' && handleMathSubmit()}
                onChange={(e) => setUserAnswer(e.target.value)}
                autoFocus
                placeholder="Răspuns?"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white font-mono mb-4 text-center focus:outline-none focus:border-red-500"
              />
              <button 
                onClick={handleMathSubmit}
                className="w-full py-3 bg-red-600 text-white font-black uppercase rounded-xl"
              >
                Verifică Accesul
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Reset Modal Overlay */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
            id="reset-overlay"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-lg w-full rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-white to-red-500" />
              
              <div className="mb-8 flex justify-center">
                <div className="bg-red-50 p-6 rounded-full">
                   <Mountain className="w-16 h-16 text-red-600" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
                Final de Etapă
              </h2>
              
              <div className="mb-10">
                <p className="text-xl italic font-medium text-slate-600 leading-relaxed">
                  "{currentQuote}"
                </p>
                <div className="mt-4 flex justify-center gap-1">
                  <div className="w-8 h-1 bg-red-100 rounded-full" />
                  <div className="w-2 h-1 bg-red-500 rounded-full" />
                  <div className="w-1 h-1 bg-red-100 rounded-full" />
                </div>
              </div>

              <button 
                onClick={restartGame}
                className="w-full py-6 px-10 bg-red-600 hover:bg-red-700 text-white font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#991b1b] active:translate-y-1 active:shadow-[0_4px_0_0_#991b1b] transition-all flex items-center justify-center gap-4"
              >
                <RotateCcw />
                Reîncepe Aventura
              </button>
              
              <p className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Explorează geografia mai departe
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
         <motion.div
           animate={{ y: [0, -10, 0], rotate: [12, 14, 12] }}
           transition={{ duration: 6, repeat: Infinity }}
           className="absolute -top-10 -left-10"
         >
           <Mountain className="w-64 h-64 text-blue-900" />
         </motion.div>

         <motion.div
           animate={{ y: [0, 10, 0], rotate: [-12, -10, -12] }}
           transition={{ duration: 5, repeat: Infinity }}
           className="absolute -bottom-10 -right-10"
         >
           <Flag className="w-64 h-64 text-red-900" />
         </motion.div>
         
         {/* Math & Info Floating Decorations */}
         <motion.div 
           animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [12, 0, 12] }}
           transition={{ duration: 7, repeat: Infinity }}
           className="absolute top-1/4 left-10 font-mono text-white/5 text-4xl select-none"
         >
           ∑
         </motion.div>

         <motion.div 
           animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 8, repeat: Infinity }}
           className="absolute top-3/4 left-20 font-mono text-red-500/10 text-6xl -rotate-12 select-none"
         >
           {"{ }"}
         </motion.div>

         <motion.div 
           animate={{ rotate: [45, 90, 45], opacity: [0.05, 0.1, 0.05] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-1/3 right-10 font-mono text-white/5 text-5xl select-none"
         >
           π
         </motion.div>

         <motion.div 
           animate={{ x: [0, -30, 0] }}
           transition={{ duration: 9, repeat: Infinity }}
           className="absolute bottom-1/4 right-20 font-mono text-blue-500/10 text-4xl select-none"
         >
           0101
         </motion.div>
         
         <motion.div 
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 11, repeat: Infinity }}
           className="absolute top-10 right-1/4 font-mono text-white/5 text-3xl select-none"
         >
           √x
         </motion.div>
      </div>

      <header className="mb-12 text-center relative" id="header">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block"
        >
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-red-600 uppercase leading-none mb-2 animate-title">
            10A Elvetian Slots
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-8 bg-slate-700" />
             <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Expediție Geografică • v2.0</p>
             <div className="h-[1px] w-8 bg-slate-700" />
          </div>
        </motion.div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="main-content">
        {/* Slot Machine */}
        <div className="lg:col-span-8 machine-frame border-[12px] border-slate-800 rounded-[40px] shadow-2xl p-6 md:p-10 relative overflow-hidden group" id="slot-machine">
          {/* Machine Header */}
          <div className="flex justify-between items-center mb-10 bg-slate-800/90 backdrop-blur text-white p-5 rounded-2xl border-b-4 border-slate-900 shadow-inner">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Status Sistem</span>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-green-400">Operațional</span>
                   </div>
                </div>
                
                <div className="h-10 w-[1px] bg-slate-700" />

                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">Resurse</span>
                   <div className="flex items-center gap-1.5">
                      {[...Array(3)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ 
                            scale: i < attempts ? [1, 1.1, 1] : 1,
                            opacity: i < attempts ? 1 : 0.2
                          }}
                          transition={{ repeat: i < attempts ? Infinity : 0, duration: 2 }}
                          className={`w-3.5 h-3.5 rounded-sm border ${i < attempts ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-slate-600 border-slate-500'}`} 
                        />
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Reels */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 mb-10 bg-slate-950 p-4 md:p-6 rounded-[32px] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] relative" id="reels-container">
            {/* Gloss & Hardware Effect */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[32px] z-10" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-[32px] z-10" />
            
            {reels.map((symbol, idx) => (
              <div key={idx} className="bg-white aspect-square rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border-b-4 border-slate-200 shadow-md">
                 {/* Internal Shadow for Depth */}
                 <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                 
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={isSpinning ? `spinning-${idx}-${Date.now()}` : symbol.id}
                      initial={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25,
                        mass: 0.8
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <symbol.icon className={`w-12 h-12 md:w-20 md:h-20 ${symbol.color} drop-shadow-sm`} strokeWidth={1.5} />
                      <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-widest">
                        {symbol.label}
                      </span>
                    </motion.div>
                 </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
               <motion.div 
                 key={message}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-slate-900 p-5 rounded-2xl border-l-4 border-red-500 shadow-inner"
               >
                 <p className="font-mono text-sm text-red-500 uppercase tracking-widest mb-1 opacity-50">Transmisie</p>
                 <p className="font-mono text-lg font-bold text-white tracking-tight leading-relaxed">
                   {message}
                 </p>
               </motion.div>
            </div>
            <button
               onClick={spin}
               disabled={isSpinning || attempts <= 0}
               className={`
                 relative group/btn min-w-[200px] py-6 rounded-3xl font-display font-black text-2xl uppercase tracking-widest 
                 transition-all duration-200 shadow-[0_12px_0_0_#991b1b] active:translate-y-2 active:shadow-[0_4px_0_0_#991b1b]
                 flex items-center justify-center gap-3 active:scale-[0.98]
                 ${isSpinning || attempts <= 0 ? 'bg-slate-700 text-slate-500 shadow-[0_6px_0_0_#334155] grayscale cursor-not-allowed top-2' : 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 hover:shadow-[0_16px_0_0_#991b1b]'}
               `}
               id="spin-button"
            >
              {isSpinning ? <RotateCcw className="animate-spin w-8 h-8" /> : <Trophy className="w-8 h-8 group-hover/btn:scale-110 transition-transform" />}
              <span className="md:inline">Învârte!</span>
            </button>
          </div>
          {/* Progress Bar for Rewards/Expedition */}
          <div className="mt-8 bg-slate-800 p-4 rounded-2xl border border-slate-700">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progres Expediție</span>
                <span className="text-[10px] font-mono text-red-400">{xp}%</span>
             </div>
             <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xp}%` }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                />
             </div>
             <p className="mt-2 text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest">
               Completează 100% pentru a debloca o recompensă rară
             </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="lg:col-span-4 flex flex-col gap-6" id="sidebar">
          {/* Stamps Collection */}
          <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl shadow-sm">
             <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 border-b pb-2 flex items-center gap-2">
               <Flag size={12} className="text-red-500" /> Pașaport Elvețian
             </h3>
             <div className="grid grid-cols-4 gap-2">
                {SYMBOLS.map((symbol) => (
                  <div 
                    key={symbol.id} 
                    className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${unlockedStamps.includes(symbol.label) ? 'bg-red-50 border-red-100 text-red-600 grayscale-0' : 'bg-slate-50 border-slate-100 text-slate-300 grayscale'}`}
                    title={symbol.label}
                  >
                    <symbol.icon size={18} strokeWidth={2.5} />
                  </div>
                ))}
             </div>
             <p className="mt-4 text-[9px] text-slate-400 font-bold text-center uppercase tracking-tighter">
               {unlockedStamps.length} / {SYMBOLS.length} Ștampile Deblocate
             </p>
          </div>

          {/* Fact Card */}
          <div className="bg-red-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
             <Info className="absolute -top-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
             <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
               <MapPin size={16} /> Știai că?
             </h3>
             <AnimatePresence mode="wait">
               <motion.p 
                 key={currentFact}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.05 }}
                 className="text-lg leading-relaxed font-medium italic"
               >
                 "{currentFact}"
               </motion.p>
             </AnimatePresence>
          </div>

          {/* Riddles */}
          <div className="bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2 border-b pb-2">Ghicitoare Elvețiană</h3>
             <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
               "{currentRiddle.q}"
             </p>
             
             <div className="mt-2">
                {showAnswer ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-bold text-center"
                  >
                    Răspuns: {currentRiddle.a}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Arată Răspunsul
                  </button>
                )}
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

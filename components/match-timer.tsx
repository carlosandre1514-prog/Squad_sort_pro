'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MatchTimer() {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(10);
  const [showConfig, setShowConfig] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAlarm = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 note

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Audio play failed:', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          playAlarm();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    // Resume audio context on user gesture to allow sound on mobile/modern browsers
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    } else if (!audioContextRef.current) {
       // Initialize on first interaction
       const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
       audioContextRef.current = new AudioContextClass();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(initialTime);
    setSeconds(0);
  };

  const handleSetTime = (mins: number) => {
    setInitialTime(mins);
    setMinutes(mins);
    setSeconds(0);
    setIsActive(false);
    setShowConfig(false);
  };

  const formatTime = (m: number, s: number) => {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TimerIcon size={80} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cronômetro</span>
           <button 
            onClick={() => setShowConfig(!showConfig)}
            className="text-[10px] font-black uppercase tracking-widest text-green-500 hover:text-green-400"
           >
            Ajustar Tempo
           </button>
        </div>

        <AnimatePresence mode="wait">
          {showConfig ? (
            <motion.div 
              key="config"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-2 py-4"
            >
              {[5, 7, 10, 12, 15].map(m => (
                <button
                  key={m}
                  onClick={() => handleSetTime(m)}
                  className={`w-12 h-12 rounded-xl font-black transition-all ${
                    initialTime === m 
                      ? 'bg-green-500 text-slate-950 scale-110 shadow-lg shadow-green-500/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {m}&apos;
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <h3 className={`text-7xl font-display font-black tracking-tighter tabular-nums transition-colors ${
                minutes === 0 && seconds < 30 ? 'text-red-500 animate-pulse' : 'text-white'
              }`}>
                {formatTime(minutes, seconds)}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isActive 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                : 'bg-green-600 text-slate-950 hover:bg-green-500 shadow-lg shadow-green-500/10'
            }`}
          >
            {isActive ? (
              <>
                <Pause size={18} fill="currentColor" />
                Pausar
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Iniciar
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-4 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-2xl transition-all"
            title="Resetar"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => {
              playAlarm();
              if (audioContextRef.current?.state === 'suspended') {
                 audioContextRef.current.resume();
              }
            }}
            className="p-4 bg-slate-800 text-slate-400 hover:text-green-500 hover:bg-slate-700 rounded-2xl transition-all"
            title="Testar Alarme"
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

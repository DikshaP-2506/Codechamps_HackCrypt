"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import moleImg from "../assets/mole.png";

const HOLE_COUNT = 9;
const GAME_LENGTH_SECONDS = 60;
const INITIAL_MOLE_SPEED = 900; // ms
const MIN_MOLE_SPEED = 320; // ms

// Layout tuning knobs
const LAYOUT_MAX_WIDTH = "1280px";
const GRID_GAP = "1rem"; // spacing between left/right and within grid
const GAME_CARD_PADDING = "1.25rem";
const SIDEBAR_WIDTH = "360px";
const MOLE_WIDTH = 140;
const MOLE_HEIGHT = 165;
const HOLE_PIT_WIDTH = "80%";
const HOLE_PIT_HEIGHT = "20%";
const HOLE_PIT_SKEW = "0deg";
const HOLE_PIT_SCALE_Y = 0.78;

function getRandomHole(exclude: number | null) {
  const candidates = Array.from({ length: HOLE_COUNT }, (_, i) => i).filter(
    (i) => i !== exclude
  );
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function WhackAMolePage() {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH_SECONDS);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const moleSpeed = useMemo(() => {
    const bonus = Math.floor(score / 5) * 40; // speed up every 5 points
    return Math.max(INITIAL_MOLE_SPEED - bonus, MIN_MOLE_SPEED);
  }, [score]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleRef = useRef<NodeJS.Timeout | null>(null);
  const sessionRecordedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleRef.current) clearInterval(moleRef.current);
    };
  }, []);

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const scheduleMole = () => {
      setMoleIndex((prev) => getRandomHole(prev));
    };

    scheduleMole();
    moleRef.current = setInterval(scheduleMole, moleSpeed);

    return () => {
      if (moleRef.current) clearInterval(moleRef.current);
    };
  }, [running, moleSpeed]);

  const handleWhack = (idx: number) => {
    if (!running) return;
    if (moleIndex === idx) {
      setScore((s) => s + 1);
      setMoleIndex(null);
    } else {
      setMisses((m) => m + 1);
    }
  };

  const handleStart = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(GAME_LENGTH_SECONDS);
    setRunning(true);
    sessionRecordedRef.current = false;
  };

  useEffect(() => {
    if (!running && timeLeft === 0) {
      if (!sessionRecordedRef.current) {
        setHighScore((hs) => Math.max(hs, score));
        setScoreHistory((hist) => [score, ...hist].slice(0, 8));
        sessionRecordedRef.current = true;
      }
    }
  }, [running, timeLeft, score]);

  const status = running ? "In play" : timeLeft === 0 ? "Finished" : "Idle";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className="mx-auto grid grid-cols-1 px-4 py-6 md:px-6 lg:grid-cols-2"
        style={{ maxWidth: LAYOUT_MAX_WIDTH, gap: GRID_GAP }}
      >
        {/* Left: compact game area */}
        <div
          className="rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
          style={{ padding: GAME_CARD_PADDING }}
        >
          <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">{status}</span>
              <span className="text-slate-400">Speed {(moleSpeed / 1000).toFixed(2)}s • Grid 3x3</span>
            </div>
            <button
              onClick={handleStart}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              {running ? "Restart" : timeLeft === GAME_LENGTH_SECONDS ? "Start" : "Play again"}
            </button>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-wide text-slate-400 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-850 p-3">
              <p>Time</p>
              <p className="text-2xl font-semibold text-slate-100">{timeLeft}s</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-850 p-3">
              <p>Score</p>
              <p className="text-2xl font-semibold text-emerald-300">{score}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-850 p-3">
              <p>Misses</p>
              <p className="text-2xl font-semibold text-rose-300">{misses}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-850 p-3">
              <p>Best</p>
              <p className="text-2xl font-semibold text-amber-200">{highScore}</p>
            </div>
          </div>

          <div
            className="grid grid-cols-3"
            style={{ gap: GRID_GAP, rowGap: `calc(${GRID_GAP} * 0.75)` }}
          >
            {Array.from({ length: HOLE_COUNT }).map((_, idx) => {
              const active = moleIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleWhack(idx)}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[inset_0_18px_40px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:border-emerald-300/50"
                  disabled={!running}
                >
                  <div className="absolute inset-0 flex items-end justify-center pb-3">
                    <div
                      className="absolute bottom-2 rounded-full opacity-90"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.18) 100%)",
                        boxShadow:
                          "inset 0 6px 12px rgba(255,255,255,0.05), 0 10px 18px rgba(0,0,0,0.45)",
                        transform: `skewX(${HOLE_PIT_SKEW}) scaleY(${HOLE_PIT_SCALE_Y})`,
                        width: HOLE_PIT_WIDTH,
                        height: HOLE_PIT_HEIGHT,
                      }}
                      aria-hidden
                    />
                    <Image
                      src={moleImg}
                      alt="Mole"
                      width={MOLE_WIDTH}
                      height={MOLE_HEIGHT}
                      className={`select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-all duration-150 ${
                        active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      draggable={false}
                      priority={idx === 0}
                    />
                  </div>
                  <span className="absolute inset-0 text-[9px] text-slate-700">{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: large title and stats */}
        <div
          className="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          style={{ maxWidth: SIDEBAR_WIDTH }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.3rem] text-emerald-300">MindPlay Mini</p>
            <h1 className="text-3xl font-bold text-slate-50">Whack a Mole</h1>
            <p className="text-sm text-slate-300">
              Fast taps, rising speed. 60s per run.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-850 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Current score</p>
            <p className="text-4xl font-semibold text-emerald-300">{score}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-850 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Highest score</p>
            <p className="text-4xl font-semibold text-amber-200">{highScore}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-850 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Score history</p>
            {scoreHistory.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Finish a run to log scores.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {scoreHistory.map((s, i) => (
                  <li key={`${s}-${i}`} className="flex items-center justify-between">
                    <span className="text-slate-400">Run {scoreHistory.length - i}</span>
                    <span className="font-semibold">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

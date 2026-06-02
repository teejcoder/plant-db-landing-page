'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

type Screenshot = {
  label: string
  sublabel: string
  videoSrc: string
  poster?: string
}

type Props = {
  screenshots: Screenshot[]
}

export function ScreenshotsSection({ screenshots }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() =>
    setSelected((i) => (i !== null ? (i - 1 + screenshots.length) % screenshots.length : null)),
    [screenshots.length]
  )

  const next = useCallback(() =>
    setSelected((i) => (i !== null ? (i + 1) % screenshots.length : null)),
    [screenshots.length]
  )

  useEffect(() => {
    if (selected === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, close, prev, next])

  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const current = selected !== null ? screenshots[selected] : null

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {screenshots.map((shot, i) => (
          <button
            key={shot.label}
            onClick={() => setSelected(i)}
            className="group rounded-xl overflow-hidden border border-green-200 shadow-lg shadow-green-900/10 hover:border-green-300 transition-colors duration-200 text-left w-full block cursor-zoom-in"
          >
            {/* Browser chrome */}
            <div className="bg-[#eef3ee] px-3 py-2.5 flex items-center gap-2 border-b border-green-200">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/50" />
              </div>
              <div className="ml-1 flex-1 min-w-0 bg-[#e0eae0] rounded px-2.5 py-0.5">
                <span className="text-[10px] text-slate-500 truncate block">plant-database.app</span>
              </div>
              <ZoomIn className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>

            {/* Demo video preview */}
            <div className="aspect-16/10 bg-[#e0eae0] overflow-hidden">
              <video
                src={shot.videoSrc}
                poster={shot.poster}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Caption bar — always visible, consistent with browser chrome */}
            <div className="px-4 py-3 bg-[#eef3ee] border-t border-green-200">
              <p className="text-xs font-semibold text-slate-700 leading-snug">{shot.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{shot.sublabel}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'rgba(2,7,2,0.93)', backdropFilter: 'blur(8px)' }}
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute -top-9 right-0 p-1.5 rounded-lg border border-[#1a2e1a] bg-[#090f09] text-slate-500 hover:text-white hover:border-[#2a4a2a] transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/80 bg-black">
              <video
                src={current.videoSrc}
                poster={current.poster}
                controls
                autoPlay
                muted
                playsInline
                className="w-full h-auto block"
              />
            </div>

            {/* Prev / Next */}
            {screenshots.length > 1 && (
              <div className="flex items-center justify-between mt-4 px-1">
                <button
                  onClick={prev}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2e1a] bg-[#090f09] text-xs text-slate-500 hover:text-white hover:border-[#2a4a2a] transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <span className="text-xs text-slate-200 tabular-nums">
                  {(selected ?? 0) + 1} / {screenshots.length}
                </span>
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1a2e1a] bg-[#090f09] text-xs text-slate-500 hover:text-white hover:border-[#2a4a2a] transition-colors"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

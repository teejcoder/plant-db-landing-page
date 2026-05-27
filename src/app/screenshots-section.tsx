'use client'

import { useState, useEffect, useCallback } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

type Screenshot = {
  label: string
  sublabel: string
  image: StaticImageData
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                <span className="text-[10px] text-slate-500 truncate block">plant-database.vercel.app</span>
              </div>
              <ZoomIn className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>

            {/* Screenshot image */}
            <div className="relative aspect-16/10 bg-[#e0eae0]">
              <Image
                src={shot.image}
                alt={shot.label}
                fill
                className="object-cover opacity-65 group-hover:opacity-80 transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#f5fdf5]/95 via-[#f5fdf5]/30 to-transparent" />

              {/* Mock UI skeleton */}
              <div className="absolute inset-x-0 top-0 p-3 opacity-20 pointer-events-none">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 w-16 rounded-full bg-green-600/40" />
                  <div className="h-1.5 w-24 rounded-full bg-slate-500/40" />
                  <div className="ml-auto h-1.5 w-10 rounded-full bg-slate-500/30" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-8 rounded bg-green-300/30 border border-green-400/20" />
                  ))}
                </div>
              </div>

              {/* Label */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs font-semibold text-green-700 leading-snug">{shot.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{shot.sublabel}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500 text-center">Screenshots available on request.</p>

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

            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/80">
              <Image
                src={current.image}
                alt={current.label}
                className="w-full h-auto block"
                priority
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
                <span className="text-xs text-slate-700 tabular-nums">
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

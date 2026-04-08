'use client'
import { useState, useRef, useCallback } from 'react'

const cards = [
  {
    badge: 'PHOTOGRAPHER & FILMMAKER',
    emoji: '📸',
    title: 'Your Name',
    sub: 'Visual Storyteller',
    extra: [
      { label: 'base', value: 'Tokyo, Japan' },
      { label: 'status', value: 'available', color: '#69f0ae' },
    ],
    num: '01 / 03',
    accent: ['#7b2ff7', '#f107a3'],
    glow: 'rgba(123,47,247,0.5)',
    bg: 'linear-gradient(145deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)',
    badgeColor: 'rgba(180,160,255,0.9)',
    badgeBorder: 'rgba(140,100,255,0.4)',
    badgeBg: 'rgba(100,60,200,0.15)',
  },
  {
    badge: 'ABOUT ME',
    emoji: '🎬',
    title: 'Skills',
    sub: '制作スキル一覧',
    tags: ['Portrait', 'Landscape', 'Short Film', 'Commercial', 'Color Grade', 'Travel'],
    num: '02 / 03',
    accent: ['#00c853', '#69f0ae'],
    glow: 'rgba(0,200,83,0.4)',
    bg: 'linear-gradient(145deg,#0d1f0d 0%,#0a2e1a 40%,#0f4a2e 100%)',
    badgeColor: 'rgba(100,255,180,0.9)',
    badgeBorder: 'rgba(60,200,120,0.4)',
    badgeBg: 'rgba(0,150,60,0.15)',
  },
  {
    badge: 'CONTACT',
    emoji: '✉️',
    title: "Let's work\ntogether",
    sub: 'お気軽にご連絡ください',
    extra: [
      { label: 'email', value: 'hello@yourname.com' },
      { label: 'instagram', value: '@yourname' },
    ],
    num: '03 / 03',
    accent: ['#e91e63', '#ff6090'],
    glow: 'rgba(233,30,99,0.4)',
    bg: 'linear-gradient(145deg,#1f0d1a 0%,#2e0a22 40%,#4a0f38 100%)',
    badgeColor: 'rgba(255,150,200,0.9)',
    badgeBorder: 'rgba(200,80,140,0.4)',
    badgeBg: 'rgba(150,0,80,0.15)',
  },
]

const STAR_POSITIONS = Array.from({ length: 18 }, (_, i) => ({
  sx: (i * 37.3) % 100,
  sy: (i * 61.7 + 13) % 100,
}))

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [holo, setHolo] = useState({ opacity: 0, px: 50, py: 50, angle: 0 })
  const [glare, setGlare] = useState({ opacity: 0, px: 50, py: 50 })
  const [starOps, setStarOps] = useState(STAR_POSITIONS.map(() => 0))
  const [snap, setSnap] = useState(true)
  const cardRef = useRef(null)
  const touchStartX = useRef(0)

  const handleMove = useCallback((clientX, clientY) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const cx = rect.width / 2, cy = rect.height / 2
    const dx = (x - cx) / cx
    const dy = (y - cy) / cy
    setSnap(false)
    setTilt({ x: -dy * 18, y: dx * 18 })
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    setHolo({ opacity: 0.25, px, py, angle: dx * 180 })
    setGlare({ opacity: 1, px, py })
    setStarOps(STAR_POSITIONS.map(({ sx, sy }) => {
      const dist = Math.sqrt((sx / 100 * rect.width - x) ** 2 + (sy / 100 * rect.height - y) ** 2)
      return Math.max(0, 1 - dist / 120)
    }))
  }, [])

  const handleReset = useCallback(() => {
    setSnap(true)
    setTilt({ x: 0, y: 0 })
    setHolo({ opacity: 0, px: 50, py: 50, angle: 0 })
    setGlare({ opacity: 0, px: 50, py: 50 })
    setStarOps(STAR_POSITIONS.map(() => 0))
  }, [])

  const card = cards[current]
  const transition = snap
    ? 'transform 0.5s cubic-bezier(.23,1,.32,1), box-shadow 0.5s'
    : 'transform 0.1s, box-shadow 0.1s'

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(120,80,255,0.08) 0%, transparent 60%)',
      }} />

      <div style={{ perspective: '1000px' }}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const diff = e.changedTouches[0].clientX - touchStartX.current
          if (diff < -50 && current < cards.length - 1) setCurrent(c => c + 1)
          else if (diff > 50 && current > 0) setCurrent(c => c - 1)
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: '280px', height: '420px', borderRadius: '20px',
            position: 'relative', cursor: 'grab',
            transition,
            transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg) scale(${snap ? 1 : 1.04})`,
            boxShadow: snap
              ? '0 20px 60px rgba(0,0,0,0.5)'
              : `${-tilt.y}px ${tilt.x}px 60px rgba(0,0,0,0.5), 0 0 40px rgba(120,80,255,0.3)`,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={e => handleMove(e.clientX, e.clientY)}
          onMouseLeave={handleReset}
          onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY) }}
          onTouchEnd={handleReset}
        >
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden',
            background: card.bg, border: '1px solid rgba(255,255,255,0.12)',
          }}>
            {/* Foil */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'repeating-linear-gradient(105deg,transparent 0%,rgba(255,100,255,0.03) 3%,rgba(100,200,255,0.05) 6%,rgba(255,255,100,0.03) 9%,transparent 12%)',
              mixBlendMode: 'color-dodge',
            }} />
            {/* Holo */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
              opacity: holo.opacity,
              background: `conic-gradient(from ${holo.angle}deg at ${holo.px}% ${holo.py}%, #ff000033,#ff7f0033,#ffff0033,#00ff0033,#0000ff33,#8b00ff33,#ff000033)`,
              mixBlendMode: 'color-dodge',
              transition: snap ? 'opacity 0.3s' : 'none',
            }} />
            {/* Glare */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.px}% ${glare.py}%, rgba(255,255,255,0.35) 0%, transparent 55%)`,
              mixBlendMode: 'overlay',
              transition: snap ? 'opacity 0.3s' : 'none',
            }} />
            {/* Stars */}
            {STAR_POSITIONS.map((pos, i) => starOps[i] > 0 && (
              <div key={i} style={{
                position: 'absolute',
                left: pos.sx + '%', top: pos.sy + '%',
                width: '2px', height: '2px', borderRadius: '50%',
                background: '#fff', opacity: starOps[i],
                boxShadow: starOps[i] > 0.3 ? `0 0 ${3 + starOps[i] * 4}px #fff` : 'none',
                pointerEvents: 'none',
              }} />
            ))}

            {/* Card content */}
            <div style={{ position: 'relative', zIndex: 2, padding: '1.75rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <span style={{
                display: 'inline-block', fontSize: '10px', letterSpacing: '1.5px',
                color: card.badgeColor, border: `1px solid ${card.badgeBorder}`,
                borderRadius: '999px', padding: '3px 12px',
                background: card.badgeBg, width: 'fit-content',
              }}>
                {card.badge}
              </span>

              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: `linear-gradient(135deg,${card.accent[0]},${card.accent[1]})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', margin: '1rem 0',
                boxShadow: `0 0 30px ${card.glow}`,
              }}>
                {card.emoji}
              </div>

              <div style={{ fontSize: '26px', fontWeight: 500, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: '6px', whiteSpace: 'pre-line' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
                {card.sub}
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', margin: '0 0 1rem' }} />

              {card.extra && card.extra.map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: row.color || 'rgba(255,255,255,0.8)' }}>{row.value}</span>
                </div>
              ))}

              {card.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                  {card.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px', padding: '4px 10px', borderRadius: '999px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)',
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.5rem', fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                {card.num}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
        {cards.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            height: '6px', borderRadius: '3px', cursor: 'pointer',
            width: i === current ? '18px' : '6px',
            background: i === current ? 'rgba(150,100,255,0.9)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '1rem', letterSpacing: '0.5px' }}>
        ← スワイプで次のカードへ →
      </div>
    </main>
  )
}

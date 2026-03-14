import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  depth: number
  radius: number
  color: string
}

const COLORS = ['#8b7db8', '#6b5d98', '#a594d0']
const random = (min: number, max: number): number => Math.random() * (max - min) + min

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const particleCount = Math.round(Math.max(80, Math.min(120, window.innerWidth / 14)))
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: random(0, window.innerWidth),
      y: random(0, window.innerHeight),
      vx: random(-0.15, 0.15),
      vy: random(-0.15, 0.15),
      depth: random(0.5, 1.4),
      radius: random(0.9, 2.2),
      color: COLORS[Math.floor(random(0, COLORS.length))],
    }))

    const draw = () => {
      ctx.fillStyle = '#0d1525'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        p.x += p.vx * p.depth
        p.y += p.vy * p.depth

        if (p.x < -20) p.x = window.innerWidth + 20
        if (p.x > window.innerWidth + 20) p.x = -20
        if (p.y < -20) p.y = window.innerHeight + 20
        if (p.y > window.innerHeight + 20) p.y = -20

        const glow = p.radius * 4
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow)
        gradient.addColorStop(0, `${p.color}AA`)
        gradient.addColorStop(1, `${p.color}00`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 110) continue

          const alpha = ((110 - distance) / 110) * 0.2
          ctx.strokeStyle = `rgba(139, 125, 184, ${alpha.toFixed(3)})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      raf = window.requestAnimationFrame(draw)
    }

    raf = window.requestAnimationFrame(draw)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}

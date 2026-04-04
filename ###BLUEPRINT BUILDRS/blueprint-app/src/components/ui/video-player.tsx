import * as React from 'react'
import { cn } from '../../lib/utils'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Film,
} from 'lucide-react'

export interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src?: string
  poster?: string
  title?: string
  className?: string
  style?: React.CSSProperties
}

export function VideoPlayer({ src, poster, title, className, style, ...props }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying]       = React.useState(false)
  const [currentTime, setCurrentTime]   = React.useState(0)
  const [duration, setDuration]         = React.useState(0)
  const [volume, setVolume]             = React.useState(1)
  const [isMuted, setIsMuted]           = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showControls, setShowControls] = React.useState(true)

  const videoRef     = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const hideTimeout  = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const fmt = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (!videoRef.current || !src) return
    isPlaying ? videoRef.current.pause() : videoRef.current.play()
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (videoRef.current) { videoRef.current.volume = v; setIsMuted(v === 0) }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value)
    setCurrentTime(t)
    if (videoRef.current) videoRef.current.currentTime = t
  }

  const skip = (s: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + s))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const resetHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    setShowControls(true)
    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  React.useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onMeta  = () => setDuration(v.duration)
    const onTime  = () => setCurrentTime(v.currentTime)
    const onPlay  = () => { setIsPlaying(true); resetHide() }
    const onPause = () => { setIsPlaying(false); setShowControls(true); if (hideTimeout.current) clearTimeout(hideTimeout.current) }
    const onVol   = () => { setVolume(v.volume); setIsMuted(v.muted) }
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('volumechange', onVol)
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('volumechange', onVol)
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
    }
  }, [isPlaying])

  React.useEffect(() => {
    const onFsc = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsc)
    return () => document.removeEventListener('fullscreenchange', onFsc)
  }, [])

  // ── Placeholder (no video) ────────────────────────────────────────────────
  if (!src) {
    return (
      <div className={cn('relative w-full rounded-xl overflow-hidden bg-secondary border border-border', className)}
        style={{ aspectRatio: '16/9', ...style }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
            <Film size={22} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          {title && (
            <p className="text-[12px] font-semibold text-foreground px-4 text-center">{title}</p>
          )}
          <p className="text-[11px] text-muted-foreground/60">Vidéo bientôt disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full bg-black rounded-xl overflow-hidden group', className)}
      style={{ aspectRatio: '16/9', ...style }}
      onMouseMove={resetHide}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        {...props}
      />

      {/* Center play/pause overlay */}
      <div className={cn(
        'absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300',
        (!isPlaying || showControls) ? 'opacity-100' : 'opacity-0',
      )}>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay() }}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 pointer-events-auto"
        >
          {isPlaying
            ? <Pause className="w-5 h-5" />
            : <Play  className="w-5 h-5 ml-0.5" />
          }
        </button>
      </div>

      {/* Controls bar */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none',
        showControls ? 'opacity-100' : 'opacity-0',
      )}>
        <div className="p-4 space-y-2.5 pointer-events-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 text-white">
            <span className="text-[11px] font-mono tabular-nums">{fmt(currentTime)}</span>
            <input
              type="range" min={0} max={duration || 0} value={currentTime}
              onChange={(e) => { e.stopPropagation(); handleSeek(e) }}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-white/30
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) 100%)`,
              }}
            />
            <span className="text-[11px] font-mono tabular-nums">{fmt(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); skip(-10) }} className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); togglePlay() }} className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); skip(10) }} className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 group/vol ml-1">
                <button onClick={(e) => { e.stopPropagation(); toggleMute() }} className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="w-0 group-hover/vol:w-16 transition-all duration-200 overflow-hidden">
                  <input
                    type="range" min={0} max={1} step={0.1} value={isMuted ? 0 : volume}
                    onChange={(e) => { e.stopPropagation(); handleVolumeChange(e) }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer bg-white/30
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

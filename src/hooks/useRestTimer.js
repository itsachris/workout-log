import { useState, useRef, useCallback, useEffect } from 'react'

export function useRestTimer(defaultDuration = 90) {
  const [duration, setDuration] = useState(defaultDuration)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const startTimeRef = useRef(null)
  const durationRef = useRef(0)
  const intervalRef = useRef(null)
  const audioCtxRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch {
      // audio not available
    }
  }, [])

  const tick = useCallback(() => {
    if (!startTimeRef.current) return
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const remaining = Math.max(0, Math.ceil(durationRef.current - elapsed))
    setSecondsRemaining(remaining)

    if (remaining <= 0) {
      clearTimer()
      setIsRunning(false)
      playBeep()
      try { navigator.vibrate?.([200, 100, 200]) } catch {}
    }
  }, [clearTimer, playBeep])

  const start = useCallback((customDuration) => {
    clearTimer()
    const dur = customDuration ?? duration
    durationRef.current = dur
    startTimeRef.current = Date.now()
    setSecondsRemaining(dur)
    setIsRunning(true)
    setIsVisible(true)
    intervalRef.current = setInterval(tick, 250)
  }, [duration, clearTimer, tick])

  const pause = useCallback(() => {
    if (!isRunning) return
    clearTimer()
    durationRef.current = secondsRemaining
    startTimeRef.current = null
    setIsRunning(false)
  }, [isRunning, secondsRemaining, clearTimer])

  const resume = useCallback(() => {
    if (isRunning || secondsRemaining <= 0) return
    durationRef.current = secondsRemaining
    startTimeRef.current = Date.now()
    setIsRunning(true)
    intervalRef.current = setInterval(tick, 250)
  }, [isRunning, secondsRemaining, tick])

  const extend = useCallback((seconds = 30) => {
    if (startTimeRef.current) {
      durationRef.current += seconds
      setSecondsRemaining((prev) => prev + seconds)
    }
  }, [])

  const dismiss = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setIsVisible(false)
    setSecondsRemaining(0)
    startTimeRef.current = null
  }, [clearTimer])

  // Re-sync when tab regains focus
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && isRunning) tick()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [isRunning, tick])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    secondsRemaining,
    isRunning,
    isVisible,
    duration,
    start,
    pause,
    resume,
    extend,
    dismiss,
    setDuration,
  }
}

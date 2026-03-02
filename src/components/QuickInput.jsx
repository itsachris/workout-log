import { useRef, useEffect } from 'react'

export default function QuickInput({ value, onChange, step = 1, min = 0, label, unit }) {
  const intervalRef = useRef(null)
  const holdingRef = useRef(false)
  const valueRef = useRef(value || 0)

  // Keep ref in sync with prop
  useEffect(() => {
    valueRef.current = value || 0
  }, [value])

  const adjust = (delta) => {
    const next = Math.max(min, valueRef.current + delta)
    valueRef.current = next
    onChange(next)
  }

  const startHold = (delta) => {
    holdingRef.current = false
    let speed = 200
    const repeat = () => {
      holdingRef.current = true
      adjust(delta)
      speed = Math.max(50, speed * 0.85)
      intervalRef.current = setTimeout(repeat, speed)
    }
    intervalRef.current = setTimeout(repeat, 400)
  }

  const stopHold = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleClick = (delta) => {
    if (!holdingRef.current) {
      adjust(delta)
    }
    holdingRef.current = false
  }

  const handleDirectInput = () => {
    const input = prompt(`Enter ${label || 'value'}:`, value || '')
    if (input !== null) {
      const num = parseFloat(input)
      if (!isNaN(num) && num >= min) {
        valueRef.current = num
        onChange(num)
      }
    }
  }

  return (
    <div className="quick-input">
      {label && <span className="quick-input-label">{label}</span>}
      <div className="quick-input-controls">
        <button
          className="quick-input-btn"
          onClick={() => handleClick(-step)}
          onPointerDown={() => startHold(-step)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          type="button"
        >
          -
        </button>
        <button className="quick-input-value" onClick={handleDirectInput} type="button">
          {value || 0}
          {unit && <span className="quick-input-unit">{unit}</span>}
        </button>
        <button
          className="quick-input-btn"
          onClick={() => handleClick(step)}
          onPointerDown={() => startHold(step)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  )
}

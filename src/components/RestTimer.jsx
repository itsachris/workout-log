export default function RestTimer({
  secondsRemaining,
  isRunning,
  isVisible,
  onDismiss,
  onExtend,
  onPause,
  onResume,
}) {
  if (!isVisible) return null

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`
  const isDone = secondsRemaining === 0 && !isRunning

  return (
    <div className={`rest-timer ${isDone ? 'rest-timer--done' : ''}`}>
      <div className="rest-timer-content">
        <span className="rest-timer-label">{isDone ? 'Rest Complete!' : 'Rest Timer'}</span>
        <span className="rest-timer-display">{display}</span>
        <div className="rest-timer-actions">
          {!isDone && (
            <>
              {isRunning ? (
                <button className="rest-timer-btn" onClick={onPause} type="button">
                  Pause
                </button>
              ) : (
                <button className="rest-timer-btn" onClick={onResume} type="button">
                  Resume
                </button>
              )}
              <button className="rest-timer-btn" onClick={() => onExtend(30)} type="button">
                +30s
              </button>
            </>
          )}
          <button className="rest-timer-btn rest-timer-btn--dismiss" onClick={onDismiss} type="button">
            {isDone ? 'OK' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  )
}

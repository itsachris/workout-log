import QuickInput from './QuickInput'

export default function SetRow({ set, index, onUpdate, onComplete, onRemove }) {
  return (
    <div className={`set-row ${set.completed ? 'set-row--done' : ''}`}>
      <span className="set-row-num">{index + 1}</span>
      <QuickInput
        value={set.weight}
        onChange={(v) => onUpdate(set.id, 'weight', v)}
        step={5}
        label="lbs"
      />
      <QuickInput
        value={set.reps}
        onChange={(v) => onUpdate(set.id, 'reps', v)}
        step={1}
        label="reps"
      />
      <button
        className={`set-row-check ${set.completed ? 'set-row-check--done' : ''}`}
        onClick={() => onComplete(set.id)}
        type="button"
        aria-label={set.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {set.completed ? '✓' : '○'}
      </button>
      {onRemove && (
        <button
          className="set-row-remove"
          onClick={() => onRemove(set.id)}
          type="button"
          aria-label="Remove set"
        >
          ×
        </button>
      )}
    </div>
  )
}

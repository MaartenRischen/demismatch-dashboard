function GapReports({ interfaceFeatures, mechanismIdsWithGaps, allMechanisms }) {
  const covered = interfaceFeatures.filter(m => mechanismIdsWithGaps.has(m.id)).length
  const total = allMechanisms.length
  const missing = allMechanisms.filter(m => !mechanismIdsWithGaps.has(m.id))

  return (
    <section className="bg-card border border-border rounded-sm p-3">
      <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-2">
        Gap Reports
      </h2>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full"
            style={{ width: `${(covered / Math.max(interfaceFeatures.length, 1)) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-text">
          {covered}/{interfaceFeatures.length}
        </span>
      </div>
      <div className="font-mono text-[10px] text-text-muted">
        Total coverage: {mechanismIdsWithGaps.size} of {total} entries
      </div>
      {missing.length > 0 && interfaceFeatures.filter(m => !mechanismIdsWithGaps.has(m.id)).length > 0 && (
        <div className="mt-2">
          <div className="text-[10px] text-text-dim mb-1">Missing (interface features):</div>
          {interfaceFeatures.filter(m => !mechanismIdsWithGaps.has(m.id)).map(m => (
            <div key={m.id} className="text-[10px] text-status-amber font-mono">
              M{String(m.id).padStart(2, '0')} {m.name}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CompletenessAudit({ completeness }) {
  const flagged = completeness.filter(c => c.pct < 80)

  return (
    <section className="bg-card border border-border rounded-sm p-3">
      <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-3">
        Completeness Audit
      </h2>
      <div className="flex flex-col gap-1.5">
        {completeness
          .sort((a, b) => a.pct - b.pct)
          .map(c => (
            <div key={c.id}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-text-muted w-28 shrink-0 truncate">
                  M{String(c.id).padStart(2, '0')} {c.name}
                </span>
                <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.pct}%`,
                      backgroundColor: c.pct >= 90 ? '#4ade80' : c.pct >= 80 ? '#fbbf24' : '#f87171',
                    }}
                  />
                </div>
                <span className={`font-mono text-[10px] w-8 text-right shrink-0 ${
                  c.pct < 80 ? 'text-status-red' : c.pct < 90 ? 'text-status-amber' : 'text-status-green'
                }`}>
                  {c.pct}%
                </span>
              </div>
              {c.pct < 80 && (
                <div className="pl-[7.5rem] text-[9px] text-text-dim mt-0.5">
                  Missing: {c.missing.join(', ')}
                </div>
              )}
            </div>
          ))}
      </div>
      {flagged.length > 0 && (
        <div className="mt-3 font-mono text-[10px] text-status-red">
          {flagged.length} mechanism{flagged.length > 1 ? 's' : ''} below 80% completeness
        </div>
      )}
    </section>
  )
}

export default function ActivityColumn({ data }) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <GapReports
        interfaceFeatures={data.interfaceFeatures}
        mechanismIdsWithGaps={data.mechanismIdsWithGaps}
        allMechanisms={data.mechanisms}
      />
      <CompletenessAudit completeness={data.completeness} />
    </div>
  )
}

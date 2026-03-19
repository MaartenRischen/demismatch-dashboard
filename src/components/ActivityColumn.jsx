import { formatDistanceToNow, truncate, CATEGORY_COLORS } from '../lib/utils'

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || 'bg-[#6b7280] text-[#6b7280]'
  const [bgClass, textClass] = colors.split(' ')
  return (
    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm ${bgClass}/15 ${textClass}`}>
      {category}
    </span>
  )
}

function RecentDecisions({ decisions }) {
  return (
    <section className="bg-card border border-border rounded-sm">
      <div className="px-3 py-2 border-b border-border">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium">
          Recent Decisions
        </h2>
      </div>
      <div>
        {decisions.map((d, i) => (
          <div key={d.id || i} className="px-3 py-2 border-b border-border last:border-b-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-text-dim">#{d.id}</span>
              <CategoryBadge category={d.category} />
              <span className="ml-auto font-mono text-[9px] text-text-dim">
                {d.created_at ? formatDistanceToNow(d.created_at) : ''}
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-snug">
              {truncate(d.decision_text, 120)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RecentUpdates({ updates }) {
  const tableColors = {
    axiom: 'text-status-blue',
    mechanism: 'text-status-green',
    document: 'text-status-purple',
  }

  return (
    <section className="bg-card border border-border rounded-sm">
      <div className="px-3 py-2 border-b border-border">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium">
          Recent Updates
        </h2>
      </div>
      <div>
        {updates.map((u, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0">
            <span className={`font-mono text-[9px] uppercase w-14 shrink-0 ${tableColors[u.table] || 'text-text-dim'}`}>
              {u.table}
            </span>
            <span className="text-[11px] text-text-muted truncate flex-1">{u.name}</span>
            <span className="font-mono text-[9px] text-text-dim shrink-0">
              {formatDistanceToNow(u.updated_at)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

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
      <RecentDecisions decisions={data.decisions} />
      <RecentUpdates updates={data.recentUpdates} />
      <GapReports
        interfaceFeatures={data.interfaceFeatures}
        mechanismIdsWithGaps={data.mechanismIdsWithGaps}
        allMechanisms={data.mechanisms}
      />
      <CompletenessAudit completeness={data.completeness} />
    </div>
  )
}

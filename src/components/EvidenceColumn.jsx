import { RELATIONSHIP_COLORS, EVIDENCE_TAG_COLORS } from '../lib/utils'

function StackedBar({ data, colors, total }) {
  return (
    <div>
      <div className="flex h-5 rounded-sm overflow-hidden">
        {Object.entries(data).map(([key, count]) => {
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, backgroundColor: colors[key] || '#6b7280' }}
              className="min-w-[2px] transition-all"
              title={`${key}: ${count}`}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {Object.entries(data).map(([key, count]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: colors[key] || '#6b7280' }}
            />
            <span className="font-mono text-[10px] text-text-muted">
              {key}
            </span>
            <span className="font-mono text-[10px] text-text font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBarChart({ items, maxValue }) {
  return (
    <div className="flex flex-col gap-1">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-muted w-28 shrink-0 truncate text-right">
            {item.name}
          </span>
          <div className="flex-1 h-4 bg-bg rounded-sm overflow-hidden">
            <div
              className="h-full bg-accent/60 rounded-sm transition-all"
              style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-text w-6 text-right shrink-0">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function EvidenceMatrix({ interfaceFeatures, matrix }) {
  const relationships = ['SUPPORTS', 'EXTENDS', 'COMPLICATES', 'CHALLENGES']

  // Find max value for heat-map scaling
  let maxVal = 0
  interfaceFeatures.forEach(m => {
    relationships.forEach(rel => {
      const val = matrix[m.id]?.[rel] || 0
      if (val > maxVal) maxVal = val
    })
  })

  function cellColor(val) {
    if (val === 0 || !val) return 'transparent'
    const intensity = Math.min(val / maxVal, 1)
    return `rgba(212, 165, 116, ${0.1 + intensity * 0.7})`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            <th className="text-left font-mono text-text-dim py-1 pr-2 font-normal">Mechanism</th>
            {relationships.map(rel => (
              <th
                key={rel}
                className="text-center font-mono text-text-dim py-1 px-1 font-normal w-16"
                style={{ color: RELATIONSHIP_COLORS[rel] }}
              >
                {rel.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {interfaceFeatures.sort((a, b) => a.id - b.id).map(m => (
            <tr key={m.id} className="border-t border-border">
              <td className="font-mono text-text-muted py-1 pr-2 truncate max-w-[120px]">
                <span className="text-accent">M{String(m.id).padStart(2, '0')}</span>{' '}
                {m.name}
              </td>
              {relationships.map(rel => {
                const val = matrix[m.id]?.[rel] || 0
                return (
                  <td
                    key={rel}
                    className="text-center font-mono py-1 px-1"
                    style={{ backgroundColor: cellColor(val) }}
                  >
                    {val > 0 ? val : <span className="text-text-dim">·</span>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function EvidenceColumn({ data }) {
  const totalPapers = data.papers.length

  // Evidence tags ordered
  const tagOrder = ['ESTABLISHED', 'SUPPORTED', 'SYNTHESIZED', 'NOVEL', 'RESISTED', 'EDGE CASE']
  const orderedTags = {}
  tagOrder.forEach(tag => {
    orderedTags[tag] = data.evidenceTagDist[tag] || 0
  })
  const totalClaims = Object.values(orderedTags).reduce((a, b) => a + b, 0)

  // Papers per mechanism sorted
  const papersPerMech = data.interfaceFeatures
    .map(m => ({
      id: m.id,
      name: `M${String(m.id).padStart(2, '0')} ${m.name}`,
      value: data.papersByMechanism[m.id] || 0,
    }))
    .sort((a, b) => b.value - a.value)

  const maxPapers = papersPerMech.length > 0 ? papersPerMech[0].value : 0

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Paper Relationship Distribution */}
      <section className="bg-card border border-border rounded-sm p-3">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-3">
          Paper Relationships <span className="text-accent">({totalPapers})</span>
        </h2>
        <StackedBar
          data={data.relationshipDist}
          colors={RELATIONSHIP_COLORS}
          total={totalPapers}
        />
      </section>

      {/* Evidence Tags */}
      <section className="bg-card border border-border rounded-sm p-3">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-3">
          Evidence Tags <span className="text-accent">({totalClaims})</span>
        </h2>
        <StackedBar
          data={orderedTags}
          colors={EVIDENCE_TAG_COLORS}
          total={totalClaims}
        />
      </section>

      {/* Papers Per Mechanism */}
      <section className="bg-card border border-border rounded-sm p-3">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-3">
          Papers Per Mechanism
        </h2>
        <HorizontalBarChart items={papersPerMech} maxValue={maxPapers} />
      </section>

      {/* Evidence Matrix */}
      <section className="bg-card border border-border rounded-sm p-3">
        <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium mb-3">
          Mechanism × Evidence Matrix
        </h2>
        <EvidenceMatrix
          interfaceFeatures={data.interfaceFeatures}
          matrix={data.matrix}
        />
      </section>
    </div>
  )
}

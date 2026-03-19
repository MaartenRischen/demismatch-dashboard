import { useState } from 'react'
import { truncate, getCompletenessColor, getPhyloDepth } from '../lib/utils'

function AxiomItem({ axiom }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className="border-b border-border last:border-b-0 px-3 py-2 cursor-pointer hover:bg-card-hover transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] text-accent shrink-0">A{String(axiom.id).padStart(2, '0')}</span>
        <span className="text-xs font-medium text-text">{axiom.name}</span>
        <span className="ml-auto text-[10px] text-text-dim">{expanded ? '−' : '+'}</span>
      </div>
      {!expanded && (
        <p className="text-[11px] text-text-muted mt-0.5 pl-7">
          {truncate(axiom.statement, 90)}
        </p>
      )}
      {expanded && (
        <div className="mt-2 pl-7 text-[11px] text-text-muted leading-relaxed">
          <p>{axiom.statement}</p>
          {axiom.source && (
            <p className="mt-1 text-text-dim italic">Source: {axiom.source}</p>
          )}
          {axiom.evidence_status && (
            <p className="mt-1">
              <span className="font-mono text-[10px] text-accent">{axiom.evidence_status}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function MechanismItem({ mechanism, paperCount, claimCount }) {
  const completenessColor = getCompletenessColor(mechanism)
  const phyloDepth = getPhyloDepth(mechanism)

  return (
    <div className="border-b border-border last:border-b-0 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${completenessColor}`} />
        <span className="font-mono text-[10px] text-accent shrink-0">
          M{String(mechanism.id).padStart(2, '0')}
        </span>
        <span className="text-xs font-medium text-text truncate">{mechanism.name}</span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          {phyloDepth && (
            <span className="font-mono text-[9px] bg-accent-dim text-accent px-1.5 py-0.5 rounded-sm">
              {phyloDepth}
            </span>
          )}
          <span className="font-mono text-[9px] bg-status-blue/15 text-status-blue px-1.5 py-0.5 rounded-sm">
            {paperCount || 0}p
          </span>
          <span className="font-mono text-[9px] bg-status-green/15 text-status-green px-1.5 py-0.5 rounded-sm">
            {claimCount || 0}c
          </span>
        </div>
      </div>
      {mechanism.core_claim && (
        <p className="text-[10px] text-text-dim mt-0.5 pl-5">
          {truncate(mechanism.core_claim, 100)}
        </p>
      )}
    </div>
  )
}

const ENTRY_TYPE_GROUPS = [
  { type: 'mismatch_effect', label: 'Mismatch Effects' },
  { type: 'population_lens', label: 'Population Lenses' },
  { type: 'axiom_operational', label: 'Axiom-Operational' },
  { type: 'adversary', label: 'Adversary' },
  { type: 'pattern', label: 'Pattern' },
  { type: 'meta_critique', label: 'Meta-Critique' },
  { type: 'absorbed', label: 'Absorbed' },
]

function OtherEntries({ entries }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] text-text-dim hover:text-text-muted transition-colors"
      >
        <span className="uppercase tracking-wider font-medium">Other Entry Types ({entries.length})</span>
        <span>{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="px-3 pb-2">
          {ENTRY_TYPE_GROUPS.map(({ type, label }) => {
            const items = entries.filter(e => e.entry_type === type)
            if (items.length === 0) return null
            return (
              <div key={type} className="mt-2">
                <div className="text-[10px] uppercase tracking-wider text-text-dim mb-1">
                  {label} ({items.length})
                </div>
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-baseline gap-2 py-0.5 ${type === 'absorbed' ? 'opacity-40' : ''}`}
                  >
                    <span className="font-mono text-[10px] text-text-dim">
                      M{String(item.id).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-text-muted">{item.name}</span>
                    {type === 'absorbed' && item.notes && (
                      <span className="text-[9px] text-text-dim italic ml-1">→ absorbed</span>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function HierarchyColumn({ data }) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Axioms */}
      <section className="bg-card border border-border rounded-sm">
        <div className="px-3 py-2 border-b border-border">
          <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium">
            Axioms <span className="text-accent">({data.axioms.length})</span>
          </h2>
        </div>
        <div>
          {data.axioms
            .sort((a, b) => a.id - b.id)
            .map(axiom => (
              <AxiomItem key={axiom.id} axiom={axiom} />
            ))}
        </div>
      </section>

      {/* Interface Features */}
      <section className="bg-card border border-border rounded-sm">
        <div className="px-3 py-2 border-b border-border">
          <h2 className="text-[11px] uppercase tracking-wider text-text-dim font-medium">
            Interface Features <span className="text-accent">({data.interfaceFeatures.length})</span>
          </h2>
        </div>
        <div>
          {data.interfaceFeatures
            .sort((a, b) => a.id - b.id)
            .map(m => (
              <MechanismItem
                key={m.id}
                mechanism={m}
                paperCount={data.papersByMechanism[m.id]}
                claimCount={data.claimsByMechanism[m.id]}
              />
            ))}
        </div>
      </section>

      {/* Other Entry Types */}
      <section className="bg-card border border-border rounded-sm">
        <OtherEntries entries={data.otherEntries} />
      </section>
    </div>
  )
}

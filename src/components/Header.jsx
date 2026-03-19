import { formatDistanceToNow } from '../lib/utils'

export default function Header({ data }) {
  const activePapers = data.papers.length
  const interfaceCount = data.interfaceFeatures.length
  const totalEntries = data.mechanisms.length

  return (
    <header className="border-b border-border px-6 py-4">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="font-mono text-lg font-semibold text-accent tracking-tight">
            De-Mismatch Knowledge Base
          </h1>
        </div>
        <div className="font-mono text-xs text-text-muted">
          {data.lastUpdated && (
            <span>Updated {formatDistanceToNow(data.lastUpdated)}</span>
          )}
        </div>
      </div>
      <div className="mt-2 font-mono text-xs text-text-dim flex items-center gap-1.5 flex-wrap">
        <span className="text-text-muted">{data.axioms.length} axioms</span>
        <span>·</span>
        <span className="text-text-muted">{interfaceCount} mechanisms</span>
        <span className="text-text-dim text-[10px]">({totalEntries} total entries)</span>
        <span>·</span>
        <span className="text-text-muted">{activePapers} active papers</span>
        <span>·</span>
        <span className="text-text-muted">{data.claims.length} claims</span>
        <span>·</span>
        <span className="text-text-muted">{data.decisions.length} decisions</span>
        <span>·</span>
        <span className="text-text-muted">{data.documents.length} documents</span>
      </div>
    </header>
  )
}

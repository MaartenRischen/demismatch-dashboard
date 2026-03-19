import { useData } from './hooks/useData'
import Header from './components/Header'
import HierarchyColumn from './components/HierarchyColumn'
import EvidenceColumn from './components/EvidenceColumn'

function App() {
  const { data, loading, error } = useData()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-text-dim">Loading knowledge base…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-status-red">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header data={data} />
      <div className="flex-1 grid grid-cols-[2fr_3fr] gap-3 p-3 overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] pr-1">
          <HierarchyColumn data={data} />
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-80px)] pr-1">
          <EvidenceColumn data={data} />
        </div>
      </div>
    </div>
  )
}

export default App

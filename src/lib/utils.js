export function formatDistanceToNow(date) {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function truncate(str, len = 80) {
  if (!str) return ''
  if (str.length <= len) return str
  return str.slice(0, len).trim() + '…'
}

const COMPLETENESS_FIELDS = [
  'ancestral_function', 'ancestral_input', 'modern_input',
  'mismatch_signal', 'proxy_forms', 'the_real_thing',
  'key_research', 'decode_examples', 'phylogenetic_origin'
]

export function getCompletenessColor(mechanism) {
  const filled = COMPLETENESS_FIELDS.filter(f =>
    mechanism[f] && (typeof mechanism[f] === 'string' ? mechanism[f].trim() !== '' : true)
  ).length
  const ratio = filled / COMPLETENESS_FIELDS.length
  if (ratio >= 0.9) return 'bg-status-green'
  if (ratio >= 0.5) return 'bg-status-amber'
  return 'bg-status-red'
}

export function getPhyloDepth(mechanism) {
  if (!mechanism.phylogenetic_origin) return null
  const origin = typeof mechanism.phylogenetic_origin === 'string'
    ? JSON.parse(mechanism.phylogenetic_origin)
    : mechanism.phylogenetic_origin
  if (origin.earliest_form?.date_mya) {
    const mya = origin.earliest_form.date_mya
    if (mya >= 1000) return `${(mya / 1000).toFixed(1)} BYA`
    return `${mya} MYA`
  }
  return null
}

export const RELATIONSHIP_COLORS = {
  SUPPORTS: '#4ade80',
  EXTENDS: '#60a5fa',
  COMPLICATES: '#fbbf24',
  CHALLENGES: '#f87171',
  UNCLASSIFIED: '#6b7280',
}

export const EVIDENCE_TAG_COLORS = {
  ESTABLISHED: '#166534',
  SUPPORTED: '#4ade80',
  SYNTHESIZED: '#60a5fa',
  NOVEL: '#a78bfa',
  RESISTED: '#f97316',
  'EDGE CASE': '#fbbf24',
}

export const CATEGORY_COLORS = {
  axiom: 'bg-status-blue text-status-blue',
  mechanism: 'bg-status-green text-status-green',
  design: 'bg-status-purple text-status-purple',
  evidence: 'bg-status-amber text-status-amber',
  product: 'bg-status-teal text-status-teal',
  scope: 'bg-[#6b7280] text-[#6b7280]',
}

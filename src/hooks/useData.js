import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          { data: axioms, error: e1 },
          { data: mechanisms, error: e2 },
          { data: papers, error: e3 },
          { data: claims, error: e4 },
          { data: decisions, error: e5 },
          { data: documents, error: e6 },
          { data: gapReports, error: e7 },
        ] = await Promise.all([
          supabase.from('axioms').select('*'),
          supabase.from('mechanisms').select('*'),
          supabase.from('papers').select('id, title, authors, year, relationship, mechanisms, archived, created_at').eq('archived', false).range(0, 1999),
          supabase.from('claims').select('*'),
          supabase.from('decisions').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('documents').select('*'),
          supabase.from('gap_reports').select('id, mechanism_id'),
        ])

        const errors = [e1, e2, e3, e4, e5, e6, e7].filter(Boolean)
        if (errors.length > 0) {
          throw new Error(errors.map(e => e.message).join(', '))
        }

        // Compute derived data
        const interfaceFeatures = mechanisms.filter(m => m.entry_type === 'interface_feature')
        const otherEntries = mechanisms.filter(m => m.entry_type !== 'interface_feature')

        // Papers per mechanism
        const papersByMechanism = {}
        papers.forEach(paper => {
          if (paper.mechanisms) {
            paper.mechanisms.forEach(mid => {
              papersByMechanism[mid] = (papersByMechanism[mid] || 0) + 1
            })
          }
        })

        // Claims per mechanism
        const claimsByMechanism = {}
        claims.forEach(claim => {
          if (claim.mechanism_id) {
            claimsByMechanism[claim.mechanism_id] = (claimsByMechanism[claim.mechanism_id] || 0) + 1
          }
        })

        // Paper relationship distribution
        const relationshipDist = { SUPPORTS: 0, EXTENDS: 0, COMPLICATES: 0, CHALLENGES: 0, UNCLASSIFIED: 0 }
        papers.forEach(p => {
          const rel = p.relationship || 'UNCLASSIFIED'
          relationshipDist[rel] = (relationshipDist[rel] || 0) + 1
        })

        // Evidence tags distribution
        const evidenceTagDist = {}
        claims.forEach(c => {
          if (c.evidence_tag) {
            evidenceTagDist[c.evidence_tag] = (evidenceTagDist[c.evidence_tag] || 0) + 1
          }
        })

        // Mechanism x Evidence matrix
        const matrix = {}
        papers.forEach(paper => {
          if (paper.mechanisms) {
            paper.mechanisms.forEach(mid => {
              if (!matrix[mid]) matrix[mid] = {}
              const rel = paper.relationship || 'UNCLASSIFIED'
              matrix[mid][rel] = (matrix[mid][rel] || 0) + 1
            })
          }
        })

        // Most recent update across all tables
        const allDates = [
          ...axioms.map(a => a.updated_at),
          ...mechanisms.map(m => m.updated_at),
          ...documents.map(d => d.updated_at),
          ...papers.map(p => p.created_at).filter(Boolean),
          ...claims.map(c => c.updated_at).filter(Boolean),
        ].filter(Boolean).map(d => new Date(d))
        const lastUpdated = allDates.length ? new Date(Math.max(...allDates)) : null

        // Recent updates across tables
        const recentUpdates = [
          ...axioms.map(a => ({ table: 'axiom', name: a.name, updated_at: a.updated_at })),
          ...mechanisms.map(m => ({ table: 'mechanism', name: m.name, updated_at: m.updated_at })),
          ...documents.map(d => ({ table: 'document', name: d.title, updated_at: d.updated_at })),
        ]
          .filter(r => r.updated_at)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 10)

        // Gap report coverage
        const mechanismIdsWithGaps = new Set(gapReports.map(g => g.mechanism_id))

        // Completeness audit for interface features
        const templateFields = [
          'ancestral_function', 'ancestral_input', 'modern_input',
          'mismatch_signal', 'proxy_forms', 'the_real_thing',
          'key_research', 'decode_examples', 'phylogenetic_origin'
        ]

        const completeness = interfaceFeatures.map(m => {
          const filled = templateFields.filter(f => m[f] && (typeof m[f] === 'string' ? m[f].trim() !== '' : true)).length
          return {
            id: m.id,
            name: m.name,
            filled,
            total: templateFields.length,
            pct: Math.round((filled / templateFields.length) * 100),
            missing: templateFields.filter(f => !m[f] || (typeof m[f] === 'string' && m[f].trim() === ''))
          }
        })

        setData({
          axioms,
          mechanisms,
          interfaceFeatures,
          otherEntries,
          papers,
          claims,
          decisions,
          documents,
          gapReports,
          papersByMechanism,
          claimsByMechanism,
          relationshipDist,
          evidenceTagDist,
          matrix,
          lastUpdated,
          recentUpdates,
          mechanismIdsWithGaps,
          completeness,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  return { data, loading, error }
}

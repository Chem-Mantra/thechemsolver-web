'use client'
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

const Loading = () => (
  <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
    Loading tool…
  </div>
)

const LAB_MAP: Record<string, ComponentType> = {
  titration:                dynamic(() => import('@/app/labs/titration/page'),                { ssr: false, loading: Loading }),
  nomenclature:             dynamic(() => import('@/app/labs/nomenclature/page'),             { ssr: false, loading: Loading }),
  equilibrium:              dynamic(() => import('@/app/labs/equilibrium/page'),              { ssr: false, loading: Loading }),
  'ionic-equilibrium':      dynamic(() => import('@/app/labs/ionic-equilibrium/page'),       { ssr: false, loading: Loading }),
  kinetics:                 dynamic(() => import('@/app/labs/kinetics/page'),                { ssr: false, loading: Loading }),
  thermodynamics:           dynamic(() => import('@/app/labs/thermodynamics/page'),          { ssr: false, loading: Loading }),
  'electrochemical-potentials': dynamic(() => import('@/app/labs/electrochemical-potentials/page'), { ssr: false, loading: Loading }),
  coordination:             dynamic(() => import('@/app/labs/coordination/page'),            { ssr: false, loading: Loading }),
  'nuclear-decay':          dynamic(() => import('@/app/labs/nuclear-decay/page'),           { ssr: false, loading: Loading }),
  quantum:                  dynamic(() => import('@/app/labs/quantum/page'),                 { ssr: false, loading: Loading }),
  'radial-probability':     dynamic(() => import('@/app/labs/radial-probability/page'),      { ssr: false, loading: Loading }),
  'atomic-evolution':       dynamic(() => import('@/app/labs/atomic-evolution/page'),        { ssr: false, loading: Loading }),
  vsepr:                    dynamic(() => import('@/app/labs/vsepr/page'),                   { ssr: false, loading: Loading }),
  hydrocarbon:              dynamic(() => import('@/app/labs/hydrocarbon/page'),             { ssr: false, loading: Loading }),
  stereochemistry:          dynamic(() => import('@/app/labs/stereochemistry/page'),         { ssr: false, loading: Loading }),
  'organic-mechanism':      dynamic(() => import('@/app/labs/organic-mechanism/page'),       { ssr: false, loading: Loading }),
  'periodic-table':         dynamic(() => import('@/app/labs/periodic-table/page'),          { ssr: false, loading: Loading }),
  'crystal-field':          dynamic(() => import('@/app/labs/crystal-field/page'),           { ssr: false, loading: Loading }),
  hybridization:            dynamic(() => import('@/app/labs/hybridization/page'),           { ssr: false, loading: Loading }),
  'projection-formula':     dynamic(() => import('@/app/labs/projection-formula/page'),      { ssr: false, loading: Loading }),
  electrochemistry:         dynamic(() => import('@/app/labs/electrochemistry/page'),        { ssr: false, loading: Loading }),
  electrochemical:          dynamic(() => import('@/app/labs/electrochemical/page'),         { ssr: false, loading: Loading }),
  periodic:                 dynamic(() => import('@/app/labs/periodic/page'),                { ssr: false, loading: Loading }),
  mechanisms:               dynamic(() => import('@/app/labs/mechanisms/page'),              { ssr: false, loading: Loading }),
  'organic-synthesis':      dynamic(() => import('@/app/labs/organic-synthesis/page'),       { ssr: false, loading: Loading }),
}

export default function LabWrapper({ slug }: { slug: string }) {
  const Lab = LAB_MAP[slug]
  if (!Lab) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Tool not found. <a href="/labs" className="ml-2 text-purple-400 underline">Browse all tools →</a>
      </div>
    )
  }
  return <Lab />
}

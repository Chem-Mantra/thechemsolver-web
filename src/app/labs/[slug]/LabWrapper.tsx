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
  // AP Chemistry labs
  'gas-laws':               dynamic(() => import('@/app/labs/gas-laws/page'),               { ssr: false, loading: Loading }),
  'colligative-properties': dynamic(() => import('@/app/labs/colligative-properties/page'), { ssr: false, loading: Loading }),
  'phase-diagram':          dynamic(() => import('@/app/labs/phase-diagram/page'),           { ssr: false, loading: Loading }),
  'unit-cell':              dynamic(() => import('@/app/labs/unit-cell/page'),               { ssr: false, loading: Loading }),
  'mo-diagram':             dynamic(() => import('@/app/labs/mo-diagram/page'),              { ssr: false, loading: Loading }),
  'lewis-structure':        dynamic(() => import('@/app/labs/lewis-structure/page'),         { ssr: false, loading: Loading }),
  'bond-polarity':          dynamic(() => import('@/app/labs/bond-polarity/page'),           { ssr: false, loading: Loading }),
  'imf-comparator':         dynamic(() => import('@/app/labs/imf-comparator/page'),          { ssr: false, loading: Loading }),
  'beer-lambert':           dynamic(() => import('@/app/labs/beer-lambert/page'),            { ssr: false, loading: Loading }),
  chromatography:           dynamic(() => import('@/app/labs/chromatography/page'),          { ssr: false, loading: Loading }),
  'reaction-classifier':    dynamic(() => import('@/app/labs/reaction-classifier/page'),     { ssr: false, loading: Loading }),
  'net-ionic-equation':     dynamic(() => import('@/app/labs/net-ionic-equation/page'),      { ssr: false, loading: Loading }),
  'limiting-reagent':       dynamic(() => import('@/app/labs/limiting-reagent/page'),        { ssr: false, loading: Loading }),
  'stoichiometry-mapper':   dynamic(() => import('@/app/labs/stoichiometry-mapper/page'),    { ssr: false, loading: Loading }),
  'hess-law':               dynamic(() => import('@/app/labs/hess-law/page'),               { ssr: false, loading: Loading }),
  calorimetry:              dynamic(() => import('@/app/labs/calorimetry/page'),             { ssr: false, loading: Loading }),
  'bond-energy':            dynamic(() => import('@/app/labs/bond-energy/page'),             { ssr: false, loading: Loading }),
  'enthalpy-diagram':       dynamic(() => import('@/app/labs/enthalpy-diagram/page'),        { ssr: false, loading: Loading }),
  'electrolytic-cell':      dynamic(() => import('@/app/labs/electrolytic-cell/page'),       { ssr: false, loading: Loading }),
  'photoelectric-effect':   dynamic(() => import('@/app/labs/photoelectric-effect/page'),    { ssr: false, loading: Loading }),
  'h-emission-spectrum':    dynamic(() => import('@/app/labs/h-emission-spectrum/page'),     { ssr: false, loading: Loading }),
  'electron-config':        dynamic(() => import('@/app/labs/electron-config/page'),         { ssr: false, loading: Loading }),
  'pes-spectrum':           dynamic(() => import('@/app/labs/pes-spectrum/page'),            { ssr: false, loading: Loading }),
  'isotope-mass-spec':      dynamic(() => import('@/app/labs/isotope-mass-spec/page'),       { ssr: false, loading: Loading }),
  'nmr-predictor':          dynamic(() => import('@/app/labs/nmr-predictor/page'),           { ssr: false, loading: Loading }),
  'mass-spec':              dynamic(() => import('@/app/labs/mass-spec/page'),               { ssr: false, loading: Loading }),
  'sn1-sn2-e1-e2':          dynamic(() => import('@/app/labs/sn1-sn2-e1-e2/page'),           { ssr: false, loading: Loading }),
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

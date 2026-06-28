'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area,
} from 'recharts'

// ── Chemistry engine ──────────────────────────────────────────
const R = 8.314, F_CONST = 96485

function arrhK(A: number, Ea: number, T: number) { return A * Math.exp(-Ea * 1000 / (R * T)) }

function concentration(C0: number, k: number, n: number, t: number): number {
  if (n === 0) return Math.max(0, C0 - k * t)
  if (n === 1) return C0 * Math.exp(-k * t)
  if (n === 2) return 1 / (1/C0 + k * t)
  if (n === 3) return 1 / Math.sqrt(1/(C0*C0) + 2*k*t)
  // nth order general
  return Math.pow(Math.pow(C0, 1-n) + (n-1)*k*t, 1/(1-n))
}

function halfLife(k: number, n: number, C0: number): number {
  if (n === 0) return C0 / (2 * k)
  if (n === 1) return Math.log(2) / k
  if (n === 2) return 1 / (k * C0)
  if (n === 3) return 3 / (2 * k * C0 * C0)
  return (Math.pow(2, n-1) - 1) / ((n-1) * k * Math.pow(C0, n-1))
}

function rateConst(C0: number, Ct: number, t: number, n: number): string {
  if (t <= 0 || Ct <= 0) return '—'
  if (n === 0) return `k = ([A]₀ − [A])/t = ${((C0-Ct)/t).toExponential(2)} M·s⁻¹`
  if (n === 1) return `k = ln([A]₀/[A])/t = ${(Math.log(C0/Ct)/t).toExponential(2)} s⁻¹`
  if (n === 2) return `k = (1/[A] − 1/[A]₀)/t = ${((1/Ct - 1/C0)/t).toExponential(2)} M⁻¹s⁻¹`
  if (n === 3) return `k = (1/2)(1/[A]² − 1/[A]₀²)/t = ${(0.5*(1/(Ct*Ct) - 1/(C0*C0))/t).toExponential(2)} M⁻²s⁻¹`
  return `k (${n}th) = ${((Math.pow(C0,1-n) - Math.pow(Ct,1-n))/((n-1)*t)).toExponential(2)}`
}

function integRateLaw(n: number): string[] {
  if (n === 0) return ['[A] = [A]₀ − kt', 'Graph: [A] vs t → straight line, slope = −k']
  if (n === 1) return ['ln[A] = ln[A]₀ − kt', '[A] = [A]₀·e^(−kt)', 'Graph: ln[A] vs t → straight line, slope = −k']
  if (n === 2) return ['1/[A] = 1/[A]₀ + kt', 'Graph: 1/[A] vs t → straight line, slope = +k']
  if (n === 3) return ['1/[A]² = 1/[A]₀² + 2kt', 'Graph: 1/[A]² vs t → straight line, slope = +2k']
  return [`[A]^(1-n) = [A]₀^(1-n) + (n−1)kt (n≠1)`, `Linearize: [A]^(1-n) vs t`]
}

function kFormulas(n: number): string[] {
  if (n === 0) return [
    'From [A]₀, [A], t:   k = ([A]₀ − [A]) / t',
    'From half-life:        k = [A]₀ / (2·t½)',
    'Units: M·s⁻¹  (concentration per time)',
  ]
  if (n === 1) return [
    'k = ln([A]₀/[A]) / t',
    'k = 2.303 × log([A]₀/[A]) / t   ← JEE form',
    'k = ln 2 / t½  =  0.693 / t½',
    'k = (1/t) × ln(N₀/N)   (for radioactive decay)',
    'Units: s⁻¹  (time⁻¹)',
  ]
  if (n === 2) return [
    'k = (1/t) × (1/[A] − 1/[A]₀)',
    'k = (1/t) × ([A]₀ − [A]) / ([A]·[A]₀)',
    'k = 1 / (t½ · [A]₀)',
    'Units: M⁻¹·s⁻¹',
  ]
  if (n === 3) return [
    'k = (1/2t) × (1/[A]² − 1/[A]₀²)',
    'k = 3 / (2·t½·[A]₀²)',
    'Units: M⁻²·s⁻¹',
  ]
  return [
    `k = ([A]₀^(1-n) − [A]^(1-n)) / ((n−1)·t)`,
    `t½ = (2^(n-1) − 1) / ((n−1)·k·[A]₀^(n-1))`,
    `Units: M^(1-n)·s⁻¹`,
  ]
}

function halfLifeFormulas(n: number): string[] {
  if (n === 0) return ['t½ = [A]₀ / 2k', 't½ ∝ [A]₀  (depends on concentration!)']
  if (n === 1) return ['t½ = ln2 / k = 0.693 / k', 't½ independent of [A]₀  ← KEY JEE fact!', 'λ = k (decay constant) for radioactivity']
  if (n === 2) return ['t½ = 1 / (k·[A]₀)', 't½ ∝ 1/[A]₀  (inversely proportional)']
  if (n === 3) return ['t½ = 3 / (2k·[A]₀²)', 't½ ∝ 1/[A]₀²']
  return ['t½ = (2^(n−1) − 1) / ((n−1)·k·[A]₀^(n−1))', `t½ ∝ [A]₀^(1-n)  (for n>1)`]
}

function rateLaw(n: number): string {
  if (n === 0) return 'rate = k  (zero order — rate is constant)'
  if (n === 1) return 'rate = k[A]  (first order — rate ∝ [A])'
  if (n === 2) return 'rate = k[A]²  (second order)'
  if (n === 3) return 'rate = k[A]³  (third order)'
  return `rate = k[A]ⁿ  (nth order, n = ${n})`
}

function orderColor(n: number): string {
  return ['#22c55e','#06b6d4','#f97316','#ef4444','#8b5cf6'][Math.min(n, 4)] ?? '#00dbe7'
}

function buildData(C0: number, k: number, n: number, tMax: number) {
  return Array.from({length:80}, (_,i)=>{
    const t = tMax * i / 79
    const C = concentration(C0, k, n, t)
    const rate = k * Math.pow(Math.max(C,1e-9), n)
    return {
      t: Math.round(t*100)/100,
      C: Math.round(C*10000)/10000,
      lnC: C>0 ? Math.round(Math.log(C)*1000)/1000 : undefined,
      invC: C>0 ? Math.round((1/C)*100)/100 : undefined,
      invC2: C>0 ? Math.round((1/(C*C))*100)/100 : undefined,
      rate: Math.round(rate*10000)/10000,
    }
  })
}

function buildMB(T: number, M: number) {
  const vMax = Math.sqrt(2*R*T/(M/1000))*3.5
  return Array.from({length:80},(_,i)=>{
    const v = vMax*i/79
    const m = M/1000/6.022e23, kB = 1.381e-23
    const f = 4*Math.PI*Math.pow(m/(2*Math.PI*kB*T),1.5)*v*v*Math.exp(-m*v*v/(2*kB*T))
    return {v:Math.round(v), f:Math.round(f*1e6)/1e6}
  })
}

// ── Highlighted Value ──────────────────────────────────────────
function HVal({label,value,unit,highlighted,color='#00dbe7'}: {label:string;value:string;unit?:string;highlighted?:boolean;color?:string}) {
  return (
    <motion.div
      animate={{ backgroundColor: highlighted ? `${color}25` : 'transparent' }}
      transition={{ duration: 0.3 }}
      style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'5px 6px', borderRadius:4 }}>
      <span style={{fontSize:11,color:'#849495'}}>{label}</span>
      <span style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:highlighted?color:'#f8fafc'}}>
        {value}{unit&&<span style={{opacity:0.5,fontSize:9}}> {unit}</span>}
      </span>
    </motion.div>
  )
}

// ── Graph type tabs ────────────────────────────────────────────
const GRAPH_TABS = [
  {id:'conc',   label:'[A] vs t',      desc:'Concentration decay'},
  {id:'linear', label:'Linear plot',   desc:'Confirms order'},
  {id:'rate',   label:'Rate vs [A]',   desc:'Rate law shape'},
  {id:'arrh',   label:'Arrhenius',     desc:'ln k vs 1/T'},
  {id:'mb',     label:'Maxwell-Boltz.', desc:'Energy distribution'},
]

export default function KineticsSim() {
  const [order,   setOrder]   = useState(1)
  const [C0,      setC0]      = useState(1.0)
  const [logA,    setLogA]    = useState(13)
  const [Ea,      setEa]      = useState(50)
  const [T,       setT]       = useState(298)
  const [M,       setM]       = useState(28)
  const [playing, setPlaying] = useState(true)
  const [tab,     setTab]     = useState('conc')
  const [simTime, setSimTime] = useState(0)
  const [prev,    setPrev]    = useState({order:1,C0:1,Ea:50,T:298,logA:13})
  const rafRef = useRef<number>(0)
  const lastRef = useRef<number>(0)

  const k = arrhK(Math.pow(10, logA), Ea, T)
  const t12 = halfLife(k, order, C0)
  const tMax = Math.min(t12 * 6, 1e8)
  const Ct = concentration(C0, k, order, simTime)
  const pctLeft = (Ct/C0)*100
  const rate = k * Math.pow(Math.max(Ct,1e-9), order)

  // Track what changed for highlighting
  const changed = {
    order: order !== prev.order, C0: C0 !== prev.C0,
    Ea: Ea !== prev.Ea, T: T !== prev.T, logA: logA !== prev.logA,
  }
  const anyChanged = Object.values(changed).some(Boolean)
  useEffect(()=>{
    if (anyChanged) {
      const t = setTimeout(()=>setPrev({order,C0,Ea,T,logA}), 1500)
      return ()=>clearTimeout(t)
    }
  },[order,C0,Ea,T,logA])

  // Animate
  useEffect(()=>{
    if (!playing) return
    const loop = (ts:number)=>{
      const dt = lastRef.current ? (ts-lastRef.current)/1000 : 0
      lastRef.current = ts
      setSimTime(t=>{ const n=t+dt*k*2.5; return n>tMax?0:n })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return ()=>cancelAnimationFrame(rafRef.current)
  },[playing,k,tMax])

  const data = buildData(C0, k, order, tMax)
  const mbData = buildMB(T, M)
  const arrhData = Array.from({length:50},(_,i)=>{
    const Tv = 250+i*10; const kv = arrhK(Math.pow(10,logA),Ea,Tv)
    return {invT:Math.round(1/Tv*10000)/10000, lnK:Math.round(Math.log(kv)*100)/100}
  })

  const YKEY = {conc:'C', linear: order===0?'C':order===1?'lnC':order===2?'invC':'invC2'}
  const col = orderColor(order)

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>

      {/* Header */}
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
          <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
          <strong style={{fontSize:14}}>Reaction Kinetics Simulator</strong>
          <span style={{background:'rgba(0,219,231,0.12)',border:'1px solid rgba(0,219,231,0.4)',color:'#00dbe7',padding:'1px 8px',borderRadius:20,fontSize:10,fontWeight:700}}>LIVE</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>{setPlaying(p=>!p);lastRef.current=0}} style={{padding:'4px 12px',borderRadius:8,border:`1px solid ${playing?'rgba(0,219,231,0.4)':'rgba(255,255,255,0.15)'}`,background:playing?'rgba(0,219,231,0.1)':'transparent',color:playing?'#00dbe7':'#849495',fontSize:12,fontWeight:700,cursor:'pointer'}}>
            {playing?'⏸ Pause':'▶ Play'}
          </button>
          <button onClick={()=>{setSimTime(0);lastRef.current=0}} style={{padding:'4px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#849495',fontSize:12,cursor:'pointer'}}>⟳ Reset</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* Controls */}
        <div style={{width:220,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',overflowY:'auto',padding:10,display:'flex',flexDirection:'column',gap:10}}>

          {/* Order selector */}
          <div>
            <div style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:6}}>Reaction Order</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
              {[0,1,2,3].map(o=>(
                <button key={o} onClick={()=>{setOrder(o);setSimTime(0);lastRef.current=0}}
                  style={{padding:'7px 0',borderRadius:7,border:`1px solid ${order===o?orderColor(o)+'80':'rgba(255,255,255,0.12)'}`,background:order===o?orderColor(o)+'18':'transparent',color:order===o?orderColor(o):'#849495',fontSize:12,fontWeight:order===o?700:400,cursor:'pointer'}}>
                  {['0th','1st','2nd','3rd'][o]}
                </button>
              ))}
            </div>
            <button onClick={()=>{setOrder(4);setSimTime(0);lastRef.current=0}}
              style={{display:'block',width:'100%',marginTop:4,padding:'6px 0',borderRadius:7,border:`1px solid ${order===4?'#c084fc80':'rgba(255,255,255,0.12)'}`,background:order===4?'#c084fc18':'transparent',color:order===4?'#c084fc':'#849495',fontSize:12,fontWeight:order===4?700:400,cursor:'pointer'}}>
              nth order
            </button>
          </div>

          {/* [A]₀ */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>[A]₀ Initial</span>
              <motion.span animate={{color:changed.C0?col:'#f8fafc',scale:changed.C0?[1.1,1]:1}} style={{fontSize:11,fontFamily:'monospace',fontWeight:700}}>{C0.toFixed(2)} M</motion.span>
            </div>
            <input type="range" min="0.1" max="3" step="0.05" value={C0} onChange={e=>{setC0(+e.target.value);setSimTime(0);lastRef.current=0}} style={{width:'100%'}} />
          </div>

          {/* Ea */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Activation Energy Ea</span>
              <motion.span animate={{color:changed.Ea?col:'#f8fafc',scale:changed.Ea?[1.1,1]:1}} style={{fontSize:11,fontFamily:'monospace',fontWeight:700}}>{Ea} kJ/mol</motion.span>
            </div>
            <input type="range" min="5" max="200" step="1" value={Ea} onChange={e=>setEa(+e.target.value)} style={{width:'100%'}} />
          </div>

          {/* A */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Frequency factor A</span>
              <motion.span animate={{color:changed.logA?col:'#f8fafc'}} style={{fontSize:11,fontFamily:'monospace',fontWeight:700}}>10^{logA}</motion.span>
            </div>
            <input type="range" min="5" max="15" step="0.1" value={logA} onChange={e=>setLogA(+e.target.value)} style={{width:'100%'}} />
          </div>

          {/* T */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Temperature</span>
              <motion.span animate={{color:changed.T?col:'#f8fafc',scale:changed.T?[1.1,1]:1}} style={{fontSize:11,fontFamily:'monospace',fontWeight:700}}>{T} K ({T-273}°C)</motion.span>
            </div>
            <input type="range" min="200" max="600" step="5" value={T} onChange={e=>setT(+e.target.value)} style={{width:'100%'}} />
          </div>

          {/* Molar mass */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Molar mass (MB dist.)</span>
              <span style={{fontSize:11,fontFamily:'monospace',color:'#849495',fontWeight:700}}>{M} g/mol</span>
            </div>
            <input type="range" min="2" max="200" step="1" value={M} onChange={e=>setM(+e.target.value)} style={{width:'100%'}} />
            <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:3}}>
              {[{l:'H₂',m:2},{l:'N₂',m:28},{l:'O₂',m:32},{l:'CO₂',m:44}].map(({l,m})=>(
                <button key={l} onClick={()=>setM(m)} style={{padding:'2px 5px',borderRadius:4,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.03)',color:'#849495',fontSize:9,cursor:'pointer'}}>{l}</button>
              ))}
            </div>
          </div>

          {/* Computed — highlighted when changed */}
          <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:8}}>
            <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>
              All Values {anyChanged&&<span style={{color:'#f97316'}}>← CHANGING</span>}
            </div>
            <HVal label="k (rate const.)" value={k<0.001?k.toExponential(2):k.toFixed(4)} unit="s⁻¹" highlighted={changed.T||changed.Ea||changed.logA} color={col} />
            <HVal label="t½ (half-life)"  value={t12<0.01?t12.toExponential(2):t12.toFixed(2)} unit="s" highlighted={changed.C0||changed.T||changed.Ea||changed.logA} color={col} />
            <HVal label="[A] current"     value={Ct.toFixed(4)} unit="M" highlighted={true} color={col} />
            <HVal label="Rate current"    value={rate.toExponential(2)} unit="M/s" highlighted={true} color={col} />
            <HVal label="% remaining"     value={pctLeft.toFixed(1)} unit="%" highlighted={true} color={pctLeft>50?'#22c55e':'#ef4444'} />
            <HVal label="ln k"            value={Math.log(k).toFixed(2)} highlighted={changed.T||changed.Ea} color={col} />
            <HVal label="Ea/R"            value={(Ea*1000/R).toFixed(0)} unit="K" highlighted={changed.Ea} color={col} />
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* Formula panel — full width, prominent */}
          <AnimatePresence mode="wait">
            <motion.div key={order} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
              style={{background:`${col}12`,borderBottom:`2px solid ${col}40`,padding:'10px 16px',flexShrink:0}}>
              <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>

                {/* Rate law */}
                <div style={{minWidth:200}}>
                  <div style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Rate Law</div>
                  <div style={{fontFamily:'monospace',fontSize:14,color:col,fontWeight:700,background:`${col}18`,padding:'4px 10px',borderRadius:6,display:'inline-block'}}>
                    {rateLaw(order)}
                  </div>
                </div>

                {/* Integrated rate law */}
                <div style={{minWidth:220}}>
                  <div style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Integrated Rate Law</div>
                  {integRateLaw(order).map((f,i)=>(
                    <div key={i} style={{fontFamily:'monospace',fontSize:i===0?13:10,color:i===0?col:'#849495',fontWeight:i===0?700:400,marginBottom:2}}>
                      {i===0?`📐 ${f}`:f}
                    </div>
                  ))}
                </div>

                {/* k formulas */}
                <div style={{minWidth:220}}>
                  <div style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Formulas for k</div>
                  {kFormulas(order).map((f,i)=>(
                    <div key={i} style={{fontFamily:'monospace',fontSize:10,color:i===0?'#f8fafc':'#849495',marginBottom:2}}>{f}</div>
                  ))}
                </div>

                {/* Half-life */}
                <div style={{minWidth:180}}>
                  <div style={{fontSize:9,color:col,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Half-life (t½)</div>
                  {halfLifeFormulas(order).map((f,i)=>(
                    <div key={i} style={{fontFamily:'monospace',fontSize:i===0?13:10,color:i===0?'#ffd700':'#849495',fontWeight:i===0?700:400,marginBottom:2}}>
                      {i===0?`⏱ ${f}`:f}
                    </div>
                  ))}
                  <div style={{fontFamily:'monospace',fontSize:10,color:col,marginTop:3}}>
                    k calc: {rateConst(C0, Ct, simTime, order)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{padding:'8px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:12,fontWeight:700,color:'#f8fafc'}}>Reaction Progress — {['0th','1st','2nd','3rd','nth'][Math.min(order,4)]} Order</span>
              <span style={{fontFamily:'monospace',fontSize:14,fontWeight:700,color:col}}>[A] = {Ct.toFixed(4)} M &nbsp; rate = {rate.toExponential(2)} M/s</span>
            </div>
            <div style={{height:10,background:'rgba(255,255,255,0.06)',borderRadius:5,overflow:'hidden'}}>
              <motion.div style={{height:'100%',background:`linear-gradient(to right,${col},${col}80)`,borderRadius:5}} animate={{width:`${pctLeft}%`}} transition={{duration:0.1}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#849495',marginTop:2}}>
              <span>0%</span>
              <span style={{color:col,fontWeight:700}}>{pctLeft.toFixed(0)}% remaining &nbsp; t = {simTime.toFixed(1)}s &nbsp; t½ = {t12.toExponential(2)}s</span>
              <span>100%</span>
            </div>
          </div>

          {/* Graph tabs */}
          <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
            {GRAPH_TABS.map(({id,label,desc})=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{padding:'7px 12px',border:'none',background:tab===id?`${col}18`:'transparent',color:tab===id?col:'#849495',fontSize:11,fontWeight:tab===id?700:400,cursor:'pointer',borderBottom:`2px solid ${tab===id?col:'transparent'}`,transition:'all 0.15s'}}>
                {label}
              </button>
            ))}
          </div>

          {/* Chart area */}
          <div style={{flex:1,padding:'12px 16px',minHeight:0}}>

            {/* [A] vs t */}
            {tab === 'conc' && (
              <div style={{height:'100%',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,color:'#849495'}}>
                  {order===0?'Linear decay — slope = −k':order===1?'Exponential decay — use ln[A] vs t for linearity':order===2?'Hyperbolic — use 1/[A] vs t for linearity':'Use linearized form to find k'}
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={data} margin={{top:5,right:20,left:5,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="t" stroke="#849495" tick={{fontSize:9}} label={{value:'Time (s)',position:'insideBottom',offset:-12,fill:'#849495',fontSize:9}} />
                    <YAxis stroke="#849495" tick={{fontSize:9}} label={{value:'[A] (M)',angle:-90,position:'insideLeft',fill:'#849495',fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:`1px solid ${col}50`,borderRadius:8,fontSize:10}} formatter={(v:number)=>[v?.toFixed(4),'[A]']} labelFormatter={v=>`t = ${v}s`} />
                    <ReferenceLine x={simTime} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                    <ReferenceLine x={t12} stroke="rgba(255,215,0,0.5)" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="C" stroke={col} strokeWidth={2.5} dot={false} activeDot={{r:4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Linear plot */}
            {tab === 'linear' && (
              <div style={{height:'100%',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,color:'#849495'}}>
                  {order===0?'[A] vs t → linear (slope = −k)':order===1?'ln[A] vs t → linear (slope = −k)':order===2?'1/[A] vs t → linear (slope = k)':'1/[A]² vs t → linear (slope = 2k)'}
                  &nbsp;— <strong style={{color:col}}>straight line confirms the order</strong>
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={data} margin={{top:5,right:20,left:5,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="t" stroke="#849495" tick={{fontSize:9}} label={{value:'Time (s)',position:'insideBottom',offset:-12,fill:'#849495',fontSize:9}} />
                    <YAxis stroke="#849495" tick={{fontSize:9}} label={{value:order===0?'[A]':order===1?'ln[A]':order===2?'1/[A]':'1/[A]²',angle:-90,position:'insideLeft',fill:'#849495',fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:`1px solid ${col}50`,borderRadius:8,fontSize:10}} formatter={(v:number)=>[v?.toFixed(4),order===0?'[A]':order===1?'ln[A]':order===2?'1/[A]':'1/[A]²']} />
                    <ReferenceLine x={simTime} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                    <Line type="monotone" dataKey={order===0?'C':order===1?'lnC':order===2?'invC':'invC2'} stroke={col} strokeWidth={2.5} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Rate vs [A] */}
            {tab === 'rate' && (
              <div style={{height:'100%',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,color:'#849495'}}>
                  rate = k[A]^{order} &nbsp;— {order===0?'Horizontal line (rate constant regardless of [A])':order===1?'Straight line through origin':order===2?'Parabola (rate ∝ [A]²)':'Cubic curve'}
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={data.map(d=>({C:d.C,rate:d.rate}))} margin={{top:5,right:20,left:5,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="C" stroke="#849495" tick={{fontSize:9}} label={{value:'[A] (M)',position:'insideBottom',offset:-12,fill:'#849495',fontSize:9}} />
                    <YAxis stroke="#849495" tick={{fontSize:9}} label={{value:'rate (M/s)',angle:-90,position:'insideLeft',fill:'#849495',fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:`1px solid ${col}50`,borderRadius:8,fontSize:10}} formatter={(v:number)=>[v?.toExponential(2),'rate']} labelFormatter={v=>`[A] = ${v} M`} />
                    <Line type="monotone" dataKey="rate" stroke={col} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Arrhenius */}
            {tab === 'arrh' && (
              <div style={{height:'100%',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,color:'#849495'}}>
                  ln k vs 1/T — slope = −Ea/R = −{(Ea*1000/R).toFixed(0)} K &nbsp;| &nbsp; Ea = {Ea} kJ/mol &nbsp;| &nbsp; ln A = {(Math.log(Math.pow(10,logA))).toFixed(1)}
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={arrhData} margin={{top:5,right:20,left:5,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="invT" stroke="#849495" tick={{fontSize:9}} label={{value:'1/T (K⁻¹)',position:'insideBottom',offset:-12,fill:'#849495',fontSize:9}} />
                    <YAxis stroke="#849495" tick={{fontSize:9}} label={{value:'ln k',angle:-90,position:'insideLeft',fill:'#849495',fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:`1px solid ${col}50`,borderRadius:8,fontSize:10}} formatter={(v:number)=>[v?.toFixed(2),'ln k']} labelFormatter={v=>`1/T = ${v}`} />
                    <ReferenceLine x={1/T} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
                    <Line type="monotone" dataKey="lnK" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{fontFamily:'monospace',fontSize:11,color:'#8b5cf6'}}>
                  k = A·e^(−Ea/RT) = 10^{logA} × e^(−{Ea}×1000/{R.toFixed(0)}×{T}) = {k.toExponential(3)} s⁻¹
                </div>
              </div>
            )}

            {/* Maxwell-Boltzmann */}
            {tab === 'mb' && (
              <div style={{height:'100%',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:11,color:'#849495'}}>
                  Fraction of molecules with energy {'>'} Ea (right of orange line) = fraction that react per collision.
                  Higher T → curve shifts right → more molecules exceed Ea → faster reaction.
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={mbData} margin={{top:5,right:20,left:5,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="v" stroke="#849495" tick={{fontSize:9}} label={{value:'Molecular speed (m/s)',position:'insideBottom',offset:-12,fill:'#849495',fontSize:9}} />
                    <YAxis stroke="#849495" tick={{fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:`1px solid ${col}50`,borderRadius:8,fontSize:10}} formatter={(v:number)=>[v?.toFixed(6),'f(v)']} />
                    <ReferenceLine x={Math.round(Math.sqrt(2*Ea*1000/(M/1000/6.022e23))/100)} stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="f" stroke={col} fill={`${col}20`} strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// ── Element data ───────────────────────────────────────────────
interface PeriodicElement {
  Z: number; sym: string; name: string; mass: number
  group: number; period: number; block: string; cat: string
  ie1: number; ar: number; en: number; ea: number; mp: number
  config: string; oxStates: string; famName?: string
  flame?: string; iupacName?: string
  exceptions?: string  // exceptional config note
}

const C: Record<string, string> = {
  alkali: '#ef4444', alkaline: '#f97316', transition: '#06b6d4',
  'post-trans': '#8b5cf6', metalloid: '#22c55e', nonmetal: '#fbbf24',
  halogen: '#ec4899', noble: '#a78bfa', lanthanide: '#34d399', actinide: '#fb923c',
}

// Full 118-element database
const ELEMENTS: PeriodicElement[] = [
  // Period 1
  {Z:1,sym:'H',name:'Hydrogen',mass:1.008,group:1,period:1,block:'s',cat:'nonmetal',ie1:1312,ar:53,en:2.2,ea:72.8,mp:14,config:'1s¹',oxStates:'+1,−1',famName:'Nonmetal'},
  {Z:2,sym:'He',name:'Helium',mass:4.003,group:18,period:1,block:'s',cat:'noble',ie1:2372,ar:31,en:0,ea:0,mp:0.95,config:'1s²',oxStates:'0',famName:'Noble Gas'},
  // Period 2
  {Z:3,sym:'Li',name:'Lithium',mass:6.941,group:1,period:2,block:'s',cat:'alkali',ie1:520,ar:167,en:0.98,ea:59.6,mp:454,config:'[He]2s¹',oxStates:'+1',famName:'Alkali Metal',flame:'Crimson red'},
  {Z:4,sym:'Be',name:'Beryllium',mass:9.012,group:2,period:2,block:'s',cat:'alkaline',ie1:900,ar:112,en:1.57,ea:0,mp:1560,config:'[He]2s²',oxStates:'+2',famName:'Alkaline Earth'},
  {Z:5,sym:'B',name:'Boron',mass:10.811,group:13,period:2,block:'p',cat:'metalloid',ie1:800,ar:87,en:2.04,ea:26.7,mp:2349,config:'[He]2s²2p¹',oxStates:'+3'},
  {Z:6,sym:'C',name:'Carbon',mass:12.011,group:14,period:2,block:'p',cat:'nonmetal',ie1:1086,ar:77,en:2.55,ea:121.8,mp:3800,config:'[He]2s²2p²',oxStates:'+4,−4'},
  {Z:7,sym:'N',name:'Nitrogen',mass:14.007,group:15,period:2,block:'p',cat:'nonmetal',ie1:1402,ar:75,en:3.04,ea:7,mp:63,config:'[He]2s²2p³',oxStates:'+5,+3,−3',famName:'Pnictogen'},
  {Z:8,sym:'O',name:'Oxygen',mass:15.999,group:16,period:2,block:'p',cat:'nonmetal',ie1:1314,ar:73,en:3.44,ea:141,mp:54,config:'[He]2s²2p⁴',oxStates:'−2,−1',famName:'Chalcogen'},
  {Z:9,sym:'F',name:'Fluorine',mass:18.998,group:17,period:2,block:'p',cat:'halogen',ie1:1681,ar:64,en:3.98,ea:328,mp:53,config:'[He]2s²2p⁵',oxStates:'−1',famName:'Halogen'},
  {Z:10,sym:'Ne',name:'Neon',mass:20.180,group:18,period:2,block:'p',cat:'noble',ie1:2081,ar:38,en:0,ea:0,mp:24,config:'[He]2s²2p⁶',oxStates:'0',famName:'Noble Gas'},
  // Period 3
  {Z:11,sym:'Na',name:'Sodium',mass:22.990,group:1,period:3,block:'s',cat:'alkali',ie1:496,ar:190,en:0.93,ea:52.8,mp:371,config:'[Ne]3s¹',oxStates:'+1',famName:'Alkali Metal',flame:'Yellow'},
  {Z:12,sym:'Mg',name:'Magnesium',mass:24.305,group:2,period:3,block:'s',cat:'alkaline',ie1:738,ar:160,en:1.31,ea:0,mp:923,config:'[Ne]3s²',oxStates:'+2',famName:'Alkaline Earth',flame:'Brilliant white'},
  {Z:13,sym:'Al',name:'Aluminium',mass:26.982,group:13,period:3,block:'p',cat:'post-trans',ie1:577,ar:143,en:1.61,ea:42.5,mp:933,config:'[Ne]3s²3p¹',oxStates:'+3'},
  {Z:14,sym:'Si',name:'Silicon',mass:28.086,group:14,period:3,block:'p',cat:'metalloid',ie1:786,ar:111,en:1.90,ea:133.6,mp:1687,config:'[Ne]3s²3p²',oxStates:'+4,−4'},
  {Z:15,sym:'P',name:'Phosphorus',mass:30.974,group:15,period:3,block:'p',cat:'nonmetal',ie1:1012,ar:106,en:2.19,ea:72,mp:317,config:'[Ne]3s²3p³',oxStates:'+5,+3,−3',famName:'Pnictogen'},
  {Z:16,sym:'S',name:'Sulfur',mass:32.065,group:16,period:3,block:'p',cat:'nonmetal',ie1:1000,ar:103,en:2.58,ea:200,mp:388,config:'[Ne]3s²3p⁴',oxStates:'+6,+4,−2',famName:'Chalcogen'},
  {Z:17,sym:'Cl',name:'Chlorine',mass:35.453,group:17,period:3,block:'p',cat:'halogen',ie1:1251,ar:99,en:3.16,ea:349,mp:172,config:'[Ne]3s²3p⁵',oxStates:'+7,+5,−1',famName:'Halogen'},
  {Z:18,sym:'Ar',name:'Argon',mass:39.948,group:18,period:3,block:'p',cat:'noble',ie1:1521,ar:71,en:0,ea:0,mp:84,config:'[Ne]3s²3p⁶',oxStates:'0',famName:'Noble Gas'},
  // Period 4 s-block
  {Z:19,sym:'K',name:'Potassium',mass:39.098,group:1,period:4,block:'s',cat:'alkali',ie1:419,ar:243,en:0.82,ea:48.4,mp:337,config:'[Ar]4s¹',oxStates:'+1',famName:'Alkali Metal',flame:'Violet'},
  {Z:20,sym:'Ca',name:'Calcium',mass:40.078,group:2,period:4,block:'s',cat:'alkaline',ie1:590,ar:194,en:1.0,ea:2.4,mp:1115,config:'[Ar]4s²',oxStates:'+2',famName:'Alkaline Earth',flame:'Orange-red'},
  // Period 4 d-block
  {Z:21,sym:'Sc',name:'Scandium',mass:44.956,group:3,period:4,block:'d',cat:'transition',ie1:633,ar:184,en:1.36,ea:18,mp:1814,config:'[Ar]3d¹4s²',oxStates:'+3',famName:'Transition Metal'},
  {Z:22,sym:'Ti',name:'Titanium',mass:47.867,group:4,period:4,block:'d',cat:'transition',ie1:659,ar:176,en:1.54,ea:7.6,mp:1941,config:'[Ar]3d²4s²',oxStates:'+4,+3',famName:'Transition Metal'},
  {Z:23,sym:'V',name:'Vanadium',mass:50.942,group:5,period:4,block:'d',cat:'transition',ie1:651,ar:171,en:1.63,ea:50.6,mp:2183,config:'[Ar]3d³4s²',oxStates:'+5,+4,+3,+2',famName:'Transition Metal'},
  {Z:24,sym:'Cr',name:'Chromium',mass:51.996,group:6,period:4,block:'d',cat:'transition',ie1:653,ar:166,en:1.66,ea:64.3,mp:2180,config:'[Ar]3d⁵4s¹',oxStates:'+6,+3,+2',famName:'Transition Metal',exceptions:'EXCEPTION: 3d⁵4s¹ (not 3d⁴4s²) — half-filled d is extra stable!'},
  {Z:25,sym:'Mn',name:'Manganese',mass:54.938,group:7,period:4,block:'d',cat:'transition',ie1:717,ar:161,en:1.55,ea:0,mp:1519,config:'[Ar]3d⁵4s²',oxStates:'+7,+4,+3,+2',famName:'Transition Metal'},
  {Z:26,sym:'Fe',name:'Iron',mass:55.845,group:8,period:4,block:'d',cat:'transition',ie1:762,ar:156,en:1.83,ea:15.7,mp:1811,config:'[Ar]3d⁶4s²',oxStates:'+3,+2',famName:'Transition Metal'},
  {Z:27,sym:'Co',name:'Cobalt',mass:58.933,group:9,period:4,block:'d',cat:'transition',ie1:760,ar:152,en:1.88,ea:63.7,mp:1768,config:'[Ar]3d⁷4s²',oxStates:'+3,+2',famName:'Transition Metal'},
  {Z:28,sym:'Ni',name:'Nickel',mass:58.693,group:10,period:4,block:'d',cat:'transition',ie1:737,ar:149,en:1.91,ea:112,mp:1728,config:'[Ar]3d⁸4s²',oxStates:'+2',famName:'Transition Metal'},
  {Z:29,sym:'Cu',name:'Copper',mass:63.546,group:11,period:4,block:'d',cat:'transition',ie1:745,ar:145,en:1.90,ea:118.4,mp:1358,config:'[Ar]3d¹⁰4s¹',oxStates:'+2,+1',famName:'Transition Metal',flame:'Green-blue',exceptions:'EXCEPTION: 3d¹⁰4s¹ (not 3d⁹4s²) — fully filled d is extra stable!'},
  {Z:30,sym:'Zn',name:'Zinc',mass:65.38,group:12,period:4,block:'d',cat:'transition',ie1:906,ar:142,en:1.65,ea:0,mp:693,config:'[Ar]3d¹⁰4s²',oxStates:'+2',famName:'Transition Metal'},
  // Period 4 p-block
  {Z:31,sym:'Ga',name:'Gallium',mass:69.723,group:13,period:4,block:'p',cat:'post-trans',ie1:579,ar:136,en:1.81,ea:28.9,mp:303,config:'[Ar]3d¹⁰4s²4p¹',oxStates:'+3'},
  {Z:32,sym:'Ge',name:'Germanium',mass:72.630,group:14,period:4,block:'p',cat:'metalloid',ie1:762,ar:122,en:2.01,ea:119,mp:1211,config:'[Ar]3d¹⁰4s²4p²',oxStates:'+4'},
  {Z:33,sym:'As',name:'Arsenic',mass:74.922,group:15,period:4,block:'p',cat:'metalloid',ie1:947,ar:119,en:2.18,ea:78,mp:1090,config:'[Ar]3d¹⁰4s²4p³',oxStates:'+5,+3,−3',famName:'Pnictogen'},
  {Z:34,sym:'Se',name:'Selenium',mass:78.971,group:16,period:4,block:'p',cat:'nonmetal',ie1:941,ar:120,en:2.55,ea:195,mp:494,config:'[Ar]3d¹⁰4s²4p⁴',oxStates:'+6,+4,−2',famName:'Chalcogen'},
  {Z:35,sym:'Br',name:'Bromine',mass:79.904,group:17,period:4,block:'p',cat:'halogen',ie1:1140,ar:114,en:2.96,ea:324.6,mp:266,config:'[Ar]3d¹⁰4s²4p⁵',oxStates:'+5,−1',famName:'Halogen'},
  {Z:36,sym:'Kr',name:'Krypton',mass:83.798,group:18,period:4,block:'p',cat:'noble',ie1:1351,ar:88,en:0,ea:0,mp:116,config:'[Ar]3d¹⁰4s²4p⁶',oxStates:'0',famName:'Noble Gas'},
  // Period 5 s-block
  {Z:37,sym:'Rb',name:'Rubidium',mass:85.468,group:1,period:5,block:'s',cat:'alkali',ie1:403,ar:265,en:0.82,ea:46.9,mp:312,config:'[Kr]5s¹',oxStates:'+1',famName:'Alkali Metal',flame:'Red-violet'},
  {Z:38,sym:'Sr',name:'Strontium',mass:87.62,group:2,period:5,block:'s',cat:'alkaline',ie1:550,ar:219,en:0.95,ea:5.0,mp:1050,config:'[Kr]5s²',oxStates:'+2',famName:'Alkaline Earth',flame:'Crimson red'},
  // Period 5 d-block
  {Z:39,sym:'Y',name:'Yttrium',mass:88.906,group:3,period:5,block:'d',cat:'transition',ie1:600,ar:180,en:1.22,ea:29.6,mp:1799,config:'[Kr]4d¹5s²',oxStates:'+3',famName:'Transition Metal'},
  {Z:40,sym:'Zr',name:'Zirconium',mass:91.224,group:4,period:5,block:'d',cat:'transition',ie1:640,ar:160,en:1.33,ea:41.1,mp:2128,config:'[Kr]4d²5s²',oxStates:'+4',famName:'Transition Metal'},
  {Z:41,sym:'Nb',name:'Niobium',mass:92.906,group:5,period:5,block:'d',cat:'transition',ie1:652,ar:146,en:1.6,ea:86.1,mp:2750,config:'[Kr]4d⁴5s¹',oxStates:'+5,+3',famName:'Transition Metal',exceptions:'EXCEPTION: 4d⁴5s¹ (promotes to half-filled d)'},
  {Z:42,sym:'Mo',name:'Molybdenum',mass:95.96,group:6,period:5,block:'d',cat:'transition',ie1:684,ar:139,en:2.16,ea:71.9,mp:2896,config:'[Kr]4d⁵5s¹',oxStates:'+6,+4',famName:'Transition Metal',exceptions:'EXCEPTION: 4d⁵5s¹ — half-filled d stability'},
  {Z:43,sym:'Tc',name:'Technetium',mass:98,group:7,period:5,block:'d',cat:'transition',ie1:702,ar:136,en:1.9,ea:53,mp:2430,config:'[Kr]4d⁵5s²',oxStates:'+7,+4',famName:'Transition Metal'},
  {Z:44,sym:'Ru',name:'Ruthenium',mass:101.07,group:8,period:5,block:'d',cat:'transition',ie1:710,ar:134,en:2.2,ea:101.3,mp:2607,config:'[Kr]4d⁷5s¹',oxStates:'+4,+3',famName:'Transition Metal'},
  {Z:45,sym:'Rh',name:'Rhodium',mass:102.906,group:9,period:5,block:'d',cat:'transition',ie1:720,ar:134,en:2.28,ea:109.7,mp:2237,config:'[Kr]4d⁸5s¹',oxStates:'+3',famName:'Transition Metal'},
  {Z:46,sym:'Pd',name:'Palladium',mass:106.42,group:10,period:5,block:'d',cat:'transition',ie1:804,ar:137,en:2.20,ea:53.7,mp:1828,config:'[Kr]4d¹⁰',oxStates:'+2',famName:'Transition Metal',exceptions:'EXCEPTION: 4d¹⁰5s⁰ — fully filled d, empty s!'},
  {Z:47,sym:'Ag',name:'Silver',mass:107.868,group:11,period:5,block:'d',cat:'transition',ie1:731,ar:144,en:1.93,ea:125.6,mp:1235,config:'[Kr]4d¹⁰5s¹',oxStates:'+1',famName:'Transition Metal',exceptions:'EXCEPTION: 4d¹⁰5s¹ — fully filled d stability'},
  {Z:48,sym:'Cd',name:'Cadmium',mass:112.411,group:12,period:5,block:'d',cat:'transition',ie1:868,ar:151,en:1.69,ea:0,mp:594,config:'[Kr]4d¹⁰5s²',oxStates:'+2',famName:'Transition Metal'},
  // Period 5 p-block
  {Z:49,sym:'In',name:'Indium',mass:114.818,group:13,period:5,block:'p',cat:'post-trans',ie1:558,ar:167,en:1.78,ea:28.9,mp:430,config:'[Kr]4d¹⁰5s²5p¹',oxStates:'+3'},
  {Z:50,sym:'Sn',name:'Tin',mass:118.710,group:14,period:5,block:'p',cat:'post-trans',ie1:709,ar:140,en:1.96,ea:107.3,mp:505,config:'[Kr]4d¹⁰5s²5p²',oxStates:'+4,+2'},
  {Z:51,sym:'Sb',name:'Antimony',mass:121.760,group:15,period:5,block:'p',cat:'metalloid',ie1:834,ar:140,en:2.05,ea:103.2,mp:904,config:'[Kr]4d¹⁰5s²5p³',oxStates:'+5,+3,−3',famName:'Pnictogen'},
  {Z:52,sym:'Te',name:'Tellurium',mass:127.60,group:16,period:5,block:'p',cat:'metalloid',ie1:869,ar:123,en:2.1,ea:190.2,mp:723,config:'[Kr]4d¹⁰5s²5p⁴',oxStates:'+6,−2',famName:'Chalcogen'},
  {Z:53,sym:'I',name:'Iodine',mass:126.904,group:17,period:5,block:'p',cat:'halogen',ie1:1008,ar:133,en:2.66,ea:295.2,mp:387,config:'[Kr]4d¹⁰5s²5p⁵',oxStates:'+7,+5,−1',famName:'Halogen'},
  {Z:54,sym:'Xe',name:'Xenon',mass:131.293,group:18,period:5,block:'p',cat:'noble',ie1:1170,ar:108,en:0,ea:0,mp:161,config:'[Kr]4d¹⁰5s²5p⁶',oxStates:'0,+2',famName:'Noble Gas'},
  // Period 6 s-block
  {Z:55,sym:'Cs',name:'Caesium',mass:132.905,group:1,period:6,block:'s',cat:'alkali',ie1:376,ar:298,en:0.79,ea:45.5,mp:302,config:'[Xe]6s¹',oxStates:'+1',famName:'Alkali Metal',flame:'Violet-blue'},
  {Z:56,sym:'Ba',name:'Barium',mass:137.327,group:2,period:6,block:'s',cat:'alkaline',ie1:503,ar:222,en:0.89,ea:13.9,mp:1000,config:'[Xe]6s²',oxStates:'+2',famName:'Alkaline Earth',flame:'Pale green'},
  // Period 6 d-block
  {Z:72,sym:'Hf',name:'Hafnium',mass:178.49,group:4,period:6,block:'d',cat:'transition',ie1:659,ar:159,en:1.3,ea:0,mp:2506,config:'[Xe]4f¹⁴5d²6s²',oxStates:'+4'},
  {Z:73,sym:'Ta',name:'Tantalum',mass:180.948,group:5,period:6,block:'d',cat:'transition',ie1:761,ar:146,en:1.5,ea:31,mp:3290,config:'[Xe]4f¹⁴5d³6s²',oxStates:'+5'},
  {Z:74,sym:'W',name:'Tungsten',mass:183.84,group:6,period:6,block:'d',cat:'transition',ie1:770,ar:139,en:2.36,ea:78.6,mp:3695,config:'[Xe]4f¹⁴5d⁴6s²',oxStates:'+6,+4'},
  {Z:75,sym:'Re',name:'Rhenium',mass:186.207,group:7,period:6,block:'d',cat:'transition',ie1:760,ar:137,en:1.9,ea:14.5,mp:3459,config:'[Xe]4f¹⁴5d⁵6s²',oxStates:'+7,+4'},
  {Z:76,sym:'Os',name:'Osmium',mass:190.23,group:8,period:6,block:'d',cat:'transition',ie1:840,ar:135,en:2.2,ea:106.1,mp:3306,config:'[Xe]4f¹⁴5d⁶6s²',oxStates:'+8,+4'},
  {Z:77,sym:'Ir',name:'Iridium',mass:192.217,group:9,period:6,block:'d',cat:'transition',ie1:880,ar:136,en:2.2,ea:151,mp:2719,config:'[Xe]4f¹⁴5d⁷6s²',oxStates:'+4,+3'},
  {Z:78,sym:'Pt',name:'Platinum',mass:195.084,group:10,period:6,block:'d',cat:'transition',ie1:870,ar:139,en:2.28,ea:205.3,mp:2041,config:'[Xe]4f¹⁴5d⁹6s¹',oxStates:'+4,+2',exceptions:'EXCEPTION: 5d⁹6s¹ — extra stability near fully filled d'},
  {Z:79,sym:'Au',name:'Gold',mass:196.967,group:11,period:6,block:'d',cat:'transition',ie1:890,ar:144,en:2.54,ea:222.8,mp:1337,config:'[Xe]4f¹⁴5d¹⁰6s¹',oxStates:'+3,+1',exceptions:'EXCEPTION: 5d¹⁰6s¹ — fully filled d stability'},
  {Z:80,sym:'Hg',name:'Mercury',mass:200.592,group:12,period:6,block:'d',cat:'transition',ie1:1007,ar:151,en:2.0,ea:0,mp:234,config:'[Xe]4f¹⁴5d¹⁰6s²',oxStates:'+2,+1'},
  // Period 6 p-block
  {Z:81,sym:'Tl',name:'Thallium',mass:204.383,group:13,period:6,block:'p',cat:'post-trans',ie1:589,ar:170,en:2.04,ea:19.2,mp:577,config:'[Xe]4f¹⁴5d¹⁰6s²6p¹',oxStates:'+3,+1'},
  {Z:82,sym:'Pb',name:'Lead',mass:207.2,group:14,period:6,block:'p',cat:'post-trans',ie1:716,ar:175,en:2.33,ea:35.1,mp:600,config:'[Xe]4f¹⁴5d¹⁰6s²6p²',oxStates:'+4,+2'},
  {Z:83,sym:'Bi',name:'Bismuth',mass:208.980,group:15,period:6,block:'p',cat:'post-trans',ie1:703,ar:156,en:2.02,ea:91.2,mp:544,config:'[Xe]4f¹⁴5d¹⁰6s²6p³',oxStates:'+5,+3',famName:'Pnictogen'},
  {Z:84,sym:'Po',name:'Polonium',mass:209,group:16,period:6,block:'p',cat:'metalloid',ie1:812,ar:167,en:2.0,ea:136,mp:527,config:'[Xe]4f¹⁴5d¹⁰6s²6p⁴',oxStates:'+4,−2',famName:'Chalcogen'},
  {Z:85,sym:'At',name:'Astatine',mass:210,group:17,period:6,block:'p',cat:'halogen',ie1:920,ar:148,en:2.2,ea:270,mp:575,config:'[Xe]4f¹⁴5d¹⁰6s²6p⁵',oxStates:'+7,−1',famName:'Halogen'},
  {Z:86,sym:'Rn',name:'Radon',mass:222,group:18,period:6,block:'p',cat:'noble',ie1:1037,ar:120,en:0,ea:0,mp:202,config:'[Xe]4f¹⁴5d¹⁰6s²6p⁶',oxStates:'0',famName:'Noble Gas'},
  // Period 7 s-block
  {Z:87,sym:'Fr',name:'Francium',mass:223,group:1,period:7,block:'s',cat:'alkali',ie1:380,ar:348,en:0.7,ea:44,mp:300,config:'[Rn]7s¹',oxStates:'+1',famName:'Alkali Metal'},
  {Z:88,sym:'Ra',name:'Radium',mass:226,group:2,period:7,block:'s',cat:'alkaline',ie1:509,ar:283,en:0.9,ea:9.6,mp:973,config:'[Rn]7s²',oxStates:'+2',famName:'Alkaline Earth',flame:'Crimson'},
  // Period 7 d-block
  {Z:104,sym:'Rf',name:'Rutherfordium',mass:267,group:4,period:7,block:'d',cat:'transition',ie1:580,ar:150,en:0,ea:0,mp:2400,config:'[Rn]5f¹⁴6d²7s²',oxStates:'+4'},
  {Z:105,sym:'Db',name:'Dubnium',mass:268,group:5,period:7,block:'d',cat:'transition',ie1:0,ar:139,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d³7s²',oxStates:'+5'},
  {Z:106,sym:'Sg',name:'Seaborgium',mass:271,group:6,period:7,block:'d',cat:'transition',ie1:0,ar:132,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁴7s²',oxStates:'+6'},
  {Z:107,sym:'Bh',name:'Bohrium',mass:272,group:7,period:7,block:'d',cat:'transition',ie1:0,ar:128,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁵7s²',oxStates:'+7'},
  {Z:108,sym:'Hs',name:'Hassium',mass:270,group:8,period:7,block:'d',cat:'transition',ie1:0,ar:126,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁶7s²',oxStates:'+8'},
  {Z:109,sym:'Mt',name:'Meitnerium',mass:278,group:9,period:7,block:'d',cat:'transition',ie1:0,ar:128,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁷7s²',oxStates:'+9'},
  {Z:110,sym:'Ds',name:'Darmstadtium',mass:281,group:10,period:7,block:'d',cat:'transition',ie1:0,ar:127,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁸7s²',oxStates:''},
  {Z:111,sym:'Rg',name:'Roentgenium',mass:282,group:11,period:7,block:'d',cat:'transition',ie1:0,ar:121,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d⁹7s²',oxStates:'+3,+1'},
  {Z:112,sym:'Cn',name:'Copernicium',mass:285,group:12,period:7,block:'d',cat:'transition',ie1:0,ar:122,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²',oxStates:'+2'},
  // Period 7 p-block
  {Z:113,sym:'Nh',name:'Nihonium',mass:286,group:13,period:7,block:'p',cat:'post-trans',ie1:0,ar:136,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p¹',oxStates:'+3,+1',iupacName:'Nihonium (2016)'},
  {Z:114,sym:'Fl',name:'Flerovium',mass:289,group:14,period:7,block:'p',cat:'post-trans',ie1:0,ar:143,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p²',oxStates:'+6,+4,+2',iupacName:'Flerovium (2012)'},
  {Z:115,sym:'Mc',name:'Moscovium',mass:290,group:15,period:7,block:'p',cat:'post-trans',ie1:0,ar:162,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p³',oxStates:'+3,+1',famName:'Pnictogen',iupacName:'Moscovium (2016)'},
  {Z:116,sym:'Lv',name:'Livermorium',mass:293,group:16,period:7,block:'p',cat:'post-trans',ie1:0,ar:175,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p⁴',oxStates:'+4,+2',famName:'Chalcogen',iupacName:'Livermorium (2012)'},
  {Z:117,sym:'Ts',name:'Tennessine',mass:294,group:17,period:7,block:'p',cat:'halogen',ie1:0,ar:165,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p⁵',oxStates:'+5,+3,−1',famName:'Halogen',iupacName:'Tennessine (2016)'},
  {Z:118,sym:'Og',name:'Oganesson',mass:294,group:18,period:7,block:'p',cat:'noble',ie1:0,ar:152,en:0,ea:0,mp:0,config:'[Rn]5f¹⁴6d¹⁰7s²7p⁶',oxStates:'0',famName:'Noble Gas',iupacName:'Oganesson (2016)'},
  // Lanthanides (f-block, period 6)
  {Z:57,sym:'La',name:'Lanthanum',mass:138.905,group:3,period:6,block:'f',cat:'lanthanide',ie1:538,ar:195,en:1.10,ea:48,mp:1193,config:'[Xe]5d¹6s²',oxStates:'+3',famName:'Lanthanide/Rare Earth',exceptions:'EXCEPTION: 5d¹6s² (not 4f¹6s²)'},
  {Z:58,sym:'Ce',name:'Cerium',mass:140.116,group:4,period:6,block:'f',cat:'lanthanide',ie1:534,ar:185,en:1.12,ea:50,mp:1071,config:'[Xe]4f¹5d¹6s²',oxStates:'+4,+3',famName:'Lanthanide'},
  {Z:59,sym:'Pr',name:'Praseodymium',mass:140.908,group:5,period:6,block:'f',cat:'lanthanide',ie1:527,ar:185,en:1.13,ea:50,mp:1208,config:'[Xe]4f³6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:60,sym:'Nd',name:'Neodymium',mass:144.242,group:6,period:6,block:'f',cat:'lanthanide',ie1:533,ar:185,en:1.14,ea:50,mp:1297,config:'[Xe]4f⁴6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:61,sym:'Pm',name:'Promethium',mass:145,group:7,period:6,block:'f',cat:'lanthanide',ie1:540,ar:185,en:1.13,ea:50,mp:1315,config:'[Xe]4f⁵6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:62,sym:'Sm',name:'Samarium',mass:150.36,group:8,period:6,block:'f',cat:'lanthanide',ie1:544,ar:185,en:1.17,ea:50,mp:1345,config:'[Xe]4f⁶6s²',oxStates:'+3,+2',famName:'Lanthanide'},
  {Z:63,sym:'Eu',name:'Europium',mass:151.964,group:9,period:6,block:'f',cat:'lanthanide',ie1:547,ar:185,en:1.2,ea:50,mp:1099,config:'[Xe]4f⁷6s²',oxStates:'+3,+2',famName:'Lanthanide',exceptions:'EXCEPTION: 4f⁷6s² — half-filled f stability'},
  {Z:64,sym:'Gd',name:'Gadolinium',mass:157.25,group:10,period:6,block:'f',cat:'lanthanide',ie1:593,ar:180,en:1.20,ea:50,mp:1585,config:'[Xe]4f⁷5d¹6s²',oxStates:'+3',famName:'Lanthanide',exceptions:'EXCEPTION: 4f⁷5d¹6s² — half-filled f stability, d electron present'},
  {Z:65,sym:'Tb',name:'Terbium',mass:158.925,group:11,period:6,block:'f',cat:'lanthanide',ie1:565,ar:175,en:1.1,ea:50,mp:1629,config:'[Xe]4f⁹6s²',oxStates:'+3,+4',famName:'Lanthanide'},
  {Z:66,sym:'Dy',name:'Dysprosium',mass:162.500,group:12,period:6,block:'f',cat:'lanthanide',ie1:573,ar:175,en:1.22,ea:50,mp:1680,config:'[Xe]4f¹⁰6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:67,sym:'Ho',name:'Holmium',mass:164.930,group:13,period:6,block:'f',cat:'lanthanide',ie1:581,ar:175,en:1.23,ea:50,mp:1734,config:'[Xe]4f¹¹6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:68,sym:'Er',name:'Erbium',mass:167.259,group:14,period:6,block:'f',cat:'lanthanide',ie1:589,ar:175,en:1.24,ea:50,mp:1802,config:'[Xe]4f¹²6s²',oxStates:'+3',famName:'Lanthanide'},
  {Z:69,sym:'Tm',name:'Thulium',mass:168.934,group:15,period:6,block:'f',cat:'lanthanide',ie1:597,ar:175,en:1.25,ea:50,mp:1818,config:'[Xe]4f¹³6s²',oxStates:'+3,+2',famName:'Lanthanide'},
  {Z:70,sym:'Yb',name:'Ytterbium',mass:173.045,group:16,period:6,block:'f',cat:'lanthanide',ie1:603,ar:175,en:1.1,ea:50,mp:1097,config:'[Xe]4f¹⁴6s²',oxStates:'+3,+2',famName:'Lanthanide',exceptions:'EXCEPTION: fully filled 4f¹⁴6s²'},
  {Z:71,sym:'Lu',name:'Lutetium',mass:174.967,group:17,period:6,block:'f',cat:'lanthanide',ie1:524,ar:175,en:1.27,ea:50,mp:1936,config:'[Xe]4f¹⁴5d¹6s²',oxStates:'+3',famName:'Lanthanide'},
  // Actinides (f-block, period 7)
  {Z:89,sym:'Ac',name:'Actinium',mass:227,group:3,period:7,block:'f',cat:'actinide',ie1:499,ar:195,en:1.1,ea:0,mp:1323,config:'[Rn]6d¹7s²',oxStates:'+3',famName:'Actinide'},
  {Z:90,sym:'Th',name:'Thorium',mass:232.038,group:4,period:7,block:'f',cat:'actinide',ie1:587,ar:180,en:1.3,ea:0,mp:2115,config:'[Rn]6d²7s²',oxStates:'+4',famName:'Actinide',exceptions:'EXCEPTION: 6d²7s² (no 5f electrons)'},
  {Z:91,sym:'Pa',name:'Protactinium',mass:231.036,group:5,period:7,block:'f',cat:'actinide',ie1:568,ar:180,en:1.5,ea:0,mp:1841,config:'[Rn]5f²6d¹7s²',oxStates:'+5,+4',famName:'Actinide'},
  {Z:92,sym:'U',name:'Uranium',mass:238.029,group:6,period:7,block:'f',cat:'actinide',ie1:584,ar:175,en:1.38,ea:0,mp:1405,config:'[Rn]5f³6d¹7s²',oxStates:'+6,+4,+3',famName:'Actinide'},
  {Z:93,sym:'Np',name:'Neptunium',mass:237,group:7,period:7,block:'f',cat:'actinide',ie1:597,ar:175,en:1.36,ea:0,mp:910,config:'[Rn]5f⁴6d¹7s²',oxStates:'+7,+5',famName:'Actinide'},
  {Z:94,sym:'Pu',name:'Plutonium',mass:244,group:8,period:7,block:'f',cat:'actinide',ie1:585,ar:175,en:1.28,ea:0,mp:913,config:'[Rn]5f⁶7s²',oxStates:'+6,+4',famName:'Actinide'},
  {Z:95,sym:'Am',name:'Americium',mass:243,group:9,period:7,block:'f',cat:'actinide',ie1:578,ar:175,en:1.3,ea:0,mp:1449,config:'[Rn]5f⁷7s²',oxStates:'+3',famName:'Actinide',iupacName:'Americium'},
  {Z:96,sym:'Cm',name:'Curium',mass:247,group:10,period:7,block:'f',cat:'actinide',ie1:581,ar:174,en:1.3,ea:0,mp:1613,config:'[Rn]5f⁷6d¹7s²',oxStates:'+3',famName:'Actinide',iupacName:'Curium'},
  {Z:97,sym:'Bk',name:'Berkelium',mass:247,group:11,period:7,block:'f',cat:'actinide',ie1:601,ar:170,en:1.3,ea:0,mp:1259,config:'[Rn]5f⁹7s²',oxStates:'+3',famName:'Actinide',iupacName:'Berkelium'},
  {Z:98,sym:'Cf',name:'Californium',mass:251,group:12,period:7,block:'f',cat:'actinide',ie1:608,ar:168,en:1.3,ea:0,mp:1173,config:'[Rn]5f¹⁰7s²',oxStates:'+3',famName:'Actinide',iupacName:'Californium'},
  {Z:99,sym:'Es',name:'Einsteinium',mass:252,group:13,period:7,block:'f',cat:'actinide',ie1:619,ar:165,en:1.3,ea:0,mp:1133,config:'[Rn]5f¹¹7s²',oxStates:'+3',famName:'Actinide',iupacName:'Einsteinium'},
  {Z:100,sym:'Fm',name:'Fermium',mass:257,group:14,period:7,block:'f',cat:'actinide',ie1:629,ar:167,en:1.3,ea:0,mp:1800,config:'[Rn]5f¹²7s²',oxStates:'+3',famName:'Actinide',iupacName:'Fermium'},
  {Z:101,sym:'Md',name:'Mendelevium',mass:258,group:15,period:7,block:'f',cat:'actinide',ie1:635,ar:173,en:1.3,ea:0,mp:1100,config:'[Rn]5f¹³7s²',oxStates:'+3,+2',famName:'Actinide',iupacName:'Mendelevium'},
  {Z:102,sym:'No',name:'Nobelium',mass:259,group:16,period:7,block:'f',cat:'actinide',ie1:642,ar:176,en:1.3,ea:0,mp:1100,config:'[Rn]5f¹⁴7s²',oxStates:'+2,+3',famName:'Actinide',iupacName:'Nobelium'},
  {Z:103,sym:'Lr',name:'Lawrencium',mass:266,group:17,period:7,block:'f',cat:'actinide',ie1:479,ar:161,en:1.3,ea:0,mp:1900,config:'[Rn]5f¹⁴7s²7p¹',oxStates:'+3',famName:'Actinide',iupacName:'Lawrencium'},
]

const ELEM_MAP: Record<string, PeriodicElement> = {}
ELEMENTS.forEach(e => { ELEM_MAP[e.sym] = e })

// ── Trend data ─────────────────────────────────────────────────
const PROPS = [
  { key: 'ie1', label: 'IE₁ (kJ/mol)',  color: '#06b6d4', acrossPeriod: '↑ increases →', downGroup: '↓ decreases ↓', reason: 'Higher nuclear charge across period; more shielding down group → easier ionization' },
  { key: 'ar',  label: 'Radius (pm)',    color: '#f97316', acrossPeriod: '↓ decreases →', downGroup: '↑ increases ↓', reason: 'Nuclear charge pulls electrons in across period; new shells added down group' },
  { key: 'en',  label: 'Electronegativity', color: '#a78bfa', acrossPeriod: '↑ increases →', downGroup: '↓ decreases ↓', reason: 'F is highest (3.98). Larger atom = weaker pull on bonding electrons' },
  { key: 'ea',  label: 'EA (kJ/mol)',    color: '#22c55e', acrossPeriod: '↑ more negative →', downGroup: '↓ less negative ↓', reason: 'Halogens highest EA; N anomaly: half-filled 2p is extra stable (lower EA than O)' },
]

// Standard PT grid layout
const PT_POSITIONS: Array<{ sym: string; col: number; row: number }> = [
  // Period 1
  { sym:'H', col:1, row:1 }, { sym:'He', col:18, row:1 },
  // Period 2
  { sym:'Li',col:1,row:2 },{ sym:'Be',col:2,row:2 },
  { sym:'B',col:13,row:2 },{ sym:'C',col:14,row:2 },{ sym:'N',col:15,row:2 },{ sym:'O',col:16,row:2 },{ sym:'F',col:17,row:2 },{ sym:'Ne',col:18,row:2 },
  // Period 3
  { sym:'Na',col:1,row:3 },{ sym:'Mg',col:2,row:3 },
  { sym:'Al',col:13,row:3 },{ sym:'Si',col:14,row:3 },{ sym:'P',col:15,row:3 },{ sym:'S',col:16,row:3 },{ sym:'Cl',col:17,row:3 },{ sym:'Ar',col:18,row:3 },
  // Period 4
  { sym:'K',col:1,row:4 },{ sym:'Ca',col:2,row:4 },
  { sym:'Sc',col:3,row:4 },{ sym:'Ti',col:4,row:4 },{ sym:'V',col:5,row:4 },{ sym:'Cr',col:6,row:4 },{ sym:'Mn',col:7,row:4 },{ sym:'Fe',col:8,row:4 },{ sym:'Co',col:9,row:4 },{ sym:'Ni',col:10,row:4 },{ sym:'Cu',col:11,row:4 },{ sym:'Zn',col:12,row:4 },
  { sym:'Ga',col:13,row:4 },{ sym:'Ge',col:14,row:4 },{ sym:'As',col:15,row:4 },{ sym:'Se',col:16,row:4 },{ sym:'Br',col:17,row:4 },{ sym:'Kr',col:18,row:4 },
  // Period 5
  { sym:'Rb',col:1,row:5 },{ sym:'Sr',col:2,row:5 },
  { sym:'Y',col:3,row:5 },{ sym:'Zr',col:4,row:5 },{ sym:'Nb',col:5,row:5 },{ sym:'Mo',col:6,row:5 },{ sym:'Tc',col:7,row:5 },{ sym:'Ru',col:8,row:5 },{ sym:'Rh',col:9,row:5 },{ sym:'Pd',col:10,row:5 },{ sym:'Ag',col:11,row:5 },{ sym:'Cd',col:12,row:5 },
  { sym:'In',col:13,row:5 },{ sym:'Sn',col:14,row:5 },{ sym:'Sb',col:15,row:5 },{ sym:'Te',col:16,row:5 },{ sym:'I',col:17,row:5 },{ sym:'Xe',col:18,row:5 },
  // Period 6
  { sym:'Cs',col:1,row:6 },{ sym:'Ba',col:2,row:6 },
  { sym:'Hf',col:4,row:6 },{ sym:'Ta',col:5,row:6 },{ sym:'W',col:6,row:6 },{ sym:'Re',col:7,row:6 },{ sym:'Os',col:8,row:6 },{ sym:'Ir',col:9,row:6 },{ sym:'Pt',col:10,row:6 },{ sym:'Au',col:11,row:6 },{ sym:'Hg',col:12,row:6 },
  { sym:'Tl',col:13,row:6 },{ sym:'Pb',col:14,row:6 },{ sym:'Bi',col:15,row:6 },{ sym:'Po',col:16,row:6 },{ sym:'At',col:17,row:6 },{ sym:'Rn',col:18,row:6 },
  // Period 7
  { sym:'Fr',col:1,row:7 },{ sym:'Ra',col:2,row:7 },
  { sym:'Rf',col:4,row:7 },{ sym:'Db',col:5,row:7 },{ sym:'Sg',col:6,row:7 },{ sym:'Bh',col:7,row:7 },{ sym:'Hs',col:8,row:7 },{ sym:'Mt',col:9,row:7 },{ sym:'Ds',col:10,row:7 },{ sym:'Rg',col:11,row:7 },{ sym:'Cn',col:12,row:7 },
  { sym:'Nh',col:13,row:7 },{ sym:'Fl',col:14,row:7 },{ sym:'Mc',col:15,row:7 },{ sym:'Lv',col:16,row:7 },{ sym:'Ts',col:17,row:7 },{ sym:'Og',col:18,row:7 },
  // Lanthanides row 9
  ...['La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu'].map((s, i) => ({ sym:s, col:i+2, row:9 })),
  // Actinides row 10
  ...['Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr'].map((s, i) => ({ sym:s, col:i+2, row:10 })),
]

// Hydride acidic strength order
const HYDRIDE_ACIDITY = [
  { group: 14, order: 'SiH₄ < GeH₄ < SnH₄ < PbH₄', note: 'Weak acids, increasing down group' },
  { group: 15, order: 'NH₃ < PH₃ < AsH₃ < SbH₃', note: 'As acid strength: increases down group (bond polarity)' },
  { group: 16, order: 'H₂O << H₂S < H₂Se < H₂Te', note: 'H₂Te strongest (weak H-Te bond). H₂O weakest (strong H-O, high bond energy)' },
  { group: 17, order: 'HF << HCl < HBr < HI', note: 'HI strongest acid (weakest bond). HF weakest (strong H-F bond, 569 kJ/mol). HF is weak acid despite F being most electronegative!' },
]

// Block general configs
const BLOCK_CONFIGS = [
  { block: 's', config: 'ns¹ (group 1) or ns² (group 2)', color: '#ef4444', examples: 'H, He, Li→Rn, alkali+alkaline earths', note: 'Valence e⁻ in s orbital. Generally reactive metals.' },
  { block: 'p', config: 'ns²np¹⁻⁶', color: '#22c55e', examples: 'B→Ne, Al→Ar, Ga→Kr, etc.', note: 'Includes metals, metalloids, nonmetals, halogens, noble gases.' },
  { block: 'd', config: '(n-1)d¹⁻¹⁰ns¹⁻²', color: '#06b6d4', examples: 'Sc-Zn, Y-Cd, Hf-Hg, Rf-Cn', note: 'Transition metals. Exceptions: Cr,Cu (4d), Mo,Ag,Au,Pt,Pd (5d/6d) — d stability.' },
  { block: 'f', config: '(n-2)f¹⁻¹⁴(n-1)d⁰⁻¹ns²', color: '#34d399', examples: 'La-Lu (4f), Ac-Lr (5f)', note: 'Lanthanide contraction: poor 4f shielding → small radius → 5d ≈ 4d in size.' },
]

// IE/AR exceptions for JEE
const EXCEPTIONS = [
  { title: 'IE₁: N > O (anomaly)', detail: 'N has half-filled 2p³ (extra stable) → higher IE than O. O loses one electron from doubly-occupied 2p easier.', color: '#ef4444' },
  { title: 'IE₁: Be > B (anomaly)', detail: 'Be has fully filled 2s² (extra stable). B loses from 2p¹ which is easier than removing from 2s².', color: '#f97316' },
  { title: 'IE₁: Mg > Al', detail: 'Mg: [Ne]3s² — filled 3s is more stable. Al loses from 3p¹ more easily.', color: '#fbbf24' },
  { title: 'AR: Cr exception', detail: 'Cr (3d⁵4s¹) has slightly smaller radius than V (3d³4s²) due to higher Z_eff from d⁵ configuration.', color: '#a78bfa' },
  { title: 'EA: N < P (anomaly)', detail: 'N has low EA — adding e⁻ to half-filled 2p³ causes repulsion. P (3p³) has more room → higher EA.', color: '#22c55e' },
  { title: 'EA: F < Cl', detail: 'F has highest electronegativity but lower EA than Cl! Tiny F atom: electron-electron repulsion in small 2p orbitals.', color: '#06b6d4' },
]

// Oxidizing power and reducing power trends
const REDOX_TRENDS = [
  { title: 'Oxidizing Power (across period →)', content: 'Increases left to right. F₂ is strongest oxidizing agent in all of chemistry (highest electronegativity). Halogens: F₂ > Cl₂ > Br₂ > I₂', color: '#ef4444' },
  { title: 'Reducing Power (down group ↓)', content: 'Metals: Cs > Rb > K > Na > Li (largest atom loses e⁻ easiest... except Li has highest charge density → most reactive in water!). Li is anomalous strongest reductant among alkali metals.', color: '#06b6d4' },
  { title: 'Reducing Power of Hydrides (group 16)', content: 'H₂Te > H₂Se > H₂S > H₂O. Larger central atom = weaker E-H bond = easier H loss = stronger reductant.', color: '#a78bfa' },
  { title: 'Reducing Power of Hydrides (group 17)', content: 'HI > HBr > HCl >> HF. HI is strongest reductant (weakest H-I bond, 297 kJ/mol). HF is NOT a reductant (565 kJ/mol H-F bond).', color: '#22c55e' },
]

export default function PeriodicTableSim() {
  const [selected, setSelected] = useState<PeriodicElement | null>(null)
  const [hovered, setHovered] = useState<PeriodicElement | null>(null)
  const [propKey, setPropKey] = useState('ie1')
  const [trendView, setTrendView] = useState<'period' | 'group'>('period')
  const [tab, setTab] = useState<'trends' | 'exceptions' | 'hydrides' | 'blocks' | 'redox'>('trends')

  const activeProp = PROPS.find(p => p.key === propKey)!
  const displayEl = hovered ?? selected

  // Heat map scaling
  const vals = ELEMENTS.map(e => (e as unknown as Record<string, number>)[propKey]).filter(v => v && v > 0)
  const minVal = Math.min(...vals), maxVal = Math.max(...vals)
  const getHeat = (e: PeriodicElement) => {
    const v = (e as unknown as Record<string, number>)[propKey]
    if (!v || v === 0) return 'rgba(30,35,55,0.5)'
    const t = (v - minVal) / (maxVal - minVal + 0.001)
    return `hsl(${200 - t * 200}, 80%, ${30 + t * 20}%)`
  }

  // Trend chart data
  const chartData = useMemo(() => {
    if (!selected) return []
    if (trendView === 'period') {
      return ELEMENTS.filter(e => e.period === selected.period && e.block !== 'f')
        .sort((a, b) => a.group - b.group)
        .map(e => ({ name: e.sym, value: (e as unknown as Record<string, number>)[propKey] ?? 0, sel: e.sym === selected.sym }))
    }
    return ELEMENTS.filter(e => e.group === selected.group)
      .sort((a, b) => a.period - b.period)
      .map(e => ({ name: e.sym, value: (e as unknown as Record<string, number>)[propKey] ?? 0, sel: e.sym === selected.sym }))
  }, [selected, propKey, trendView])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Interactive Periodic Table — All 118 Elements, Trends & Exceptions</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: PT + right sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Property selector */}
          <div style={{ display: 'flex', gap: 5, padding: '6px 12px', background: 'rgba(9,14,28,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#849495' }}>Heat map:</span>
            {PROPS.map(p => (
              <button key={p.key} onClick={() => setPropKey(p.key)}
                style={{ padding: '3px 9px', borderRadius: 20, border: `1px solid ${propKey === p.key ? p.color : 'rgba(255,255,255,0.08)'}`, background: propKey === p.key ? `${p.color}22` : 'transparent', color: propKey === p.key ? p.color : '#849495', fontSize: 9, cursor: 'pointer', fontWeight: propKey === p.key ? 700 : 400 }}>
                {p.label}
              </button>
            ))}
            {/* Legend */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {Object.entries({ alkali:'Alkali', alkaline:'Alkaline', transition:'Transition', 'post-trans':'Post-trans', metalloid:'Metalloid', nonmetal:'Nonmetal', halogen:'Halogen', noble:'Noble Gas', lanthanide:'Lanthanide', actinide:'Actinide' }).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, color: '#849495' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: C[k] }} />
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Periodic Table grid */}
          <div style={{ overflowX: 'auto', overflowY: 'auto', padding: '6px 8px', flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 32px)', gridTemplateRows: 'repeat(10, 30px)', gap: 2, minWidth: 612 }}>
              {PT_POSITIONS.map(({ sym, col, row }) => {
                const el = ELEM_MAP[sym]
                if (!el) return null
                const isSel = selected?.sym === sym
                const isHov = hovered?.sym === sym
                const inSamePeriod = selected && trendView === 'period' && el.period === selected.period && el.block !== 'f'
                const inSameGroup  = selected && trendView === 'group'  && el.group  === selected.group
                return (
                  <button key={sym}
                    style={{
                      gridColumn: col, gridRow: row,
                      borderRadius: 3, border: isSel ? '2px solid #fff' : isHov ? `1.5px solid ${C[el.cat]}` : `1px solid ${C[el.cat]}40`,
                      background: isSel ? C[el.cat] : (inSamePeriod || inSameGroup) ? `${C[el.cat]}40` : getHeat(el),
                      color: isSel ? '#fff' : '#f8fafc', fontSize: 7, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0,
                      boxShadow: isSel ? `0 0 8px ${C[el.cat]}80` : 'none', transition: 'all 0.1s',
                      position: 'relative',
                    }}
                    onClick={() => setSelected(isSel ? null : el)}
                    onMouseEnter={() => setHovered(el)}
                    onMouseLeave={() => setHovered(null)}>
                    <div style={{ fontSize: 5.5, opacity: 0.7 }}>{el.Z}</div>
                    <div style={{ fontSize: 9, lineHeight: 1 }}>{sym}</div>
                    {/* Exception indicator */}
                    {el.exceptions && <div style={{ position: 'absolute', top: 1, right: 2, width: 4, height: 4, borderRadius: '50%', background: '#fbbf24' }} />}
                  </button>
                )
              })}
              {/* f-block spacer labels */}
              <div style={{ gridColumn: 3, gridRow: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#34d399', fontStyle: 'italic' }}>La-Lu</div>
              <div style={{ gridColumn: 3, gridRow: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#fb923c', fontStyle: 'italic' }}>Ac-Lr</div>
            </div>
          </div>

          {/* Bottom info tabs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ display: 'flex', gap: 0, background: 'rgba(9,14,28,0.7)', flexShrink: 0 }}>
              {[
                { id: 'trends', label: 'Trend Chart' },
                { id: 'exceptions', label: 'IE/AR Exceptions' },
                { id: 'hydrides', label: 'Hydride Strength' },
                { id: 'blocks', label: 'Block Configs' },
                { id: 'redox', label: 'Redox Power' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                  style={{ padding: '5px 14px', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#06b6d4' : 'transparent'}`, background: 'transparent', color: tab === t.id ? '#06b6d4' : '#849495', fontSize: 10, cursor: 'pointer' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
              {tab === 'trends' && selected && (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#849495' }}>Trend across:</span>
                    {(['period', 'group'] as const).map(v => (
                      <button key={v} onClick={() => setTrendView(v)}
                        style={{ padding: '3px 10px', borderRadius: 20, border: `1px solid ${trendView === v ? activeProp.color : 'rgba(255,255,255,0.1)'}`, background: trendView === v ? `${activeProp.color}18` : 'transparent', color: trendView === v ? activeProp.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
                        {v === 'period' ? `Period ${selected.period}` : `Group ${selected.group}`}
                      </button>
                    ))}
                    <span style={{ fontSize: 9, color: '#849495', flex: 1 }}>
                      {trendView === 'period' ? activeProp.acrossPeriod : activeProp.downGroup} · {activeProp.reason}
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <LineChart data={chartData} margin={{ top: 4, right: 10, left: 5, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#849495', fontSize: 9 }} />
                      <YAxis tick={{ fill: '#849495', fontSize: 8 }} />
                      <Tooltip contentStyle={{ background: '#130818', border: `1px solid ${activeProp.color}50`, borderRadius: 8, fontSize: 10 }} formatter={(v: number) => [v, activeProp.label]} />
                      <ReferenceLine x={selected.sym} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 2" />
                      <Line type="monotone" dataKey="value" stroke={activeProp.color} strokeWidth={2.5} dot={(p) => {
                        const { cx, cy, payload } = p as { cx: number; cy: number; payload: { sel: boolean } }
                        return <circle key="dot" cx={cx} cy={cy} r={payload.sel ? 6 : 3} fill={payload.sel ? '#fff' : activeProp.color} stroke={activeProp.color} strokeWidth={2} />
                      }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
              {tab === 'trends' && !selected && (
                <div style={{ color: '#3a4060', fontSize: 12, textAlign: 'center', paddingTop: 20 }}>Click any element to see trend chart</div>
              )}
              {tab === 'exceptions' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {EXCEPTIONS.map(ex => (
                    <div key={ex.title} style={{ background: `${ex.color}0f`, border: `1px solid ${ex.color}30`, borderRadius: 9, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: ex.color, fontWeight: 700, marginBottom: 3 }}>{ex.title}</div>
                      <div style={{ fontSize: 9, color: '#849495', lineHeight: 1.4 }}>{ex.detail}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'hydrides' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {HYDRIDE_ACIDITY.map(h => (
                    <div key={h.group} style={{ background: 'rgba(26,31,47,0.8)', borderRadius: 9, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700 }}>Group {h.group} — Acid Strength:</div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#f8fafc', margin: '3px 0' }}>{h.order}</div>
                      <div style={{ fontSize: 9, color: '#849495' }}>{h.note}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'blocks' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {BLOCK_CONFIGS.map(b => (
                    <div key={b.block} style={{ background: `${b.color}0f`, border: `1px solid ${b.color}30`, borderRadius: 9, padding: '8px 10px' }}>
                      <div style={{ fontSize: 11, color: b.color, fontWeight: 900, fontFamily: 'monospace', marginBottom: 3 }}>{b.block}-block: {b.config}</div>
                      <div style={{ fontSize: 9, color: '#f8fafc', marginBottom: 2 }}>{b.examples}</div>
                      <div style={{ fontSize: 9, color: '#849495' }}>{b.note}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'redox' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {REDOX_TRENDS.map(r => (
                    <div key={r.title} style={{ background: `${r.color}0f`, border: `1px solid ${r.color}30`, borderRadius: 9, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: r.color, fontWeight: 700, marginBottom: 3 }}>{r.title}</div>
                      <div style={{ fontSize: 9, color: '#849495', lineHeight: 1.4 }}>{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: element detail */}
        <div style={{ width: 245, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.7)', padding: 12, overflowY: 'auto' }}>
          {displayEl ? (
            <>
              {/* Element card */}
              <div style={{ background: `${C[displayEl.cat]}14`, border: `1px solid ${C[displayEl.cat]}50`, borderRadius: 14, padding: '12px 14px', textAlign: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 8, color: C[displayEl.cat], marginBottom: 2 }}>Z = {displayEl.Z} · {displayEl.mass.toFixed(3)} u</div>
                <div style={{ fontSize: 46, fontWeight: 900, color: C[displayEl.cat], lineHeight: 1, fontFamily: 'monospace', textShadow: `0 0 18px ${C[displayEl.cat]}60` }}>{displayEl.sym}</div>
                <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 700, marginTop: 3 }}>{displayEl.name}</div>
                {displayEl.iupacName && <div style={{ fontSize: 9, color: '#fbbf24', marginTop: 2 }}>IUPAC: {displayEl.iupacName}</div>}
                <div style={{ fontSize: 9, color: (C[displayEl.cat] ?? '#849495'), marginTop: 4, fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: 6 }}>{displayEl.config}</div>
                <div style={{ fontSize: 9, color: '#849495', marginTop: 3 }}>Ox: {displayEl.oxStates}</div>
                {displayEl.famName && <div style={{ fontSize: 9, color: C[displayEl.cat], marginTop: 2, fontWeight: 700 }}>{displayEl.famName}</div>}
              </div>

              {/* Exceptional config warning */}
              {displayEl.exceptions && (
                <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 9, padding: '7px 10px', marginBottom: 8 }}>
                  <div style={{ fontSize: 8, color: '#fbbf24', fontWeight: 700, marginBottom: 2 }}>⚠️ Exceptional Config</div>
                  <div style={{ fontSize: 9, color: '#f8fafc', lineHeight: 1.4 }}>{displayEl.exceptions}</div>
                </div>
              )}

              {/* Flame color */}
              {displayEl.flame && (
                <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 9, padding: '6px 10px', marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700 }}>🔥 Flame Color: {displayEl.flame}</div>
                </div>
              )}

              {/* Properties */}
              {[
                { label: 'IE₁', value: displayEl.ie1 > 0 ? `${displayEl.ie1} kJ/mol` : 'N/A', color: '#06b6d4' },
                { label: 'Atomic Radius', value: `${displayEl.ar} pm`, color: '#f97316' },
                { label: 'Electronegativity', value: displayEl.en > 0 ? displayEl.en.toFixed(2) : 'N/A', color: '#a78bfa' },
                { label: 'Electron Affinity', value: displayEl.ea > 0 ? `${displayEl.ea} kJ/mol` : '~0', color: '#22c55e' },
                { label: 'Melting Point', value: `${displayEl.mp} K`, color: '#fbbf24' },
                { label: 'Block', value: `${displayEl.block}-block`, color: '#ec4899' },
                { label: 'Period / Group', value: `${displayEl.period} / ${displayEl.group}`, color: '#34d399' },
              ].map(prop => (
                <div key={prop.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '4px 7px', borderRadius: 7, background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 9, color: '#849495' }}>{prop.label}</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: prop.color }}>{prop.value}</span>
                </div>
              ))}

              {/* Trend hint on hover */}
              {!selected && (
                <div style={{ marginTop: 8, padding: '6px 8px', borderRadius: 8, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', fontSize: 9, color: '#849495' }}>
                  Click element to pin and see trend chart below
                </div>
              )}

              {/* Trend arrows */}
              {selected && selected.sym === displayEl.sym && (
                <div style={{ marginTop: 8, padding: '7px 9px', borderRadius: 9, background: `${activeProp.color}0a`, border: `1px solid ${activeProp.color}25` }}>
                  <div style={{ fontSize: 9, color: activeProp.color, fontWeight: 700, marginBottom: 3 }}>{activeProp.label} trends:</div>
                  <div style={{ fontSize: 9, color: '#849495' }}>→ Period: {activeProp.acrossPeriod}</div>
                  <div style={{ fontSize: 9, color: '#849495' }}>↓ Group: {activeProp.downGroup}</div>
                  <div style={{ fontSize: 8, color: '#849495', marginTop: 4, lineHeight: 1.4 }}>{activeProp.reason}</div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#3a4060', marginTop: 60 }}>
              <div style={{ fontSize: 32 }}>⚛</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Hover or click an element</div>
              <div style={{ fontSize: 9, marginTop: 4 }}>🟡 dot = exceptional electronic config</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

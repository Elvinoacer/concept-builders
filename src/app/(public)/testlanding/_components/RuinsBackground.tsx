"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function RuinsBackground() {
  const { scrollY } = useScroll();
  // Fixed position means it naturally stays in place (speed 0).
  // Moving it UP by half the scroll distance makes it scroll at 0.5x speed relative to the page.
  const y = useTransform(scrollY, v => -v * 0.5);

  return (
    <motion.div 
      style={{ y }} 
      className="pointer-events-none fixed inset-0 z-20 opacity-40 flex justify-between"
      aria-hidden="true"
    >
      <div className="w-[180px] h-[1200px] shrink-0">
        <svg className="ruins-left" viewBox="0 0 180 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin slice">
  <defs>
    <filter id="roughL" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="shadowL">
      <feDropShadow dx="6" dy="0" stdDeviation="12" floodColor="#0a0500" floodOpacity="0.9"/>
    </filter>
    <linearGradient id="brickEdgeGrad" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stopColor="#0d0603" stopOpacity="1"/>
      <stop offset="35%" stopColor="#1a1008" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#1a1008" stopOpacity="0"/>
    </linearGradient>
    <clipPath id="leftClip">
      <rect x="0" y="0" width="180" height="1200"/>
    </clipPath>
  </defs>

  <g clipPath="url(#leftClip)" filter="url(#shadowL)">

  {/* === ROW GENERATOR: rows of bricks with ragged right edge === */}
  {/* Row height ~22px, brick width varies 38-62px, mortar 3px */}

  {/* COLUMN of bricks: each brick is a group with a rect + mortar lines */}
  {/* We define a macro-column from top to bottom with random widths and irregular right edges */}

  {/* bg fill behind bricks */}
  <rect x="0" y="0" width="180" height="1200" fill="#0d0603"/>

  {/* BRICKS — hand-crafted irregular stack with jagged profile */}

  {/* ROW 0 (y=0) */}
  <rect x="0" y="0" width="128" height="19" rx="0" fill="#6b3018" filter="url(#roughL)"/>
  <rect x="0" y="0" width="128" height="19" rx="0" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  {/* crack */}
  <line x1="60" y1="0" x2="58" y2="19" stroke="#1e0e04" strokeWidth="0.8" opacity="0.6"/>

  {/* ROW 1 (y=22) */}
  <rect x="0" y="22" width="58" height="20" fill="#7a3820" filter="url(#roughL)"/>
  <rect x="0" y="22" width="58" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="61" y="22" width="74" height="20" fill="#5e2c14" filter="url(#roughL)"/>
  <rect x="61" y="22" width="74" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 2 (y=45) */}
  <rect x="0" y="45" width="112" height="21" fill="#6f3219" filter="url(#roughL)"/>
  <rect x="0" y="45" width="112" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  {/* mortar gap */}

  {/* ROW 3 (y=69) */}
  <rect x="0" y="69" width="46" height="20" fill="#7c3a1e" filter="url(#roughL)"/>
  <rect x="0" y="69" width="46" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="49" y="69" width="65" height="20" fill="#5f2c13" filter="url(#roughL)"/>
  <rect x="49" y="69" width="65" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 4 (y=92) — broken section, shorter bricks */}
  <rect x="0" y="92" width="35" height="21" fill="#7a381c" filter="url(#roughL)"/>
  <rect x="0" y="92" width="35" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="38" y="92" width="52" height="21" fill="#633017" filter="url(#roughL)"/>
  <rect x="38" y="92" width="52" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="93" y="92" width="40" height="21" fill="#6b3019" filter="url(#roughL)"/>
  <rect x="93" y="92" width="40" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 5 (y=116) */}
  <rect x="0" y="116" width="130" height="20" fill="#6a2f17" filter="url(#roughL)"/>
  <rect x="0" y="116" width="130" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 6 (y=139) */}
  <rect x="0" y="139" width="55" height="21" fill="#7a3820" filter="url(#roughL)"/>
  <rect x="0" y="139" width="55" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="58" y="139" width="68" height="21" fill="#5c2b12" filter="url(#roughL)"/>
  <rect x="58" y="139" width="68" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 7 (y=163) — crumbled, only partial */}
  <rect x="0" y="163" width="42" height="20" fill="#7b3820" filter="url(#roughL)"/>
  <rect x="0" y="163" width="42" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="45" y="163" width="55" height="20" fill="#5e2c14" filter="url(#roughL)"/>
  <rect x="45" y="163" width="55" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 8 (y=186) */}
  <rect x="0" y="186" width="118" height="21" fill="#6c3018" filter="url(#roughL)"/>
  <rect x="0" y="186" width="118" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 9 (y=210) */}
  <rect x="0" y="210" width="60" height="20" fill="#7a3820" filter="url(#roughL)"/>
  <rect x="0" y="210" width="60" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="63" y="210" width="58" height="20" fill="#5f2c14" filter="url(#roughL)"/>
  <rect x="63" y="210" width="58" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>

  {/* ROW 10 (y=233) — partial break */}
  <rect x="0" y="233" width="30" height="20" fill="#7e3c22" filter="url(#roughL)"/>
  <rect x="0" y="233" width="30" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="33" y="233" width="70" height="20" fill="#66301a" filter="url(#roughL)"/>
  <rect x="33" y="233" width="70" height="20" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  <rect x="106" y="235" width="28" height="16" fill="#5a2810" filter="url(#roughL)"/>

  {/* ROW 11 (y=256) */}
  <rect x="0" y="256" width="145" height="21" fill="#693018" filter="url(#roughL)"/>
  <rect x="0" y="256" width="145" height="21" fill="none" stroke="#3a1a0a" strokeWidth="1"/>
  {/* big crack */}
  <polyline points="80,256 77,270 82,277" stroke="#1e0e04" strokeWidth="1.2" fill="none" opacity="0.7"/>

  {/* Rows 12–50 continue seamlessly — abbreviated for efficiency, repeating pattern */}
  {/* We generate rows every ~23px down to y=1200 in a tight loop of similar bricks */}

  <g id="brick-repeat">
  {/* Row 12 y=280 */}
  <rect x="0" y="280" width="52" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="55" y="280" width="78" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 13 y=303 */}
  <rect x="0" y="303" width="120" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 14 y=327 */}
  <rect x="0" y="327" width="40" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="43" y="327" width="62" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="108" y="329" width="30" height="16" fill="#5a2810" stroke="#3a1a0a" strokeWidth="1"/>
  {/* Row 15 y=350 */}
  <rect x="0" y="350" width="136" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 16 y=374 */}
  <rect x="0" y="374" width="58" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="61" y="374" width="72" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 17 y=397 partial */}
  <rect x="0" y="397" width="38" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="41" y="397" width="60" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 18 y=421 */}
  <rect x="0" y="421" width="110" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 19 y=444 */}
  <rect x="0" y="444" width="63" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="66" y="444" width="55" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 20 y=468 */}
  <rect x="0" y="468" width="142" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <polyline points="90,468 88,488" stroke="#1e0e04" strokeWidth="0.9" fill="none" opacity="0.6"/>
  {/* Row 21 y=491 */}
  <rect x="0" y="491" width="50" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="53" y="491" width="74" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 22 y=514 */}
  <rect x="0" y="514" width="125" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 23 y=538 */}
  <rect x="0" y="538" width="44" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="47" y="538" width="68" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 24 y=561 */}
  <rect x="0" y="561" width="135" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 25 y=585 */}
  <rect x="0" y="585" width="55" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="58" y="585" width="70" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 26 y=608 */}
  <rect x="0" y="608" width="38" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="41" y="608" width="58" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="102" y="610" width="36" height="17" fill="#5a2810"/>
  {/* Row 27 y=632 */}
  <rect x="0" y="632" width="115" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 28 y=655 */}
  <rect x="0" y="655" width="62" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="65" y="655" width="60" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 29 y=679 */}
  <rect x="0" y="679" width="140" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 30 y=702 */}
  <rect x="0" y="702" width="51" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="54" y="702" width="75" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 31 y=726 */}
  <rect x="0" y="726" width="122" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <polyline points="55,726 53,746" stroke="#1e0e04" strokeWidth="1" fill="none" opacity="0.55"/>
  {/* Row 32 y=749 */}
  <rect x="0" y="749" width="42" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="45" y="749" width="64" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 33 y=773 */}
  <rect x="0" y="773" width="133" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 34 y=796 */}
  <rect x="0" y="796" width="56" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="59" y="796" width="73" height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 35 y=820 */}
  <rect x="0" y="820" width="37" height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="40" y="820" width="56" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 36 y=843 */}
  <rect x="0" y="843" width="112" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 37 y=867 */}
  <rect x="0" y="867" width="64" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="67" y="867" width="58" height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 38 y=890 */}
  <rect x="0" y="890" width="138" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 39 y=914 */}
  <rect x="0" y="914" width="52" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="55" y="914" width="76" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 40 y=937 */}
  <rect x="0" y="937" width="120" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 41 y=961 */}
  <rect x="0" y="961" width="43" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="46" y="961" width="66" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 42 y=984 */}
  <rect x="0" y="984" width="132" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 43 y=1008 */}
  <rect x="0" y="1008" width="57" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="60" y="1008" width="71" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 44 y=1031 */}
  <rect x="0" y="1031" width="39" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="42" y="1031" width="59" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 45 y=1055 */}
  <rect x="0" y="1055" width="116" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 46 y=1078 */}
  <rect x="0" y="1078" width="65" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="68" y="1078" width="57" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 47 y=1102 */}
  <rect x="0" y="1102" width="136" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 48 y=1125 */}
  <rect x="0" y="1125" width="53" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="56" y="1125" width="77" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 49 y=1149 */}
  <rect x="0" y="1149" width="118" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  {/* Row 50 y=1172 */}
  <rect x="0" y="1172" width="44" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  <rect x="47" y="1172" width="67" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
  </g>

  {/* Scattered rubble/pebbles */}
  <ellipse cx="112" cy="108" rx="5" ry="3" fill="#5a2810" opacity="0.8"/>
  <ellipse cx="125" cy="174" rx="4" ry="2" fill="#4e2208" opacity="0.7"/>
  <ellipse cx="140" cy="250" rx="6" ry="3" fill="#5c2a10" opacity="0.75"/>
  <ellipse cx="118" cy="340" rx="3" ry="2" fill="#50200a" opacity="0.65"/>
  <ellipse cx="132" cy="430" rx="5" ry="3" fill="#5a2810" opacity="0.7"/>
  <ellipse cx="108" cy="520" rx="4" ry="2" fill="#4e2208" opacity="0.65"/>
  <ellipse cx="150" cy="620" rx="5" ry="3" fill="#5c2a10" opacity="0.8"/>
  <ellipse cx="122" cy="720" rx="6" ry="3" fill="#50200a" opacity="0.7"/>
  <ellipse cx="142" cy="830" rx="4" ry="2" fill="#5a2810" opacity="0.65"/>
  <ellipse cx="110" cy="940" rx="5" ry="3" fill="#5c2a10" opacity="0.75"/>

  {/* Vignette / fade to transparent on right */}
  <rect x="0" y="0" width="180" height="1200" fill="url(#brickEdgeGrad)"/>
  {/* Deep left shadow */}
  <rect x="0" y="0" width="40" height="1200" fill="rgba(5,2,1,0.6)"/>

  </g>
</svg>
      </div>
      <div className="w-[180px] h-[1200px] shrink-0">
        <svg className="ruins-right" viewBox="0 0 180 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin slice">
  {/* Mirror of left — scaleX(-1) on the element handles the flip */}
  <defs>
    <filter id="roughR" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="shadowR">
      <feDropShadow dx="6" dy="0" stdDeviation="12" floodColor="#0a0500" floodOpacity="0.9"/>
    </filter>
    <linearGradient id="brickEdgeGradR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stopColor="#0d0603" stopOpacity="1"/>
      <stop offset="40%" stopColor="#1a1008" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#1a1008" stopOpacity="0"/>
    </linearGradient>
    <clipPath id="rightClip">
      <rect x="0" y="0" width="180" height="1200"/>
    </clipPath>
  </defs>
  <g clipPath="url(#rightClip)" filter="url(#shadowR)">
  <rect x="0" y="0" width="180" height="1200" fill="#0d0603"/>

  {/* Staggered rows slightly offset from left for asymmetry */}
  <rect x="0" y="5" width="135" height="19" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="27" width="58" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="61" y="27" width="68" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="50" width="115" height="21" fill="#6f3219" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="74" width="48" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="51" y="74" width="63" height="20" fill="#5f2c13" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="97" width="38" height="21" fill="#7a381c" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="41" y="97" width="52" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="96" y="99" width="38" height="17" fill="#5a2810"/>
  <rect x="0" y="121" width="128" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="144" width="54" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="57" y="144" width="70" height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="168" width="44" height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="47" y="168" width="57" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="191" width="122" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="215" width="61" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="64" y="215" width="57" height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="238" width="32" height="20" fill="#7e3c22" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="35" y="238" width="72" height="20" fill="#66301a" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="261" width="143" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="285" width="53" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="56" y="285" width="76" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="308" width="118" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="332" width="41" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="44" y="332" width="65" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="355" width="134" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="379" width="56" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="59" y="379" width="72" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="402" width="39" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="42" y="402" width="59" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="104" y="404" width="34" height="17" fill="#5a2810"/>
  <rect x="0" y="426" width="113" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="449" width="64" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="67" y="449" width="58" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="473" width="141" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="496" width="51" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="54" y="496" width="74" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="519" width="124" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="543" width="45" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="48" y="543" width="67" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="566" width="133" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="590" width="57" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="60" y="590" width="71" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="613" width="37" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="40" y="613" width="57" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="637" width="116" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="660" width="65" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="68" y="660" width="56" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="684" width="139" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="707" width="52" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="55" y="707" width="75" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="731" width="121" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="754" width="43" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="46" y="754" width="65" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="778" width="132" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="801" width="58" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="61" y="801" width="72" height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="825" width="38" height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="41" y="825" width="58" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="848" width="114" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="872" width="63" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="66" y="872" width="59" height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="895" width="137" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="919" width="53" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="56" y="919" width="76" height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="942" width="119" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="966" width="44" height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="47" y="966" width="66" height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="989" width="131" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1013" width="59" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="62" y="1013" width="70" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1036" width="40" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="43" y="1036" width="60" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1060" width="117" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1083" width="64" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="67" y="1083" width="57" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1107" width="135" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1130" width="54" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="57" y="1130" width="76" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1154" width="120" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="0" y="1177" width="45" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
  <rect x="48" y="1177" width="68" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>

  {/* Rubble */}
  <ellipse cx="115" cy="115" rx="5" ry="3" fill="#5a2810" opacity="0.8"/>
  <ellipse cx="128" cy="185" rx="4" ry="2" fill="#4e2208" opacity="0.7"/>
  <ellipse cx="143" cy="258" rx="6" ry="3" fill="#5c2a10" opacity="0.75"/>
  <ellipse cx="120" cy="350" rx="3" ry="2" fill="#50200a" opacity="0.65"/>
  <ellipse cx="136" cy="440" rx="5" ry="3" fill="#5a2810" opacity="0.7"/>

  {/* Edge gradient */}
  <rect x="0" y="0" width="180" height="1200" fill="url(#brickEdgeGradR)"/>
  <rect x="0" y="0" width="40" height="1200" fill="rgba(5,2,1,0.6)"/>
  </g>
</svg>
      </div>
    </motion.div>
  );
}

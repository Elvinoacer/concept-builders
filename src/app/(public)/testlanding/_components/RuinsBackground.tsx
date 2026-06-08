"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function RuinsBackground() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, v => -v * 0.5);

  return (
    <motion.div
      style={{ y }}
      className="ruins-wrapper"
      aria-hidden="true"
    >
      {/* ── LEFT RUIN ── */}
      <div className="ruin ruin-left">
        <svg
          viewBox="0 0 180 1200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMin slice"
        >
          <defs>
            <filter id="roughL" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <filter id="shadowL">
              <feDropShadow dx="6" dy="0" stdDeviation="12" floodColor="#0a0500" floodOpacity="0.9"/>
            </filter>
            <linearGradient id="brickEdgeGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%"   stopColor="#0d0603" stopOpacity="1"/>
              <stop offset="35%"  stopColor="#1a1008" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#1a1008" stopOpacity="0"/>
            </linearGradient>
            <clipPath id="leftClip">
              <rect x="0" y="0" width="180" height="1200"/>
            </clipPath>
          </defs>

          <g clipPath="url(#leftClip)" filter="url(#shadowL)">
            <rect x="0" y="0" width="180" height="1200" fill="#0d0603"/>

            {/* ROW 0 */}
            <rect x="0" y="0"   width="128" height="19" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <line x1="60" y1="0" x2="58" y2="19" stroke="#1e0e04" strokeWidth="0.8" opacity="0.6"/>
            {/* ROW 1 */}
            <rect x="0"  y="22" width="58"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="61" y="22" width="74"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 2 */}
            <rect x="0"  y="45" width="112" height="21" fill="#6f3219" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 3 */}
            <rect x="0"  y="69" width="46"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="49" y="69" width="65"  height="20" fill="#5f2c13" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 4 */}
            <rect x="0"  y="92" width="35"  height="21" fill="#7a381c" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="38" y="92" width="52"  height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="93" y="92" width="40"  height="21" fill="#6b3019" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 5 */}
            <rect x="0"  y="116" width="130" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 6 */}
            <rect x="0"  y="139" width="55"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="58" y="139" width="68"  height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 7 */}
            <rect x="0"  y="163" width="42"  height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="45" y="163" width="55"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 8 */}
            <rect x="0"  y="186" width="118" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 9 */}
            <rect x="0"  y="210" width="60"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="63" y="210" width="58"  height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            {/* ROW 10 */}
            <rect x="0"   y="233" width="30"  height="20" fill="#7e3c22" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="33"  y="233" width="70"  height="20" fill="#66301a" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="106" y="235" width="28"  height="16" fill="#5a2810"/>
            {/* ROW 11 */}
            <rect x="0"  y="256" width="145" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <polyline points="80,256 77,270 82,277" stroke="#1e0e04" strokeWidth="1.2" fill="none" opacity="0.7"/>
            {/* ROWS 12-50 */}
            <rect x="0"   y="280" width="52"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="55"  y="280" width="78"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="303" width="120" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="327" width="40"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="43"  y="327" width="62"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="108" y="329" width="30"  height="16" fill="#5a2810" stroke="#3a1a0a" strokeWidth="1"/>
            <rect x="0"   y="350" width="136" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="374" width="58"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="61"  y="374" width="72"  height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="397" width="38"  height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="41"  y="397" width="60"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="421" width="110" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="444" width="63"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="66"  y="444" width="55"  height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="468" width="142" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <polyline points="90,468 88,488" stroke="#1e0e04" strokeWidth="0.9" fill="none" opacity="0.6"/>
            <rect x="0"   y="491" width="50"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="53"  y="491" width="74"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="514" width="125" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="538" width="44"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="47"  y="538" width="68"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="561" width="135" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="585" width="55"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="58"  y="585" width="70"  height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="608" width="38"  height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="41"  y="608" width="58"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="102" y="610" width="36"  height="17" fill="#5a2810"/>
            <rect x="0"   y="632" width="115" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="655" width="62"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="65"  y="655" width="60"  height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="679" width="140" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="702" width="51"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="54"  y="702" width="75"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="726" width="122" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <polyline points="55,726 53,746" stroke="#1e0e04" strokeWidth="1" fill="none" opacity="0.55"/>
            <rect x="0"   y="749" width="42"  height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="45"  y="749" width="64"  height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="773" width="133" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="796" width="56"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="59"  y="796" width="73"  height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="820" width="37"  height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="40"  y="820" width="56"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="843" width="112" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="867" width="64"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="67"  y="867" width="58"  height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="890" width="138" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="914" width="52"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="55"  y="914" width="76"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="937" width="120" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="961" width="43"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="46"  y="961" width="66"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="984" width="132" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1008" width="57" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="60"  y="1008" width="71" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1031" width="39" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="42"  y="1031" width="59" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1055" width="116" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1078" width="65" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="68"  y="1078" width="57" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1102" width="136" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1125" width="53" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="56"  y="1125" width="77" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1149" width="118" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="0"   y="1172" width="44" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>
            <rect x="47"  y="1172" width="67" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughL)"/>

            {/* Rubble */}
            <ellipse cx="112" cy="108"  rx="5" ry="3" fill="#5a2810" opacity="0.8"/>
            <ellipse cx="125" cy="174"  rx="4" ry="2" fill="#4e2208" opacity="0.7"/>
            <ellipse cx="140" cy="250"  rx="6" ry="3" fill="#5c2a10" opacity="0.75"/>
            <ellipse cx="118" cy="340"  rx="3" ry="2" fill="#50200a" opacity="0.65"/>
            <ellipse cx="132" cy="430"  rx="5" ry="3" fill="#5a2810" opacity="0.7"/>
            <ellipse cx="108" cy="520"  rx="4" ry="2" fill="#4e2208" opacity="0.65"/>
            <ellipse cx="150" cy="620"  rx="5" ry="3" fill="#5c2a10" opacity="0.8"/>
            <ellipse cx="122" cy="720"  rx="6" ry="3" fill="#50200a" opacity="0.7"/>
            <ellipse cx="142" cy="830"  rx="4" ry="2" fill="#5a2810" opacity="0.65"/>
            <ellipse cx="110" cy="940"  rx="5" ry="3" fill="#5c2a10" opacity="0.75"/>

            {/* Fade-to-transparent on right + left deep shadow */}
            <rect x="0" y="0" width="180" height="1200" fill="url(#brickEdgeGrad)"/>
            <rect x="0" y="0" width="40"  height="1200" fill="rgba(5,2,1,0.6)"/>
          </g>
        </svg>
      </div>

      {/* ── RIGHT RUIN ── */}
      <div className="ruin ruin-right">
        <svg
          viewBox="0 0 180 1200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMin slice"
        >
          <defs>
            <filter id="roughR" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <filter id="shadowR">
              <feDropShadow dx="6" dy="0" stdDeviation="12" floodColor="#0a0500" floodOpacity="0.9"/>
            </filter>
            <linearGradient id="brickEdgeGradR" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%"   stopColor="#0d0603" stopOpacity="1"/>
              <stop offset="40%"  stopColor="#1a1008" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#1a1008" stopOpacity="0"/>
            </linearGradient>
            <clipPath id="rightClip">
              <rect x="0" y="0" width="180" height="1200"/>
            </clipPath>
          </defs>

          <g clipPath="url(#rightClip)" filter="url(#shadowR)">
            <rect x="0" y="0" width="180" height="1200" fill="#0d0603"/>

            <rect x="0"  y="5"   width="135" height="19" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="27"  width="58"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="61" y="27"  width="68"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="50"  width="115" height="21" fill="#6f3219" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="74"  width="48"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="51" y="74"  width="63"  height="20" fill="#5f2c13" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="97"  width="38"  height="21" fill="#7a381c" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="41" y="97"  width="52"  height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="96" y="99"  width="38"  height="17" fill="#5a2810"/>
            <rect x="0"  y="121" width="128" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="144" width="54"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="57" y="144" width="70"  height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="168" width="44"  height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="47" y="168" width="57"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="191" width="122" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="215" width="61"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="64" y="215" width="57"  height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="238" width="32"  height="20" fill="#7e3c22" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="35" y="238" width="72"  height="20" fill="#66301a" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="261" width="143" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="285" width="53"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="56" y="285" width="76"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="308" width="118" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="332" width="41"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="44" y="332" width="65"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="355" width="134" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="379" width="56"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="59" y="379" width="72"  height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="402" width="39"  height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="42" y="402" width="59"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="104" y="404" width="34" height="17" fill="#5a2810"/>
            <rect x="0"  y="426" width="113" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="449" width="64"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="67" y="449" width="58"  height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="473" width="141" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="496" width="51"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="54" y="496" width="74"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="519" width="124" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="543" width="45"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="48" y="543" width="67"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="566" width="133" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="590" width="57"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="60" y="590" width="71"  height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="613" width="37"  height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="40" y="613" width="57"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="637" width="116" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="660" width="65"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="68" y="660" width="56"  height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="684" width="139" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="707" width="52"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="55" y="707" width="75"  height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="731" width="121" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="754" width="43"  height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="46" y="754" width="65"  height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="778" width="132" height="20" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="801" width="58"  height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="61" y="801" width="72"  height="21" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="825" width="38"  height="20" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="41" y="825" width="58"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="848" width="114" height="21" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="872" width="63"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="66" y="872" width="59"  height="20" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="895" width="137" height="21" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="919" width="53"  height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="56" y="919" width="76"  height="20" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="942" width="119" height="21" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="966" width="44"  height="20" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="47" y="966" width="66"  height="20" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="989" width="131" height="21" fill="#6a2f17" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1013" width="59" height="20" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="62" y="1013" width="70" height="20" fill="#5c2b12" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1036" width="40" height="21" fill="#7b3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="43" y="1036" width="60" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1060" width="117" height="20" fill="#6c3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1083" width="64" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="67" y="1083" width="57" height="21" fill="#5f2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1107" width="135" height="20" fill="#693018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1130" width="54" height="21" fill="#7a3820" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="57" y="1130" width="76" height="21" fill="#5e2c14" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1154" width="120" height="20" fill="#6b3018" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="0"  y="1177" width="45" height="21" fill="#7c3a1e" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>
            <rect x="48" y="1177" width="68" height="21" fill="#633017" stroke="#3a1a0a" strokeWidth="1" filter="url(#roughR)"/>

            {/* Rubble */}
            <ellipse cx="115" cy="115"  rx="5" ry="3" fill="#5a2810" opacity="0.8"/>
            <ellipse cx="128" cy="185"  rx="4" ry="2" fill="#4e2208" opacity="0.7"/>
            <ellipse cx="143" cy="258"  rx="6" ry="3" fill="#5c2a10" opacity="0.75"/>
            <ellipse cx="120" cy="350"  rx="3" ry="2" fill="#50200a" opacity="0.65"/>
            <ellipse cx="136" cy="440"  rx="5" ry="3" fill="#5a2810" opacity="0.7"/>

            {/* Fade + shadow */}
            <rect x="0" y="0" width="180" height="1200" fill="url(#brickEdgeGradR)"/>
            <rect x="0" y="0" width="40"  height="1200" fill="rgba(5,2,1,0.6)"/>
          </g>
        </svg>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        .ruins-wrapper {
          pointer-events: none;
          position: fixed;
          inset: 0;
          /*
           * z-index: 15 layers bricks above page content (z-10)
           * but below nav overlays. pointer-events: none ensures
           * clicks pass through to content underneath.
           */
          z-index: 15;
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          /* Slightly dimmer on mobile — content legibility first */
          opacity: 0.55;
        }

        /*
         * Each ruin container scales with the viewport.
         * Negative margin = -(width × 0.6) → 40% stays visible.
         *
         * Both ruins use scaleX(-1) so the SVG's dense/solid left
         * edge is always pushed offscreen and only the organic
         * ragged/crumbled inner edge peeks in — on both sides.
         */
        .ruin {
          width: 60px;
          flex-shrink: 0;
          height: 100vh;
          overflow: visible;
        }

        .ruin svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /*
         * BOTH ruins flip horizontally:
         * - Left:  scaleX(-1) + transform-origin right → solid edge
         *          goes offscreen left, ragged edge faces content
         * - Right: scaleX(-1) mirrors same SVG, ragged edge right
         */
        .ruin-left {
          transform: scaleX(-1);
          transform-origin: left center;
        }
        .ruin-right {
          transform: scaleX(-1);
          transform-origin: right center;
        }

        /* Mobile base (<641px): ~20px peek */
        .ruin-left  { margin-left:  -40px; }
        .ruin-right { margin-right: -40px; }

        /* Tiny phones (<400px): ~16px peek */
        @media (max-width: 400px) {
          .ruin { width: 50px; }
          .ruin-left  { margin-left:  -34px; }
          .ruin-right { margin-right: -34px; }
        }

        /* Tablets (641–1023px): ~36px peek */
        @media (min-width: 641px) and (max-width: 1023px) {
          .ruin { width: 90px; }
          .ruin-left  { margin-left:  -54px; }
          .ruin-right { margin-right: -54px; }
          .ruins-wrapper { opacity: 0.65; }
        }

        /* Desktop (≥1024px): ~52px peek */
        @media (min-width: 1024px) {
          .ruin { width: 130px; }
          .ruin-left  { margin-left:  -78px; }
          .ruin-right { margin-right: -78px; }
          .ruins-wrapper { opacity: 0.72; }
        }

        /* Wide desktop (≥1440px): ~68px peek */
        @media (min-width: 1440px) {
          .ruin { width: 170px; }
          .ruin-left  { margin-left:  -102px; }
          .ruin-right { margin-right: -102px; }
          .ruins-wrapper { opacity: 0.75; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ruins-wrapper { opacity: 0.3; }
        }
      `}</style>
    </motion.div>
  );
}
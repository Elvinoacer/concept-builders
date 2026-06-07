"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import "./DreamPlan.css";

// ── House plan data ──
const PLANS = [
  {
    tag: "Contemporary Villa",
    name: "The Maisonette",
    beds: "5 Bed · 4 Bath",
    area: "4,200 sqft",
    price: "$3,800",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg",
  },
  {
    tag: "Modern Bungalow",
    name: "The Zenith",
    beds: "3 Bed · 2 Bath",
    area: "1,850 sqft",
    price: "$1,600",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
  },
  {
    tag: "Apartment Block",
    name: "The Nexus",
    beds: "20 Units · Mixed",
    area: "15,000 sqft",
    price: "$12,000",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
  },
  {
    tag: "Luxury Estate",
    name: "The Oasis Vista",
    beds: "6 Bed · 7 Bath",
    area: "6,500 sqft",
    price: "$5,200",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
  },
  {
    tag: "Country Cottage",
    name: "English Retreat",
    beds: "4 Bed · 3 Bath",
    area: "2,600 sqft",
    price: "$2,100",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg",
  },
  {
    tag: "Townhouse Community",
    name: "Urban Haven",
    beds: "3 Bed · 3 Bath",
    area: "2,100 sqft",
    price: "$1,850",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Streetscape1.jpg",
  },
  {
    tag: "Luxury Maisonette",
    name: "The Pinnacle",
    beds: "4 Bed · 4 Bath",
    area: "3,400 sqft",
    price: "$2,900",
    image: "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",
  },
];

// ── SVG Illustrations ──
function VillaSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="150" fill={c2} opacity="0.5" />
      <rect y="195" width="280" height="55" fill={c1} opacity="0.8" />
      <rect x="30" y="110" width="220" height="90" fill={c2} />
      <rect x="20" y="105" width="240" height="10" fill={ac} opacity="0.7" />
      <rect x="10" y="130" width="60" height="70" fill={c2} opacity="0.8" />
      <rect x="210" y="130" width="60" height="70" fill={c2} opacity="0.8" />
      <rect x="50" y="120" width="50" height="40" fill={ac} opacity="0.18" />
      <rect x="115" y="120" width="50" height="40" fill={ac} opacity="0.18" />
      <rect x="180" y="120" width="50" height="40" fill={ac} opacity="0.18" />
      <rect x="50" y="120" width="50" height="1" fill={ac} opacity="0.5" />
      <rect x="115" y="120" width="50" height="1" fill={ac} opacity="0.5" />
      <rect x="180" y="120" width="50" height="1" fill={ac} opacity="0.5" />
      <rect x="120" y="155" width="40" height="45" fill={ac} opacity="0.2" />
      <rect x="120" y="155" width="40" height="2" fill={ac} opacity="0.6" />
      <rect x="115" y="110" width="4" height="90" fill={ac} opacity="0.3" />
      <rect x="160" y="110" width="4" height="90" fill={ac} opacity="0.3" />
      <rect x="80" y="210" width="120" height="20" rx="4" fill={ac} opacity="0.12" />
      <rect x="80" y="210" width="120" height="1" fill={ac} opacity="0.35" />
      <ellipse cx="20" cy="170" rx="12" ry="18" fill={ac} opacity="0.08" />
      <rect x="19" y="182" width="2" height="12" fill={ac} opacity="0.2" />
      <ellipse cx="260" cy="165" rx="12" ry="18" fill={ac} opacity="0.08" />
      <rect x="259" y="177" width="2" height="12" fill={ac} opacity="0.2" />
      <circle cx="40" cy="30" r="1" fill={ac} opacity="0.6" />
      <circle cx="120" cy="20" r="1.5" fill={ac} opacity="0.4" />
      <circle cx="200" cy="45" r="1" fill={ac} opacity="0.5" />
      <circle cx="250" cy="25" r="1" fill={ac} opacity="0.35" />
      <circle cx="80" cy="50" r="0.8" fill={ac} opacity="0.45" />
      <rect x="0" y="190" width="280" height="8" fill={ac} opacity="0.04" />
    </svg>
  );
}

function BungalowSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="180" fill={c2} opacity="0.3" />
      <rect y="190" width="280" height="60" fill={c2} opacity="0.4" />
      <rect x="40" y="130" width="200" height="65" fill={c2} />
      <polygon points="20,130 140,65 260,130" fill={c2} opacity="0.9" />
      <polygon points="20,130 140,65 260,130" fill="none" stroke={ac} strokeWidth="1" opacity="0.4" />
      <rect x="85" y="72" width="14" height="38" fill={c2} />
      <rect x="82" y="68" width="20" height="6" fill={ac} opacity="0.5" />
      <rect x="55" y="140" width="45" height="35" fill={ac} opacity="0.15" />
      <line x1="55" y1="140" x2="100" y2="140" stroke={ac} strokeWidth="0.8" opacity="0.5" />
      <line x1="77" y1="140" x2="77" y2="175" stroke={ac} strokeWidth="0.5" opacity="0.3" />
      <rect x="180" y="140" width="45" height="35" fill={ac} opacity="0.15" />
      <line x1="180" y1="140" x2="225" y2="140" stroke={ac} strokeWidth="0.8" opacity="0.5" />
      <line x1="202" y1="140" x2="202" y2="175" stroke={ac} strokeWidth="0.5" opacity="0.3" />
      <rect x="122" y="152" width="36" height="43" rx="2" fill={ac} opacity="0.18" />
      <circle cx="153" cy="175" r="2.5" fill={ac} opacity="0.5" />
      <rect x="112" y="193" width="56" height="5" fill={ac} opacity="0.25" />
      <rect x="130" y="198" width="20" height="52" fill={ac} opacity="0.08" />
      <ellipse cx="50" cy="196" rx="20" ry="12" fill={ac} opacity="0.1" />
      <ellipse cx="230" cy="196" rx="20" ry="12" fill={ac} opacity="0.1" />
      <circle cx="230" cy="35" r="18" fill={c2} opacity="0.6" />
      <circle cx="238" cy="30" r="15" fill={c1} />
    </svg>
  );
}

function SkylineSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="210" fill={c2} opacity="0.2" />
      <rect y="180" width="280" height="70" fill={c2} opacity="0.35" />
      <rect x="95" y="60" width="90" height="145" fill={c2} />
      <rect x="105" y="55" width="70" height="8" fill={ac} opacity="0.6" />
      <rect x="120" y="44" width="40" height="12" fill={ac} opacity="0.4" />
      <rect x="30" y="95" width="65" height="110" fill={c2} opacity="0.85" />
      <rect x="185" y="105" width="65" height="100" fill={c2} opacity="0.85" />
      <rect x="103" y="72" width="18" height="14" fill={ac} opacity="0.22" />
      <rect x="130" y="72" width="18" height="14" fill={ac} opacity="0.22" />
      <rect x="159" y="72" width="18" height="14" fill={ac} opacity="0.22" />
      <rect x="103" y="96" width="18" height="14" fill={ac} opacity="0.18" />
      <rect x="130" y="96" width="18" height="14" fill={ac} opacity="0.3" />
      <rect x="159" y="96" width="18" height="14" fill={ac} opacity="0.18" />
      <rect x="103" y="120" width="18" height="14" fill={ac} opacity="0.22" />
      <rect x="130" y="120" width="18" height="14" fill={ac} opacity="0.14" />
      <rect x="159" y="120" width="18" height="14" fill={ac} opacity="0.22" />
      <rect x="103" y="144" width="18" height="14" fill={ac} opacity="0.16" />
      <rect x="130" y="144" width="18" height="14" fill={ac} opacity="0.2" />
      <rect x="159" y="144" width="18" height="14" fill={ac} opacity="0.16" />
      <rect x="38" y="108" width="22" height="16" fill={ac} opacity="0.16" />
      <rect x="68" y="108" width="22" height="16" fill={ac} opacity="0.22" />
      <rect x="38" y="134" width="22" height="16" fill={ac} opacity="0.2" />
      <rect x="68" y="134" width="22" height="16" fill={ac} opacity="0.14" />
      <rect x="38" y="160" width="22" height="16" fill={ac} opacity="0.16" />
      <rect x="68" y="160" width="22" height="16" fill={ac} opacity="0.2" />
      <rect x="193" y="118" width="22" height="16" fill={ac} opacity="0.22" />
      <rect x="223" y="118" width="22" height="16" fill={ac} opacity="0.16" />
      <rect x="193" y="144" width="22" height="16" fill={ac} opacity="0.14" />
      <rect x="223" y="144" width="22" height="16" fill={ac} opacity="0.2" />
      <rect x="193" y="168" width="22" height="16" fill={ac} opacity="0.2" />
      <rect x="223" y="168" width="22" height="16" fill={ac} opacity="0.14" />
      <line x1="140" y1="44" x2="140" y2="28" stroke={ac} strokeWidth="1.5" opacity="0.5" />
      <circle cx="140" cy="26" r="3" fill={ac} opacity="0.7" />
      <circle cx="30" cy="25" r="1.2" fill={ac} opacity="0.5" />
      <circle cx="70" cy="15" r="0.8" fill={ac} opacity="0.4" />
      <circle cx="200" cy="22" r="1" fill={ac} opacity="0.45" />
      <circle cx="255" cy="35" r="1.5" fill={ac} opacity="0.35" />
    </svg>
  );
}

function CoastalSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="160" fill={c2} opacity="0.35" />
      <rect y="160" width="280" height="90" fill={ac} opacity="0.08" />
      <path d="M0,168 Q35,158 70,168 Q105,178 140,168 Q175,158 210,168 Q245,178 280,168 L280,250 L0,250Z" fill={ac} opacity="0.07" />
      <rect x="45" y="145" width="190" height="8" fill={c2} />
      <rect x="60" y="153" width="6" height="45" fill={c2} opacity="0.7" />
      <rect x="90" y="153" width="6" height="45" fill={c2} opacity="0.7" />
      <rect x="134" y="153" width="6" height="45" fill={c2} opacity="0.7" />
      <rect x="178" y="153" width="6" height="45" fill={c2} opacity="0.7" />
      <rect x="214" y="153" width="6" height="45" fill={c2} opacity="0.7" />
      <rect x="45" y="90" width="190" height="58" fill={c2} />
      <polygon points="35,90 140,48 245,90" fill={c2} opacity="0.9" />
      <polygon points="35,90 140,48 245,90" fill="none" stroke={ac} strokeWidth="0.8" opacity="0.35" />
      <rect x="55" y="100" width="70" height="35" fill={ac} opacity="0.18" />
      <rect x="155" y="100" width="70" height="35" fill={ac} opacity="0.18" />
      <line x1="55" y1="100" x2="125" y2="100" stroke={ac} strokeWidth="0.8" opacity="0.45" />
      <line x1="155" y1="100" x2="225" y2="100" stroke={ac} strokeWidth="0.8" opacity="0.45" />
      <rect x="45" y="143" width="190" height="4" fill={ac} opacity="0.3" />
      <line x1="45" y1="135" x2="235" y2="135" stroke={ac} strokeWidth="1" opacity="0.25" />
      <rect x="122" y="112" width="36" height="33" fill={ac} opacity="0.2" />
      <line x1="20" y1="200" x2="25" y2="100" stroke={ac} strokeWidth="2" opacity="0.2" />
      <ellipse cx="22" cy="98" rx="14" ry="8" fill={ac} opacity="0.1" transform="rotate(-15,22,98)" />
      <circle cx="240" cy="40" r="20" fill={ac} opacity="0.1" />
      <circle cx="240" cy="185" r="12" fill={ac} opacity="0.06" />
    </svg>
  );
}

function EstateSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="175" fill={c2} opacity="0.25" />
      <rect x="75" y="100" width="130" height="100" fill={c2} />
      <polygon points="70,100 140,65 210,100" fill={c2} opacity="0.9" />
      <line x1="70" y1="100" x2="210" y2="100" stroke={ac} strokeWidth="1" opacity="0.4" />
      <rect x="15" y="120" width="60" height="80" fill={c2} opacity="0.8" />
      <rect x="205" y="120" width="60" height="80" fill={c2} opacity="0.8" />
      <rect x="83" y="100" width="5" height="100" fill={ac} opacity="0.22" />
      <rect x="103" y="100" width="5" height="100" fill={ac} opacity="0.22" />
      <rect x="172" y="100" width="5" height="100" fill={ac} opacity="0.22" />
      <rect x="192" y="100" width="5" height="100" fill={ac} opacity="0.22" />
      <rect x="93" y="112" width="25" height="30" fill={ac} opacity="0.16" />
      <rect x="162" y="112" width="25" height="30" fill={ac} opacity="0.16" />
      <rect x="125" y="108" width="30" height="35" fill={ac} opacity="0.18" />
      <path d="M125,108 Q140,95 155,108" fill={ac} opacity="0.14" />
      <rect x="120" y="150" width="40" height="50" rx="2" fill={ac} opacity="0.2" />
      <path d="M120,150 Q140,138 160,150" fill={ac} opacity="0.18" />
      <circle cx="154" cy="178" r="2" fill={ac} opacity="0.45" />
      <rect x="23" y="130" width="22" height="22" fill={ac} opacity="0.14" />
      <rect x="52" y="130" width="22" height="22" fill={ac} opacity="0.14" />
      <rect x="205" y="130" width="22" height="22" fill={ac} opacity="0.14" />
      <rect x="234" y="130" width="22" height="22" fill={ac} opacity="0.14" />
      <rect x="125" y="200" width="30" height="50" fill={ac} opacity="0.06" />
      <circle cx="65" cy="198" r="12" fill={ac} opacity="0.1" />
      <rect x="63" y="205" width="4" height="15" fill={ac} opacity="0.12" />
      <circle cx="215" cy="198" r="12" fill={ac} opacity="0.1" />
      <rect x="213" y="205" width="4" height="15" fill={ac} opacity="0.12" />
      <ellipse cx="112" cy="200" rx="7" ry="4" fill={ac} opacity="0.2" />
      <rect x="109" y="200" width="6" height="8" fill={ac} opacity="0.18" />
      <ellipse cx="168" cy="200" rx="7" ry="4" fill={ac} opacity="0.2" />
      <rect x="165" y="200" width="6" height="8" fill={ac} opacity="0.18" />
    </svg>
  );
}

function LoftSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="200" fill={c2} opacity="0.2" />
      <rect x="30" y="80" width="220" height="140" fill={c2} />
      <rect x="25" y="74" width="230" height="10" fill={c2} opacity="0.9" />
      <rect x="25" y="74" width="230" height="2" fill={ac} opacity="0.4" />
      <rect x="38" y="88" width="90" height="110" fill={ac} opacity="0.12" />
      <line x1="38" y1="88" x2="128" y2="88" stroke={ac} strokeWidth="0.8" opacity="0.4" />
      <line x1="38" y1="120" x2="128" y2="120" stroke={ac} strokeWidth="0.5" opacity="0.25" />
      <line x1="38" y1="152" x2="128" y2="152" stroke={ac} strokeWidth="0.5" opacity="0.25" />
      <line x1="68" y1="88" x2="68" y2="198" stroke={ac} strokeWidth="0.5" opacity="0.25" />
      <line x1="98" y1="88" x2="98" y2="198" stroke={ac} strokeWidth="0.5" opacity="0.25" />
      <rect x="138" y="88" width="100" height="110" fill={c2} opacity="0.5" />
      <rect x="148" y="100" width="35" height="25" fill={ac} opacity="0.2" />
      <rect x="193" y="100" width="35" height="25" fill={ac} opacity="0.2" />
      <rect x="148" y="136" width="35" height="25" fill={ac} opacity="0.14" />
      <rect x="193" y="136" width="35" height="25" fill={ac} opacity="0.2" />
      <rect x="148" y="166" width="35" height="25" fill={ac} opacity="0.18" />
      <rect x="40" y="170" width="30" height="28" fill={ac} opacity="0.14" />
      <line x1="40" y1="170" x2="70" y2="170" stroke={ac} strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="84" x2="30" y2="220" stroke={ac} strokeWidth="2.5" opacity="0.18" />
      <line x1="250" y1="84" x2="250" y2="220" stroke={ac} strokeWidth="2.5" opacity="0.18" />
      <rect x="60" y="60" width="30" height="15" fill={c2} opacity="0.6" />
      <rect x="180" y="54" width="20" height="22" fill={c2} opacity="0.6" />
      <line x1="195" y1="54" x2="195" y2="38" stroke={ac} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

function PenthouseSVG({ c1, c2, ac }) {
  return (
    <svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="280" height="250" fill={c1} />
      <rect width="280" height="220" fill={c2} opacity="0.15" />
      <rect x="55" y="170" width="170" height="60" fill={c2} opacity="0.7" />
      <rect x="40" y="110" width="200" height="64" fill={c2} />
      <rect x="65" y="68" width="150" height="46" fill={c2} opacity="0.9" />
      <rect x="85" y="44" width="110" height="28" fill={c2} opacity="0.8" />
      <rect x="80" y="40" width="120" height="6" fill={ac} opacity="0.45" />
      <rect x="48" y="118" width="185" height="48" fill={ac} opacity="0.14" />
      <line x1="48" y1="118" x2="233" y2="118" stroke={ac} strokeWidth="1" opacity="0.4" />
      <line x1="48" y1="142" x2="233" y2="142" stroke={ac} strokeWidth="0.5" opacity="0.2" />
      <line x1="90" y1="118" x2="90" y2="166" stroke={ac} strokeWidth="0.5" opacity="0.2" />
      <line x1="140" y1="118" x2="140" y2="166" stroke={ac} strokeWidth="0.5" opacity="0.2" />
      <line x1="190" y1="118" x2="190" y2="166" stroke={ac} strokeWidth="0.5" opacity="0.2" />
      <rect x="75" y="76" width="42" height="28" fill={ac} opacity="0.18" />
      <rect x="127" y="76" width="42" height="28" fill={ac} opacity="0.18" />
      <rect x="164" y="76" width="42" height="28" fill={ac} opacity="0.18" />
      <rect x="95" y="52" width="28" height="18" fill={ac} opacity="0.2" />
      <rect x="157" y="52" width="28" height="18" fill={ac} opacity="0.2" />
      <rect x="40" y="165" width="200" height="7" fill={ac} opacity="0.15" />
      <rect x="40" y="166" width="200" height="3" fill={ac} opacity="0.25" />
      <circle cx="18" cy="18" r="1.5" fill={ac} opacity="0.6" />
      <circle cx="45" cy="38" r="1" fill={ac} opacity="0.4" />
      <circle cx="220" cy="12" r="1.2" fill={ac} opacity="0.55" />
      <circle cx="258" cy="30" r="1.8" fill={ac} opacity="0.4" />
      <circle cx="152" cy="22" r="1" fill={ac} opacity="0.35" />
      <circle cx="12" cy="55" r="0.8" fill={ac} opacity="0.45" />
      <rect y="225" width="280" height="25" fill={ac} opacity="0.04" />
    </svg>
  );
}

const SVG_MAP = {
  villa: VillaSVG,
  bungalow: BungalowSVG,
  skyline: SkylineSVG,
  coastal: CoastalSVG,
  estate: EstateSVG,
  loft: LoftSVG,
  penthouse: PenthouseSVG,
};

// ── HouseCard ──
function HouseCard({ plan, cardStyle, onClick }) {
  return (
    <div className="dp-house-card" style={cardStyle} onClick={onClick}>
      <img src={plan.image} alt={plan.name} className="dp-card-img-full" />
      <div className="dp-card-overlay">
        <div className="dp-card-content">
          <div className="dp-card-tag">{plan.tag}</div>
          <div className="dp-card-name-row">
            <h3 className="dp-card-name">{plan.name}</h3>
            <div className="dp-card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carousel Logic ──
function useCarousel(total, interval = 3800) {
  const [current, setCurrent] = useState(0);
  const [animated, setAnimated] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    const next = ((idx % total) + total) % total;
    setAnimated(true);
    setCurrent(next);
  }, [total]);

  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, interval);
  }, [next, interval]);

  useEffect(() => {
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [next, interval]);

  const goToWithReset = useCallback((idx) => {
    goTo(idx);
    resetTimer();
  }, [goTo, resetTimer]);

  return { current, animated, goTo: goToWithReset, next, prev };
}

// ── Carousel card position calculator ──
function getCardPositions(current, total, stageW, stageH) {
  const W = 340; // --card-w
  const H = 440; // --card-h
  const cx = stageW / 2;
  const cy = stageH / 2;

  return Array.from({ length: total }, (_, i) => {
    const offset = i - current;
    const N = total;
    let tx, ty, tz, scale, opacity, zIndex, blur;

    if (offset === 0) {
      tx = cx - W / 2; ty = cy - H / 2; tz = 0;
      scale = 1; opacity = 1; zIndex = 10; blur = 0;
    } else if (offset === 1 || offset === -(N - 1)) {
      tx = cx - W / 2 + W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120;
      scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1;
    } else if (offset === -1 || offset === (N - 1)) {
      tx = cx - W / 2 - W * 0.62; ty = cy - H / 2 + H * 0.06; tz = -120;
      scale = 0.88; opacity = 0.7; zIndex = 8; blur = 1;
    } else if (offset === 2 || offset === -(N - 2)) {
      tx = cx - W / 2 + W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240;
      scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2;
    } else if (offset === -2 || offset === (N - 2)) {
      tx = cx - W / 2 - W * 1.05; ty = cy - H / 2 + H * 0.14; tz = -240;
      scale = 0.72; opacity = 0.35; zIndex = 5; blur = 2;
    } else {
      tx = cx - W / 2 + (offset > 0 ? W * 1.5 : -W * 1.5);
      ty = cy - H / 2 + H * 0.2; tz = -400;
      scale = 0.5; opacity = 0; zIndex = 1; blur = 4;
    }

    return { tx, ty, tz, scale, opacity, zIndex, blur };
  });
}

// ── Cinematic Background ──
const BG_SLIDES = [
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa2.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%20Luxury%20English%20Country%20Cottage1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Townhouse_Community_Streetscape1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",
  "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Top-Down_Aerial_View.jpg"
];

function CinematicBackground() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(-1);
  const [playCounts, setPlayCounts] = useState(Array(BG_SLIDES.length).fill(0));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % BG_SLIDES.length;
        setLeaving(prev);
        setPlayCounts((counts) => {
          const newCounts = [...counts];
          newCounts[next]++;
          return newCounts;
        });
        return next;
      });
    }, 8000); // --dur
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (leaving !== -1) {
      const t = setTimeout(() => {
        setLeaving(-1);
      }, 1900); // --trans (1.8s) + 100ms
      return () => clearTimeout(t);
    }
  }, [leaving]);

  return (
    <div className="cinematic-bg-wrapper">
      <div className="vignette"></div>
      <div className="grain"></div>
      <div className="stage" id="bg-stage">
        {BG_SLIDES.map((src, i) => {
          let className = "slide";
          if (i === current) className += " active";
          else if (i === leaving) className += " leaving";

          return (
            <div key={i} className={className}>
              <div 
                key={`${i}-${playCounts[i]}`} 
                className="slide__img" 
                style={{ backgroundImage: `url('${src}')` }}
              />
              <div className="slide__grade" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main DreamPlan Component ──
export default function DreamPlan() {
  const N = PLANS.length;
  const { current, animated, goTo, next, prev } = useCarousel(N, 3800);
  const stageRef = useRef(null);
  const [stageDims, setStageDims] = useState({ w: 500, h: 580 });
  const touchStartX = useRef(0);

  // Measure stage
  useEffect(() => {
    function measure() {
      if (stageRef.current) {
        setStageDims({
          w: stageRef.current.offsetWidth,
          h: stageRef.current.offsetHeight,
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch support
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
  }

  const positions = getCardPositions(current, N, stageDims.w, stageDims.h);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="dreamplan-root">
        {/* ─── HERO ─── */}
        <section className="dp-hero">
          <CinematicBackground />

          <div className="dp-hero-body">

            {/* LEFT: TEXT */}
            <div className="dp-hero-text">
              <div className="dp-hero-eyebrow">
                <span className="dp-eyebrow-line" />
                <span className="dp-eyebrow-text">Award-winning Architecture</span>
              </div>

              <h1 className="dp-hero-headline">
                Design Your<br />
                Dream Home<br />
                <em>Before You Build It</em>
              </h1>

              <p className="dp-hero-sub">
                Explore 100+ professionally designed house plans tailored for modern living.
                From luxury villas to contemporary bungalows — every plan crafted to perfection.
              </p>

              <div className="dp-hero-actions">
                <a href="#" className="dp-btn-primary">
                  View House Plans
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#" className="dp-btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
                    <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor" />
                  </svg>
                  Watch the Story
                </a>
              </div>

              <div className="dp-hero-stats">
                <div className="dp-stat-item">
                  <div className="dp-stat-number">100+</div>
                  <div className="dp-stat-label">House Plans</div>
                </div>
                <div className="dp-stat-item">
                  <div className="dp-stat-number">2,400+</div>
                  <div className="dp-stat-label">Homes Built</div>
                </div>
                <div className="dp-stat-item">
                  <div className="dp-stat-number">18yr</div>
                  <div className="dp-stat-label">Experience</div>
                </div>
              </div>
            </div>

            {/* RIGHT: CAROUSEL */}
            <div className="dp-hero-visual">
              <div
                className="dp-stage"
                ref={stageRef}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div className="dp-stage-inner">
                  {PLANS.map((plan, i) => {
                    const pos = positions[i];
                    const transition = animated
                      ? "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.7s ease, filter 0.7s ease"
                      : "none";
                    const cardStyle = {
                      transform: `translate(${pos.tx}px, ${pos.ty}px) translateZ(${pos.tz}px) scale(${pos.scale})`,
                      opacity: pos.opacity,
                      zIndex: pos.zIndex,
                      filter: `blur(${pos.blur}px)`,
                      transition,
                      cursor: i === current ? "default" : "pointer",
                    };
                    return (
                      <HouseCard
                        key={plan.name}
                        plan={plan}
                        cardStyle={cardStyle}
                        onClick={() => goTo(i)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Dots */}
              <div className="dp-carousel-nav">
                {PLANS.map((_, i) => (
                  <button
                    key={i}
                    className={`dp-dot${i === current ? " dp-dot--active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating badge */}
              <div className="dp-float-badge">
                <div className="dp-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.5 3.1L12 4.6l-2.5 2.4.6 3.4L7 8.9l-3.1 1.5.6-3.4L2 4.6l3.5-.5L7 1z" fill="#C9A96E" />
                  </svg>
                </div>
                <div className="dp-badge-title">Featured Collection</div>
                <div className="dp-badge-sub">Modern Luxury · 2025</div>
              </div>
            </div>

          </div>{/* /hero-body */}

          {/* Scroll hint */}
          <div className="dp-scroll-hint">
            <div className="dp-scroll-line" />
            <span className="dp-scroll-text">Scroll to explore</span>
          </div>

        </section>
      </div>
    </>
  );
}
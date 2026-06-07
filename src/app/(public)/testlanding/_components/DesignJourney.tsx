"use client";

import React from 'react';
import './DesignJourney.css';

export default function DesignJourney() {
  return (
    <div className="dj-wrapper">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      
      {/* ─── HERO ─── */}
      <section className="hero">
        {/* Architectural blueprint background */}
        <div className="hero-bg">
          <svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <rect width="1440" height="900" fill="#0A0A08"/>
            {/* Blueprint grid */}
            <defs>
              <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#C9A96E" strokeWidth="0.2" opacity="0.3"/>
              </pattern>
              <pattern id="bigGrid" width="150" height="150" patternUnits="userSpaceOnUse">
                <rect width="150" height="150" fill="url(#smallGrid)"/>
                <path d="M 150 0 L 0 0 0 150" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="1440" height="900" fill="url(#bigGrid)"/>

            {/* House floor plan outline — upper right */}
            <g transform="translate(780, 80)" opacity="0.55">
              {/* Outer walls */}
              <rect x="0" y="0" width="580" height="420" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.6"/>
              {/* Interior walls */}
              <line x1="220" y1="0" x2="220" y2="270" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              <line x1="0" y1="270" x2="380" y2="270" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              <line x1="380" y1="0" x2="380" y2="420" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              <line x1="220" y1="160" x2="380" y2="160" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              <line x1="0" y1="160" x2="140" y2="160" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              {/* Doors arcs */}
              <path d="M 220 100 A 40 40 0 0 0 260 100" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6"/>
              <path d="M 220 220 A 40 40 0 0 0 260 220" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6"/>
              <path d="M 380 200 A 40 40 0 0 1 380 240" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6"/>
              {/* Window markers */}
              <line x1="60" y1="0" x2="120" y2="0" stroke="#E8D5A3" strokeWidth="2.5" opacity="0.8"/>
              <line x1="460" y1="0" x2="530" y2="0" stroke="#E8D5A3" strokeWidth="2.5" opacity="0.8"/>
              <line x1="0" y1="50" x2="0" y2="110" stroke="#E8D5A3" strokeWidth="2.5" opacity="0.8"/>
              <line x1="580" y1="80" x2="580" y2="160" stroke="#E8D5A3" strokeWidth="2.5" opacity="0.8"/>
              {/* Dimension lines */}
              <line x1="-20" y1="0" x2="-20" y2="420" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
              <line x1="-25" y1="0" x2="-15" y2="0" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5"/>
              <line x1="-25" y1="420" x2="-15" y2="420" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5"/>
              <text x="-35" y="215" fill="#C9A96E" fontSize="9" fontFamily="DM Sans" letterSpacing="1" transform="rotate(-90,-35,215)" opacity="0.6">18.5 m</text>
              <line x1="0" y1="440" x2="580" y2="440" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4"/>
              <line x1="0" y1="435" x2="0" y2="445" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5"/>
              <line x1="580" y1="435" x2="580" y2="445" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5"/>
              <text x="270" y="458" fill="#C9A96E" fontSize="9" fontFamily="DM Sans" letterSpacing="1" opacity="0.6">26.0 m</text>
              {/* Room labels */}
              <text x="100" y="130" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" letterSpacing="2" opacity="0.5" textAnchor="middle">MASTER BED</text>
              <text x="290" y="80" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" letterSpacing="2" opacity="0.5" textAnchor="middle">LIVING ROOM</text>
              <text x="110" y="340" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" letterSpacing="2" opacity="0.5" textAnchor="middle">KITCHEN</text>
              <text x="480" y="200" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" letterSpacing="2" opacity="0.5" textAnchor="middle">GARAGE</text>
              {/* Compass rose */}
              <g transform="translate(540, 370)">
                <circle cx="0" cy="0" r="18" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.5"/>
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#C9A96E" strokeWidth="0.7" opacity="0.6"/>
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#C9A96E" strokeWidth="0.7" opacity="0.6"/>
                <polygon points="0,-14 -3,-7 3,-7" fill="#E8D5A3" opacity="0.9"/>
                <text x="0" y="-19" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" textAnchor="middle" opacity="0.7">N</text>
              </g>
            </g>

            {/* Elevation sketch — left side */}
            <g transform="translate(40, 340)" opacity="0.3">
              <line x1="0" y1="280" x2="560" y2="280" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6"/>
              <polygon points="0,280 280,60 560,280" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.5"/>
              <rect x="60" y="160" width="120" height="120" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.5"/>
              <rect x="240" y="160" width="100" height="120" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.5"/>
              <rect x="380" y="160" width="120" height="120" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.5"/>
              <line x1="100" y1="220" x2="140" y2="220" stroke="#C9A96E" strokeWidth="0.5"/>
              <line x1="120" y1="200" x2="120" y2="240" stroke="#C9A96E" strokeWidth="0.5"/>
              <line x1="250" y1="220" x2="330" y2="220" stroke="#C9A96E" strokeWidth="0.5"/>
              <line x1="250" y1="200" x2="250" y2="280" stroke="#C9A96E" strokeWidth="0.8"/>
              <line x1="440" y1="220" x2="460" y2="220" stroke="#C9A96E" strokeWidth="0.5"/>
              <line x1="450" y1="210" x2="450" y2="280" stroke="#C9A96E" strokeWidth="0.8"/>
            </g>
          </svg>
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>Premium House Plans</span>
          </div>
          <h1>
            Where Vision<br/>
            Becomes <em>Architecture</em>
          </h1>
          <p className="hero-sub">
            From hand-drafted concepts to construction-ready documents — we craft house plans that transform your idea of home into something you can actually build.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">
              Explore Plans
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#journey" className="btn-ghost">
              Our Process
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">1,400<sup style={{fontSize: '1rem', color: 'var(--brass-dark)'}}>+</sup></span>
            <span className="stat-label">Plan Designs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98<sup style={{fontSize: '1rem', color: 'var(--brass-dark)'}}>%</sup></span>
            <span className="stat-label">Client Satisfaction</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">17</span>
            <span className="stat-label">Years of Craft</span>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ─── DESIGN JOURNEY SECTION ─── */}
      <section className="journey" id="journey">
        <div className="section-header">
          <div>
            <div className="section-eyebrow"><span>Design Journey</span></div>
            <h2>We sell the <em>process</em>,<br/>not just the image.</h2>
          </div>
          <p className="section-desc">
            Every plan begins as a dream. Our three-stage process turns that dream into documents your builder can actually use — with full transparency at every step.
          </p>
        </div>

        <div className="journey-stages">

          {/* Stage 1 */}
          <div className="stage">
            <div className="stage-number-wrap">
              <div className="stage-number">01</div>
              <div className="stage-connector"></div>
            </div>

            <div className="stage-visual">
              <div className="stage-tag">Concept & Planning</div>
              {/* Concept sketch illustration */}
              <svg viewBox="0 0 380 285" xmlns="http://www.w3.org/2000/svg">
                <rect width="380" height="285" fill="#1A1A16"/>
                {/* Sketch paper effect */}
                <rect x="30" y="25" width="320" height="235" fill="#1E1D18" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
                {/* Rough sketch lines (irregular) */}
                <g stroke="#C9A96E" fill="none" opacity="0.7" strokeLinecap="round">
                  {/* House outline rough sketch */}
                  <path d="M 70 190 L 68 195 L 310 196 L 312 190" strokeWidth="1.2" strokeDasharray="4,2"/>
                  <path d="M 190 70 L 68 192 M 190 68 L 314 194" strokeWidth="1.2" strokeDasharray="3,2"/>
                  <path d="M 160 70 L 220 70 M 190 70 L 190 50 L 185 55" strokeWidth="0.8" strokeDasharray="2,2"/>
                  {/* Windows */}
                  <rect x="95" y="145" width="40" height="30" strokeWidth="1" strokeDasharray="2,2" opacity="0.8"/>
                  <line x1="115" y1="145" x2="115" y2="175" strokeWidth="0.7"/>
                  <line x1="95" y1="160" x2="135" y2="160" strokeWidth="0.7"/>
                  <rect x="175" y="155" width="35" height="40" strokeWidth="1" strokeDasharray="2,2" opacity="0.8"/>
                  <rect x="240" y="145" width="40" height="30" strokeWidth="1" strokeDasharray="2,2" opacity="0.8"/>
                  <line x1="260" y1="145" x2="260" y2="175" strokeWidth="0.7"/>
                </g>
                {/* Annotation marks */}
                <g fill="none" stroke="#E8D5A3" strokeWidth="0.7" opacity="0.6">
                  <line x1="50" y1="190" x2="66" y2="190" strokeDasharray="2,2"/>
                  <line x1="50" y1="70" x2="66" y2="130"/>
                  <line x1="45" y1="70" x2="55" y2="70"/>
                  <line x1="45" y1="190" x2="55" y2="190"/>
                  <line x1="50" y1="70" x2="50" y2="190"/>
                </g>
                <text x="35" y="135" fill="#E8D5A3" fontSize="7" fontFamily="DM Sans" opacity="0.6" transform="rotate(-90,35,135)">6.5m</text>
                {/* Note bubbles */}
                <rect x="245" y="105" width="80" height="20" rx="2" fill="#2A2920" stroke="#C9A96E" strokeWidth="0.5" opacity="0.7"/>
                <text x="285" y="119" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1" textAnchor="middle" opacity="0.8">Open plan</text>
                {/* Pencil icon sketch feel */}
                <circle cx="340" cy="40" r="3" fill="#C9A96E" opacity="0.5"/>
              </svg>
            </div>

            <h3>Concept &amp; Planning</h3>
            <p>We start by listening. Your lot, your lifestyle, your budget — everything feeds into a design brief before a single line is drawn.</p>
            <ul className="stage-features">
              <li>Site analysis &amp; orientation study</li>
              <li>Space planning &amp; room adjacency</li>
              <li>Preliminary sketches &amp; layouts</li>
              <li>Budget feasibility review</li>
            </ul>
          </div>

          {/* Stage 2 */}
          <div className="stage">
            <div className="stage-number-wrap">
              <div className="stage-number">02</div>
              <div className="stage-connector"></div>
            </div>

            <div className="stage-visual">
              <div className="stage-tag">3D Visualization</div>
              {/* 3D perspective illustration */}
              <svg viewBox="0 0 380 285" xmlns="http://www.w3.org/2000/svg">
                <rect width="380" height="285" fill="#141410"/>
                {/* Ground plane gradient suggestion */}
                <polygon points="30,240 190,200 350,240 190,280" fill="#1C1C18" opacity="0.8"/>

                {/* House 3D isometric body */}
                <g>
                  {/* Main house face */}
                  <polygon points="80,220 80,110 230,110 230,220" fill="#1E1D18" stroke="#C9A96E" strokeWidth="1"/>
                  {/* Side face (shadow) */}
                  <polygon points="230,110 310,80 310,190 230,220" fill="#161613" stroke="#C9A96E" strokeWidth="1"/>
                  {/* Roof face left */}
                  <polygon points="50,110 155,55 230,110 80,110" fill="#252420" stroke="#C9A96E" strokeWidth="1"/>
                  {/* Roof face right */}
                  <polygon points="230,110 155,55 310,80" fill="#1A1915" stroke="#C9A96E" strokeWidth="1"/>
                  {/* Roof ridge */}
                  <line x1="155" y1="55" x2="310" y2="80" stroke="#E8D5A3" strokeWidth="1.2" opacity="0.7"/>
                  <line x1="155" y1="55" x2="50" y2="110" stroke="#E8D5A3" strokeWidth="1.2" opacity="0.6"/>

                  {/* Windows front face */}
                  <rect x="95" y="135" width="40" height="35" fill="#0D1520" stroke="#C9A96E" strokeWidth="0.8"/>
                  <line x1="115" y1="135" x2="115" y2="170" stroke="#C9A96E" strokeWidth="0.5"/>
                  <line x1="95" y1="152" x2="135" y2="152" stroke="#C9A96E" strokeWidth="0.5"/>
                  {/* window glow */}
                  <rect x="96" y="136" width="38" height="33" fill="#C9A96E" opacity="0.06"/>

                  <rect x="165" y="135" width="40" height="35" fill="#0D1520" stroke="#C9A96E" strokeWidth="0.8"/>
                  <line x1="185" y1="135" x2="185" y2="170" stroke="#C9A96E" strokeWidth="0.5"/>
                  <line x1="165" y1="152" x2="205" y2="152" stroke="#C9A96E" strokeWidth="0.5"/>
                  <rect x="166" y="136" width="38" height="33" fill="#C9A96E" opacity="0.06"/>

                  {/* Door front */}
                  <rect x="125" y="178" width="30" height="42" fill="#0D0D0A" stroke="#C9A96E" strokeWidth="0.8"/>
                  <circle cx="152" cy="200" r="2" fill="#C9A96E" opacity="0.7"/>

                  {/* Side windows */}
                  <polygon points="245,130 265,115 265,145 245,160" fill="#0D1520" stroke="#C9A96E" strokeWidth="0.7"/>
                  <polygon points="275,115 295,100 295,130 275,145" fill="#0D1520" stroke="#C9A96E" strokeWidth="0.7"/>

                  {/* Ground shadow line */}
                  <line x1="80" y1="220" x2="310" y2="190" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
                  <line x1="80" y1="220" x2="30" y2="240" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>
                  <line x1="310" y1="190" x2="350" y2="240" stroke="#C9A96E" strokeWidth="0.5" opacity="0.4"/>

                  {/* Light rays hint */}
                  <line x1="155" y1="55" x2="115" y2="30" stroke="#E8D5A3" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.3"/>
                </g>

                {/* Overlay measurement indicator */}
                <g opacity="0.5">
                  <line x1="340" y1="80" x2="340" y2="190" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="2,2"/>
                  <line x1="335" y1="80" x2="345" y2="80" stroke="#C9A96E" strokeWidth="0.5"/>
                  <line x1="335" y1="190" x2="345" y2="190" stroke="#C9A96E" strokeWidth="0.5"/>
                  <text x="355" y="140" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" opacity="0.7" transform="rotate(90,355,140)">4.2m</text>
                </g>

                {/* 3D label */}
                <text x="355" y="260" fill="#C9A96E" fontSize="8" fontFamily="DM Sans" letterSpacing="2" textAnchor="end" opacity="0.4">3D VIEW</text>
              </svg>
            </div>

            <h3>3D Visualization</h3>
            <p>Before a single brick is laid, you walk through your future home. Photorealistic renders let you feel the space and refine every detail with confidence.</p>
            <ul className="stage-features">
              <li>Exterior 3D renders &amp; perspectives</li>
              <li>Interior space visualization</li>
              <li>Material &amp; finish previews</li>
              <li>Revision rounds included</li>
            </ul>
          </div>

          {/* Stage 3 */}
          <div className="stage">
            <div className="stage-number-wrap">
              <div className="stage-number">03</div>
            </div>

            <div className="stage-visual">
              <div className="stage-tag">Construction Ready</div>
              {/* Technical drawings illustration */}
              <svg viewBox="0 0 380 285" xmlns="http://www.w3.org/2000/svg">
                <rect width="380" height="285" fill="#0E0E0C"/>
                {/* Title block bottom */}
                <rect x="0" y="245" width="380" height="40" fill="#141410" stroke="#C9A96E" strokeWidth="0.5" opacity="0.6"/>
                <line x1="120" y1="245" x2="120" y2="285" stroke="#C9A96E" strokeWidth="0.5" opacity="0.6"/>
                <line x1="240" y1="245" x2="240" y2="285" stroke="#C9A96E" strokeWidth="0.5" opacity="0.6"/>
                <text x="60" y="268" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1" textAnchor="middle" opacity="0.7">GROUND FLOOR</text>
                <text x="180" y="268" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1" textAnchor="middle" opacity="0.7">SCALE 1:100</text>
                <text x="310" y="262" fill="#E8D5A3" fontSize="7" fontFamily="DM Sans" letterSpacing="1" textAnchor="middle" opacity="0.7">ARCHFORM LTD</text>
                <text x="310" y="274" fill="#C9A96E" fontSize="6" fontFamily="DM Sans" letterSpacing="1" textAnchor="middle" opacity="0.5">DWG-001 REV C</text>

                {/* Precise floor plan */}
                <g transform="translate(20,15)" stroke="#C9A96E" fill="none">
                  {/* Outer walls thick */}
                  <rect x="10" y="10" width="340" height="220" strokeWidth="3" opacity="0.9"/>
                  {/* Inner wall lines */}
                  <line x1="130" y1="10" x2="130" y2="150" strokeWidth="2" opacity="0.8"/>
                  <line x1="10" y1="150" x2="220" y2="150" strokeWidth="2" opacity="0.8"/>
                  <line x1="220" y1="10" x2="220" y2="230" strokeWidth="2" opacity="0.8"/>
                  <line x1="220" y1="100" x2="350" y2="100" strokeWidth="2" opacity="0.8"/>

                  {/* Door swings */}
                  <path d="M 130 95 Q 170 95 170 55" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.6"/>
                  <line x1="130" y1="95" x2="130" y2="55" strokeWidth="0.8" opacity="0.5"/>
                  <line x1="130" y1="55" x2="170" y2="55" strokeWidth="0.8" opacity="0.7"/>

                  <path d="M 175 150 Q 175 110 215 110" strokeWidth="0.8" strokeDasharray="2,1.5" opacity="0.6"/>
                  <line x1="175" y1="150" x2="215" y2="150" strokeWidth="0.8" opacity="0.5"/>
                  <line x1="215" y1="110" x2="215" y2="150" strokeWidth="0.8" opacity="0.7"/>

                  {/* Window openings */}
                  <line x1="40" y1="10" x2="80" y2="10" strokeWidth="3" stroke="#141410"/>
                  <line x1="40" y1="10" x2="80" y2="10" strokeWidth="1.5" stroke="#E8D5A3" opacity="0.9"/>
                  <line x1="40" y1="9" x2="80" y2="9" strokeWidth="0.5" stroke="#C9A96E" opacity="0.7"/>
                  <line x1="40" y1="11" x2="80" y2="11" strokeWidth="0.5" stroke="#C9A96E" opacity="0.7"/>

                  <line x1="160" y1="10" x2="210" y2="10" strokeWidth="3" stroke="#141410"/>
                  <line x1="160" y1="10" x2="210" y2="10" strokeWidth="1.5" stroke="#E8D5A3" opacity="0.9"/>
                  <line x1="160" y1="9" x2="210" y2="9" strokeWidth="0.5" stroke="#C9A96E" opacity="0.7"/>
                  <line x1="160" y1="11" x2="210" y2="11" strokeWidth="0.5" stroke="#C9A96E" opacity="0.7"/>

                  <line x1="260" y1="10" x2="330" y2="10" strokeWidth="3" stroke="#141410"/>
                  <line x1="260" y1="10" x2="330" y2="10" strokeWidth="1.5" stroke="#E8D5A3" opacity="0.9"/>

                  <line x1="350" y1="30" x2="350" y2="80" strokeWidth="3" stroke="#141410"/>
                  <line x1="350" y1="30" x2="350" y2="80" strokeWidth="1.5" stroke="#E8D5A3" opacity="0.9"/>

                  {/* Room labels precise */}
                  <text x="65" y="90" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">MASTER</text>
                  <text x="65" y="100" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">BED</text>
                  <text x="170" y="65" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">LIVING</text>
                  <text x="65" y="195" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">KITCHEN</text>
                  <text x="285" y="60" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">GARAGE</text>
                  <text x="285" y="175" fill="#C9A96E" fontSize="7" fontFamily="DM Sans" letterSpacing="1.5" textAnchor="middle" opacity="0.6">BED 2</text>

                  {/* Dimension lines crisp */}
                  <line x1="10" y1="-8" x2="350" y2="-8" strokeWidth="0.5" stroke="#E8D5A3" opacity="0.6"/>
                  <line x1="10" y1="-12" x2="10" y2="-4" strokeWidth="0.5" stroke="#E8D5A3" opacity="0.6"/>
                  <line x1="350" y1="-12" x2="350" y2="-4" strokeWidth="0.5" stroke="#E8D5A3" opacity="0.6"/>
                  <text x="180" y="-2" fill="#E8D5A3" fontSize="7" fontFamily="DM Sans" textAnchor="middle" opacity="0.7">17 000</text>
                </g>
              </svg>
            </div>

            <h3>Construction Ready Plans</h3>
            <p>Stamped, dimensioned, and fully compliant. Your contractor gets everything needed to break ground — no guesswork, no delays, no costly surprises.</p>
            <ul className="stage-features">
              <li>Full architectural drawing set</li>
              <li>Structural &amp; electrical layouts</li>
              <li>Bill of quantities (BQ)</li>
              <li>Council submission ready</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="cta-banner">
        <div className="cta-text">
          <div className="section-eyebrow"><span>Start Today</span></div>
          <h2>Ready to design your<br/><em>dream home?</em></h2>
          <p>Tell us about your plot, budget, and vision. We'll respond within 24 hours with an initial assessment — no obligation, no rush.</p>
        </div>
        <div className="cta-actions">
          <a href="#" className="btn-primary">
            Start Your Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

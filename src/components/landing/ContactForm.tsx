"use client";

import React, { useEffect, useRef, useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [plotSize, setPlotSize] = useState('');
  const [message, setMessage] = useState('');
  
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for reveals
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          if (observerRef.current) {
            observerRef.current.unobserve(e.target);
          }
        }
      });
    }, { threshold: 0.12 });

    const revealElements = document.querySelectorAll('.cf-wrapper .reveal');
    revealElements.forEach(el => observerRef.current?.observe(el));

    // Cleanup
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          subject: `Consultation Request: ${location || 'General'}`,
          message: `Plot Location: ${location || 'Not provided'}\nPlot Size: ${plotSize || 'Not provided'}\n\nMessage:\n${message}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsFadingOut(true);
      setTimeout(() => {
        setIsSubmitted(true);
        setIsLoading(false);
      }, 400); // Matches the fade out animation duration in CSS
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className="cf-wrapper">
      <section className="form-section" id="consult">
        <div className="form-inner">
          <div className="form-intro reveal">
            <div className="section-label">Start Your Journey</div>
            <h2 className="section-title">Tell Us What You<br />Want to Build</h2>
            <p className="form-intro-text">
              Whether you're starting with a rough idea or already have a plot, we'll help you determine the best design approach for your project.
            </p>
            <div className="trust-badges">
              <div className="trust-badge"><span className="trust-dot"></span> Free, no-obligation consultation call</div>
              <div className="trust-badge"><span className="trust-dot"></span> Response within 24 hours</div>
              <div className="trust-badge"><span className="trust-dot"></span> Plans delivered across East Africa</div>
              <div className="trust-badge"><span className="trust-dot"></span> 22 years of residential expertise</div>
              <div className="trust-badge"><span className="trust-dot"></span> NCA-registered practice</div>
            </div>
          </div>

          <div className="consult-form reveal reveal-delay-2">
            {!isSubmitted ? (
              <form 
                className={`form-card ${isFadingOut ? 'fade-out' : ''}`} 
                onSubmit={handleSubmit}
              >
                <div className="form-title">Book a Free Architectural Consultation</div>
                <div className="form-subtitle">Speak directly with our team about your plot, design requirements, budget, and next steps.</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-input" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-input" placeholder="Kamau" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp</label>
                  <input type="tel" className="form-input" placeholder="+254 7xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Plot Location</label>
                    <input type="text" className="form-input" placeholder="e.g. Nakuru, Rongai" value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Plot Size</label>
                    <select className="form-select form-input" value={plotSize} onChange={e => setPlotSize(e.target.value)}>
                      <option value="">Select…</option>
                      <option>50×100 ft</option>
                      <option>40×80 ft</option>
                      <option>40×60 ft</option>
                      <option>60×100 ft</option>
                      <option>100×100 ft</option>
                      <option>½ Acre +</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message / Customisation Requests</label>
                  <textarea className="form-textarea form-input" placeholder="Tell us about your project, timeline, or any specific requirements…" value={message} onChange={e => setMessage(e.target.value)} required></textarea>
                </div>
                {error && <div className="form-error" style={{ color: '#ff4d4f', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}
                <button type="submit" className="form-submit" disabled={isLoading}><span>{isLoading ? 'Sending...' : 'Send Consultation Request →'}</span></button>
              </form>
            ) : (
              <div className="form-success show">
                <div className="success-icon">✦</div>
                <div className="success-title">Thank You!</div>
                <p className="success-text">Your consultation request has been received. Our architect will contact you within 24 hours to schedule a call.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

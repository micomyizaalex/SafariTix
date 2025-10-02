import React from "react";
import bus from "../images/bus.jpg";

function HomePage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="section hero">
        <div className="hero-inner">
          <div>
            <h1 className="hero-title">Fast, reliable bus ticketing for commuters and operators</h1>
            <p className="hero-sub">Book, cancel, and track buses in real-time. Manage schedules, seats, and revenue with ease.</p>
            <div className="hero-ctas">
              <button className="btn-primary">Book Your Ticket</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-card">
            <img src={bus} alt="SafariTix hero" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <h2 className="center heading">Everything you need to move smarter</h2>
        <div className="section features-grid cards grid">
          <div className="feature-card">
            <h3>Ticket booking & cancellation</h3>
            <p>Simple online booking with flexible cancellation for peace of mind.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time bus tracking</h3>
            <p>Know bus locations and ETAs instantly to reduce waiting time.</p>
          </div>
          <div className="feature-card">
            <h3>Subscription for transport companies</h3>
            <p>Onboard quickly and manage fleets with our company plans.</p>
          </div>
          <div className="feature-card">
            <h3>Revenue & analytics dashboard</h3>
            <p>Monitor performance, routes, and revenue with actionable insights.</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section steps">
        <h2 className="center heading">How it works</h2>
        <div className="grid steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>Sign up & add your buses</h3>
            <p className="muted">Transport companies create an account and add fleet details.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>Create schedules & seat availability</h3>
            <p className="muted">Publish routes, times, and seats in minutes.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>Commuters book tickets online</h3>
            <p className="muted">Frictionless booking with instant confirmation.</p>
          </div>
          <div className="step-card">
            <div className="step-num">4</div>
            <h3>Track buses & manage tickets</h3>
            <p className="muted">Live tracking and easy ticket management for everyone.</p>
          </div>
        </div>
      </section>

      {/* Company CTA */}
      <section className="section company-cta">
        <div className="cta-inner">
          <div>
            <h2 className="heading">Grow your transport business with SafariTix</h2>
            <p>Subscribe to unlock fleet tools, staff roles, analytics, and priority support.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn-primary">Get Started</button>
            </div>
          </div>
          <div className="cta-card">
            <ul style={{ lineHeight: 1.8 }}>
              <li>Unlimited routes and schedules</li>
              <li>Real-time tracking & alerts</li>
              <li>Revenue analytics & settlements</li>
              <li>Dedicated onboarding support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <h2 className="center heading">Trusted by commuters and operators</h2>
        <div className="grid testimonial-grid">
          <div className="testimonial-card">
            <p className="quote">“Booking a bus is now a 30-second task. I never queue anymore.”</p>
            <p className="author">— Alice, Kigali commuter</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">“SafariTix helped us optimize routes and increase revenue by 18%.”</p>
            <p className="author">— TransitCo, Operations Manager</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">“The dashboard gives our team clear visibility across the fleet.”</p>
            <p className="author">— CityRides, CTO</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;





import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import BookingConfirmation from '../components/BookingConfirmation';
import '../styles/main.css';

const DESTINATIONS = [
  { name: 'Santorini', location: 'Greece', price: 219, img: '/images/destinationImage/destinationFive.png', alt: 'Santorini, Greece' },
  { name: 'Bali', location: 'Indonesia', price: 199, img: '/images/destinationImage/destinationTwo.png', alt: 'Bali, Indonesia' },
  { name: 'Paris', location: 'France', price: 399, img: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop', alt: 'Paris, France' },
  { name: 'Maldives', location: 'Indian Ocean', price: 599, img: '/images/destinationImage/destinationFour.png', alt: 'Maldives' },
  { name: 'Tokyo', location: 'Japan', price: 499, img: '/images/destinationImage/destinationOne.png', alt: 'Tokyo, Japan' },
  { name: 'Dubai', location: 'UAE', price: 399, img: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop', alt: 'Dubai, UAE' },
];

const PACKAGES = [
  {
    name: 'Adventure Explorer',
    location: 'Multiple Locations',
    price: 1299,
    duration: '7 Days',
    badge: 'Popular',
    img: '/images/TravelPackages/packageOne.png',
    alt: 'Adventure Package',
    description: 'Perfect for thrill-seekers and adventure enthusiasts. Includes hiking, water sports, and extreme activities.',
    features: [
      { icon: 'fa-mountain', label: 'Mountain Hiking' },
      { icon: 'fa-swimmer', label: 'Water Sports' },
      { icon: 'fa-camera', label: 'Photography Tours' },
    ],
  },
  {
    name: 'Luxury Escape',
    location: 'Premium Destinations',
    price: 2999,
    duration: '10 Days',
    badge: 'Luxury',
    img: '/images/TravelPackages/packagesTwo.png',
    alt: 'Luxury Package',
    description: 'Indulge in the finest accommodations, gourmet dining, and exclusive experiences in premium destinations.',
    features: [
      { icon: 'fa-hotel', label: '5-Star Hotels' },
      { icon: 'fa-utensils', label: 'Fine Dining' },
      { icon: 'fa-spa', label: 'Spa Treatments' },
    ],
  },
  {
    name: 'Family Fun',
    location: 'Family Destinations',
    price: 899,
    duration: '5 Days',
    badge: 'Family',
    img: '/images/TravelPackages/packageThree.png',
    alt: 'Family Package',
    description: 'Create lasting memories with family-friendly activities, comfortable accommodations, and kid-approved adventures.',
    features: [
      { icon: 'fa-child', label: 'Kid Activities' },
      { icon: 'fa-home', label: 'Family Rooms' },
      { icon: 'fa-gamepad', label: 'Entertainment' },
    ],
  },
];

const TESTIMONIALS = [
  {
    text: '"Son_Caleb made our honeymoon absolutely perfect! The attention to detail and personalized service exceeded our expectations."',
    name: 'Sarah Johnson',
    role: 'Honeymooner',
    img: '/images/UserImage/userOne.png',
  },
  {
    text: '"The family package was incredible! Our kids had a blast, and we parents got to relax too."',
    name: 'Mike Chen',
    role: 'Family Traveler',
    img: '/images/UserImage/userTwo.png',
  },
  {
    text: '"As a solo traveler, I was nervous about my first international trip. Son_Caleb\'s support team was amazing!"',
    name: 'Emma Davis',
    role: 'Solo Adventurer',
    img: '/images/UserImage/userThree.png',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking modal state
  const [modal, setModal] = useState({ isOpen: false, destination: '', location: '', basePrice: 0 });
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Testimonials
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Search form
  const today = new Date().toISOString().split('T')[0];
  const [search, setSearch] = useState({ destination: '', checkin: '', checkout: '', guests: '1' });

  // Back-to-top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Refs for IntersectionObserver targets
  const animateRefs = useRef([]);

  // --- Testimonials auto-rotate ---
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- IntersectionObserver for fade-in ---
  useEffect(() => {
    const els = animateRefs.current.filter(Boolean);
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- Back-to-top scroll listener ---
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Booking helpers ---
  function handleBookingClick(destination, location, basePrice) {
    if (!user) {
      navigate('/login');
      return;
    }
    setModal({ isOpen: true, destination, location, basePrice });
  }

  function handleBookingSuccess(booking) {
    setModal({ isOpen: false, destination: '', location: '', basePrice: 0 });
    setConfirmedBooking(booking);
  }

  // --- Search form ---
  function handleSearchChange(e) {
    const { name, value } = e.target;
    setSearch(prev => ({ ...prev, [name]: value }));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!search.destination || !search.checkin || !search.checkout) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Searching for trips to ${search.destination} from ${search.checkin} to ${search.checkout} for ${search.guests} guest(s)`);
  }

  // --- Contact form ---
  function handleContactSubmit(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, textarea');
    const [name, email, subject, message] = inputs;
    if (!name.value || !email.value || !subject.value || !message.value) {
      alert('❌ Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert('❌ Please enter a valid email address');
      return;
    }
    alert('✅ Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
  }

  // --- Newsletter form ---
  function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
      alert('❌ Please enter a valid email address');
      return;
    }
    alert('✅ Thank you for subscribing to our newsletter!');
    e.target.reset();
  }

  // Ref collector helper
  function addAnimateRef(el) {
    if (el && !animateRefs.current.includes(el)) {
      animateRefs.current.push(el);
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Discover Your Next <span>Adventure</span></h1>
            <p className="hero-subtitle">Explore breathtaking destinations around the world and create unforgettable memories</p>
            <div className="hero-buttons">
              <a href="#destinations" className="btn btn-primary">Explore Destinations</a>
              <a href="#packages" className="btn btn-secondary">View Packages</a>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <h3>Find Your Perfect Trip</h3>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-group">
                <label htmlFor="search-destination">
                  <i className="fas fa-map-marker-alt"></i> Destination
                </label>
                <input
                  type="text"
                  id="search-destination"
                  name="destination"
                  value={search.destination}
                  onChange={handleSearchChange}
                  placeholder="Where do you want to go?"
                />
              </div>
              <div className="search-group">
                <label htmlFor="search-checkin">
                  <i className="fas fa-calendar-alt"></i> Check-in
                </label>
                <input
                  type="date"
                  id="search-checkin"
                  name="checkin"
                  value={search.checkin}
                  onChange={handleSearchChange}
                  min={today}
                />
              </div>
              <div className="search-group">
                <label htmlFor="search-checkout">
                  <i className="fas fa-calendar-alt"></i> Check-out
                </label>
                <input
                  type="date"
                  id="search-checkout"
                  name="checkout"
                  value={search.checkout}
                  onChange={handleSearchChange}
                  min={search.checkin || today}
                />
              </div>
              <div className="search-group">
                <label htmlFor="search-guests">
                  <i className="fas fa-users"></i> Guests
                </label>
                <select id="search-guests" name="guests" value={search.guests} onChange={handleSearchChange}>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
              <button type="submit" className="btn btn-search">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="destinations">
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Click any destination to book your trip ✈️</p>
          </div>
          <div className="destinations-grid">
            {DESTINATIONS.map(dest => (
              <div
                key={dest.name}
                className="destination-card"
                ref={addAnimateRef}
                onClick={() => handleBookingClick(dest.name, dest.location, dest.price)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleBookingClick(dest.name, dest.location, dest.price)}
                aria-label={`Book trip to ${dest.name}, ${dest.location}`}
              >
                <div className="destination-image">
                  <img src={dest.img} alt={dest.alt} />
                  <div className="destination-overlay">
                    <div className="destination-info">
                      <h3>{dest.name}</h3>
                      <p>{dest.location}</p>
                      <span className="price">From ${dest.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Packages */}
      <section id="packages" className="packages">
        <div className="container">
          <div className="section-header">
            <h2>Travel Packages</h2>
            <p>Carefully curated experiences for every traveler</p>
          </div>
          <div className="packages-grid">
            {PACKAGES.map(pkg => (
              <div key={pkg.name} className="package-card" ref={addAnimateRef}>
                <div className="package-image">
                  <img src={pkg.img} alt={pkg.alt} />
                  <div className="package-badge">{pkg.badge}</div>
                </div>
                <div className="package-content">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <div className="package-features">
                    {pkg.features.map(f => (
                      <span key={f.label}><i className={`fas ${f.icon}`}></i> {f.label}</span>
                    ))}
                  </div>
                  <div className="package-price">
                    <span className="price">${pkg.price.toLocaleString()}</span>
                    <span className="duration">{pkg.duration}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBookingClick(pkg.name, pkg.location, pkg.price)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Why Choose Son_Caleb?</h2>
              <p>With over 10 years of experience in the travel industry, we've helped thousands of travelers discover their dream destinations. Our expert team curates unique experiences that go beyond typical tourist attractions.</p>
              <div className="about-stats">
                {[
                  { value: '50K+', label: 'Happy Travelers' },
                  { value: '200+', label: 'Destinations' },
                  { value: '10+', label: 'Years Experience' },
                  { value: '24/7', label: 'Support' },
                ].map(stat => (
                  <div key={stat.label} className="stat" ref={addAnimateRef}>
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-image">
              <img src="/images/others/image.png" alt="Travel Experience" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Travelers Say</h2>
            <p>Real experiences from real travelers</p>
          </div>
          <div className="testimonials-slider">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`testimonial-card${i === activeTestimonial ? ' active' : ''}`}>
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, si) => <i key={si} className="fas fa-star"></i>)}
                  </div>
                  <p>{t.text}</p>
                  <div className="testimonial-author">
                    <img src={t.img} alt={t.name} />
                    <div className="author-info">
                      <h4>{t.name}</h4>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((t, i) => (
              <span
                key={t.name}
                className={`dot${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                role="button"
                aria-label={`Go to testimonial ${i + 1}`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveTestimonial(i)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Get Travel Inspiration</h2>
            <p>Subscribe to our newsletter for exclusive deals, travel tips, and destination guides</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Ready to start your adventure? Contact us today!</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="contact-details">
                  <h4>Visit Us</h4>
                  <p>123 Travel Street<br />Adventure City, AC 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-phone"></i></div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567<br />Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p>info@Son_Caleb.com<br />support@Son_Caleb.com</p>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* Back to top */}
      <button
        className={`back-to-top${showBackToTop ? ' show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        destination={modal.destination}
        location={modal.location}
        basePrice={modal.basePrice}
        onSuccess={handleBookingSuccess}
      />

      {/* Booking Confirmation */}
      {confirmedBooking && (
        <BookingConfirmation
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </>
  );
}

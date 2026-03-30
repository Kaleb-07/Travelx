import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe, getBookings, deleteBooking, updateMe, getWeather } from '../api/client';

// ─── Profile Edit Modal (Task 12.3) ──────────────────────────────────────────

function ProfileEditModal({ user, token, onSave, onClose }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    country: user?.country || '',
    imageUrl: user?.imageUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await updateMe(token, form);
      onSave(updated);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-details-modal" role="dialog" aria-modal="true" aria-label="Edit Profile">
      <div className="details-content">
        <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        <h2>Edit Profile</h2>
        {form.imageUrl && (
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <img
              src={form.imageUrl}
              alt="Profile Preview"
              style={{ width: 100, height: 100, borderRadius: 15, objectFit: 'cover', border: '2px solid #667eea' }}
            />
          </div>
        )}
        {error && <p className="error-message" style={{ color: 'red', marginBottom: 10 }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="detail-group">
            <div className="detail-row">
              <label className="detail-label" htmlFor="editFirstName">First Name</label>
              <input
                className="detail-value"
                type="text"
                id="editFirstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="detail-row">
              <label className="detail-label" htmlFor="editLastName">Last Name</label>
              <input
                className="detail-value"
                type="text"
                id="editLastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="detail-row">
              <label className="detail-label" htmlFor="editCountry">Country</label>
              <input
                className="detail-value"
                type="text"
                id="editCountry"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <div className="detail-row">
              <label className="detail-label" htmlFor="editImageUrl">Image URL</label>
              <input
                className="detail-value"
                type="text"
                id="editImageUrl"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="details-buttons">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Navbar ─────────────────────────────────────────────────────────

function DashboardNavbar({ user, onEditProfile, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const avatarSrc = user?.imageUrl ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop';

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">
            <i className="fas fa-globe"></i>
            Son-Caleb
          </h1>
          <p className="navbar-subtitle">Travel Dashboard</p>
        </div>
        <div className="navbar-right">
          <button className="btn-notification" aria-label="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <div className="navbar-profile" ref={menuRef}>
            <img
              src={avatarSrc}
              alt="Profile"
              onClick={() => setMenuOpen(prev => !prev)}
              style={{ cursor: 'pointer' }}
            />
            {menuOpen && (
              <div className="profile-menu" style={{ display: 'block' }}>
                <a href="#" onClick={e => { e.preventDefault(); setMenuOpen(false); onEditProfile(); }}>
                  Edit Profile
                </a>
                <a href="#" onClick={e => { e.preventDefault(); onLogout(); }}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user: authUser, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // ── 401 guard ──────────────────────────────────────────────────────────────
  function handle401(err) {
    if (err?.status === 401) {
      logout();
      navigate('/login');
      return true;
    }
    return false;
  }

  // ── Fetch profile ──────────────────────────────────────────────────────────
  async function fetchProfile() {
    try {
      const data = await getMe(token);
      setProfile(data);
    } catch (err) {
      handle401(err);
    }
  }

  // ── Fetch bookings + weather ───────────────────────────────────────────────
  async function fetchBookings() {
    setLoadingBookings(true);
    try {
      const data = await getBookings(token);
      setBookings(data);
      if (data.length > 0) {
        fetchWeather(data[0].destination);
      }
    } catch (err) {
      handle401(err);
    } finally {
      setLoadingBookings(false);
    }
  }

  async function fetchWeather(city) {
    try {
      const data = await getWeather(token, city);
      setWeather(data);
    } catch {
      setWeather(null);
    }
  }

  // ── Mount: parallel fetch of profile + bookings ────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetchProfile();
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Cancel booking (Task 12.2) ─────────────────────────────────────────────
  async function handleCancelBooking(id) {
    try {
      await deleteBooking(token, id);
      fetchBookings();
    } catch (err) {
      handle401(err);
    }
  }

  // ── Profile save (Task 12.3) ───────────────────────────────────────────────
  function handleProfileSave(updatedUser) {
    setProfile(updatedUser);
    // Update AuthContext session with returned user
    login({ token, user: updatedUser });
    setShowEditModal(false);
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const displayUser = profile || authUser;
  const recentTrips = bookings.slice(0, 3);
  const avatarSrc = displayUser?.imageUrl ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop';

  return (
    <div className="dashboard-body">
      {/* ── Navbar ── */}
      <DashboardNavbar
        user={displayUser}
        onEditProfile={() => setShowEditModal(true)}
        onLogout={() => { logout(); navigate('/login'); }}
      />

      {/* ── Profile Edit Modal ── */}
      {showEditModal && (
        <ProfileEditModal
          user={displayUser}
          token={token}
          onSave={handleProfileSave}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* ── Welcome Hero ── */}
          <section className="hero-welcome">
            <div className="hero-content">
              <h1 className="hero-title">
                Welcome back, <span>{displayUser?.firstName || 'Traveler'}</span>! 🌍
              </h1>
              <p className="hero-subtitle">
                Ready for your next adventure? Explore destinations, book trips, and track your journey.
              </p>
            </div>
            <Link to="/#destinations" className="btn btn-primary btn-large">
              <i className="fas fa-compass"></i> Explore Now
            </Link>
          </section>

          {/* ── Stats Grid ── */}
          <section className="stats-grid">
            <div className="stat-card stat-card-1">
              <div className="stat-icon"><i className="fas fa-plane"></i></div>
              <div className="stat-content">
                <h3>{bookings.length}</h3>
                <p>Trips Booked</p>
              </div>
            </div>
            <div className="stat-card stat-card-2">
              <div className="stat-icon"><i className="fas fa-heart"></i></div>
              <div className="stat-content">
                <h3>0</h3>
                <p>Favorites</p>
              </div>
            </div>
            <div className="stat-card stat-card-3">
              <div className="stat-icon"><i className="fas fa-globe"></i></div>
              <div className="stat-content">
                <h3>{new Set(bookings.map(b => b.location)).size}</h3>
                <p>Countries Visited</p>
              </div>
            </div>
            <div className="stat-card stat-card-4">
              <div className="stat-icon"><i className="fas fa-award"></i></div>
              <div className="stat-content">
                <h3>Gold</h3>
                <p>Member Status</p>
              </div>
            </div>
          </section>

          {/* ── Main Content Grid ── */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="left-column">

              {/* ── Profile Card ── */}
              <section className="card profile-card">
                <div className="card-header">
                  <h2><i className="fas fa-user-circle"></i> My Profile</h2>
                  <button className="btn-icon" onClick={() => setShowEditModal(true)} aria-label="Edit profile">
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
                <div className="card-body">
                  <div className="profile-section">
                    <div className="profile-avatar">
                      <img src={avatarSrc} alt="Profile Avatar" />
                    </div>
                    <div className="profile-details">
                      <h3>{[displayUser?.firstName, displayUser?.lastName].filter(Boolean).join(' ') || 'Traveler'}</h3>
                      <p>{displayUser?.email || ''}</p>
                      <p className="profile-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{displayUser?.country || 'Not specified'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <span className="stat-value">Level 5</span>
                      <span className="stat-label">Traveler</span>
                    </div>
                    <div className="profile-stat">
                      <span className="stat-value">2,450</span>
                      <span className="stat-label">Points</span>
                    </div>
                    <div className="profile-stat">
                      <span className="stat-value">95%</span>
                      <span className="stat-label">Satisfaction</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Recent Trips ── */}
              <section className="card">
                <div className="card-header">
                  <h2><i className="fas fa-history"></i> Recent Trips</h2>
                </div>
                <div className="card-body">
                  <div className="trips-list">
                    {loadingBookings ? (
                      <p className="empty-state"><i className="fas fa-spinner fa-spin"></i> Loading trips…</p>
                    ) : recentTrips.length === 0 ? (
                      <p className="empty-state">
                        <i className="fas fa-inbox"></i> No trips booked yet. Start exploring!
                      </p>
                    ) : (
                      recentTrips.map(booking => (
                        <div className="trip-item" key={booking._id}>
                          <div>
                            <h4>📍 {booking.destination}, {booking.location}</h4>
                            <span className={`trip-status ${booking.status?.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="trip-actions">
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link to="/" className="btn btn-primary" style={{ display: 'block', marginTop: 15 }}>
                    <i className="fas fa-plus"></i> Book a Trip
                  </Link>
                </div>
              </section>

              {/* ── Travel Tips ── */}
              <section className="card tips-card">
                <div className="card-header">
                  <h2><i className="fas fa-lightbulb"></i> Travel Tips</h2>
                </div>
                <div className="card-body">
                  <div className="tip">
                    <span className="tip-icon">✈️</span>
                    <div>
                      <h4>Best Time to Travel</h4>
                      <p>Visit European destinations in spring (April–May) for perfect weather!</p>
                    </div>
                  </div>
                  <div className="tip">
                    <span className="tip-icon">🎒</span>
                    <div>
                      <h4>Packing Smart</h4>
                      <p>Pack light clothes in summer, bring layers for mountain areas.</p>
                    </div>
                  </div>
                  <div className="tip">
                    <span className="tip-icon">💰</span>
                    <div>
                      <h4>Save Money</h4>
                      <p>Book flights on Monday for better deals and discounts.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="right-column">

              {/* ── Quick Actions ── */}
              <section className="card actions-card">
                <div className="card-header">
                  <h2><i className="fas fa-bolt"></i> Quick Actions</h2>
                </div>
                <div className="card-body">
                  <Link to="/#search-section" className="action-btn">
                    <div className="action-icon action-icon-1"><i className="fas fa-search"></i></div>
                    <span>Search Trips</span>
                  </Link>
                  <Link to="/#destinations" className="action-btn">
                    <div className="action-icon action-icon-2"><i className="fas fa-globe"></i></div>
                    <span>Destinations</span>
                  </Link>
                  <Link to="/#packages" className="action-btn">
                    <div className="action-icon action-icon-3"><i className="fas fa-box"></i></div>
                    <span>Packages</span>
                  </Link>
                  <Link to="/#contact" className="action-btn">
                    <div className="action-icon action-icon-4"><i className="fas fa-envelope"></i></div>
                    <span>Contact</span>
                  </Link>
                </div>
              </section>

              {/* ── Recommendations ── */}
              <section className="card recommendations-card">
                <div className="card-header">
                  <h2><i className="fas fa-star"></i> Recommended For You</h2>
                </div>
                <div className="card-body">
                  {[
                    { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop', name: 'Santorini, Greece', desc: 'Perfect sunsets & wine', price: 'From $799' },
                    { img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=80&fit=crop', name: 'Bali, Indonesia', desc: 'Tropical paradise', price: 'From $599' },
                    { img: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=100&h=80&fit=crop', name: 'Paris, France', desc: 'City of love & art', price: 'From $1,299' },
                  ].map(rec => (
                    <div className="recommendation" key={rec.name}>
                      <img src={rec.img} alt={rec.name} />
                      <div>
                        <h4>{rec.name}</h4>
                        <p>{rec.desc}</p>
                        <span className="price">{rec.price}</span>
                      </div>
                      <i className="fas fa-heart"></i>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Weather Card ── */}
              {weather && (
                <section className="card">
                  <div className="card-header">
                    <h2><i className="fas fa-cloud-sun"></i> Weather at Destination</h2>
                  </div>
                  <div className="card-body" id="weather-content">
                    <h4>{weather.city}</h4>
                    <p>{weather.condition}, {weather.temperatureCelsius}°C</p>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* ── Achievements ── */}
          <section className="card achievements-card">
            <div className="card-header">
              <h2><i className="fas fa-trophy"></i> Achievements</h2>
            </div>
            <div className="card-body achievements-body">
              <div className="achievement unlocked">
                <i className="fas fa-certificate"></i>
                <span>First Trip</span>
              </div>
              <div className="achievement unlocked">
                <i className="fas fa-globe"></i>
                <span>Globetrotter</span>
              </div>
              <div className="achievement">
                <i className="fas fa-star"></i>
                <span>5 Trips</span>
              </div>
              <div className="achievement">
                <i className="fas fa-mountain"></i>
                <span>Mountain Climber</span>
              </div>
            </div>
          </section>

          {/* ── Newsletter ── */}
          <section className="card newsletter-card">
            <div className="newsletter-content">
              <div>
                <h2><i className="fas fa-envelope"></i> Never Miss Traveling</h2>
                <p>Get exclusive travel deals and tips delivered to your inbox</p>
              </div>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  aria-label="Newsletter email"
                />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

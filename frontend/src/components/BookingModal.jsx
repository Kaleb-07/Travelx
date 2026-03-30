import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../api/client';
import { calculatePricing } from '../utils/pricing';

/**
 * BookingModal
 * Props:
 *   isOpen       {boolean}
 *   onClose      {() => void}
 *   destination  {string}  - destination name
 *   location     {string}  - destination location/country
 *   basePrice    {number}  - base price per guest
 *   onSuccess    {(booking) => void} - called with created booking on success
 */
export default function BookingModal({ isOpen, onClose, destination, location, basePrice, onSuccess }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
    guests: '',
    roomType: '',
    specialRequests: '',
    terms: false,
  });

  const [pricing, setPricing] = useState({
    basePrice: basePrice || 0,
    roomAdjustment: 0,
    taxAmount: 0,
    totalAmount: basePrice || 0,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill user info when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setForm(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }
    if (!isOpen) {
      setError('');
      setLoading(false);
    }
  }, [isOpen, user]);

  // Recalculate pricing when roomType or guests changes
  useEffect(() => {
    const guestsNum = parseInt(form.guests) || 1;
    const result = calculatePricing(basePrice || 0, form.roomType, guestsNum);
    setPricing(result);
  }, [form.roomType, form.guests, basePrice]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const { firstName, lastName, email, phone, checkin, checkout, guests, roomType, terms } = form;

    if (!firstName || !lastName || !email || !phone || !checkin || !checkout || !guests || !roomType) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!terms) {
      setError('Please agree to the booking terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking(token, {
        destination,
        location,
        checkin,
        checkout,
        guests: Number(guests),
        roomType,
        totalPrice: pricing.totalAmount,
      });
      onSuccess(booking);
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="booking-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal-content">
        <div className="booking-modal-header">
          <h2>📍 Book Your Trip to {destination}</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="booking-modal-body">
          <form id="bookingForm" onSubmit={handleSubmit}>
            {/* Package summary */}
            <div className="package-summary">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{destination}, {location}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>✈️ Destination</p>
                </div>
                <span className="price" style={{ fontSize: '1.5rem' }}>${basePrice}</span>
              </div>
            </div>

            {/* Personal info */}
            <div className="form-section">
              <h4>👤 Your Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Travel dates */}
            <div className="form-section">
              <h4>📅 Travel Dates</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date *</label>
                  <input
                    type="date"
                    name="checkin"
                    value={form.checkin}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date *</label>
                  <input
                    type="date"
                    name="checkout"
                    value={form.checkout}
                    onChange={handleChange}
                    min={form.checkin || today}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Accommodation */}
            <div className="form-section">
              <h4>🏨 Accommodation</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Guests *</label>
                  <select name="guests" value={form.guests} onChange={handleChange} required>
                    <option value="">Select number of guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Room Type *</label>
                  <select name="roomType" value={form.roomType} onChange={handleChange} required>
                    <option value="">Select room type</option>
                    <option value="Standard">🏠 Standard Room</option>
                    <option value="Deluxe">⭐ Deluxe Room (+20%)</option>
                    <option value="Suite">✨ Suite (+50%)</option>
                    <option value="Villa">🏝️ Villa (+100%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special requests */}
            <div className="form-section">
              <h4>📝 Special Requests (Optional)</h4>
              <textarea
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                placeholder="Any special requirements? (e.g., early check-in, high floor, etc.)"
                rows="3"
              />
            </div>

            {/* Terms */}
            <div className="form-section">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="bookTerms"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="bookTerms">I agree to the booking terms and conditions</label>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Price:</span>
                <span>${pricing.basePrice}</span>
              </div>
              <div className="price-row">
                <span>Room Type Adjustment:</span>
                <span>+${pricing.roomAdjustment}</span>
              </div>
              <div className="price-row">
                <span>Taxes &amp; Fees (10%):</span>
                <span>${pricing.taxAmount}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount:</span>
                <span>${Math.floor(pricing.totalAmount)}</span>
              </div>
            </div>

            {/* Validation error */}
            {error && (
              <p style={{ color: '#e53e3e', marginBottom: '12px', fontSize: '0.9rem' }}>
                ❌ {error}
              </p>
            )}

            {/* Actions */}
            <div className="booking-buttons">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Booking...' : '✓ Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

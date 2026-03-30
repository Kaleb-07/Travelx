/**
 * BookingConfirmation
 * Props:
 *   booking  {object} - booking object returned from the API
 *   onClose  {() => void} - called when the user clicks the done/close button
 */
export default function BookingConfirmation({ booking, onClose }) {
  if (!booking) return null;

  const {
    destination,
    location,
    checkin,
    checkout,
    guests,
    roomType,
    totalPrice,
  } = booking;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="booking-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal-content">
        <div className="booking-modal-header">
          <h2>🎉 Booking Confirmed!</h2>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="booking-modal-body">
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px' }}>✅</div>
            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '24px' }}>
              Your trip to <strong>{destination}</strong> has been booked successfully!
            </p>
          </div>

          <div className="package-summary">
            <h3 style={{ marginBottom: '16px' }}>📋 Booking Details</h3>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Destination:</span>
                <span>{destination}{location ? `, ${location}` : ''}</span>
              </div>
              <div className="price-row">
                <span>Check-in:</span>
                <span>{formatDate(checkin)}</span>
              </div>
              <div className="price-row">
                <span>Check-out:</span>
                <span>{formatDate(checkout)}</span>
              </div>
              <div className="price-row">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="price-row">
                <span>Room Type:</span>
                <span>{roomType}</span>
              </div>
              {totalPrice != null && (
                <div className="price-row total">
                  <span>Total Paid:</span>
                  <span>${Math.floor(totalPrice)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="booking-buttons" style={{ marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

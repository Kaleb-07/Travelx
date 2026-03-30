import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Son_Caleb</h3>
            <p>Your gateway to extraordinary adventures around the world. Let us help you create memories that last a lifetime.</p>
            <div className="social-links">
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="/#destinations">Destinations</a></li>
              <li><a href="/#packages">Packages</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Flight Booking</a></li>
              <li><a href="#">Hotel Reservation</a></li>
              <li><a href="#">Tour Packages</a></li>
              <li><a href="#">Travel Insurance</a></li>
              <li><a href="#">Visa Assistance</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cancellation Policy</a></li>
              <li><a href="#">24/7 Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Son_Caleb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

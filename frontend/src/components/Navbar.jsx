import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function toggleMenu() {
    setMenuOpen(prev => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none' }}>
            <h2>Son_Caleb</h2>
          </Link>
        </div>

        <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <a href="/#destinations" className="nav-link" onClick={closeMenu}>Destinations</a>
          </li>
          <li className="nav-item">
            <a href="/#packages" className="nav-link" onClick={closeMenu}>Packages</a>
          </li>
          <li className="nav-item">
            <a href="/#about" className="nav-link" onClick={closeMenu}>About</a>
          </li>
          <li className="nav-item">
            <a href="/#contact" className="nav-link" onClick={closeMenu}>Contact</a>
          </li>

          {user ? (
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link btn-book" onClick={closeMenu}>
                <i className="fas fa-user-circle"></i> {user.firstName}
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link btn-book" onClick={closeMenu}>
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
            </li>
          )}
        </ul>

        <div
          className={`hamburger${menuOpen ? ' active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && toggleMenu()}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

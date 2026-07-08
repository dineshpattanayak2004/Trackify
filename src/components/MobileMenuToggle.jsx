import { FaBars, FaTimes } from 'react-icons/fa';

export default function MobileMenuToggle({ onToggle, isOpen }) {
  return (
    <button 
      className="mobile-toggle" 
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? <FaTimes /> : <FaBars />}
    </button>
  );
}
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <p className="footer-copy">© 2026 Hoang Dinh Duy Anh &nbsp;·&nbsp; Hanoi, Vietnam</p>
        <nav className="footer-socials" aria-label="Social links">
          <a href="https://github.com/dduyanhhoang" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/dduyanhhoang/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:dduyanhhoang@gmail.com">Email</a>
          <Link to="/resume">Resume</Link>
        </nav>
      </div>
    </footer>
  );
}

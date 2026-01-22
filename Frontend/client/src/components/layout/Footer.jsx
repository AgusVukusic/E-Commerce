import { Link } from "react-router-dom";
import "../../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Navegación</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/search">Buscar Juegos</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Sobre Nosotros</h3>
                    <ul>
                        <li><Link to="/about-us">Quiénes Somos</Link></li>
                        <li><Link to="/partners">Nuestros Socios</Link></li>
                        <li><Link to="/quality">Garantía de Calidad</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Ayuda</h3>
                    <ul>
                        <li><Link to="/orders">Mis Pedidos</Link></li>
                        <li><Link to="/cart">Mi Carrito</Link></li>
                        <li><Link to="/wishlist">Lista de Deseos</Link></li>
                        <li><Link to="/profile">Mi Perfil</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Síguenos</h3>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank">
                            <i className="fab fa-facebook"></i> Facebook
                        </a>
                        <a href="https://twitter.com" target="_blank">
                            <i className="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="https://instagram.com" target="_blank">
                            <i className="fab fa-instagram"></i> Instagram
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} PressPlay. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

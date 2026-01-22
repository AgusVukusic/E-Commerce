import { useNavigate } from "react-router-dom";
import "../../styles/heroShowcase.css";

export default function HeroShowcase() {
    const navigate = useNavigate();

    const scrollToGames = () => {
        const section = document.getElementById("games-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="showcase">
            <article
                className="hero-cover"
                style={{ backgroundImage: 'url(/showcase/hero.png)' }}
            >
                <div className="hero-cover__overlay">
                    <h1>Bienvenido a PressPlay™</h1>
                    <p>
                        El lugar donde los gamers encuentran los mejores títulos, ofertas y experiencias.
                    </p>
                    <button className="hero-btn" onClick={scrollToGames}>
                        Conocé nuestro catálogo
                    </button>
                </div>
            </article>

            <div className="promo-grid">
                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/studio.png)' }}
                    onClick={() => navigate('/about-us')}
                >
                    <div className="promo-card__content">
                        <h3>¿Quiénes somos?</h3>
                        <p>Somos fanáticos de los videojuegos como vos. Creamos un espacio hecho por gamers, para gamers.</p>
                    </div>
                </article>

                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/service.png)' }}
                    onClick={() => navigate('/partners')}
                >
                    <div className="promo-card__content">
                        <h3>Trabajamos con los mejores</h3>
                        <p>Colaboramos con las desarrolladoras más grandes del mundo para ofrecerte lanzamientos oficiales y calidad garantizada.</p>
                    </div>
                </article>

                <article
                    className="promo-card"
                    style={{ backgroundImage: 'url(/showcase/calidad.jpg)' }}
                    onClick={() => navigate('/quality')}
                >
                    <div className="promo-card__content">
                        <h3>Calidad garantizada</h3>
                        <p>Cada juego que ves en PressPlay fue elegido por su rendimiento, soporte y experiencia de juego.</p>
                    </div>
                </article>
            </div>
        </section>
    );
}

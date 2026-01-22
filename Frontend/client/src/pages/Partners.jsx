import "../styles/staticPage.css";

export default function Partners() {
    return (
        <div className="static-page">
            <div
                className="static-page__banner"
                style={{ backgroundImage: 'url(/showcase/service.png)' }}
            >
                <div className="static-page__banner-overlay">
                    <h1>Trabajamos con los mejores</h1>
                </div>
            </div>

            <div className="static-page__content">
                <section className="static-page__section">
                    <h2>Alianzas Estratégicas</h2>
                    <p>
                        En PressPlay, entendemos que la calidad empieza desde la fuente. Por eso establecemos
                        asociaciones directas con las desarrolladoras y distribuidoras más importantes de la
                        industria del gaming. Esto nos permite ofrecerte no solo los mejores precios, sino
                        también garantías oficiales y acceso anticipado a lanzamientos exclusivos.
                    </p>
                    <p>
                        Trabajamos codo a codo con gigantes como Electronic Arts, Ubisoft, Activision Blizzard,
                        CD Projekt Red, y muchos estudios independientes que están revolucionando la industria.
                        Esta red de colaboración nos permite estar siempre un paso adelante.
                    </p>
                </section>

                

                <img
                    src="https://i.redd.it/az53dqt18br31.jpg"
                    alt="Partners de trabajo"
                    className="static-page__image"
                />

                <section className="static-page__section">
                    <h2>Distribución Oficial</h2>
                    <p>
                        Todos nuestros juegos provienen de canales oficiales. Esto significa que cada copia
                        digital que compras en PressPlay es 100% legítima, con todos los beneficios que eso
                        conlleva: actualizaciones automáticas, soporte técnico oficial, compatibilidad
                        garantizada y participación en programas de fidelidad de los desarrolladores.
                    </p>
                    <p>
                        Rechazamos categóricamente las copias no autorizadas o mercados grises. Tu confianza
                        es nuestro mayor activo, y nunca la pondríamos en riesgo con prácticas dudosas.
                    </p>
                </section>

                <section className="static-page__section">
                    <h2>Beneficios de Nuestras Alianzas</h2>
                    <ul className="static-page__list">
                        <li><strong>Lanzamientos Exclusivos:</strong> Acceso prioritario a nuevos títulos y ediciones especiales.</li>
                        <li><strong>Precios Competitivos:</strong> Al comprar directamente a los publishers, eliminamos intermediarios.</li>
                        <li><strong>Contenido Exclusivo:</strong> DLCs, skins y bonificaciones exclusivas para nuestra comunidad.</li>
                        <li><strong>Soporte Garantizado:</strong> Respaldo directo de los desarrolladores ante cualquier inconveniente.</li>
                        <li><strong>Eventos Especiales:</strong> Participación en betas, demos y eventos exclusivos.</li>
                    </ul>
                </section>

                <img
                    src="../../pressplay-evento.jpg"
                    alt="Evento PressPlay"
                    className="static-page__image"
                />

                <section className="static-page__section">
                    <h2>Creciendo Juntos</h2>
                    <p>
                        Nuestra relación con los estudios va más allá de lo comercial. Compartimos feedback
                        de nuestra comunidad, participamos en programas de testing y ayudamos a promover
                        títulos que sabemos que merecen atención. Somos un puente entre los creadores y los
                        jugadores, y nos enorgullece ese rol.
                    </p>
                </section>
            </div>
        </div>
    );
}

import "../styles/staticPage.css";

export default function Quality() {
    return (
        <div className="static-page">
            <div
                className="static-page__banner"
                style={{ backgroundImage: 'url(/showcase/calidad.jpg)' }}
            >
                <div className="static-page__banner-overlay">
                    <h1>Calidad garantizada</h1>
                </div>
            </div>

            <div className="static-page__content">
                <section className="static-page__section">
                    <h2>Nuestro Compromiso con la Calidad</h2>
                    <p>
                        En PressPlay, la calidad no es negociable. Cada juego que aparece en nuestro catálogo
                        ha pasado por un riguroso proceso de selección. No se trata solo de popularidad o
                        ventas: evaluamos el rendimiento técnico, la experiencia de usuario, el soporte
                        post-lanzamiento y la satisfacción de la comunidad gaming.
                    </p>
                    <p>
                        Nuestro equipo de curadores está compuesto por gamers experimentados que prueban
                        personalmente los títulos antes de ofrecerlos. Si algo no cumple nuestros estándares,
                        simplemente no entra al catálogo. Así de simple.
                    </p>
                </section>

                

                <img
                    src="https://static.tildacdn.one/tild6135-3234-4436-b161-356162383932/test-video-games-for.jpg"
                    alt="Testing en PressPlay"
                    className="static-page__image"
                />

                <section className="static-page__section">
                    <h2>Proceso de Selección</h2>
                    <p>
                        Antes de que un juego llegue a PressPlay, pasa por múltiples filtros:
                    </p>
                    <ul className="static-page__list">
                        <li><strong>Verificación Técnica:</strong> Comprobamos que el juego funcione correctamente en diferentes configuraciones.</li>
                        <li><strong>Evaluación de Contenido:</strong> Analizamos la calidad del gameplay, narrativa y experiencia general.</li>
                        <li><strong>Revisión de Soporte:</strong> Nos aseguramos de que el desarrollador ofrezca actualizaciones y soporte continuo.</li>
                        <li><strong>Análisis de Reviews:</strong> Consideramos opiniones de la comunidad y crítica especializada.</li>
                        <li><strong>Pruebas de Rendimiento:</strong> Verificamos que el juego corra de manera óptima.</li>
                    </ul>
                </section>

                <section className="static-page__section">
                    <h2>Garantía de Satisfacción</h2>
                    <p>
                        Estamos tan seguros de la calidad de nuestros productos que ofrecemos garantías sólidas.
                        Si experimentas problemas técnicos con un juego comprado en PressPlay, nuestro equipo
                        de soporte está disponible 24/7 para ayudarte. En casos donde el problema sea imputable
                        al producto, trabajaremos directamente con el desarrollador para encontrar una solución.
                    </p>
                    <p>
                        Además, mantenemos una comunicación transparente sobre el estado de los juegos: si hay
                        problemas conocidos, bugs importantes o requisitos específicos, lo advertimos claramente
                        en la página del producto.
                    </p>
                </section>

                <img
                    src="https://www.thewowstyle.com/wp-content/uploads/2024/02/Customer-Service.webp"
                    alt="Customer Service en PressPlay"
                    className="static-page__image"
                />

                <section className="static-page__section">
                    <h2>Actualizaciones y Mantenimiento</h2>
                    <p>
                        La calidad no termina en la compra. Monitoreamos constantemente los juegos de nuestro
                        catálogo para asegurarnos de que se mantengan actualizados y compatibles con las últimas
                        versiones de sistemas operativos y hardware. Si un juego deja de recibir soporte o presenta
                        problemas graves, lo indicamos claramente y, en algunos casos, lo retiramos del catálogo.
                    </p>
                </section>

                <section className="static-page__section">
                    <h2>Tu Opinión Cuenta</h2>
                    <p>
                        Valoramos enormemente el feedback de nuestra comunidad. Si has tenido una mala experiencia
                        con algún título, queremos saberlo. Tus reseñas y comentarios nos ayudan a mejorar
                        continuamente nuestro proceso de selección y a mantener los más altos estándares de calidad.
                    </p>
                    <p>
                        Porque al final del día, nuestra calidad se mide por tu satisfacción.
                    </p>
                </section>

                

                <img
                    src="https://business-portal-bucket.s3.amazonaws.com/media/images/22STREAMERS1-videoSixteenByNineJumbo1600.original.jpg"
                    alt="Comunidad PressPlay"
                    className="static-page__image"
                />
            </div>
        </div>
    );
}

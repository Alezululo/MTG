// Lógica para el menú móvil
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = mobileMenuButton.querySelector('i');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    } else {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    }
});

// Año actual en el footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Animación de aparición al hacer scroll (bidireccional)
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            // Opcional: remover la clase si quieres que la animación se repita al salir y volver a entrar
            entry.target.classList.remove('is-visible');
        }
    });
}, {
    threshold: 0.1 // Porcentaje del elemento visible para activar
});

animatedElements.forEach(element => {
    observer.observe(element);
});

// Carrusel de Clientes
const clientTrack = document.getElementById('client-carousel-track');
if (clientTrack) {
    const clientLogos = clientTrack.querySelectorAll('.client-logo');
    const logoWidth = clientLogos.length > 0 ? clientLogos[0].offsetWidth : 160; // Ancho de un logo + padding
    let currentClientScroll = 0;
    const scrollAmountClients = logoWidth; // Cuánto se desplaza cada vez

    function scrollClientCarousel() {
        currentClientScroll -= scrollAmountClients;
        // Si se pasó del final (considerando los logos duplicados), vuelve al inicio
        if (Math.abs(currentClientScroll) >= (clientTrack.scrollWidth / 2)) {
            clientTrack.style.transition = 'none'; // Evita la transición al resetear
            currentClientScroll = 0;
            clientTrack.style.transform = `translateX(${currentClientScroll}px)`;
            // Forzar reflow para aplicar el cambio de 'none' antes de volver a activar la transición
            void clientTrack.offsetWidth;
            clientTrack.style.transition = 'transform 0.5s ease-in-out';
        }
        clientTrack.style.transform = `translateX(${currentClientScroll}px)`;
    }
    setInterval(scrollClientCarousel, 3000); // Cambia cada 3 segundos
}


// Carrusel de Noticias
const newsTrack = document.getElementById('news-carousel-track');
const prevNewsButton = document.getElementById('prevNews');
const nextNewsButton = document.getElementById('nextNews');
let currentNewsIndex = 0;
let newsItemsPerPage = 1; // Por defecto para móviles

function updateNewsItemsPerPage() {
    if (window.innerWidth >= 1024) { // lg
        newsItemsPerPage = 3;
    } else if (window.innerWidth >= 768) { // md
        newsItemsPerPage = 2;
    } else {
        newsItemsPerPage = 1;
    }
}

function showNewsSlide(index) {
    if (!newsTrack) return;
    const newsCards = newsTrack.querySelectorAll('.news-card');
    const totalNewsItems = newsCards.length;

    updateNewsItemsPerPage(); // Asegurar que tenemos el valor correcto

    // Validar límites
    if (index >= totalNewsItems - newsItemsPerPage + 1) {
        index = totalNewsItems - newsItemsPerPage;
    }
    if (index < 0) {
        index = 0;
    }
    currentNewsIndex = index;

    const cardWidth = newsTrack.querySelector('.news-card').offsetWidth;
    newsTrack.style.transform = `translateX(-${currentNewsIndex * cardWidth}px)`;

    // Habilitar/deshabilitar botones
    if (prevNewsButton && nextNewsButton) {
        prevNewsButton.disabled = currentNewsIndex === 0;
        nextNewsButton.disabled = currentNewsIndex >= totalNewsItems - newsItemsPerPage;
    }
}

if (prevNewsButton && nextNewsButton && newsTrack) {
    prevNewsButton.addEventListener('click', () => {
        showNewsSlide(currentNewsIndex - 1);
    });
    nextNewsButton.addEventListener('click', () => {
        showNewsSlide(currentNewsIndex + 1);
    });
    // Inicializar y ajustar en resize
    window.addEventListener('resize', () => showNewsSlide(currentNewsIndex));
    showNewsSlide(0); // Mostrar el primer slide al cargar
}



// Scripts para la pagina quienes somos ---------------------------------------------------------------------

// Abrir y cerrar modal Certificados
document.getElementById('openCertificatesModal')?.addEventListener('click', () => {
    const modal = document.getElementById('certificatesModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
document.getElementById('closeCertificatesModal')?.addEventListener('click', () => {
    const modal = document.getElementById('certificatesModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});

// Abrir y cerrar modal Trabaja con Nosotros
document.getElementById('openWorkWithUsModal')?.addEventListener('click', () => {
    const modal = document.getElementById('workWithUsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
document.getElementById('closeWorkWithUsModal')?.addEventListener('click', () => {
    const modal = document.getElementById('workWithUsModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});

// Modal visor de archivos (PDF o imagen)
function openFileModal(url) {
    const viewer = document.getElementById('fileViewerFrame');
    viewer.src = url;
    const modal = document.getElementById('fileViewerModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
function closeFileViewer() {
    const modal = document.getElementById('fileViewerModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.getElementById('fileViewerFrame').src = '';
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // Cierra todos los modales que estén visibles
        ['certificatesModal', 'workWithUsModal', 'fileViewerModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal && modal.classList.contains('flex')) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                // Limpia iframe si es el visor
                if (id === 'fileViewerModal') {
                    document.getElementById('fileViewerFrame').src = '';
                }
            }
        });
    }
});





// Scripts para la pagina productos y servicios  ---------------------------------------------------------------------

// --- Lógica para Carruseles de Productos Específicos ---
function setupProductCarousel(carouselId, prevBtnId, nextBtnId) {
    const track = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let itemsPerPage = 1;
    const cards = track.querySelectorAll('.product-specific-card');
    const totalItems = cards.length;

    function updateItemsPerPage() {
        if (window.innerWidth >= 1280) { itemsPerPage = 3; } // xl
        else if (window.innerWidth >= 1024) { itemsPerPage = 2; } // lg - mostrando 2.5 es más complejo sin JS fraccional, así que ajustamos a 2 o 3
        else if (window.innerWidth >= 768) { itemsPerPage = 2; } // md
        else { itemsPerPage = 1; }

        // Ajuste para mostrar un poco del siguiente si caben 2.5
        if (window.innerWidth >= 1024 && window.innerWidth < 1280 && totalItems > 2) {
            // No se puede hacer calc(100% / 2.5) directamente en JS para el translate sin recalcular ancho exacto
            // Para simplicidad, se mostrarán 2 completos, el tercero se asomará.
        }
    }

    function showSlide(index) {
        if (!cards || cards.length === 0) return;
        updateItemsPerPage();

        if (totalItems <= itemsPerPage) {
            currentIndex = 0;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            track.style.transform = `translateX(0px)`;
            return;
        }

        if (index >= totalItems - itemsPerPage + 1) { // +1 para que el último grupo se muestre completo
            index = totalItems - itemsPerPage;
        }
        if (index < 0) {
            index = 0;
        }
        currentIndex = index;

        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight) * 2 || cards[0].getBoundingClientRect().width; // Incluir margen si es necesario
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalItems - itemsPerPage;
    }

    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

    window.addEventListener('resize', () => showSlide(currentIndex));
    showSlide(0);
}

setupProductCarousel('baja-tension-carousel-track', 'prevBajaTension', 'nextBajaTension');
setupProductCarousel('media-tension-carousel-track', 'prevMediaTension', 'nextMediaTension');

// --- Lógica para Modales de Productos ---
const openModalButtons = document.querySelectorAll('.open-product-modal-btn');
const closeModalButtons = document.querySelectorAll('.close-product-modal-btn');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.dataset.modalId;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});

// Cerrar modales al hacer clic fuera o con Escape
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            // Zamezení scrollování těla při otevřeném menu
            document.body.style.overflow = navbar.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth Scroll for anchor links (if browser doesn't interpret scroll-behavior properly or for extra control)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // --- Lightbox Gallery Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    let currentImageIndex = 0;
    const updateLightboxImage = () => {
        if (galleryItems.length > 0) {
            lightboxImg.src = galleryItems[currentImageIndex].src;
            lightboxImg.alt = galleryItems[currentImageIndex].alt;
        }
    };

    const openLightbox = (index) => {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Zamezí scrollování pozadí
    };

    const closeLightboxFunc = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    };

    const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    };

    // Attach click events to gallery items
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox Controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFunc);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Zavření kliknutím mimo obrázek
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightboxFunc();
            }
        });
    }

    // Klávesové zkratky
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightboxFunc();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // --- Swipe Gestures for Mobile ---
    let touchStartX = 0;
    let touchEndX = 0;

    const handleGesture = () => {
        const swipeThreshold = 50; // minimální swipe vzdálenost v pixelech
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left
            nextImage();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right
            prevImage();
        }
    };

    if (lightbox) {
        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, { passive: true });
    }

    // --- Load More Gallery Items ---
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-gallery-item');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden-gallery-item');
                item.classList.add('fade-in'); // Přidá animaci
            });
            // Skryje tlačítko po načtení všech
            loadMoreBtn.style.display = 'none';
        });
    }
});

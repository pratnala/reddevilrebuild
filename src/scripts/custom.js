const htmlElement = document.documentElement;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.min.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

function setTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    const darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeIcon) {
        if (theme === 'dark') {
            darkModeIcon.className = 'fas fa-sun text-warning';
        } else {
            darkModeIcon.className = 'fas fa-moon text-light';
        }
    }
}

function getPreferredTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

setTheme(getPreferredTheme());

document.addEventListener("DOMContentLoaded", () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
            setTheme(getPreferredTheme());
        }
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        });
    }

    function playVideo(link) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${link.getAttribute('data-video-id')}?autoplay=1`;
        iframe.title = link.getAttribute('data-video-title');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        link.replaceWith(iframe);
    }

    document.addEventListener('click', e => {
        // A button that plays a player elsewhere on the page; once that player is playing, it opens YouTube
        const trigger = e.target.closest('[data-play]');
        const target = trigger && document.getElementById(trigger.getAttribute('data-play'));
        if (target) {
            e.preventDefault();
            playVideo(target);
            return;
        }

        const link = e.target.closest('[data-video-id]');
        if (link) {
            e.preventDefault();
            playVideo(link);
        }
    });

    const albumWrapper = document.querySelector('.album');
    if (albumWrapper) {
        initializePagination(albumWrapper);
    }

    function initializePagination(albumWrapper) {
        const allItems = albumWrapper.querySelectorAll('.video-item');
        const paginationContainers = albumWrapper.querySelectorAll('.pagination-container');
        const seasonTabs = albumWrapper.querySelectorAll('.season-tabs-container .nav-link');
        const itemsPerPage = parseInt(albumWrapper.getAttribute('data-items-per-page')) || 6;

        let currentPage = 1;
        let filteredItems = [];

        function updateSeason(season) {
            currentPage = 1;

            allItems.forEach(item => {
                item.classList.add('d-none');
                const iframe = item.querySelector('iframe');
                if (iframe && iframe.hasAttribute('src')) {
                    iframe.removeAttribute('src');
                }
            });

            filteredItems = Array.from(allItems).filter(item => item.getAttribute('data-season') === season);

            seasonTabs.forEach(tab => {
                if (tab.getAttribute('data-target-season') === season) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            renderPage(1);
        }

        function renderPage(page) {
            currentPage = page;
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            filteredItems.forEach((item, index) => {
                const iframe = item.querySelector('iframe');

                if (index >= start && index < end) {
                    item.classList.remove('d-none');
                    if (iframe && iframe.getAttribute('data-src') && !iframe.getAttribute('src')) {
                        iframe.setAttribute('src', iframe.getAttribute('data-src'));
                    }
                } else {
                    item.classList.add('d-none');
                    if (iframe && iframe.hasAttribute('src')) {
                        iframe.removeAttribute('src');
                    }
                }
            });

            renderPaginationControls();
        }

        function createPageItem(label, className, onClick) {
            const li = document.createElement('li');
            li.className = `page-item ${className}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = label;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                onClick();
            });
            li.appendChild(a);
            return li;
        }

        function renderPaginationControls() {
            const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
            paginationContainers.forEach(container => {
                container.innerHTML = '';

                if (totalPages <= 1) {
                    return;
                }

                container.appendChild(createPageItem('Previous', currentPage === 1 ? 'd-none' : '', () => {
                    if (currentPage > 1) {
                        renderPage(currentPage - 1);
                    }
                }));

                for (let i = 1; i <= totalPages; i++) {
                    container.appendChild(createPageItem(i, i === currentPage ? 'active' : '', () => renderPage(i)));
                }

                container.appendChild(createPageItem('Next', currentPage === totalPages ? 'd-none' : '', () => {
                    if (currentPage < totalPages) {
                        renderPage(currentPage + 1);
                    }
                }));
            });
        }

        seasonTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                updateSeason(tab.getAttribute('data-target-season'));
            });
        });

        if (allItems.length > 0) {
            if (seasonTabs.length > 0) {
                updateSeason(seasonTabs[0].getAttribute('data-target-season'));
            } else {
                filteredItems = Array.from(allItems);
                renderPage(1);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Toggle the side navigation
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            document.body.classList.toggle('sidebar-toggled');
            document.getElementById('accordionSidebar').classList.toggle('toggled');
        });
    }

    // Toggle button on topbar for small screens
    const sidebarToggleTop = document.getElementById('sidebarToggleTop');
    if (sidebarToggleTop) {
        sidebarToggleTop.addEventListener('click', function(e) {
            document.body.classList.toggle('sidebar-toggled');
            document.getElementById('accordionSidebar').classList.toggle('toggled');
        });
    }


    // Scroll to top button functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) { // Show button after scrolling down 100px
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
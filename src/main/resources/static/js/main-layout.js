document.addEventListener('DOMContentLoaded', async () => {
    const usernameDisplay = document.getElementById('current-username-display');
    const API_URL_BASE = '/api/products'; // Basis URL API Anda

    // Fungsi untuk mengambil dan menampilkan info user
    async function fetchUserInfo() {
        try {
            const response = await fetch(`${API_URL_BASE}/user-info`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userInfo = await response.json();

            if (usernameDisplay) {
                usernameDisplay.textContent = userInfo.username;
            }

            // Opsi: Sembunyikan/tampilkan link sidebar berdasarkan peran
            // Contoh:
            const dashboardLink = document.querySelector('a[href="dashboard.html"]');
            const addProductLink = document.querySelector('a[href="product-form.html"]'); // di collapse menu

            if (userInfo.isAdmin) {
                if (dashboardLink) dashboardLink.style.display = 'block';
                if (addProductLink) addProductLink.style.display = 'block';
                // Jika ada tombol edit/delete di index.html yang perlu disembunyikan/ditampilkan oleh JS,
                // Anda perlu logic tambahan di index.js yang menerima info.isAdmin.
                // Untuk saat ini, kita mengandalkan backend security.
            } else {
                // Jika bukan admin
                if (dashboardLink) dashboardLink.style.display = 'none'; // Sembunyikan link Dashboard
                if (addProductLink) addProductLink.style.display = 'none'; // Sembunyikan link Tambah Produk
                // Opsional: Redirect jika user mencoba mengakses dashboard/form langsung
                if (window.location.pathname === '/dashboard.html' || window.location.pathname === '/product-form.html') {
                    // Jika ada di halaman terlarang tanpa peran admin, arahkan ke home
                    window.location.href = '/';
                }
            }

        } catch (error) {
            console.error('Error fetching user info:', error);
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Guest'; // Fallback jika gagal
            }
        }
    }

    // Panggil saat halaman dimuat
    fetchUserInfo();
    
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
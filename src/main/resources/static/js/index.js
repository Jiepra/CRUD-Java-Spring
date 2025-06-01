document.addEventListener('DOMContentLoaded', () => {
    const productsTableBody = document.getElementById('products-table-body');
    const messageDiv = document.getElementById('product-list-message');
    const API_URL = '/api/products'; // Sesuaikan dengan base URL API Anda

    // Fungsi untuk menampilkan pesan (sukses/error)
    function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = `alert mt-3 alert-${type}`;
        messageDiv.classList.remove('d-none');
        setTimeout(() => {
            messageDiv.classList.add('d-none');
        }, 5000); // Pesan akan hilang setelah 5 detik
    }

    // Fungsi untuk mengambil dan menampilkan produk
    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                // Periksa jika status 404 (Not Found) untuk kasus tidak ada produk
                if (response.status === 404) {
                    renderProducts([]); // Render tabel kosong jika tidak ada produk
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            showMessage('Gagal memuat daftar produk. Pastikan backend berjalan dengan baik.', 'danger');
        }
    }

    // Fungsi untuk merender produk ke dalam tabel
    function renderProducts(products) {
        productsTableBody.innerHTML = ''; // Kosongkan tabel sebelum mengisi ulang
        if (products.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada produk ditemukan.</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = productsTableBody.insertRow();
            // PASTIKAN BARIS INI BENAR-BENAR SAMA, MENGGUNAKAN BACKTICKS (`) DAN ${}
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description || '-'}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Hapus</button>
                </td>
            `;
        });

        // Tambahkan event listener untuk tombol Edit dan Hapus
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                window.location.href = `product-form.html?id=${productId}`; // Arahkan ke form edit
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                if (confirm(`Anda yakin ingin menghapus produk dengan ID ${productId}?`)) {
                    deleteProduct(productId);
                }
            });
        });
    }

    // Fungsi untuk menghapus produk
    async function deleteProduct(id) {
        try {
            // SINTAKS TEMPLATE LITERAL HARUS BENAR: BACKTICKS (`) dan ${}
            const response = await fetch(`${API_URL}/${id}`, { // <--- INI ADALAH SINTAKS YANG BENAR
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showMessage('Produk berhasil dihapus!', 'success');
            fetchProducts(); // Muat ulang daftar produk
        } catch (error) {
            console.error('Error deleting product:', error);
            showMessage('Gagal menghapus produk.', 'danger');
        }
    }

    // Muat produk saat halaman dimuat
    fetchProducts();
});
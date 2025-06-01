document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productIdField = document.getElementById('product-id');
    const productNameField = document.getElementById('product-name');
    const productDescriptionField = document.getElementById('product-description');
    const productPriceField = document.getElementById('product-price');
    const productStockField = document.getElementById('product-stock');
    const pageTitle = document.getElementById('page-title');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const messageDiv = document.getElementById('product-form-message');

    const API_URL = '/api/products';
    let isEditMode = false;
    let productIdToEdit = null;

    // Fungsi untuk menampilkan pesan (sukses/error)
    function showMessage(text, type = 'success') {
        messageDiv.textContent = text;
        messageDiv.className = `alert mt-3 alert-${type}`;
        messageDiv.classList.remove('d-none');
        setTimeout(() => {
            messageDiv.classList.add('d-none');
        }, 5000); // Ubah durasi menjadi 5 detik
    }

    // Ambil ID dari URL jika sedang dalam mode edit
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id')) {
        isEditMode = true;
        productIdToEdit = urlParams.get('id');
        pageTitle.textContent = 'Edit Produk';
        formTitle.textContent = 'Edit Produk';
        submitButton.textContent = 'Update Produk';
        fetchProductForEdit(productIdToEdit);
    }

    // Fungsi untuk mengambil data produk jika sedang dalam mode edit
    async function fetchProductForEdit(id) {
        try {
            // PASTIKAN SINTAKS URL DI SINI BENAR
            const response = await fetch(`${API_URL}/${id}`); // <-- Ini yang benar
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();
            productIdField.value = product.id;
            productNameField.value = product.name;
            productDescriptionField.value = product.description;
            productPriceField.value = product.price;
            productStockField.value = product.stock;
        } catch (error) {
            console.error('Error fetching product for edit:', error);
            showMessage('Gagal memuat data produk untuk diedit.', 'danger');
            isEditMode = false;
            pageTitle.textContent = 'Tambah Produk Baru';
            formTitle.textContent = 'Tambah Produk Baru';
            submitButton.textContent = 'Simpan Produk';
        }
    }


    // Handler saat form disubmit
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Mencegah reload halaman

        const productData = {
            name: productNameField.value,
            description: productDescriptionField.value,
            price: parseFloat(productPriceField.value), // Pastikan ini angka
            stock: parseInt(productStockField.value, 10), // Pastikan ini bilangan bulat
        };

        try {
            let response;
            if (isEditMode) {
                // Update produk
                response = await fetch(`${API_URL}/${productIdToEdit}`, { // <-- Ini juga harus benar
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: productIdToEdit, ...productData }),
                });
            } else {
                // Tambah produk baru
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            showMessage(`Produk berhasil ${isEditMode ? 'diupdate' : 'ditambahkan'}!`, 'success');

            if (!isEditMode) {
                productForm.reset(); // Kosongkan form setelah menambah produk baru
            } else {
                // Jika mode edit, bisa arahkan kembali ke daftar produk setelah sukses
                // atau biarkan di halaman ini
                // setTimeout(() => window.location.href = 'index.html', 1500);
            }

        } catch (error) {
            console.error('Error saving product:', error);
            showMessage(`Gagal ${isEditMode ? 'mengupdate' : 'menambahkan'} produk.`, 'danger');
        }
    });
});
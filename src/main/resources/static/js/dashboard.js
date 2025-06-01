document.addEventListener('DOMContentLoaded', async () => {
    const totalProductsSpan = document.getElementById('total-products');
    const totalStockSpan = document.getElementById('total-stock');
    const averagePriceSpan = document.getElementById('average-price');
    const dashboardMessageDiv = document.getElementById('dashboard-message');
    const API_URL = '/api/products';

    // Fungsi untuk menampilkan pesan (sukses/error)
    function showMessage(text, type = 'success') {
        dashboardMessageDiv.textContent = text;
        dashboardMessageDiv.className = `alert mt-3 alert-${type}`;
        dashboardMessageDiv.classList.remove('d-none');
        setTimeout(() => {
            dashboardMessageDiv.classList.add('d-none');
        }, 5000); // Durasi 5 detik
    }

    async function fetchDashboardData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            // Hitung statistik ringkasan
            const totalProducts = products.length;
            let totalStock = 0;
            let totalPrice = 0;

            products.forEach(product => {
                totalStock += product.stock;
                totalPrice += product.price;
            });

            const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;

            // Tampilkan statistik
            totalProductsSpan.textContent = totalProducts;
            totalStockSpan.textContent = totalStock;
            averagePriceSpan.textContent = `Rp ${averagePrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // Render grafik stok (Donut Chart)
            renderProductStockDonutChart(products);
            // Render grafik distribusi harga (Bar Chart)
            renderProductPriceDistributionChart(products);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showMessage('Gagal memuat data dashboard. Pastikan backend berjalan.', 'danger');
        }
    }

// Fungsi untuk membuat Line Chart stok produk
function renderProductStockDonutChart(products) { // Nama fungsi tetap sama tapi fungsinya berubah
    const ctx = document.getElementById('productStockDonutChart'); // ID canvas juga tetap sama
    if (!ctx) return;

    // Ambil top 5 produk dengan stok terbanyak untuk ditampilkan di chart
    // Jika Anda ingin menampilkan semua produk, hapus .slice(0, 5)
    const topProducts = products.sort((a, b) => b.stock - a.stock).slice(0, 5);

    const productNames = topProducts.map(p => p.name);
    const productStocks = topProducts.map(p => p.stock);

    new Chart(ctx, {
        type: 'line', // <-- UBAH KE 'line'
        data: {
            labels: productNames,
            datasets: [{
                label: 'Jumlah Stok',
                data: productStocks,
                backgroundColor: 'rgba(78, 115, 223, 0.2)', // Warna area di bawah garis
                borderColor: '#4e73df', // Warna garis
                pointRadius: 3, // Ukuran titik data
                pointBackgroundColor: '#4e73df',
                pointBorderColor: '#4e73df',
                pointHoverRadius: 3,
                pointHoverBackgroundColor: '#4e73df',
                pointHoverBorderColor: '#4e73df',
                pointHitRadius: 10,
                pointBorderWidth: 2,
                fill: true, // Mengisi area di bawah garis
                tension: 0.4 // Kehalusan garis
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7 // Batasi jumlah label di sumbu X
                    },
                    title: {
                        display: true,
                        text: 'Nama Produk'
                    }
                },
                y: {
                    ticks: {
                        maxTicksLimit: 5, // Batasi jumlah label di sumbu Y
                        padding: 10,
                        // Callback untuk format angka
                        callback: function(value, index, values) {
                            return value; // Atau format sesuai kebutuhan, misal `$${value}`
                        }
                    },
                    grid: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    },
                    title: {
                        display: true,
                        text: 'Stok'
                    }
                },
            },
            legend: {
                display: false // Sembunyikan legenda
            },
            tooltips: { // Opsi tooltip sudah sesuai untuk line chart
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + tooltipItem.raw; // Menampilkan label dan nilai
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Stok Produk (Top 5)' // Judul chart
                }
            }
        }
    });
}

    // Fungsi untuk membuat Bar Chart distribusi harga
    function renderProductPriceDistributionChart(products) {
        const ctx = document.getElementById('productPriceDistributionChart');
        if (!ctx) return;

        // Definisikan rentang harga
        const priceRanges = {
            '0 - 50rb': { min: 0, max: 50000, count: 0 },
            '50rb - 200rb': { min: 50001, max: 200000, count: 0 },
            '200rb - 1jt': { min: 200001, max: 1000000, count: 0 },
            '1jt - 5jt': { min: 1000001, max: 5000000, count: 0 },
            '> 5jt': { min: 5000001, max: Infinity, count: 0 }
        };

        // Hitung produk di setiap rentang
        products.forEach(product => {
            for (const range in priceRanges) {
                if (product.price >= priceRanges[range].min && product.price <= priceRanges[range].max) {
                    priceRanges[range].count++;
                    break;
                }
            }
        });

        const labels = Object.keys(priceRanges);
        const dataCounts = Object.values(priceRanges).map(range => range.count);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Produk',
                    data: dataCounts,
                    backgroundColor: '#36b9cc', // Info blue
                    borderColor: '#2c9faf',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Rentang Harga'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Produk'
                        },
                        ticks: {
                            precision: 0 // Pastikan sumbu Y adalah bilangan bulat
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Distribusi Produk Berdasarkan Harga'
                    }
                }
            }
        });
    }


    // Muat data dashboard saat halaman dimuat
    fetchDashboardData();
});
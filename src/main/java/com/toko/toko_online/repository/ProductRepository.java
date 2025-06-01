package com.toko.toko_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.toko.toko_online.entity.Product;

@Repository // Menandakan bahwa ini adalah komponen Spring Repository.
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA akan secara otomatis menyediakan metode CRUD dasar:
    // - save() untuk menambah/memperbarui produk
    // - findById() untuk mencari produk berdasarkan ID
    // - findAll() untuk mendapatkan semua produk
    // - deleteById() untuk menghapus produk berdasarkan ID
    // Dan masih banyak lagi!

    // Anda bisa menambahkan metode kustom di sini jika butuh query spesifik
    // Contoh:
    // List<Product> findByNameContainingIgnoreCase(String name);
}
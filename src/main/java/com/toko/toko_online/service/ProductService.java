package com.toko.toko_online.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.toko.toko_online.entity.Product;
import com.toko.toko_online.repository.ProductRepository;

@Service // Menandakan bahwa kelas ini adalah komponen Service di Spring.
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired // Melakukan injeksi dependensi untuk ProductRepository.
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Metode untuk menyimpan produk baru atau memperbarui yang sudah ada
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Metode untuk mendapatkan semua produk
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Metode untuk mendapatkan produk berdasarkan ID
    // Optional<Product> digunakan karena produk mungkin tidak ditemukan
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Metode untuk menghapus produk berdasarkan ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Metode untuk memperbarui produk
    // Ini adalah contoh sederhana. Logika yang lebih kompleks bisa ditambahkan di sini.
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStock(productDetails.getStock());
            return productRepository.save(existingProduct);
        } else {
            // Atau bisa juga throw Exception custom jika produk tidak ditemukan
            return null;
        }
    }
}
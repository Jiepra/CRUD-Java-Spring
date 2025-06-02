package com.toko.toko_online.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // Menandakan bahwa kelas ini adalah entitas JPA dan akan dipetakan ke tabel database.
@Table(name = "products") // Menentukan nama tabel di database. Jika nama kelas sama dengan nama tabel, ini opsional.
public class Product {

    @Id // Menandakan bahwa field ini adalah primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi untuk menghasilkan nilai primary key secara otomatis (AUTO_INCREMENT di MySQL).
    private Long id;

    @Column(nullable = false) // Menandakan bahwa kolom ini tidak boleh kosong di database.
    private String name;

    @Column(columnDefinition = "TEXT") // Menentukan tipe data kolom di database.
    private String description;

    @Column(nullable = false)
    private BigDecimal price; // Menggunakan BigDecimal untuk presisi dalam representasi harga.

    @Column(nullable = false)
    private Integer stock;

    // Konstruktor default (dibutuhkan oleh JPA)
    public Product() {
    }

    // Konstruktor dengan semua field (opsional, tapi berguna)
    public Product(String name, String description, BigDecimal price, Integer stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }

    // Getter dan Setter untuk setiap field
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    // Metode toString (opsional, tapi berguna untuk debugging)
    @Override
    public String toString() {
        return "Product{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", description='" + description + '\'' +
               ", price=" + price +
               ", stock=" + stock +
               '}';
    }
}
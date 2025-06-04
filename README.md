# 🛍️ Toko Online Admin Panel

[![Java](https://img.shields.io/badge/Java-17+-%23EA2D2E.svg?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/en/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.1-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-%234479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-%237952B3.svg?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-%23FF6384.svg?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

---

Selamat datang di repositori **Toko Online Admin Panel**! 🎉

Proyek ini adalah aplikasi web lengkap yang dibangun menggunakan **Spring Boot** sebagai backend dan kombinasi **HTML, CSS, JavaScript, Bootstrap**, serta **Chart.js** untuk frontend. Aplikasi ini dirancang untuk mengelola data produk dengan fungsionalitas CRUD (Create, Read, Update, Delete) dan dilengkapi dengan dashboard interaktif serta sistem otentikasi dan otorisasi berbasis peran (Admin & User).

---

## ✨ Fitur Utama

Berikut adalah fitur-fitur yang ada dalam aplikasi ini:

* **🔐 Otentikasi Pengguna:**
    * Sistem login yang aman menggunakan Spring Security.
    * Password disimpan ter-hash dengan BCryptPasswordEncoder.
    * Pemisahan peran (`ROLE_ADMIN` dan `ROLE_USER`).
* **👥 Otorisasi Berbasis Peran:**
    * **Administrator (`ROLE_ADMIN`):** Memiliki akses penuh ke semua fitur CRUD (Tambah, Lihat, Edit, Hapus Produk), Dashboard, dan halaman manajemen.
    * **Pengguna Biasa (`ROLE_USER`):** Hanya dapat melihat daftar produk. Akses ke Dashboard, halaman tambah/edit, dan operasi modifikasi (Edit/Hapus) akan dibatasi.
* **📝 Manajemen Produk (CRUD):**
    * **Create (Tambah):** Formulir intuitif untuk menambahkan produk baru ke database.
    * **Read (Lihat):** Tabel produk yang menampilkan daftar semua produk dengan detail lengkap.
    * **Update (Edit):** Formulir yang terisi otomatis untuk memperbarui informasi produk yang sudah ada.
    * **Delete (Hapus):** Fungsionalitas untuk menghapus produk dari daftar.
* **📊 Dashboard Interaktif:**
    * Ringkasan statistik produk (total produk, total stok, rata-rata harga).
    * **Visualisasi Data Keren:** Menampilkan grafik menggunakan Chart.js, seperti:
        * Distribusi stok produk terlaris (Donut Chart / Line Chart).
        * Distribusi harga produk dalam rentang tertentu (Bar Chart).
* **🎨 Desain UI Modern:**
    * Menggunakan Bootstrap 5 untuk tampilan responsif dan terstruktur.
    * Layout Admin Panel kustom yang terinspirasi dari SB Admin 2, dengan sidebar dan topbar yang elegan.
    * Pesan notifikasi yang informatif untuk setiap operasi.

---

## 🛠️ Teknologi yang Digunakan

* **Backend:**
    * Java 17 (LTS)
    * [Spring Boot 3.3.1](https://spring.io/projects/spring-boot)
    * [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
    * [Spring Security](https://spring.io/projects/spring-security)
    * Maven
* **Database:**
    * MySQL 8 (Localhost, misalnya dengan [Laragon](https://laragon.org/) atau Docker)
    * Alternatif: PostgreSQL (melalui [Neon.tech Free Tier](https://neon.tech/) untuk deployment cloud)
* **Frontend:**
    * HTML5
    * CSS3 (dengan [Bootstrap 5](https://getbootstrap.com/))
    * JavaScript (ES6+)
    * [Chart.js 4.x](https://www.chartjs.org/)
    * [Font Awesome 5](https://fontawesome.com/) (untuk ikon)

---

## 🚀 Cara Menjalankan Aplikasi (Lokal)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan pengembangan lokal Anda.

### Prasyarat

* [Java Development Kit (JDK) 17](https://adoptium.net/temurin/releases/) atau lebih baru.
* [Maven](https://maven.apache.org/download.cgi) terinstal.
* [MySQL Server](https://www.mysql.com/downloads/installation/) (Direkomendasikan menggunakan [Laragon](https://laragon.org/) atau [Docker](https://www.docker.com/products/docker-desktop/)).
* IDE (IntelliJ IDEA, VS Code dengan ekstensi Java, atau Eclipse).

### Setup Database MySQL

1.  Pastikan MySQL Server Anda berjalan (misalnya, di Laragon).
2.  Buka klien MySQL Anda (HeidiSQL, MySQL Workbench, atau terminal).
3.  Buat database baru bernama `toko_online`:
    ```sql
    CREATE DATABASE toko_online;
    USE toko_online;
    ```
4.  Buat tabel `products`, `users`, dan `user_roles`:
    ```sql
    CREATE TABLE products (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL
    );

    CREATE TABLE users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE user_roles (
        user_id BIGINT NOT NULL,
        role VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_id, role),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    ```
5.  **Tambahkan Pengguna Awal (Admin & User):**
    * Buat file `src/main/java/com/toko/tokoonline/PasswordGenerator.java` (atau di package `com.toko.tokoonline.util`) dengan kode berikut untuk mendapatkan hash password:
        ```java
        package com.toko.tokoonline; // Sesuaikan dengan package Anda
        import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

        public class PasswordGenerator {
            public static void main(String[] args) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                String rawPasswordAdmin = "admin_password"; // Ganti dengan password pilihan Anda
                String encodedPasswordAdmin = encoder.encode(rawPasswordAdmin);
                System.out.println("Hashed Password for ADMIN ('" + rawPasswordAdmin + "'): " + encodedPasswordAdmin);

                String rawPasswordUser = "user_password"; // Ganti dengan password pilihan Anda
                String encodedPasswordUser = encoder.encode(rawPasswordUser);
                System.out.println("Hashed Password for USER ('" + rawPasswordUser + "'): " + encodedPasswordUser);
            }
        }
        ```
    * Jalankan `PasswordGenerator.java` dari IDE Anda (klik kanan -> Run Main). Salin hash password yang dihasilkan.
    * Masukkan hash password ke database:
        ```sql
        INSERT INTO users (username, password) VALUES ('admin', '[HASH_PASSWORD_ADMIN]');
        INSERT INTO users (username, password) VALUES ('user', '[HASH_PASSWORD_USER]');

        INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM users WHERE username = 'admin'), 'ROLE_ADMIN');
        INSERT INTO user_roles (user_id, role) VALUES ((SELECT id FROM users WHERE username = 'user'), 'ROLE_USER');
        ```

### Konfigurasi Proyek

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/Jiepra/Toko-Online-Admin-Panel.git](https://github.com/Jiepra/Toko-Online-Admin-Panel.git)
    cd Toko-Online-Admin-Panel # Ganti nama repositori jika berbeda
    ```
2.  **Perbarui `application.properties`:**
    Buka `src/main/resources/application.properties` dan pastikan konfigurasi database Anda sesuai dengan MySQL lokal Anda:
    ```properties
    spring.application.name=toko-online
    spring.datasource.url=jdbc:mysql://localhost:3306/toko_online?useSSL=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password= # Kosongkan jika tidak ada password
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
    ```
3.  **Bangun Proyek:**
    Buka terminal di root proyek dan jalankan:
    ```bash
    mvn clean install -U
    ```
### Menjalankan Aplikasi

1.  **Dari IDE:**
    Buka proyek di IDE (IntelliJ IDEA, VS Code). Jalankan kelas `TokoOnlineApplication.java` (klik kanan -> Run Main).
2.  **Dari Terminal:**
    Di root proyek, jalankan:
    ```bash
    mvn spring-boot:run
    ```

Setelah aplikasi berjalan, buka browser Anda dan akses: [http://localhost:8080/](http://localhost:8080/)

Anda akan diarahkan ke halaman login.

**Kredensial Login (Default):**
* **Admin:** Username: `admin`, Password: `admin_password` (sesuai yang Anda hash)
* **User:** Username: `user`, Password: `user_password` (sesuai yang Anda hash)

---

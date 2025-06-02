package com.toko.toko_online.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Mungkin perlu import ini jika sebelumnya terhapus
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Izinkan akses publik (tanpa login) ke:
                // - Halaman login
                // - Semua aset statis (CSS, JS, gambar, vendor)
                // - Halaman utama (daftar produk)
                // - API untuk GET semua produk (agar halaman utama bisa tampil)
                .requestMatchers("/login.html", "/css/**", "/js/**", "/img/**", "/vendor/**", "/").permitAll()
                .requestMatchers("/api/products").permitAll() // GET /api/products (read-only for all)
                .requestMatchers("/api/products/user-info").permitAll()

                // Hanya ADMIN yang bisa:
                // - Mengakses API produk untuk POST, PUT, DELETE
                // - Mengakses halaman dashboard
                // - Mengakses halaman tambah/edit produk
                .requestMatchers("/api/products/**").hasRole("ADMIN") // Untuk API produk lainnya (POST, PUT, DELETE)
                .requestMatchers("/dashboard.html").hasRole("ADMIN") // Halaman dashboard
                .requestMatchers("/product-form.html").hasRole("ADMIN") // Halaman tambah/edit produk

                // Semua request lainnya (URL yang belum diizinkan secara spesifik) harus diautentikasi (membutuhkan login)
                // Ini menangani akses ke resource yang tidak secara eksplisit diizinkan secara publik
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html") // Halaman login kustom
                .loginProcessingUrl("/login") // URL yang memproses submit form login (POST)
                .defaultSuccessUrl("/", true) // Redirect setelah login sukses ke halaman utama
                .failureUrl("/login.html?error=true") // Halaman jika login gagal
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout")) // URL untuk logout
                .logoutSuccessUrl("/login.html?logout=true") // Redirect setelah logout sukses
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID") // Hapus cookie sesi
                .permitAll() // Izinkan semua akses ke proses logout
            )
            .csrf(csrf -> csrf.disable()); // Nonaktifkan CSRF untuk development

        return http.build();
    }
}
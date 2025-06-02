package com.toko.toko_online.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
                // Aturan Paling Longgar Dulu: Izinkan akses ke Halaman Login, Aset Statis, dan Root
                // Pastikan /login ADA di sini
                .requestMatchers("/login", "/css/**", "/js/**", "/img/**", "/vendor/**", "/").permitAll()

                // Aturan untuk API Produk (GET public, POST/PUT/DELETE ADMIN)
                .requestMatchers("/api/products").permitAll() // GET all products
                .requestMatchers("/api/products/**").hasRole("ADMIN") // POST, PUT, DELETE products

                // Aturan untuk Dashboard
                .requestMatchers("/dashboard.html").hasRole("ADMIN")

                // Semua permintaan lainnya harus diautentikasi
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login") // Tetap arahkan ke URL /login
                // .permitAll() <--- HAPUS ATAU KOMENTARI INI
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error=true")
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .csrf(Customizer.withDefaults()); // Aktifkan CSRF (jika belum)

        return http.build();
    }
}
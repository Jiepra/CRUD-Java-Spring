package com.toko.toko_online.service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.toko.toko_online.entity.User;
import com.toko.toko_online.repository.UserRepository;

@Service
public class UserService implements UserDetailsService { // Implement UserDetailsService

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Untuk hashing password

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Metode ini akan dipanggil oleh Spring Security saat proses login
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Konversi peran (String) menjadi GrantedAuthority yang dipahami Spring Security
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(), // Password sudah di-hash
                authorities
        );
    }

    // Metode untuk mendaftarkan user baru (akan di-hash passwordnya)
    public User registerNewUser(String username, String password, String role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password)); // HASH PASSWORD!
        newUser.addRole(role); // Tambahkan peran
        return userRepository.save(newUser);
    }

    // Metode untuk mencari user (opsional)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
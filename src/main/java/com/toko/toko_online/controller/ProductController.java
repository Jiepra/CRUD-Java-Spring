package com.toko.toko_online.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional; // Mungkin perlu juga
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Mungkin perlu juga
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.toko.toko_online.entity.Product;
import com.toko.toko_online.service.ProductService;

@RestController // Menandakan bahwa kelas ini adalah REST Controller.
@RequestMapping("/api/products") // Menentukan base URL untuk semua endpoint di controller ini.
@CrossOrigin(origins = "http://localhost:8080") // Izinkan permintaan dari frontend kita. Akan disesuaikan nanti.
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Endpoint untuk mendapatkan semua produk
    // GET: http://localhost:8080/api/products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Endpoint untuk mendapatkan produk berdasarkan ID
    // GET: http://localhost:8080/api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint untuk menambah produk baru
    // POST: http://localhost:8080/api/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Endpoint untuk memperbarui produk
    // PUT: http://localhost:8080/api/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        if (updatedProduct != null) {
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint untuk menghapus produk
    // DELETE: http://localhost:8080/api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id); // Cek keberadaan produk dulu
        if (product.isPresent()) {
            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> userInfo = new HashMap<>();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String && "anonymousUser".equals(authentication.getPrincipal()))) {
            // Jika user sudah terotentikasi dan bukan anonymous
            Object principal = authentication.getPrincipal();
            String username;
            Set<String> roles = new HashSet<>();

            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
                ((UserDetails) principal).getAuthorities().forEach(authority -> roles.add(authority.getAuthority()));
            } else {
                username = principal.toString(); // Fallback jika bukan UserDetails
                // Roles for non-UserDetails principal might be trickier to get directly.
                // For simplicity, we'll assume UserDetails or default to basic roles.
            }

            userInfo.put("username", username);
            userInfo.put("isAuthenticated", true);
            userInfo.put("roles", roles); // Menambahkan peran pengguna

            // Contoh untuk memeriksa peran di backend
            boolean isAdmin = roles.contains("ROLE_ADMIN");
            userInfo.put("isAdmin", isAdmin);

        } else {
            // Jika user belum login atau anonymous
            userInfo.put("username", "Guest");
            userInfo.put("isAuthenticated", false);
            userInfo.put("roles", new HashSet<>());
            userInfo.put("isAdmin", false);
        }
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }
}
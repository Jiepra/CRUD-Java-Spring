package com.toko.toko_online.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Menandakan bahwa ini adalah Spring MVC Controller untuk melayani view.
public class LoginController {

    // Metode ini akan melayani permintaan GET ke "/login"
    @GetMapping("/login")
    public String login() {
        // Mengembalikan nama view (file HTML) yang akan disajikan.
        // Karena kita meletakkan login.html di src/main/resources/static,
        // Spring Boot akan secara otomatis mencari file ini.
        return "login"; // Ini akan mencari login.html
    }
}
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPasswordAdmin = "password_admin_anda"; // Ganti dengan password ADMIN yang Anda inginkan
        String encodedPasswordAdmin = encoder.encode(rawPasswordAdmin);
        System.out.println("Hashed Password for ADMIN ('" + rawPasswordAdmin + "'): " + encodedPasswordAdmin);

        String rawPasswordUser = "password_user_anda"; // Ganti dengan password USER yang Anda inginkan
        String encodedPasswordUser = encoder.encode(rawPasswordUser);
        System.out.println("Hashed Password for USER ('" + rawPasswordUser + "'): " + encodedPasswordUser);
    }
}
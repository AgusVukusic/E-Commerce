package com.example.uade.tpo.ecommerce_grupo10.adminXdefecto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificar si ya existe un usuario ADMIN
        boolean adminExists = usuarioRepository.existsByRol(Rol.ADMIN);

        if (!adminExists) {
            // Crear usuario ADMIN por defecto
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombre("Administrador");
            admin.setApellido("Sistema");
            admin.setTelefono("0000000000");
            admin.setDireccion("Sistema");
            admin.setRol(Rol.ADMIN);

            usuarioRepository.save(admin);

            System.out.println("✅ Usuario ADMIN creado por defecto:");
        } else {
            System.out.println("ℹ️  Usuario ADMIN ya existe en la base de datos");
        }
    }
}

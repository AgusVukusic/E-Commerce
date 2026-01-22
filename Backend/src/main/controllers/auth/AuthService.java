package com.example.uade.tpo.ecommerce_grupo10.controllers.auth;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.ecommerce_grupo10.controllers.auth.dto.AuthRequest;
import com.example.uade.tpo.ecommerce_grupo10.controllers.auth.dto.AuthResponse;
import com.example.uade.tpo.ecommerce_grupo10.controllers.auth.dto.RegisterRequest;
import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.entity.Usuario;
import com.example.uade.tpo.ecommerce_grupo10.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByUsername(req.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso");
        }
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("El email ya está en uso");
        }

        // Validar que no se pueda registrar con rol ADMIN
        if (req.getRol() != null && req.getRol() == Rol.ADMIN) {
            throw new IllegalArgumentException(
                    "No se puede registrar un usuario con rol ADMIN. Los administradores son creados por el sistema.");
        }

        Usuario u = new Usuario();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setNombre(req.getNombre());
        u.setApellido(req.getApellido());
        u.setTelefono(req.getTelefono());
        u.setDireccion(req.getDireccion());

        // Si no viene rol, default COMPRADOR (y nunca puede ser ADMIN)
        u.setRol(req.getRol() == null ? Rol.COMPRADOR : req.getRol());
        Usuario saved = usuarioRepository.save(u);

        // creo un userDetail para el usuario registrado
        UserDetails userDetails = new User(
                saved.getEmail(),
                saved.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + saved.getRol().name())));

        String token = jwtService.generateToken(userDetails);

        // Crear información del usuario para la respuesta
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getNombre(),
                saved.getApellido(),
                saved.getTelefono(),
                saved.getDireccion(),
                saved.getRol());

        return new AuthResponse(token, userInfo);
    }

    public AuthResponse authenticate(AuthRequest req) {
        return authenticate(req, null);
    }

    public AuthResponse authenticate(AuthRequest req, String authHeader) {
        // Verificar si ya hay una sesión activa
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String currentToken = authHeader.substring(7);
            if (!tokenBlacklistService.isTokenBlacklisted(currentToken)) {
                try {
                    String currentUserEmail = jwtService.extractUsername(currentToken);
                    if (currentUserEmail != null && !currentUserEmail.isEmpty()) {
                        throw new IllegalStateException(
                                "Ya tienes una sesión activa. Debes cerrar sesión antes de iniciar sesión con otra cuenta.");
                    }
                } catch (Exception e) {
                    // Si el token es inválido, continuamos con el login normal
                }
            }
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        Usuario u = usuarioRepository.findByEmailIgnoreCase(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        // creo un userDetail para el usuario autenticado
        UserDetails userDetails = new User(
                u.getEmail(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().name())));

        String token = jwtService.generateToken(userDetails);

        // Crear información del usuario para la respuesta
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getNombre(),
                u.getApellido(),
                u.getTelefono(),
                u.getDireccion(),
                u.getRol());

        return new AuthResponse(token, userInfo);
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
        }
    }
}

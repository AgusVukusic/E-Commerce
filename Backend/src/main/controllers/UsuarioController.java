package com.example.uade.tpo.ecommerce_grupo10.controllers;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.Rol;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioCreateDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioUpdateDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.usuario.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Listar todos los usuarios con paginacion
    @GetMapping
    public Page<UsuarioDTO> listarUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.listar(pageable);
    }

    // Buscar usuarios por username, email o nombre completo
    @GetMapping("/buscar")
    public Page<UsuarioDTO> buscarUsuarios(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.buscar(q, pageable);
    }

    // Filtrar usuarios por rol
    @GetMapping("/rol/{rol}")
    public Page<UsuarioDTO> usuariosPorRol(
            @PathVariable Rol rol,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.listarPorRol(rol, pageable);
    }

    // Buscar usuario por username
    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioDTO> buscarPorUsername(@PathVariable String username) {
        Optional<UsuarioDTO> usuario = usuarioService.buscarPorUsername(username);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar usuario por email
    @GetMapping("/email")
    public ResponseEntity<UsuarioDTO> buscarPorEmail(@RequestParam("value") String email) {
        return usuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Verificar si existe username
    @GetMapping("/existe/username/{username}")
    public ResponseEntity<Boolean> existeUsername(@PathVariable String username) {
        boolean existe = usuarioService.existePorUsername(username);
        return ResponseEntity.ok(existe);
    }

    // Verificar si existe email
    @GetMapping("/existe/email/{email}")
    public ResponseEntity<Boolean> existeEmail(@PathVariable String email) {
        boolean existe = usuarioService.existePorEmail(email);
        return ResponseEntity.ok(existe);
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    // Crear nuevo usuario
    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@Valid @RequestBody UsuarioCreateDTO dto) {
        UsuarioDTO usuarioCreado = usuarioService.crear(dto);
        return ResponseEntity.ok(usuarioCreado);
    }

    // Actualizar usuario
    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO dto) {

        UsuarioDTO usuarioActualizado = usuarioService.actualizar(id, dto);
        return ResponseEntity.ok(usuarioActualizado);
    }
}

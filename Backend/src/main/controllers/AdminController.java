package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.admin.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    /**
     * Promueve un VENDEDOR a ADMIN
     * Solo puede ser ejecutado por otro ADMIN
     */
    @PatchMapping("/promover/{usuarioId}")
    public ResponseEntity<UsuarioDTO> promoverAAdmin(@PathVariable Long usuarioId) {
        UsuarioDTO usuario = adminService.promoverAAdmin(usuarioId);
        return ResponseEntity.ok(usuario);
    }

    /**
     * Degrada un ADMIN a VENDEDOR
     * Solo puede ser ejecutado por otro ADMIN
     */
    @PatchMapping("/degradar/{usuarioId}")
    public ResponseEntity<UsuarioDTO> degradarAdmin(@PathVariable Long usuarioId) {
        UsuarioDTO usuario = adminService.degradarAdmin(usuarioId);
        return ResponseEntity.ok(usuario);
    }
}

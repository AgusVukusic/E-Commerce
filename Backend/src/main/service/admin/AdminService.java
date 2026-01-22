package com.example.uade.tpo.ecommerce_grupo10.service.admin;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.dtosUsuario.UsuarioDTO;

public interface AdminService {

    /**
     * Promueve un usuario a ADMIN
     * Solo puede ser ejecutado por otro ADMIN
     */
    UsuarioDTO promoverAAdmin(Long usuarioId);

    /**
     * Degrada un ADMIN a VENDEDOR
     * Solo puede ser ejecutado por otro ADMIN
     */
    UsuarioDTO degradarAdmin(Long usuarioId);

    /**
     * Verifica si el usuario actual puede gestionar admins
     */
    boolean puedeGestionarAdmins();
}

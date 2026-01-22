package com.example.uade.tpo.ecommerce_grupo10.service.checkout;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;

public interface CheckoutService {
    
    // Realiza el checkout del carrito del usuario creando una orden
    OrdenDTO realizarCheckout(Long usuarioId);

    //Valida que se pueda realizar el checkout
    boolean validarCheckout(Long usuarioId);
}

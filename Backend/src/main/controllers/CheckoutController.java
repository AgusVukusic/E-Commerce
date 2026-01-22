package com.example.uade.tpo.ecommerce_grupo10.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.ecommerce_grupo10.entity.__dto__.OrdenDTO;
import com.example.uade.tpo.ecommerce_grupo10.service.checkout.CheckoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    /**
     * Realiza el checkout del carrito del usuario
     * POST /checkout/usuario/{usuarioId}
     */
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<OrdenDTO> realizarCheckout(@PathVariable Long usuarioId) {
        OrdenDTO orden = checkoutService.realizarCheckout(usuarioId);
        return ResponseEntity.ok(orden);
    }

    /**
     * Valida si se puede realizar el checkout
     * GET /checkout/usuario/{usuarioId}/validar
     */
    @GetMapping("/usuario/{usuarioId}/validar")
    public ResponseEntity<CheckoutValidationResponse> validarCheckout(@PathVariable Long usuarioId) {
        boolean valido = checkoutService.validarCheckout(usuarioId);
        String mensaje = valido ? "Checkout válido" : "No se puede realizar el checkout";

        CheckoutValidationResponse response = new CheckoutValidationResponse(valido, mensaje);
        return ResponseEntity.ok(response);
    }

    // DTO para la respuesta de validación
    public static class CheckoutValidationResponse {
        private boolean valido;
        private String mensaje;

        public CheckoutValidationResponse(boolean valido, String mensaje) {
            this.valido = valido;
            this.mensaje = mensaje;
        }

        public boolean isValido() {
            return valido;
        }

        public void setValido(boolean valido) {
            this.valido = valido;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
    }
}

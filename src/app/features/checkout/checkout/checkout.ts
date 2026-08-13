import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CarrinhoService } from '../../../core/services/carrinho.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  carrinhoService = inject(CarrinhoService);

  compraFinalizar = signal(false);

  formulario = new FormGroup({
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      nomeSemNumeros
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    endereco: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  finalizar() {
    this.compraFinalizar.set(false);

    if (this.carrinhoService.carrinhoVazio()) {
      console.log('Não é possível finalizar a compra com o carrinho vazio');
      return;
    }

    if (this.formulario.invalid) {
      console.log('Formulário inválido!');
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.value;
    const itens = this.carrinhoService.item();

    console.log('Dados do formulário:', dados);
    console.log('Itens no carrinho:', itens);

    this.compraFinalizar.set(true);
  }
}

function nomeSemNumeros(
  controle: AbstractControl
): ValidationErrors | null {
  const valor = controle.value;

  if (!valor) {
    return null;
  }

  if (/\d/.test(valor)) {
    return {
      numeroInvalido: true
    };
  }

  return null;
}
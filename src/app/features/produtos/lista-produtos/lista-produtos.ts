import { Component, inject} from '@angular/core';
import { Produto } from '../produto/produto';
import { signal } from '@angular/core';
import { computed } from '@angular/core';
import { PrecoFormatadoPipe } from '../../../shared/pipes/preco-formatado-pipe';
import { effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { produtoService } from '../../../core/services/produtos.service';
import { Inject } from '@angular/core';
import { Carrinho } from '../../carrinho/carrinho/carrinho';
import { CarrinhoService } from '../../../core/services/carrinho.service';
@Component({
  selector: 'app-lista-produtos',
  imports: [Produto,PrecoFormatadoPipe, UpperCasePipe],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  //signal
 produtos = signal<{nome: string; preco: number}[]>([]);
 carregando = signal(true);
 produtoSelecionado = signal<string | null >(null);
 erro = signal < string | null > (null);
    
  //funçao para exibier produtos selecionados pelos usuario console 
  exibirProduto (nome: string){
    console.log ('Produto Selecionado: ', nome);
    this.produtoSelecionado.set(nome);
  }
  //função que adicionar produtos usando metodo update()
  adicionarProduto(){
    this.produtos.update(listaAtual =>[
      ...listaAtual,
      {nome:'playstation 5',preco:3000}
    ]);
  }
  //função que contabiliza a quantidade de produtos na lista 
totalProdutos = computed(() => this.produtos().length);
//função que calcula o valor total do produtos usando metodo computed()
valorTotal = computed(()=>
{return this.produtos().reduce((total, item) =>
total + item.preco,0
)});
//função para substituir a lista aual usando o metodo atual 
substituirProduto(){
  this.produtos.set([
    { nome:'Teclado', preco:50},
    { nome:'Mouse', preco:15},
    { nome:'Monitor', preco:500},
    { nome:'Desktop', preco:1500},
    { nome:'headset', preco:30},
  ]);
}

carregarProdutos(){
this.carregando.set(true);
this.produtosService.buscarProduto().subscribe({
  next: (dados) => {
    const produtos = this.produtosService.transformarProduto(dados);
    this.produtos.set(produtos);
    this.carregando.set(false);
  },
  error: (erro) => {
    console.error('Erro ao carregar produtos', erro);
    this.erro.set('Erro ao carregar produtos. por favor, tente novamente!');
    this.carregando.set(false);
  }
});
}
// metodo para monitorar alterações em tempo em tempo real usando metodo effect()
constructor(){
  // carrega o API
  this.carregarProdutos();
  effect(() => {
    console.log('Lista de Produtos Alterados: ',this.produtos());
  });
  effect(() => {
    console.log('Valor Total Atualizado: ', this.valorTotal());
  });
  effect(() => {
    if (typeof document !== 'undefined'){
      document.title = `(${this.totalProdutos()}) - Loja do paulotec`;
    }
  });
}

adicionarAoCarrinho(produto:{nome: string; preco: number}){
  this.carrinhoService.adicionar(produto);
    }

private produtosService = inject(produtoService);
public carrinhoService = inject(CarrinhoService);

quantidadeCarrinho = this.carrinhoService.quantidadeItens;
totalCarrinho = this.carrinhoService.totalItens;
}

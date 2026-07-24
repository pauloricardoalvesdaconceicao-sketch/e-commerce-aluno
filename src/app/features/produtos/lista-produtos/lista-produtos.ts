import { Component} from '@angular/core';
import { Produto } from '../produto/produto';
import { signal } from '@angular/core';
import { computed } from '@angular/core';
import { PrecoFormatadoPipe } from '../../../shared/pipes/preco-formatado-pipe';
import { effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
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
 carrinho = signal<{nome: string; preco: number}[]>([]);
    
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
  this.http.get<{title: string; price: number}[]>
  ('https://fakestoreapi.com/products').subscribe({
    next: (dados) => {
      const produtosFormatados = dados.map(p => ({
        nome: p.title,
        preco: p.price,
      }));
      this.produtos.set(produtosFormatados);
      this.carregando.set(false);
    },
    error: (error) => {
      console.error('Error ao carregar produtos: ', error );
      this.carregando.set(false);
    } 
    
  });

}
// metodo para monitorar alterações em tempo em tempo real usando metodo effect()
constructor(private http: HttpClient){
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
  this.carrinho.update(listaAtual =>
  [...listaAtual, produto]
  ); 
    }
     //metodo para calcular a quantidade total de item no carrinho
quantidadeCarrinho = computed(() => this.carrinho().length);
//metodo para calcular o valor todal do carrinho
totalCarrinho = computed(()=>
{return this.carrinho().reduce((total, item) =>
total + item.preco,0
)});

}

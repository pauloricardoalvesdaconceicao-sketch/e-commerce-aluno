import { Injectable,signal, computed } from "@angular/core";
@Injectable({
    providedIn: 'root'
})

export class CarrinhoService {
    //! estado global - criando com sucesso
    private carrinho = signal<{nome: string; preco: number}[]>([]);
    //? seleção
    item = computed(() => this.carrinho());
    quantidadeItens = computed(()=> this.carrinho().length);
    totalItens = computed(()=>
    this.carrinho().reduce((total, item) => total + item.preco,0
    
));
// toda: Ações
adicionar(produto:{nome:string; preco:number}){
    this.carrinho.update(lista => [...lista, produto]);
}
// toda: Ações de limpeza
limpar(){
    this.carrinho.set([]);
}
}
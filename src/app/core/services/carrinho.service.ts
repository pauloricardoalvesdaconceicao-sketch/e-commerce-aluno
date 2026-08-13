import { Injectable, signal, computed } from "@angular/core";

type ItemCarrinho = {
    nome: string;
    preco: number;
};

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    //! Estado global
    private carrinho = signal<ItemCarrinho[]>([]);

    //? Seleção
    item = computed(() => this.carrinho());

    quantidadeItens = computed(() =>
        this.carrinho().length
    );

    totalItens = computed(() =>
        this.carrinho().reduce(
            (total, item) => total + item.preco,
            0
        )
    );

    carrinhoVazio = computed(() =>
        this.carrinho().length === 0
    );

    // TODO: Ações
    adicionar(produto: ItemCarrinho) {
        this.carrinho.update(lista => [...lista, produto]);
    }

    // TODO: Ações de limpeza
    limpar() {
        this.carrinho.set([]);
    }
}
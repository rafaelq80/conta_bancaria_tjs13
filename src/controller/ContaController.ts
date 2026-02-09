import { Conta } from "../model/Conta";
import { ContaRepository } from "../repository/ContaRepository";
import { Colors } from "../util/Colors";
import { formatarMoeda } from "../util/Currency";

export class ContaController implements ContaRepository{
        
    private listaContas = new Array<Conta>();

    public numero: number = 0;

    // Métodos do CRUD
    procurarPorNumero(numero: number): void {
        const buscaConta = this.buscarNoArray(numero);

        if(buscaConta !== null)
            buscaConta.visualizar();
        else
            console.log(Colors.fg.red, `\nA Conta número ${numero} não foi encontrada!`, Colors.reset);

    }
    
    listarTodas(): void {
        for (let conta of this.listaContas){
            conta.visualizar();
        }
    }

    procurarPorTitular(titular: string): void {
        
        // Filtragem dos dados
        const buscaPorTitular = this.listaContas.filter( conta =>
            conta.titular.toUpperCase().includes(titular.toUpperCase())
        );

        // Listagem dos dados filtrados
        if (buscaPorTitular.length > 0){
            buscaPorTitular.forEach( conta => conta.visualizar());
        }else{
            console.log(Colors.fg.red, `\nNenhuma conta foi encontrada!`, Colors.reset);
        }

    }

    cadastrar(conta: Conta): void {
        this.listaContas.push(conta);
        console.log(Colors.fg.green,
            `\nA Conta número ${conta.numero} foi cadastrada com sucesso!`, Colors.reset);
    }

    atualizar(conta: Conta): void {
        const buscaConta = this.buscarNoArray(conta.numero);

        if(buscaConta !== null){
            this.listaContas[this.listaContas.indexOf(buscaConta)] = conta;
            console.log(Colors.fg.green, 
                `\nA Conta número ${conta.numero} foi atualizada com sucesso!`, Colors.reset);
        }else
            console.log(Colors.fg.red, `\nA Conta número ${conta.numero} não foi encontrada!`, Colors.reset);
    }

    deletar(numero: number): void {
        const buscaConta = this.buscarNoArray(numero);

        if(buscaConta !== null){
            this.listaContas.splice(this.listaContas.indexOf(buscaConta), 1);
            console.log(Colors.fg.green, 
                `\nA Conta número ${numero} foi deletada com sucesso!`, Colors.reset);
        }else
            console.log(Colors.fg.red, `\nA Conta número ${numero} não foi encontrada!`, Colors.reset);
    }

    // Métodos Bancários
    sacar(numero: number, valor: number): void {
        const buscaConta = this.buscarNoArray(numero);

        if(buscaConta !== null){
            if(buscaConta.sacar(valor) === true)  
                console.log(Colors.fg.green, 
                `\nO Saque no valor de ${formatarMoeda(valor)} na Conta número ${numero} foi realizado com sucesso!`, Colors.reset); 
        }else
            console.log(Colors.fg.red, `\nA Conta número ${numero} não foi encontrada!`, Colors.reset);
    }

    depositar(numero: number, valor: number): void {
         const buscaConta = this.buscarNoArray(numero);

        if(buscaConta !== null){
            buscaConta.depositar(valor)  
            console.log(Colors.fg.green, 
                `\nO Depósito no valor de ${formatarMoeda(valor)} na Conta número ${numero} foi realizado com sucesso!`, Colors.reset); 
        }else
            console.log(Colors.fg.red, `\nA Conta número ${numero} não foi encontrada!`, Colors.reset);
    }

    transferir(numeroOrigem: number, numeroDestino: number, valor: number): void {
        
        const buscaContaOrigem = this.buscarNoArray(numeroOrigem);
        const buscaContaDestino = this.buscarNoArray(numeroDestino);

        if(buscaContaOrigem !== null && buscaContaDestino !== null){
            if(buscaContaOrigem.sacar(valor) === true){  
                buscaContaDestino.depositar(valor);
                console.log(Colors.fg.green, 
                `\nA Transferência no valor de ${formatarMoeda(valor)} da Conta número ${numeroOrigem} 
                 \npara a Conta número ${numeroDestino} foi realizado com sucesso!`, Colors.reset); 
            }
        }else
            console.log(Colors.fg.red, `\nA Conta de origem e/ou destino não foram encontradas!`, Colors.reset);
    }

    // Métodos Auxiliares
    
    public gerarNumero(): number{
        return ++ this.numero;
    }

    public buscarNoArray(numero: number): Conta | null {
        for (let conta of this.listaContas){
            if (conta.numero === numero)
                return conta
        }

        return null;
    }
}
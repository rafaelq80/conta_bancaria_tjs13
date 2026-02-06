import { Conta } from "../model/Conta";
import { ContaRepository } from "../repository/ContaRepository";
import { Colors } from "../util/Colors";

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
        throw new Error("Method not implemented.");
    }

    depositar(numero: number, valor: number): void {
        throw new Error("Method not implemented.");
    }

    transferir(numeroOrigem: number, numeroDestino: number, valor: number): void {
        throw new Error("Method not implemented.");
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
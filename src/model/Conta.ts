import { Colors } from "../util/Colors";
import { formatarMoeda } from "../util/Currency";

export abstract class Conta{

    // Atributos da Classe
    private _numero: number;
    private _agencia: number;
    private _titular: string;
    private _tipo: number;
    private _saldo: number;

    // Método Construtor
	constructor(numero: number, agencia: number, titular: string, tipo: number, saldo: number) {
		this._numero = numero;
		this._agencia = agencia;
		this._titular = titular;
		this._tipo = tipo;
		this._saldo = saldo;
	}
	
    // Métodos Get e Set
	public get numero(): number {
		return this._numero;
	}

	public get agencia(): number {
		return this._agencia;
	}

	public get titular(): string {
		return this._titular;
	}

	public get tipo(): number {
		return this._tipo;
	}

	public get saldo(): number {
		return this._saldo;
	}

	public set numero(value: number) {
		this._numero = value;
	}

	public set agencia(value: number) {
		this._agencia = value;
	}

	public set titular(value: string) {
		this._titular = value;
	}

	public set tipo(value: number) {
		this._tipo = value;
	}

	public set saldo(value: number) {
		this._saldo = value;
	}

    //Métodos Auxiliares

    public sacar(valor: number): boolean {

        if(valor <= 0){
            console.log(Colors.fg.red, "\nO valor deve ser positivo", Colors.reset);
            return false;
        }

        if(valor > this._saldo){
            console.log(Colors.fg.red, "\nSaldo Insuficiente!", Colors.reset);
            return false;
        }

        this._saldo -= valor;
        return true;
    }

    public depositar(valor: number): void {

        if(valor <= 0)
            console.log(Colors.fg.red, "O valor deve ser positivo", Colors.reset);
        else
            this._saldo += valor;
    }

    public visualizar(): void {

        let tipo: string;

        switch(this._tipo){
            case 1:
                tipo = "Conta Corrente";
            break;
            case 2:
                tipo = "Conta Poupança";
            break;
            default:
                tipo = "Tipo Inválido";
        }

        console.log("\n************************************");
        console.log("        DADOS DA CONTA              ");
        console.log("************************************");
        console.log(`Número da conta: ${this._numero}`);
        console.log(`Número da agência: ${this._agencia}`);
        console.log(`Nome do titular: ${this._titular}`);
        console.log(`Tipo da conta: ${tipo}`);
        console.log(`Saldo da conta: ${formatarMoeda(this._saldo)}`);
    }
}
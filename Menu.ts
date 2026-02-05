import { ContaCorrente } from './src/model/ContaCorrente';
import { ContaPoupanca } from './src/model/ContaPoupanca';
import { Colors } from './src/util/Colors';
import { Input } from "./src/util/Input";

export function main() {

    let opcao: number;

    // *** Testes da Classe Conta Corrente ***

    console.log("\nTestes - Classe Conta Corrente");

    const cc1 = new ContaCorrente(1, 5678, "Bianca", 1, 200000.00, 2000.00);

    cc1.visualizar();
  
    console.log("\nSacar 1000.00");
    console.log("\n", cc1.sacar(1000.00));

    console.log("\nSacar 200000.00");
    console.log("\n", cc1.sacar(200000.00));

    console.log("\nDepositar 500.00");
    cc1.depositar(500.00);

    cc1.visualizar();

    // *** Testes da Classe Conta Poupanca ***

    console.log("\nTestes - Classe Conta Poupança");

    const cp1 = new ContaPoupanca(2, 1234, "Paula", 1, 2000.00, 12);

    cp1.visualizar();
  
    console.log("\nSacar 1000.00");
    console.log("\n", cp1.sacar(1000.00));

    console.log("\nSacar 2100.00");
    console.log("\n", cp1.sacar(2100.00));

    console.log("\nDepositar 500.00");
    cp1.depositar(500.00);

    cp1.visualizar();

    console.log("\n");

    while (true) {

        console.log(Colors.bg.black, Colors.fg.yellow, 
                    "*****************************************************");
        console.log("                                                     ");
        console.log("                BANCO DO BRAZIL COM Z                ");
        console.log("                                                     ");
        console.log("*****************************************************");
        console.log("                                                     ");
        console.log("            1 - Criar Conta                          ");
        console.log("            2 - Listar todas as Contas               ");
        console.log("            3 - Buscar Conta por Numero              ");
        console.log("            4 - Atualizar Dados da Conta             ");
        console.log("            5 - Apagar Conta                         ");
        console.log("            6 - Sacar                                ");
        console.log("            7 - Depositar                            ");
        console.log("            8 - Transferir valores entre Contas      ");
        console.log("            0 - Sair                                 ");
        console.log("                                                     ");
        console.log("*****************************************************");
        console.log("                                                     ", 
        Colors.reset);

        console.log("Entre com a opção desejada: ");
        opcao = Input.questionInt("");

        if (opcao === 0) {
            console.log(Colors.fg.greenstrong, "\nBanco do Brazil com Z - O seu Futuro começa aqui!");
            sobre();
            console.log(Colors.reset, "");
            process.exit(0);
        }

        switch (opcao) {
            case 1:
                console.log(Colors.fg.whitestrong, "\n\nCriar Conta\n\n", Colors.reset);

                keyPress()
                break;
            case 2:
                console.log(Colors.fg.whitestrong, "\n\nListar todas as Contas\n\n", Colors.reset);

                keyPress()
                break;
            case 3:
                console.log(Colors.fg.whitestrong, "\n\nConsultar dados da Conta - por número\n\n", Colors.reset);

                keyPress()
                break;
            case 4:
                console.log(Colors.fg.whitestrong, "\n\nAtualizar dados da Conta\n\n", Colors.reset);

                keyPress()
                break;
            case 5:
                console.log(Colors.fg.whitestrong, "\n\nApagar uma Conta\n\n", Colors.reset);

                keyPress()
                break;
            case 6:
                console.log(Colors.fg.whitestrong, "\n\nSaque\n\n", Colors.reset);

                keyPress()
                break;
            case 7:
                console.log(Colors.fg.whitestrong, "\n\nDepósito\n\n", Colors.reset);

                keyPress()
                break;
            case 8:
                console.log(Colors.fg.whitestrong, "\n\nTransferência entre Contas\n\n", Colors.reset);

                keyPress()
                break;
            default:
                console.log(Colors.fg.whitestrong, "\nOpção Inválida!\n", Colors.reset);

                keyPress()
        }
    }

}

/* Função com os dados da pessoa desenvolvedora */
function sobre(): void {
    console.log("\n*****************************************************");
    console.log("Projeto Desenvolvido por: ");
    console.log("Rafael Antônio de Queiróz - rafaelproinfo@gmail.com");
    console.log("github.com/rafaelq80");
    console.log("*****************************************************");
}

/* Função de pausa entre as opções do menu */
function keyPress(): void {
    console.log(Colors.reset,"\nPressione enter para continuar...");
    Input.prompt();
}

main();
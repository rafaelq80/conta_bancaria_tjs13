import { ContaController } from './src/controller/ContaController';
import { ContaCorrente } from './src/model/ContaCorrente';
import { ContaPoupanca } from './src/model/ContaPoupanca';
import { Colors } from './src/util/Colors';
import { formatarMoeda } from './src/util/Currency';
import { Input } from "./src/util/Input";

// Cria um Objeto Global da Classe ContaController
const contas = new ContaController();

// Cria um array contendo os tipos de conta
const tipoContas = ["Conta Corrente", "Conta Poupanca"];

export function main() {

    let opcao: number;

    // Cria contas de teste para validar a aplicação
    criarContasTeste();

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
        console.log("            9 - Buscar Conta por Nome do Titular     ");
        console.log("            0 - Sair                                 ");
        console.log("                                                     ");
        console.log("*****************************************************");
        console.log("                                                     ", 
        Colors.reset);

        console.log("Entre com a opção desejada:");
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

                criarConta();

                keyPress()
                break;
            case 2:
                console.log(Colors.fg.whitestrong, "\n\nListar todas as Contas\n\n", Colors.reset);
                
                listarTodasContas();

                keyPress()
                break;
            case 3:
                console.log(Colors.fg.whitestrong, "\n\nConsultar dados da Conta - por número\n\n", Colors.reset);

                buscarContaPorNumero();

                keyPress()
                break;
            case 4:
                console.log(Colors.fg.whitestrong, "\n\nAtualizar dados da Conta\n\n", Colors.reset);

                atualizarConta();

                keyPress()
                break;
            case 5:
                console.log(Colors.fg.whitestrong, "\n\nApagar uma Conta\n\n", Colors.reset);
                
                deletarContaPorNumero();

                keyPress()
                break;
            case 6:
                console.log(Colors.fg.whitestrong, "\n\nSaque\n\n", Colors.reset);

                sacar();

                keyPress()
                break;
            case 7:
                console.log(Colors.fg.whitestrong, "\n\nDepósito\n\n", Colors.reset);

                depositar();

                keyPress()
                break;
            case 8:
                console.log(Colors.fg.whitestrong, "\n\nTransferência entre Contas\n\n", Colors.reset);

                transferir();

                keyPress()
                break;
            case 9:
                console.log(Colors.fg.whitestrong, "\n\nProcurar Conta por Nome do Titular\n\n", Colors.reset);

                procurarPorTitular();

                keyPress()
                break;
            default:
                console.log(Colors.fg.whitestrong, "\nOpção Inválida!\n", Colors.reset);

                keyPress()
        }
    }

}

/**
 * Opção 1: Cria uma nova conta (Corrente ou Poupança)
 */
function criarConta(){

    console.log("Digite o número da agência: ")
    const agencia = Input.questionInt("");

    console.log("Digite o nome do titular: ")
    const titular = Input.question("");

    console.log("Selecione o tipo da conta: ")
    const tipo = Input.keyInSelect(tipoContas, "", { cancel: false}) + 1;

    console.log("Digite o saldo da conta: ")
    const saldo = Input.questionFloat("");

    switch(tipo){
        case 1: // Cria um objeto da classe Conta Corrente
            console.log("Digite o limite da conta: ");
            const limite = Input.questionFloat("");
            contas.cadastrar(new ContaCorrente(
                contas.gerarNumero(), agencia, titular, tipo, saldo, limite));
        break;

        case 2: // Cria um objeto da classe Conta Poupança
            console.log("Digite o dia do aniversário da conta: ");
            const aniversario = Input.questionInt("");
            contas.cadastrar(new ContaPoupanca(
                contas.gerarNumero(), agencia, titular, tipo, saldo, aniversario));
        break;

    }

}

/**
 * Opção 2: Lista todas as contas cadastradas
 */
function listarTodasContas(): void{
    contas.listarTodas();
}

/**
 * Opção 3: Busca uma conta pelo número
 */
function buscarContaPorNumero(): void{

    // Solicita o número da conta
    console.log("Digite o número da conta: ");
    const numero = Input.questionInt("");

    // Localiza a conta a partir do número
    contas.procurarPorNumero(numero);

}

/**
 * Opção 4: Atualiza os dados de uma conta existente e
 * permite manter os valores atuais pressionando Enter.
 */
function atualizarConta(): void{

    // Solicita o número da conta
    console.log("Digite o número da conta: ");
    const numero = Input.questionInt("");

    // Verifica se a conta existe
    const conta = contas.buscarNoArray(numero);

    // Se a conta existir...
    if (conta !== null) {

        /**
         * Guarda os valores atuais da conta em variáveis
         * Exceto tipo que não será aramazenado em uma constante
         * porque não terá o seu valor modificado
         */
        let agencia: number = conta.agencia;
        let titular: string = conta.titular;
        const tipo: number = conta.tipo;
        let saldo: number = conta.saldo;

        /**
         * Atualização da Agência
         * 
         * 1. Exibe o valor atual da agência
         * 2. Se pressionar ENTER o valor atual será mantido
         * 3. Para o ENTER funcionar, passamos o parâmetro
         *    default input, que indica o valor padrão (solução mais simples)
         * 4. Caso contrário o valor atual será substituído
         * 5. Como estamos usando o  método questionInt, 
         *    a validação dos dados está garantida
         * 
         * Os demais atributos seguirão a mesma lógica, alterando
         * apenas a função de input, de acordo com o tipo.
         */
        console.log(`\nAgência atual: ${agencia}`);
        console.log("Digite o novo número da agência: ");
        console.log("(Pressione ENTER para manter o valor atual)");
        agencia = Input.questionInt("", { defaultInput: agencia });

        // Atualização da Titular
        console.log(`\nTitular atual: ${titular}`);
        console.log("Digite o novo nome do titular: ");
        console.log("(Pressione ENTER para manter o valor atual)");
        titular = Input.question("", { defaultInput: titular });

        // Atualização do Saldo
        console.log(`\nSaldo atual: ${formatarMoeda(saldo)}`);
        console.log("Digite o valor do novo saldo: ");
        console.log("(Pressione ENTER para manter o valor atual)");
        saldo = Input.questionFloat("", { defaultInput: saldo });

        // Atualização do Tipo
        switch(tipo){
            case 1: // Conta Corrente
                
                /**
                 * Como o objeto 'conta' é do tipo genérico Conta, 
                 * precisamos converter o objeto (casting) para o tipo 
                 * ContaCorrente.
                 * Isso é necessário porque apenas a classe ContaCorrente 
                 * possui o atributo 'limite'.
                 * Após o casting, conseguimos acessar o atributo limite.
                 * O mesmo será feito com o atributo aniversario da classe
                 * ContPoupanca
                 */
                let limite: number = (conta as ContaCorrente).limite;

                // Atualização do Limite
                console.log(`\nLimite atual: ${formatarMoeda(limite)}`);
                console.log("Digite o valor do novo limite: ");
                console.log("(Pressione ENTER para manter o valor atual)");
                limite = Input.questionFloat("", { defaultInput: limite });

                 /**
                 * Na atualização não utilizamos o método gerarNumero() no atributo 'numero'.
                 * O número da conta já existe e identifica unicamente essa conta.
                 * 
                 * Se chamarmos o método 'gerarNumero()', um novo número seria criado e 
                 * substituiria o antigo, o que impediria a atualização dos dados.
                 * 
                 * O mesmo vale para a classe ContaPoupanca
                 */
                contas.atualizar(new ContaCorrente(numero, agencia, titular, tipo, saldo, limite));
            break;

            case 2: // Conta Poupança
                    
                let aniversario: number = (conta as ContaPoupanca).aniversario;

                // Atualização do Aniversário
                console.log(`\nAniversário Atual: ${aniversario}`);
                console.log("Digite o novo dia do aniversário: ");
                console.log("(Pressione ENTER para manter o valor atual)");
                aniversario = Input.questionInt("", { defaultInput: aniversario });

                contas.atualizar(new ContaPoupanca(numero, agencia, titular, tipo, saldo, aniversario));

            break;
        }

    }else{
        console.log(Colors.fg.red, `A conta número ${numero} não foi encontrada!`, Colors.reset);
    }
}

/**
 * Opção 5: Apaga uma conta do sistema
 */
function deletarContaPorNumero(): void{

    // Solicita o número da conta
    console.log("Digite o número da conta: ");
    const numero = Input.questionInt("");
    
    // Verifica se a conta existe
    const conta = contas.buscarNoArray(numero);

    // Se a conta existir...
    if(conta !== null){
        
        // Exibe a mensagem de confirmação da exclusão (Yes ou No)
        console.log(Colors.fg.whitestrong, 
            `\nTem certeza que deseja deletar a conta número ${numero} [y/n]?`, Colors.reset);
        const confirma = Input.keyInYNStrict("");

        // Se cofirmar (y), deleta a conta
        if (confirma)
            contas.deletar(numero);
        else
            console.log(Colors.fg.red,"\nOperação cancelada!", Colors.reset);
    

    }else{
        console.log(Colors.fg.red, `A conta número ${numero} não foi encontrada!`, Colors.reset);
    }

}

function sacar(): void{

    console.log("Digite o número da conta: ");
    const numero = Input.questionInt("");
    
    const conta = contas.buscarNoArray(numero);

    if(conta !== null){
        console.log("Digite o valor do saque: ");
        const valor = Input.questionFloat("");

        contas.sacar(numero, valor);
    }else{
        console.log(Colors.fg.red, `A conta número ${numero} não foi encontrada!`, Colors.reset);
    }
}

function depositar(): void{

    console.log("Digite o número da conta: ");
    const numero = Input.questionInt("");
    
    const conta = contas.buscarNoArray(numero);

    if(conta !== null){
        console.log("Digite o valor do depósito: ");
        const valor = Input.questionFloat("");

        contas.depositar(numero, valor);
    }else{
        console.log(Colors.fg.red, `A conta número ${numero} não foi encontrada!`, Colors.reset);
    }
}

function transferir(): void{

    console.log("Digite o número da Conta de Origem: ");
    const numeroOrigem = Input.questionInt("");
    
    console.log("Digite o número da Conta de Destino: ");
    const numeroDestino = Input.questionInt("");

    const contaOrigem = contas.buscarNoArray(numeroOrigem);
    const contaDestino = contas.buscarNoArray(numeroDestino);

    if(contaOrigem === null){

        console.log(Colors.fg.red, `A Conta de Origem número ${numeroOrigem} não foi encontrada!`, Colors.reset);

    }else if(contaDestino === null)    {

        console.log(Colors.fg.red, `A Conta de Destino número ${numeroDestino} não foi encontrada!`, Colors.reset);

    }else{
        console.log("Digite o valor da Transferência: ");
        const valor = Input.questionFloat("");

        contas.transferir(numeroOrigem, numeroDestino, valor);
    }
}

function procurarPorTitular(): void{

    // Solicita o nome do titular
    console.log("Digite o Nome do Titular: ");
    const titular = Input.question("");

    // Localiza a conta a partir do nome do titular
    contas.procurarPorTitular(titular);
}

/**
 * Dados da pessoa desenvolvedora
 */
function sobre(): void {
    console.log("\n*****************************************************");
    console.log("Projeto Desenvolvido por: ");
    console.log("Rafael Antônio de Queiróz - rafaelproinfo@gmail.com");
    console.log("github.com/rafaelq80");
    console.log("*****************************************************");
}

/**
 * Função de pausa entre as opções do menu
 */
function keyPress(): void {
    console.log(Colors.reset,"\nPressione enter para continuar...");
    Input.prompt();
}

/**
 * Função para inserir objetos das Classes ContaCorrente e Conta Poupanca
 * no sistema, para realizar testes
 */
function criarContasTeste(): void{
    
    // Instâncias da Classe ContaCorrente
    contas.cadastrar(new ContaCorrente(contas.gerarNumero(), 1234, 'Amanda Magro', 1, 1000000.00, 100000.00));
    contas.cadastrar(new ContaCorrente(contas.gerarNumero(), 4578, 'João da Silva', 1,  1000.00, 100.00));

    // Instâncias da Classe ContaPoupança
    contas.cadastrar(new ContaPoupanca(contas.gerarNumero(), 5789, "Geana Almeida", 2, 10000, 10));
    contas.cadastrar(new ContaPoupanca(contas.gerarNumero(), 5698, "Jean Lima", 2, 15000, 15));

}

main();
import * as iconv from 'iconv-lite'

/**
 * Classe Input - Solução para leitura de caracteres acentuados com o readline-sync no Windows
 *
 * 🔴 PROBLEMA:
 * - No Windows, o console usa a codificação CP850 (não UTF-8)
 * - Quando você digita "João", o console envia bytes em CP850
 * - O Node.js interpreta como UTF-8 e fica "Joo" (perde os acentos)
 *
 * ✅ SOLUÇÃO:
 * - Esta classe converte automaticamente CP850 → UTF-8
 * - Você digita "João" e a variável recebe "João" corretamente!
 */
export class Input {
	/** Controla se já detectou o encoding (detecta apenas uma vez) */
	private static configurado = false

	/** Armazena o encoding do console (cp850, cp1252 ou utf8) */
	private static encodingConsole: string = 'cp850'

	/**
	 * 🔍 Detecta qual encoding o console do Windows está usando
	 *
	 * O que é encoding?
	 * - É a forma como o computador transforma letras em números
	 * - Diferentes encodings usam números diferentes para "ã", "ç", "é"
	 *
	 * Como funciona:
	 * 1. Executa o comando 'chcp' no Windows (mostra qual encoding está ativo)
	 * 2. Lê o número do Code Page:
	 *    - 65001 = UTF-8 (encoding moderno, funciona bem)
	 *    - 850 = CP850 (padrão no Brasil, causa problemas)
	 *    - 1252 = CP1252 (Windows Latin-1)
	 * 3. Salva essa informação para usar depois
	 *
	 * ⚠️ Esta detecção acontece apenas UMA vez (na primeira chamada de qualquer método)
	 */
	private static detectarEncoding(): void {
		// Se já detectou antes, não precisa fazer novamente
		if (this.configurado) return

		// Só precisa detectar no Windows (Linux/Mac já usam UTF-8 automaticamente)
		if (process.platform === 'win32') {
			try {
				// Executa o comando 'chcp' no terminal do Windows
				const { execSync } = require('child_process')
				const resultado = execSync('chcp', {
					encoding: 'utf8',
				}).toString()

				// Extrai o número do code page
				// Exemplo: de "Página de código ativa: 850" pega só o "850"
				const match = resultado.match(/\d+/)

				if (match) {
					const codePage = match[0]

					// Define o encoding baseado no code page encontrado
					this.encodingConsole =
						codePage === '65001'
							? 'utf8' // UTF-8 (já funciona bem)
							: codePage === '850'
								? 'cp850' // CP850 (precisa conversão)
								: codePage === '1252'
									? 'cp1252' // Windows Latin-1
									: `cp${codePage}` // Outros code pages
				}
			} catch (error) {
				// Se algo der errado, assume CP850 (mais comum no Brasil)
				this.encodingConsole = 'cp850'
			}
		} else {
			// Linux e Mac sempre usam UTF-8 (não precisa conversão)
			this.encodingConsole = 'utf8'
		}

		// Marca como já configurado (não vai detectar novamente)
		this.configurado = true
	}

	/**
	 * 📝 Lê uma linha de TEXTO com acentuação correta
	 *
	 * 💡 QUANDO USAR:
	 * - Para ler nomes: "João", "José", "María"
	 * - Para ler endereços: "Rua São Paulo"
	 * - Para ler qualquer texto com acentos
	 *
	 * 📖 EXEMPLOS:
	 * const nome = Input.question('Digite seu nome: ')
	 * const cidade = Input.question('Digite sua cidade: ', { defaultInput: 'São Paulo' })
	 *
	 * 🔧 COMO FUNCIONA INTERNAMENTE:
	 * 1. Detecta qual encoding o console está usando
	 * 2. SEMPRE lê os bytes brutos (sem interpretar)
	 * 3. Converte esses bytes do encoding correto → UTF-8
	 * 4. Retorna a string com acentos corretos!
	 */
	static question(pergunta: string, config?: any): string {
		// Detecta o encoding do console (só na primeira vez)
		this.detectarEncoding()

		const readlinesync = require('readline-sync')

		// Converte a PERGUNTA de UTF-8 → encoding do console
		const bufferPergunta = iconv.encode(pergunta, this.encodingConsole)
		const perguntaConvertida = bufferPergunta.toString('binary')

		// SEMPRE usa conversão de encoding, mesmo em UTF-8
		// Isso garante compatibilidade total com acentos
		// Configura para ler bytes brutos (sem interpretar como texto)
		let configFinal = {
			encoding: 'binary', // 'binary' = lê bytes sem conversão
			...config, // Adiciona outras configurações do usuário
		}

		// Se tem valor padrão (defaultInput), precisa converter também
		if (config?.defaultInput) {
			// Converte o valor padrão de UTF-8 → encoding do console
			const bufferDefault = iconv.encode(
				config.defaultInput,
				this.encodingConsole,
			)
			configFinal.defaultInput = bufferDefault.toString('binary')
		}

		// Lê a resposta como 'binary' (bytes brutos)
		// Usa a pergunta CONVERTIDA
		const respostaRaw = readlinesync.question(perguntaConvertida, configFinal)

		// Converte os bytes do encoding do console → UTF-8 (para usar no JavaScript)
		const buffer = Buffer.from(respostaRaw, 'binary')
		return iconv.decode(buffer, this.encodingConsole)
	}

	/**
	 * 🔢 Lê um número INTEIRO com validação automática
	 *
	 * 💡 QUANDO USAR:
	 * - Para idade: 25, 30, 18
	 * - Para quantidade: 5, 10, 100
	 * - Para opções de menu: 1, 2, 3
	 * - Para qualquer número SEM casas decimais
	 *
	 * 📖 EXEMPLOS:
	 * const idade = Input.questionInt('Digite sua idade: ')
	 * const opcao = Input.questionInt('Escolha (1-3): ', { limitMessage: 'Opção inválida!' })
	 * const quantidade = Input.questionInt('Quantidade: ', { defaultInput: 1 })
	 *
	 * ✅ VANTAGENS:
	 * - Só aceita números inteiros (rejeita letras automaticamente)
	 * - Rejeita números decimais (1.5 não é aceito)
	 * - Pode ter valor padrão (usuário só aperta ENTER)
	 * - Sempre mostra mensagem de erro quando digitar valor inválido
	 */
	static questionInt(pergunta: string, config?: any): number {
		const limitMessage = config?.limitMessage || 'Digite um número inteiro!'
		const defaultInput = config?.defaultInput

		while (true) {
			// Usa o question() que já funciona com acentos
			const respostaStr = this.question(pergunta, {
				defaultInput: defaultInput !== undefined ? String(defaultInput) : undefined
			})

			// Se está vazio e tem defaultInput, retorna o padrão
			if (respostaStr.trim() === '' && defaultInput !== undefined) {
				return defaultInput
			}

			// Tenta converter para número inteiro
			const numero = parseInt(respostaStr.trim(), 10)

			// Valida se é um número inteiro válido
			if (!isNaN(numero) && numero.toString() === respostaStr.trim()) {
				return numero
			}

			// Mostra mensagem de erro
			console.log(limitMessage)
		}
	}

	/**
	 * 💰 Lê um número DECIMAL com validação automática
	 *
	 * 💡 QUANDO USAR:
	 * - Para preço: 19.90, 100.50
	 * - Para altura: 1.75, 1.80
	 * - Para peso: 70.5, 65.3
	 * - Para nota: 8.5, 9.0
	 * - Para qualquer número COM casas decimais
	 *
	 * 📖 EXEMPLOS:
	 * const preco = Input.questionFloat('Digite o preço: ')
	 * const altura = Input.questionFloat('Digite sua altura (m): ')
	 * const nota = Input.questionFloat('Digite a nota: ', { defaultInput: 0.0 })
	 *
	 * ✅ VANTAGENS:
	 * - Aceita números decimais (8.5, 10.75)
	 * - Aceita números inteiros também (10 vira 10.0)
	 * - Rejeita letras automaticamente
	 * - Pode ter valor padrão
	 * - Sempre mostra mensagem de erro quando digitar valor inválido
	 */
	static questionFloat(pergunta: string, config?: any): number {
		const limitMessage = config?.limitMessage || 'Digite um número decimal.'
		const defaultInput = config?.defaultInput

		while (true) {
			// Usa o question() que já funciona com acentos
			const respostaStr = this.question(pergunta, {
				defaultInput: defaultInput !== undefined ? String(defaultInput) : undefined
			})

			// Se está vazio e tem defaultInput, retorna o padrão
			if (respostaStr.trim() === '' && defaultInput !== undefined) {
				return defaultInput
			}

			// Tenta converter para número decimal
			const numero = parseFloat(respostaStr.trim())

			// Valida se é um número válido
			if (!isNaN(numero) && isFinite(numero)) {
				return numero
			}

			// Mostra mensagem de erro
			console.log(limitMessage)
		}
	}

	/**
	 * 📋 Exibe um menu de opções para o usuário escolher
	 *
	 * 💡 QUANDO USAR:
	 * - Para menu principal do programa
	 * - Para escolher entre várias opções
	 * - Para campos do tipo SELECT (como em formulários)
	 *
	 * 📖 EXEMPLO:
	 * const opcoes = ['Cadastrar', 'Listar', 'Sair']
	 * const escolha = Input.keyInSelect(opcoes, 'Escolha uma opção: ')
	 *
	 * if (escolha === 0) {
	 *   console.log('Você escolheu Cadastrar')
	 * } else if (escolha === 1) {
	 *   console.log('Você escolheu Listar')
	 * } else if (escolha === 2) {
	 *   console.log('Você escolheu Sair')
	 * } else {
	 *   console.log('Você cancelou') // escolha === -1
	 * }
	 *
	 * ✅ COMO FUNCIONA:
	 * - Mostra as opções numeradas automaticamente [1] [2] [3]
	 * - Usuário digita o número e aperta ENTER
	 * - Retorna o ÍNDICE da escolha (começa em 0)
	 * - Retorna -1 se o usuário cancelar (CANCEL ou ESC)
	 */
	static keyInSelect(
		opcoes: string[],
		pergunta: string,
		config?: any,
	): number {
		// Detecta o encoding do console (só na primeira vez)
		this.detectarEncoding()

		const readlinesync = require('readline-sync')

		// Converte a PERGUNTA de UTF-8 → encoding do console
		const bufferPergunta = iconv.encode(pergunta, this.encodingConsole)
		const perguntaConvertida = bufferPergunta.toString('binary')

		// Converte cada OPÇÃO de UTF-8 → encoding do console
		const opcoesConvertidas = opcoes.map((opcao) => {
			const bufferOpcao = iconv.encode(opcao, this.encodingConsole)
			return bufferOpcao.toString('binary')
		})

		// Usa a pergunta e opções convertidas
		return readlinesync.keyInSelect(opcoesConvertidas, perguntaConvertida, config)
	}

	/**
	 * ❓ Faz uma pergunta SIM ou NÃO (modo estrito)
	 *
	 * 💡 QUANDO USAR:
	 * - Para confirmar ações: "Deseja realmente excluir?"
	 * - Para perguntas sim/não: "Você é maior de idade?"
	 * - Quando precisa de uma resposta clara (Y ou N)
	 *
	 * 📖 EXEMPLOS:
	 * const confirmou = Input.keyInYNStrict('Deseja continuar? ')
	 * if (confirmou) {
	 *   console.log('Usuário confirmou!')
	 * } else {
	 *   console.log('Usuário negou!')
	 * }
	 *
	 * ✅ COMO FUNCIONA:
	 * - Usuário deve digitar Y (Yes/Sim) ou N (No/Não)
	 * - Não aceita outras teclas (é "estrito")
	 * - Retorna true para Y, false para N
	 */
	static keyInYNStrict(pergunta: string, config?: any): boolean {
		// Detecta o encoding do console (só na primeira vez)
		this.detectarEncoding()

		const readlinesync = require('readline-sync')

		// Converte a PERGUNTA de UTF-8 → encoding do console
		const bufferPergunta = iconv.encode(pergunta, this.encodingConsole)
		const perguntaConvertida = bufferPergunta.toString('binary')

		// Usa a pergunta convertida
		return readlinesync.keyInYNStrict(perguntaConvertida, config)
	}

	/**
	 * ⏸️ Pausa o programa e aguarda o usuário pressionar ENTER
	 *
	 * 💡 QUANDO USAR:
	 * - Para pausar o programa: "Pressione ENTER para continuar..."
	 * - Para o usuário ler mensagens antes de limpar a tela
	 * - Para criar "breakpoints" no fluxo do programa
	 *
	 * 📖 EXEMPLO:
	 * console.log('Cadastro realizado com sucesso!')
	 * console.log('Pressione ENTER para voltar ao menu...')
	 * Input.prompt()
	 * // Aqui o programa pausa até o usuário apertar ENTER
	 * console.clear() // Limpa a tela
	 *
	 * ✅ COMO FUNCIONA:
	 * - O programa para e aguarda
	 * - Usuário aperta ENTER
	 * - O programa continua
	 */
	static prompt(): void {
		const readlinesync = require('readline-sync')

		readlinesync.prompt()
	}

	/**
	 * 🔍 Retorna qual encoding está sendo usado
	 *
	 * 💡 QUANDO USAR:
	 * - Para DEBUGAR problemas de acentuação
	 * - Para verificar se está usando UTF-8 ou CP850
	 * - Para entender por que os acentos não aparecem
	 *
	 * 📖 EXEMPLO:
	 * console.log('Encoding atual:', Input.getEncoding())
	 * // Possíveis respostas:
	 * // - "utf8" (não precisa conversão, acentos funcionam)
	 * // - "cp850" (precisa conversão, comum no Windows Brasil)
	 * // - "cp1252" (precisa conversão, Windows Latin-1)
	 */
	static getEncoding(): string {
		// Detecta o encoding se ainda não foi detectado
		this.detectarEncoding()

		return this.encodingConsole
	}
}
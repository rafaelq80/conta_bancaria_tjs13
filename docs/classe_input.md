# Documentação — Classe `Input`

### Leitura de dados no terminal com suporte a acentuação no Windows

<br />

A classe **`Input`** é um **utilitário para leitura de dados do usuário no terminal**, criado para resolver um problema comum ao usar a biblioteca JavaScript **`readline-sync`** com o **Node.js no Windows**: a **quebra de acentuação em textos digitados**.

Ela atua como uma **camada de compatibilidade**, garantindo que textos com acentos (como *João, José, Ação*) sejam lidos corretamente, independentemente do sistema operacional.

<br />

## Por que essa classe foi criada?



### O problema real

Ao usar a biblioteca `readline-sync` no Windows, ocorre um erro de codificação de caracteres.

**Exemplo do problema:**

```typescript
import readlinesync from 'readline-sync';

const nome = readlinesync.question("Digite seu nome: ");
// Usuário digita: João
// Resultado: "Joo" ❌ (acentuação perdida)
```

### O motivo técnico

* O **Windows** usa a codificação **CP850**
* O **Node.js** trabalha com **UTF-8**
* Sem conversão, os caracteres especiais são corrompidos

<br />

## A solução oferecida pela Classe `Input`



A classe **`Input`** converte automaticamente o texto digitado para **UTF-8**, garantindo a leitura correta.

```typescript
import { Input } from "./util/Input";

const nome = Input.question("Digite seu nome: ");
// Usuário digita: João
// Resultado: "João" ✅
```

### Em termos simples:

```
Usuário digita → Console Windows (CP850)
Classe Input converte → UTF-8
Aplicação recebe → Texto correto ✅
```

<br />

## Quando usar a Classe `Input`?



Use a classe `Input` quando:

* Seu projeto roda no **terminal**
* Precisa ler dados do usuário
* Deseja **evitar problemas com acentuação**
* Quer **validação pronta para números e menus**
* Trabalha com **Node.js no Windows**

É ideal para:

* Projetos educacionais
* Sistemas CLI
* Exercícios de lógica
* Menus interativos no terminal

<br />

## Instalação



### 1️⃣ Instalar dependências

```bash
npm install iconv-lite
npm install --save-dev @types/iconv-lite
```

### 2️⃣ Criar o arquivo

Crie o arquivo `Input.ts` em:

```text
src/util/Input.ts
```

### 3️⃣ Importar no projeto

```typescript
import { Input } from "./src/util/Input";
```

<br />

## Como Usar — Exemplos Práticos



### 📌 Ler texto

```typescript
const nome = Input.question("Digite seu nome: ");
```

✔ Aceita acentos
✔ Aceita Enter vazio

<br />

### 📌 Ler número inteiro

```typescript
const idade = Input.questionInt("Digite sua idade: ");
```

✔ Aceita: 10, 25, -3
❌ Rejeita: letras, números decimais

<br />

### 📌 Ler número decimal

```typescript
const saldo = Input.questionFloat("Digite o saldo: ");
```

✔ Aceita: `1000.50` ou `1000,50`
❌ Rejeita texto

<br />

### 📌 Criar menu de seleção

```typescript
const opcoes = ['Conta Corrente', 'Conta Poupança'];

const escolha = Input.keyInSelect(
  opcoes, 
  "Escolha o tipo:", 
  { cancel: false }
);
```

🔹 Retorna o **índice do array** (0, 1, 2...)

<br />

### 📌 Pausar o programa

```typescript
console.log("Pressione ENTER para continuar...");
Input.prompt();
```

<br />

> [!WARNING]
>
> Quando o texto exibido no **prompt** possui **acentos**, recomenda-se imprimir a mensagem antes:
>
> ```typescript
> console.log("Entre com a opção desejada:");
> const opcao = Input.questionInt("");
> ```
>
> 📌 **Motivo:** a conversão funciona apenas na **entrada**, mas o **prompt do Windows** pode falhar ao **exibir acentos**.

<br />

## Métodos Disponíveis

| Método            | Para quê serve  | Retorno |
| ----------------- | --------------- | ------- |
| `question()`      | Ler texto       | String  |
| `questionInt()`   | Ler inteiro     | Number  |
| `questionFloat()` | Ler decimal     | Number  |
| `keyInSelect()`   | Menu interativo | Índice  |
| `prompt()`        | Pausar execução | void    |
| `getEncoding()`   | Debug encoding  | String  |

<br />

## Exemplo Completo:

```typescript
import { Input } from "./util/Input";

const nome = Input.question("Digite seu nome: ");
const idade = Input.questionInt("Digite sua idade: ");
const saldo = Input.questionFloat("Digite o saldo inicial: ");

console.log("\nResumo:");
console.log(`Nome: ${nome}`);
console.log(`Idade: ${idade}`);
console.log(`Saldo: R$ ${saldo}`);

console.log("\nPressione ENTER para sair...");
Input.prompt();
```




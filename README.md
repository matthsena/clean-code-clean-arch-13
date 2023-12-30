# Aula 1
## Code smells - As maiores red flags 🚩
- Nome estranhos de variáveis, métodos e classes
- Números mágicos (Literais no meio do código)
- Comentários (Se resolve com variáveis explicativas)
- Código morto
- Linhas em branco dentro de métodos
  - Não existe uma regra bem definida, normalmente utilizam há muita responsábilidade onde não deveria, nesses casos: extrair um método é uma solução melhor
- Código duplicado
- Longa lista de parâmetros
  - Soluções: Utilizar objeto como parâmetro; Extraír classe;
- Variável declarada longe da utilização
- Condições confusas
  - Soluções: Remover condição aninhada por cláusula guarda; Consolidar expressão condicional; Introduzir ternário (casos específicos apenas);
- Falta de tratamento de excessões
- Substituir tratamento de exceção por condição

## Testes - TDD e automação de testes em geral 🧪
- Escrever testes requer disciplina, a falta deles denota indisciplina
- Ansiedade de ver tudo funcionando
- Muitas vezes o design e a arquitetura não favorecem a automação dos testes
### Testes são um conjunto de 3 coisas
- **Given/Arrange**: Definição de todas as informações necessárias para executar o comportamento que será testado
- **When/Act**: Executar o comportamento
- **Then/Assert**: Verificar o que aconteceu após a execução, comparando as informações retornadas com a expectativa que foi criada
### Padrão FIRST
- **Fast**: Execução rápida
- **Independent**: Nenhum teste deve depender de outro
- **Repeatable**: O resultado deve ser repitivel, independente de variáveis externas
- **Self-validating**: O próprio teste deve ter uma saída bem definida que é valida ou não, fazendo com que ele passe ou falhe
- **Timely**: Preferencialmente escrito antes do código fonte

### TDD
É um método para construir software, não para testá-lo, guiado por cenários.

<img src="https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/7cbca7f0-d57c-44e9-bbed-d6a4507cbdaf" width="50%">

#### As 3 leis do TDD
- Você não pode escrever nenhum código até ter escrito um teste que detecte uma possível falha
- Você não pode escrever mais testes de unidade do que o suficiente para detectar a falha
- Você não pode escrever mais código do que o suficiente para passar nos testes

### Mais sobre testes

- Test patterns como stub e mock nem sempre são ruins
- Use o teste que for mais viável para sua realidade (unidade, integração ou E2E)
- Técnica de testes parametrizados
- Teoria das janelas quebradas

# Aula 2
## SOLID - SRP (Single responsability principle)
Se uma classe tem mais de uma responsabilidade**, as responsabilidades podem se tornar acopladas e mexer em uma pode impactar nas outras.

** responsabilidade no contexto = motivo de mudança.

## Como resolver acoplamento com banco de dados em testes?
** Test Patterns: exemplo de bibliotecas => sinon / stub ou mock

## Arquitetura hexagonal
A arquitetura hexagonal ajuda a separar melhor as responsabilidades, auxilia principalmente em testes. O ideal é que a aplicação possa ser testada em isolamento de eventuais run-time devices e banco de dados.

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/590c3831-831c-4bcd-9139-e30a80cff1c5)

As regras de negocio são isoladas de drivers e recursos.

### Ports and Adapters
Temos um componente que vai ter alguns tipos de recursos que ele consome (banco de dados, API externa, file system e etc), e para cada recurso que ele irá consumir, ele expõe uma porta que ele conhece, qual o recurso irá implementar, o componente não conhece diretamente o recurso e nem o recurso o componente. 

** Dependency inversion principle

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/60fa1fd9-9b38-4f74-a0eb-2a9b3b137efb)

O componente expõe também uma interface para os Drivers (HTTP, Fila, CLI, Tests e etc), porém o componente não conhece os Drivers, dessa forma o componente fica mais isolado.
![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/ef03a36e-64dc-4712-956f-c8eb1241016b)

**Em suma o componente não conhece os recursos nem os drivers, além da regra de negócio, expõe apenas interfaces e portas**

Uma application é basicamente um grupo com vários componentes, todos eles expõem algo na fronteira, mas podem ter outros relacionamentos internos ao hexagono.

**Em algumas literaturas recursos podem ser chamados de "Driven"**

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/f80a736f-3e38-4ac6-adbf-00ed64cc9075)

** As portas são tudo que o componente expõe e os adapters tudo o que se conecta ao componente

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/dff40e96-ac47-4a9a-8fe9-c4a43ed1b60d)

### Table Data Gatewey (ou DAO)
** Gateway é um objeto que encapsula acesso a um sistema externo
** (DAO) Data Access Object é um padrão onde se mapeia as operações feitas na tabela (CRUD)

## Test Patterns - Stub, Spy e Mock
Em suma temos 5 tipos de test patterts (Dummy, Stubs, Spies, Mocks e Fake)
** Dummy: Ajuda a completar a lista de parâmetros

### Stub
**Explicação formal:** Objetos que retornam respostas prontas, definidas para um determinado teste, porquestão de performance ou segurança (exemplo: quando eu executar o método fazer pedido preciso que o método pagar cotação do dólar retorne R$ 3,00)

**Matheus's version:** Se eu quero fazer o teste sem depender direto do banco de dados, tenho que de alguma forma sobrescrever o comportamento das funções que o utilizam, isso é o STUB
Ou seja, o stub você passa por cima de um comportamento em especifico e dizer o que ele retorna; Sobscreve o que você faz


### Spie
**Explicação formal:** Objetos que "espionam" a execução do método e armazenam os resultados para verificação posterior (exemplo: quando eu executar o método fazer pedido preciso saber se o método enviar email foi invocado internamente e com quais parâmetros)

**Matheus's version:** Quero saber se uma fn em especifica foi chamada, com quais parâmetros e quantas vezes, basicamente verificamos isso, em momento algum alteramos o seu comportamento, apenas verificamos os parâmetros. Registra o que aconteceu e depois você consulta

### Mock
**Explicação formal:** Objetos similares a stubs e spies, permitem que você diga exatamente o que quer que ele faça e o teste vai quebrar se isso não acontecer

**Matheus's version:** O Mock reune o stub e o spy no mesmo objeto porém normalmente você programa no mock o que você quer que seja retornado; Você programa no mock exatamente o comportamento dele

### Fake
**Explicação formal:** Objetos que tem implementações que simulam o funcionamento da instância real, que seria utilizada em produção (exemplo: uma base de dados em memória)


**Matheus's version:** O Fake vai permitir que a gente passe a dependencia que queremos, sobrescrever uma variável fora, podemos definir uma classe anonima e criar nossas próprias versões de algumas implementações, ou seja, podemos passar dependencias falsas.

Muito utilizado em objetos que simulam uma situação real

## SOLID - DIP (Dependency inversion principle)
Diz respeito a design, compile time, a forma que as dependencias se relacionam
Identificar se algo High Level está ou não dependendo de algo Low Level

Como identificar low level ou high level? Quanto mais indepentende de recursos externos, mais high level é

Quando falamos de DIP, a classe não pode ter depêndencia de nenhuma classe com "mais low level" do que ela

** Source Code Dependency são os imports
** Flow of control é o fluxo de execução

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/3685a7fe-7685-4f94-aa79-1a4a2647e85d)

A forma de quebrar isso para aplicar DIP é fazer essa construção:

A interface é um contrato, ou seja, não dependemos da implementação concreta, ou seja, podemos passar nossa propria implementação concreta nos testes, como no padrão fake.

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/ef17a2b8-4c4c-466a-b03e-ac3ce0a667e5)

No trecho de código abaixo a classe Signup não sabe mais quem é o AccountDAO, removemos o construtor new da classe, ele conhece apenas a implementação

```ts
	constructor(accountDAO: AccountDAO) {
		this.accountDAO = accountDAO;
	}
```
Podemos aplicar essa separação de low level e high level de forma mais simples, apenas separando o que é recurso externo

## SOLID - ISP (Interface segregation principle)
A quem a interface serve? Qual razão de existência dela? Ela serve quem usa, não quem implementa

Imagina uma impressora que tenha um objeto chamado JOB, e todos os processos conhecem esse objeto, isso indica um acoplamento, se JOB mudar, o que acontece com os outros? Eles quebram, para onde a seta aponta, é a direção do acoplamento.

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/f90fa80c-91d6-456f-9ca1-032c93afe276)

Interface segregation vem de uma epoca que tinha um tempo muito grande de compilação (anos 80), pois quando "JOB" mudava, ele forçava todo mundo recompilar

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/a6288a8e-0112-48c3-8539-75f5fc04ad21)

Após ISP:

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/a9f985d2-8546-477f-aa2b-cf023266d3af)

E se eu colocasse no meio de cada relação uma interface e para cada processo eu ter uma versão daquele "JOB" especifica? Apenas com o que é utilizado, assim quando alteramos algo em uma interface, não quebra todos os processos, não preciso recompila-los, apenas os que dependem do que foi alterado.

Com isso diminuimos a fragilidade do sistema, lembrando que o SOLID vem com o objetivo de deixar os sistemas menos frágeis, com maior facilidade para manutenção, testes e etc

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/cc0283dc-8575-4de6-bcee-96a9d3bb5c89)

## Testes de Unidade vs. Integração

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/31c0f716-aaa4-42a4-9b90-c9183da28d95)

Diferenças entre os testes de unidade x integração:

- Quando vai para o banco de dados, ele é um exemplo de teste de integração, quando mistura camadas é um teste de integração
- Teste de unidade é um teste mais eficiente e mais rápido, além de rodar em mais isolamento

Testes de integração ou unidade não devem ser separados como "true" ou "false", ou é um ou é outro, essa visão é um pouco errada, seguindo o que diz Martin Fowler, temos uma especie de graduação, afunilamento, estreitamento, quanto mais estreito o teste fica, mais perto da unidade e longe da integração ele é, existe um ponto de ruptura onde você atravessa camadas. Podemos ter testes de unidade solitários, onde a classe é testada em total isolamento, ou sociável, onde a classe é testada com as outras dependencias que ela tem. Já o de integração pode ser estreito, caso tenha muitos recursos mockados ou abrangente, com nenhum recurso mockado.

![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/b2ed2f36-8f5a-436f-9c43-813eefa892e5)

Conforme eu estou mais perto das dependencias, maior o funil, quanto mais perto da classe isolada, mais perto da unidade.


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

### Test Pyramid
![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/31c0f716-aaa4-42a4-9b90-c9183da28d95)

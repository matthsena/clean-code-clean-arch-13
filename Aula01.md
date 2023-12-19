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
![image](https://github.com/matthsena/clean-code-clean-arch-14/assets/36769242/7cbca7f0-d57c-44e9-bbed-d6a4507cbdaf)
#### As 3 leis do TDD
- Você não pode escrever nenhum código até ter escrito um teste que detecte uma possível falha
- Você não pode escrever mais testes de unidade do que o suficiente para detectar a falha
- Você não pode escrever mais código do que o suficiente para passar nos testes

### Mais sobre testes

- Test patterns como stub e mock nem sempre são ruins
- Use o teste que for mais viável para sua realidade (unidade, integração ou E2E)
- Técnica de testes parametrizados
- Teoria das janelas quebradas

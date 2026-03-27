# Layout da Matriz Curricular Interativa

Este documento descreve a estrutura visual estática do arquivo HTML gerado pelo utilitário MCI. As informações aqui contidas são genéricas e aplicáveis a qualquer currículo de graduação.

---

## Estrutura Geral da Página

A página é dividida nas seguintes regiões principais, organizadas verticalmente:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CABEÇALHO DO CURSO                       │
├─────────────────────────────────────────────────────────────────┤
│                     BARRA DE TURNOS (opcional)                  │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┤
│  I   │  II  │ III  │  IV  │  V   │  VI  │ VII  │ VIII │        │
│      │      │      │      │      │      │      │      │LEGENDA │
│      │      │  G   │  R   │  A   │  D   │  E   │      │        │
│      │      │      │      │      │      │      │      │        │
├──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┤        │
│                   RODAPÉ DA GRADE (eletivas)          │        │
└────────────────────────────────────────────────────────┴────────┘
```

---

## 1. Cabeçalho do Curso

- Ocupa toda a largura da área útil da página.
- Fundo em cor de destaque (ex.: azul escuro) com texto claro.
- Exibe o nome completo do curso em fonte grande e em negrito.
- Pode exibir o código do currículo e o semestre de início de vigência em fonte menor, ao lado do nome.
- Logo da instituição posicionada à direita do cabeçalho, fora da área da grade.

---

## 2. Barra de Turnos *(opcional)*

- Linha horizontal abaixo do cabeçalho, presente quando os níveis são divididos em turnos diferentes (ex.: manhã e noite).
- Subdividida em blocos coloridos, cada bloco abrangendo os níveis correspondentes ao turno indicado.
- Cor distinta para cada turno; rótulo de texto centralizado no bloco.

---

## 3. Grade de Níveis

Região central da página; contém todas as colunas de nível (semestres).

### 3.1 Colunas de Nível

- Uma coluna por nível do currículo (tipicamente 8 colunas).
- Todas as colunas têm a mesma largura fixa.
- Espaçamento horizontal entre colunas deve ser amplo o suficiente para acomodar as linhas de pré-requisito que passam entre elas.

### 3.2 Cabeçalho de Coluna

Cada coluna possui um cabeçalho fixo no topo, contendo:

| Elemento | Detalhe |
|---|---|
| Número do nível | Em algarismos romanos maiúsculos (I, II, III…), centralizado |
| Total de créditos | Soma dos créditos de todas as disciplinas do nível, exibida abaixo do numeral romano |

- Estilo visual: fundo levemente destacado, borda inferior marcada.

### 3.3 Rodapé de Coluna

- Exibição de vagas de disciplinas eletivas associadas ao nível, quando existirem (ver seção 7).

---

## 4. Cartão de Disciplina

Cada disciplina é representada por um retângulo (cartão) dentro de sua coluna.

### 4.1 Anatomia do Cartão

```
┌─────────────────────────┐
│  Nome da Disciplina     │
│                  (nc)   │
├─────────────────────────┤
│  🔵 tag1   🔴 tag2      │
└─────────────────────────┘
```

| Área | Conteúdo |
|---|---|
| Corpo superior | Nome da disciplina (pode ser abreviado se necessário) |
| Canto inferior direito do corpo | Número de créditos entre parênteses, ex.: `(4)` |
| Rodapé interno | Marcadores visuais das tags da disciplina (ex.: ícones coloridos) |

### 4.2 Cor de Fundo

A cor de fundo do cartão indica o **eixo temático** ao qual a disciplina pertence. O conjunto de eixos e suas cores é definido por currículo no JSON de entrada. Exemplos de categorias comuns:

- Eixo de Fundamentos Teóricos
- Eixo de Ciência de Dados
- Eixo de Programação e Desenvolvimento de Software
- Eixo de Infraestrutura de TI
- Eixo de Banco de Dados
- Eixo de Formação Social e Profissional

Disciplinas sem eixo definido utilizam a cor padrão (cinza claro ou branco).

### 4.3 Dimensões

- Largura: ocupa a maior parte da largura da coluna, com margem lateral consistente.
- Altura: fixa e uniforme para todas as disciplinas, independentemente do nome.
- Nomes longos devem ser truncados com reticências ou quebrados em duas linhas.

### 4.4 Tags Visuais

Tags são exibidas como marcadores (ícones circulares ou pictogramas) no rodapé interno do cartão:

| Tag | Representação sugerida |
|---|---|
| `online` | Círculo azul claro |
| `extensionista` | Círculo vermelho/laranja |

O significado de cada marcador é explicado no painel de Legenda.

---

## 5. Linhas de Pré-requisito

As linhas conectam cartões de disciplinas que possuem relação de requisito entre si. Todas as linhas são compostas apenas por **segmentos retos** (horizontais e verticais — sem curvas), roteadas pelos espaços entre os cartões e entre as colunas.

### 5.1 Tipos de Linha

| Tipo de requisito | Estilo da linha | Direção |
|---|---|---|
| Pré-requisito comum | Sólida (`──────►`) | De nível anterior para nível posterior |
| Pré-requisito especial | Tracejada (`- - - ►`) | De nível anterior para nível posterior |
| Co-requisito | Pontilhada (`· · · ►`) | Entre disciplinas do mesmo nível |

- Todas as linhas possuem uma seta indicando a direção (disciplina origem → disciplina destino).
- As linhas devem ser traçadas de forma a não sobrepor os cartões das disciplinas.

### 5.2 Rótulos das Linhas

- Cada linha pode possuir um rótulo de texto curto (ex.: `RE` para Requisito Especial).
- O rótulo é posicionado próximo ao meio da linha, em área livre entre os cartões.

### 5.3 Roteamento

- As linhas percorrem os canais de espaço disponíveis: margens laterais das colunas e espaços entre os cartões dentro de uma coluna.
- Quando múltiplas linhas precisam passar pelo mesmo canal, são paralelizadas com leve deslocamento entre si para evitar sobreposição.

---

## 6. Marcadores de Requisito de Créditos

Quando uma disciplina possui um requisito de créditos mínimos (`credit_requirement`), esse requisito é indicado visualmente na grade:

- Um rótulo de texto posicionado na área entre colunas, próximo à disciplina destino.
- Formato: `XX CR` (onde XX é o número mínimo de créditos).
- Não utiliza seta; é apenas um rótulo textual flutuante na grade.

---

## 7. Eletivas

Disciplinas eletivas não possuem código fixo no currículo e são representadas por cartões genéricos:

- Aparência: retângulo com fundo em cor neutra (ex.: cinza claro ou azul claro), borda tracejada.
- Conteúdo: rótulo "Eletiva" e o número de créditos correspondente.
- Posicionamento: abaixo do rodapé de cada coluna que aceita eletivas.
- O total de créditos em eletivas exigidos pelo currículo é indicado na Legenda.

---

## 8. Painel de Legenda

Painel fixo posicionado à direita da grade, fora do fluxo das colunas.

### 8.1 Conteúdo

| Seção | Elementos |
|---|---|
| Tipos de requisito | Exemplos visuais dos três tipos de linha (sólida, tracejada, pontilhada) com rótulo descritivo |
| Requisito de Créditos | Descrição textual do marcador `CR` |
| Cartão de disciplina | Exemplo do retângulo com indicação do campo de créditos `(nc)` |
| Tags | Lista de marcadores coloridos com seu significado |
| Eixos temáticos | Lista de eixos com a cor correspondente e o total de créditos de cada eixo |
| Total geral de créditos | Soma de todos os créditos do currículo |

### 8.2 Posicionamento e Dimensões

- Largura fixa, suficiente para acomodar os exemplos visuais sem truncamento.
- Altura ajustável conforme o conteúdo; pode incluir barra de rolagem interna se necessário.
- Cabeçalho "Legenda" em destaque no topo do painel.

---

## 9. Espaçamento e Proporções

| Elemento | Diretriz |
|---|---|
| Largura mínima da página | Suficiente para exibir todos os níveis sem sobreposição |
| Espaçamento entre colunas | Mínimo de 40 px (para passagem de linhas de pré-requisito) |
| Espaçamento vertical entre cartões | Mínimo de 20 px (para passagem de linhas horizontais de pré-requisito) |
| Margem interna do cartão | Mínimo de 8 px em todos os lados |
| Altura do cabeçalho do curso | Proporcional ao tamanho do título (uma ou duas linhas) |

---

## 10. Paleta de Cores Mínima Necessária

A paleta exata é definida por currículo, mas qualquer tema deve prever as seguintes categorias de cor:

| Categoria | Uso |
|---|---|
| Cor primária | Cabeçalho do curso, destaques gerais |
| Cores dos eixos temáticos | Uma cor distinta por eixo (mínimo de 6) |
| Cor neutra clara | Cartões sem eixo definido, eletivas |
| Cor de barra de turno A | Primeiro turno |
| Cor de barra de turno B | Segundo turno |
| Cor das linhas de requisito | Preto ou cinza escuro (comum a todos os tipos) |
| Tags | Uma cor distinta por tipo de tag |

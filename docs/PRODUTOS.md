# Produtos

Fonte de verdade para os 8 produtos do catálogo inicial — os mesmos dados da
seção 3 do `CLAUDE.md`, para o script de seed consumir sem precisar abrir
dois arquivos.

Descrições, sabores detalhados e fotos adicionais **ainda não foram
enviados pela Patricia**. Ficam marcados como pendentes abaixo — não
inventar texto de venda ou variações que ela não confirmou.

| Produto | slug | Preço | Sabores | Descrição |
|---|---|---|---|---|
| Espetinho de morango | `espetinho-de-morango` | R$ 15,00 | — | pendente |
| Espetinho de bombom de morango | `espetinho-de-bombom-de-morango` | R$ 18,00 | — | pendente |
| Espetinho de uva | `espetinho-de-uva` | R$ 12,00 | — | pendente |
| Pão de mel | `pao-de-mel` | R$ 10,00 | pendente | pendente |
| Bombom de morango no pote | `bombom-de-morango-no-pote` | R$ 18,00 | — | pendente |
| Bombom de uva no pote | `bombom-de-uva-no-pote` | R$ 18,00 | — | pendente |
| Lanche natural | `lanche-natural` | R$ 12,00 | — | pendente |
| Suco natural 250ml | `suco-natural` | R$ 7,00 | pendente | pendente |

Todos entram com `ativo: true`, `controlaEstoque: false` (sem contagem
manual até a Patricia pedir) e `imagens` apontando para
`/produtos/<slug>.webp`.

## Encomendas para festinha

Brigadeiros e pão de mel sob encomenda, **sem preço definido** — não é um
produto de catálogo (não entra na coleção `produtos` com `preco: 0`). É uma
chamada à parte no fim da página levando direto ao WhatsApp, conforme
`CLAUDE.md` seção 4.

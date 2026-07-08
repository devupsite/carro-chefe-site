# COLABORACAO.md — Espaço Carro Chefe

> **Leia este arquivo ANTES de fazer qualquer alteração.**
> Ele reflete o estado real do site na última sessão que o atualizou.
> Se você (outra sessão) fizer mudanças, **atualize este arquivo antes do commit final**
> — não deixe para a próxima sessão descobrir sozinha.

**Última atualização:** 08/07/2026 — sessão de otimização de imagens (WebP + lazy loading) + merge com sessão de polimento visual/acessibilidade

### Mudanças recentes de outra sessão (já mescladas, cientes)

- `carro_chefe.html` foi **removido** — era um snapshot órfão do `index.html`, sem links
  apontando para ele, fora do sitemap, e já bloqueado no `robots.txt` (`Disallow: /carro_chefe.html`
  — regra mantida mesmo com o arquivo já não existindo, sem problema).
- Correções de contraste WCAG AA em todas as páginas (troca de variável de cor de texto)
- Barra LGPD do rodapé virou card flutuante compacto + botão "cookie fofinho" persistente
- Botão voltar-ao-topo com anel de progresso de scroll
- Cursor customizado "Ver" na galeria (desktop)
- Seção "Como Funciona" adicionada entre O Espaço e Galeria

---

## Regra de ouro entre sessões

Sessões **não são simultâneas**. Uma sessão trabalha, finaliza o lote, faz commit + push,
e só depois a próxima sessão começa. Antes de iniciar:

```bash
git pull origin main
```

Se der conflito de merge com alterações locais não commitadas, **nunca descarte sem entender
o que é** — dê `git stash`, puxe o remoto, avalie o diff, e só então decida se reaplica o stash
ou se as mudanças do stash já foram feitas por outra sessão (e podem ser descartadas).

---

## Estrutura do site

12 páginas HTML na raiz do repositório:

| Página | Função |
|---|---|
| `index.html` | Home |
| `carro_chefe.html` | Cópia/variante da home (mesma estrutura, manter sincronizada) |
| `carro_chefe_casamentos.html` | Página de evento — Casamentos (com álbuns por casal) |
| `carro_chefe_aniversarios.html` | Página de evento — Aniversários |
| `carro_chefe_debutantes.html` | Página de evento — Debutantes / 15 anos |
| `carro_chefe_eventos_corporativos.html` | Página de evento — Corporativo |
| `carro_chefe_galeria.html` | Galeria geral, dividida em blocos por evento (filtros por categoria) |
| `carro_chefe_contato.html` | Contato + formulário + mapa |
| `carro_chefe_obrigado.html` | Página de agradecimento pós-formulário |
| `carro_chefe_404.html` / `404.html` | Páginas de erro |
| `carro_chefe_politica_privacidade.html` | Política de privacidade |

**Removidas permanentemente (não recriar):** `carro_chefe_shows.html` e
`carro_chefe_workshops.html` — os produtos "Shows & Festivais" e "Workshops" foram
descontinuados a pedido do cliente. Não há mais cards, links de footer nem filtros de
galeria (`data-cat="shows"` / `data-cat="workshops"`) apontando para eles.

---

## Integrações — status real (confirmado em código, não em memória)

| Integração | Status | Detalhe |
|---|---|---|
| **Formspree** | ✅ Ativo | ID real `xeebrbjl` em `carro_chefe_contato.html` |
| **GTM** | ✅ Ativo | Container `GTM-PXJX4RW8` |
| **Meta Pixel** | ✅ Ativo — via GTM | Snippet `fbq()` hardcoded foi **removido** de todas as páginas (estava com placeholder quebrado `META_PIXEL_ID`). O Pixel real é gerenciado como tag dentro do próprio GTM, não no HTML. Se precisar mexer no Pixel, é no painel do GTM, não no código. |
| **SEO** (meta description, OG, canonical) | ✅ Presente nas páginas principais | |
| **robots.txt / sitemap.xml** | ✅ Existem na raiz | |
| **Google Maps** (embed) | ✅ Presente em `carro_chefe_contato.html` | |
| **Depoimentos** | ✅ Seção existe em `carro_chefe_casamentos.html` | |
| **Lightbox da galeria** | ✅ Implementado | |

---

## Imagens — pipeline de otimização (NOVO — 08/07/2026)

Todas as imagens da pasta `images/` (142 arquivos) foram convertidas para **WebP**
(qualidade 80, ~30% menores) via `cwebp`. **Os `.jpg`/`.jpeg` originais foram mantidos**
na pasta como backup — não foram deletados, mas **não são mais referenciados** no HTML.

### Lazy loading de background-image

O site usa `background-image` em CSS extensivamente (não `<img>`), então
`loading="lazy"` nativo do HTML **não funciona**. Foi implementado lazy loading manual:

- Script: `js/lazy-bg.js` — usa `IntersectionObserver`, com `rootMargin: 200px`
- Padrão HTML: em vez de
  ```html
  <div class="pi" style="background-image:url('images/foto.jpg');background-size:cover;background-position:center"></div>
  ```
  agora é:
  ```html
  <div class="pi lazy-bg" data-bg="images/foto.webp" style="background-size:cover;background-position:center"></div>
  ```
- O script substitui `data-bg` por `background-image` inline quando o elemento entra
  na viewport, e remove o atributo `data-bg` depois de carregar.
- **Todas** as 7 páginas com imagens (`index.html`, `carro_chefe.html`,
  `carro_chefe_casamentos.html`, `carro_chefe_aniversarios.html`,
  `carro_chefe_debutantes.html`, `carro_chefe_eventos_corporativos.html`,
  `carro_chefe_galeria.html`) têm `<script src="js/lazy-bg.js" defer></script>`
  antes de `</body>`.
- O hero da home **não** usa esse padrão (é CSS decorativo, não imagem), então não foi
  tocado.

### Ao adicionar novas imagens

1. Salvar o `.jpg` original em `images/`
2. Converter para WebP: `cwebp -q 80 images/nome.jpg -o images/nome.webp`
3. No HTML, usar o padrão `class="... lazy-bg" data-bg="images/nome.webp" style="..."`
   (sem `background-image` dentro do `style`)
4. **Exceção:** imagens acima da dobra (hero, primeira foto visível ao carregar a página)
   podem continuar com `background-image` direto no `style` (sem lazy), para não atrasar
   o LCP (Largest Contentful Paint).

---

## Álbuns de casamento já publicados

| Álbum | Prefixo de arquivo | Onde aparece |
|---|---|---|
| G & Y (11/04/2026) | `gy-*.jpg` / `gy-*.webp` | `carro_chefe_casamentos.html` (Álbum 1) + `carro_chefe_galeria.html` (Bloco 3) + cards do `index.html` |
| Sabrina & Felipe | `sf-*.jpg` / `sf-*.webp` | Só em `carro_chefe_casamentos.html` — **ainda não está na galeria geral** |
| Álbum 5 | `casamento5-*.jpg` / `.webp` | Só em `carro_chefe_casamentos.html` — **ainda não está na galeria geral** |

⚠️ **Atualização 08/07/2026 (mesmo dia, sessão posterior):** essa reorganização já foi
feita por outra sessão. Sabrina & Felipe, Álbum 5, Halloween, Debutante e Buffet estão
publicados na galeria geral com categorização e labels coerentes. As duas imagens
`venue-arco-vazio.jpg` e `venue-salao-festa.jpg` (antes flagadas como suspeitas) agora
estão corretamente usadas sob `data-cat="espaco"`, não misturadas com álbuns de casal.

**Único resíduo conhecido:** `show-amigos-risada.jpg` e `show-banda-ao-vivo.jpg` continuam
órfãs (sem uso em nenhuma página) — provavelmente sobras da categoria "Shows & Festivais",
que foi descontinuada como produto. Não é um erro a corrigir, é esperado — pode apagar os
dois arquivos (jpg + webp) se quiser limpar a pasta `images/`, ou deixar como estão (não
afetam nada).

---

## Convenções de commit

```bash
git config user.email "upco@devupsite.com"
git config user.name "UP Co."
```

## Pendências gerais (não resolvidas)

Nenhuma pendência de peso registrada no momento (08/07/2026). Ver nota acima sobre as
2 imagens órfãs de "Shows/Banda" — resíduo esperado, não é bug.

# Backup — Site Original (Carro Chefe)

Este diretório contém uma cópia integral de todas as páginas do site tal como
estavam publicadas antes da suspensão de conteúdo em produção.

**Motivo:** pendência de pagamento do cliente pelo desenvolvimento do site.

**Situação:** todas as páginas em produção (index.html e demais
`carro_chefe_*.html`) foram substituídas pelo conteúdo da página de erro
404, de forma que qualquer acesso ao domínio exibe apenas a página de erro.
Nada foi apagado — o histórico completo do Git também preserva cada versão
anterior, além desta cópia direta no repositório.

**Para restaurar o site**, assim que a situação for resolvida, copie os
arquivos deste diretório de volta para a raiz do repositório, sobrescrevendo
as versões atuais (que são cópias da 404). Restaure também o `sitemap.xml`
original (`backup-site-original/sitemap.xml`) e o `robots.txt` original.

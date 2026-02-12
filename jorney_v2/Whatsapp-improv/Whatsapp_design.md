Perfeito. Seguindo exatamente o combinado — um documento por vez, focado em execução, e deixando o “como implementar” para o Replit + MCP do n8n — abaixo está o arquivo .md de UX Design Conversacional para WhatsApp, já estruturado como especificação, não como texto solto.

Este documento é o que orienta botões, listas, emojis, fluxos e microcopy, e pode ser usado tanto por:
  •     quem desenha a UX
  •     quanto pelo Replit para materializar no fluxo n8n / Evolution API

⸻


# UX Design Conversacional – WhatsApp  
**Produto:** Educare App  
**Assistente:** TitiNauta 🚀👶  
**Canal:** WhatsApp (Evolution API)  

---

## 1. Objetivo do Documento

Este documento define a **experiência conversacional no WhatsApp**, incluindo:
- tom de voz
- mensagens padrão
- botões e listas
- regras de exibição de menus
- microcopy emocional
- fallbacks
- compatibilidade com limitações do WhatsApp

O foco é **humanização, clareza e redução de fricção**, respeitando que a lógica técnica será implementada pelo Replit via MCP do n8n.

---

## 2. Princípios de UX Conversacional

### 2.1 Tom de Voz (TitiNauta)

- acolhedor
- calmo
- humano
- não técnico
- sem julgamento

**Regra central**
> “Ajudar sem assustar. Orientar sem pressionar.”

---

### 2.2 Linguagem

- Frases curtas
- Uma ideia por mensagem
- Emojis com intenção (não decorativos)
- Perguntas simples e diretas
- Nunca usar jargões técnicos

---

## 3. Estrutura Geral da Conversa

A experiência no WhatsApp segue este padrão:

1. Mensagem curta
2. Ação clara (botão ou pergunta)
3. Feedback imediato
4. Próximo passo opcional

---

## 4. Onboarding Personalizado (Primeira Interação)

### 4.1 Boas-vindas + Coleta de Nome

**Mensagem**

Oi! Eu sou o TitiNauta 🚀👶
Vou te acompanhar na jornada de desenvolvimento do seu bebê, passo a passo.

Pra começar, me conta: *qual o nome do seu bebê?*

---

### 4.2 Confirmação de Nome + Gênero

**Mensagem** (após receber nome)

Que nome lindo! 💙
O {nome} é menino ou menina?

**Botões**
- 👦 Menino
- 👧 Menina

---

### 4.3 Data de Nascimento

**Mensagem** (após seleção de gênero)

Perfeito! 💙
Quando o {nome} nasceu?
Me manda a data assim: *DD/MM/AAAA*

---

### 4.4 Confirmação do Onboarding

**Mensagem** (após validar data)

Maravilha! O {nome} tem {idade} 🎉
Já preparei tudo pra acompanhar o desenvolvimento {dele/dela}!

Aqui você pode:
✨ acompanhar o desenvolvimento
✨ responder quizzes rápidos
✨ receber dicas personalizadas

**Botões**
- 👶 Sobre meu bebê
- 💚 Sobre mim

---

### 4.5 Retorno de Usuário com Onboarding Completo

**Mensagem**

Oi, {nome_mãe}! 💙
O {nome_bebê} está com {idade} agora!

**Botões**
- 👶 Sobre o {nome_bebê}
- 💚 Sobre mim

---

## 5. Seleção de Contexto (Bebê × Mãe)

### 5.1 Confirmação – Bebê

Perfeito 💙
Então vamos falar sobre seu bebê 👶

---

### 5.2 Confirmação – Mãe

Combinado 💚
Agora nosso foco é você.

---

## 6. Conversa Livre (Estado Padrão)

### 6.1 Prompt Aberto

Pode me contar com suas palavras 😊
O que você gostaria de saber ou conversar agora?

---

### 6.2 Fallback para Mensagens Curtas

Usado quando a mensagem for vaga ou muito curta.

Oi 😊
Me conta um pouquinho mais pra eu conseguir te ajudar melhor.

---

## 7. Menu Contextual (Fallback)

### 7.1 Quando Exibir Menu

Exibir menu quando:
- intenção for vaga
- usuário pedir “opções”
- retorno após pausa
- confiança baixa do classificador

---

### 7.2 Menu Padrão (List Message)

Como o menu tem 6+ opções, usar **List Message** ao invés de botões:

**Header:** Como posso te ajudar agora? ✨

| Seção | Opção | Descrição | rowId |
|---|---|---|---|
| Jornada | 📚 Conteúdos da semana | Ver o conteúdo desta semana | `content_weekly` |
| Jornada | 🧩 Quiz rápido | Responder quiz interativo | `quiz_start` |
| Registros | 📝 Registrar informações | Biometria, sono, vacinas | `log_start` |
| Registros | 📊 Ver progresso | Relatório de desenvolvimento | `report_view` |
| Suporte | 🛠️ Reportar problema | Relatar um problema | `support_problem` |
| Suporte | ⭐ Avaliar experiência | Dar sua avaliação | `feedback_start` |

**buttonText:** "Ver opções"  
**footerText:** "Educare+ • TitiNauta 🚀"

### 7.3 Menu Simplificado (Botões)

Para situações com poucas opções (≤3):

**Botões**
- 📚 Ver conteúdos
- 🧩 Fazer quiz
- 📊 Ver progresso

---

## 8. Jornada de Conteúdos (Child / Mother)

### 8.1 Introdução

Separei um conteúdo especial para esta semana 🌱
É rapidinho e pode te ajudar bastante.

**Botões**
- ▶️ Ver conteúdo
- 🧩 Fazer um quiz
- ⏸️ Voltar depois

---

## 9. Quiz no WhatsApp

### 9.1 Introdução ao Quiz

Vamos lá! 🧩
Vou te fazer algumas perguntas rápidas.

Não existe resposta certa ou errada 💙

---

### 9.2 Pergunta de Múltipla Escolha

Como foi o sono do bebê nos últimos dias? 🌙

**Botões**
- 😴 Dormiu bem
- 😐 Dormiu pouco
- 😢 Teve dificuldade

---

### 9.3 Confirmação de Resposta

Resposta registrada ✅
Obrigada por compartilhar 💙

---

## 10. Registros Estruturados (Logs)

### 10.1 Introdução

Vamos anotar isso rapidinho 📝

Após registro:

Prontinho ✅
Isso ajuda muito no acompanhamento.

---

## 11. Respostas com Áudio (Multimodal)

### 11.1 Oferta de Áudio

Preparei um áudio pra te explicar melhor 🎧
Se preferir, posso responder assim outras vezes.

**Botões**
- 🔊 Prefiro áudio
- 💬 Prefiro texto

---

## 12. Recomendações Personalizadas

Com base no que você me contou, isso pode te ajudar 💡

**Botões**
- 📘 Ver no app
- 🎓 Conhecer treinamento
- 🕒 Ver depois

---

## 13. Feedback de Experiência (Estrelas)

### 13.1 Disparo

Antes de você sair, posso te perguntar uma coisinha? ⭐



Como você avalia sua experiência até agora?

**Botões**
- ⭐
- ⭐⭐
- ⭐⭐⭐
- ⭐⭐⭐⭐
- ⭐⭐⭐⭐⭐

---

### 13.2 Pós-feedback

- Avaliação alta:

Que bom saber disso 💙
Obrigada por compartilhar.

- Avaliação baixa:

Obrigada por me contar 🤍
Se quiser, pode me dizer o que posso melhorar.

---

## 14. Reportar Problema ou Sugestão

### 14.1 Entrada

Se algo não funcionou como esperado, você pode me contar 🛠️

**Botões**
- ⚠️ Reportar problema
- 💡 Sugerir melhoria
- ↩️ Voltar

---

### 14.2 Confirmação

Recebi, sim 🙏
Vou encaminhar isso para o time cuidar.

---

## 15. Pausa e Encerramento

### 15.1 Voltar Mais Tarde

Tudo bem 💙
Quando quiser, é só me chamar.

---

### 15.2 Encerramento Final

Estarei por aqui sempre que precisar 🌷

---

## 16. Relatório Visual de Progresso (Novo)

### 16.1 Relatório como Imagem

Quando o usuário selecionar "Ver progresso", enviar uma imagem PNG gerada com:
- Header com logo, nome e idade do bebê
- Barras de progresso por domínio (Cognitivo, Linguagem, Motor, Social, Criativo)
- Insights personalizados
- Timeline de marcos desde o nascimento
- CTA para plataforma

**Caption da imagem:**

📊 Relatório semanal do {nome} — Semana {semana}

### 16.2 Relatório como Texto (Fallback ASCII)

Quando a imagem não puder ser enviada, usar barras ASCII:

```
📊 *Progresso do {nome} — Semana {semana}*

🧠 Cognitivo    ████████░░ 80%
🗣️ Linguagem   ██████░░░░ 60%
🏃 Motor       █████████░ 90%
💚 Social      ███████░░░ 70%
🎨 Criativo    ██████░░░░ 60%

💡 _{nome} está se destacando em habilidades motoras!_

🏆 *Marcos alcançados:*
✅ Social 0-2m • Sorriso social
✅ Motor 3-4m • Sustenta a cabeça
✅ Linguagem 9-12m • Primeiras palavras
⏳ Motor 12-15m • Primeiros passos

📱 _Relatório completo disponível na plataforma Educare+_
```

### 16.3 CTA pós-relatório

**Botões**
- 🧩 Fazer quiz da semana
- 📚 Ver conteúdo
- 💬 Conversar com TitiNauta

---

## 17. Regras de Ouro da UX no WhatsApp (Atualizado)

1. Nunca mais de 3 botões por mensagem
2. **List Messages para 4+ opções** (menu contextual, seleção de conteúdo)
3. Menu é exceção, não regra
4. Emojis sempre com função
5. Feedback sempre positivo
6. Nenhuma resposta deve soar como avaliação ou julgamento
7. **Dados do bebê (nome) devem ser usados em todas as interações**
8. **Relatório visual como imagem quando possível, ASCII como fallback**
9. **Onboarding é obrigatório na primeira interação**

---

**Documento de UX conversacional pronto para orientar design e implementação no WhatsApp via n8n + Evolution API.**

# 🔮 Aprimoramento Futuro: Migrando para Text-to-Speech com IA do Google

Este documento serve como um guia técnico e um roteiro, passo a passo, para migrar a funcionalidade atual de Text-to-Speech (TTS), baseada no sintetizador de voz do navegador, para a **API Google Cloud Text-to-Speech**. O objetivo é substituir a voz robótica e inconsistente por uma voz de alta qualidade, natural e fluida, criando uma identidade sonora única para o TitiNauta com um tom infantil e agradável.

## 🎯 Objetivos

1.  **Qualidade Superior:** Obter uma voz significativamente mais natural e expressiva que a do navegador.
2.  **Consistência:** Garantir que a voz do TitiNauta seja a mesma em todos os dispositivos e plataformas.
3.  **Identidade da Marca:** Criar uma voz única e memorável para o personagem TitiNauta, reforçando o branding.
4.  **Experiência do Usuário:** Aumentar o engajamento e a imersão através de uma narração de alta fidelidade.

---

## 🏗️ Arquitetura Proposta: Cliente-Servidor

A API do Google Cloud requer uma chave de API (`API_KEY`) para autenticação. É **extremamente inseguro** expor essa chave diretamente no código do frontend (o aplicativo que roda no navegador do usuário). Portanto, a arquitetura correta é a seguinte:

1.  **Frontend (App TitiNauta):**
    *   O aplicativo continua sendo a interface do usuário.
    *   Quando o usuário clica no botão de áudio, em vez de chamar a API do navegador, ele fará uma **requisição para um backend seguro**.
    *   A requisição enviará apenas o texto que precisa ser narrado.

2.  **Backend (Função Serverless):**
    *   Será uma pequena função na nuvem (por exemplo, usando Google Cloud Functions, Vercel Serverless Functions ou similar).
    *   Esta função receberá o texto do frontend.
    *   Ela guardará a `API_KEY` do Google de forma segura, como uma variável de ambiente.
    *   Ela fará a chamada para a API Google Cloud Text-to-Speech, enviando o texto e a chave.
    *   A API do Google retornará o áudio (em formato MP3, codificado em Base64).
    *   A função de backend então envia esses dados de áudio de volta para o frontend.

3.  **Frontend (De volta ao App):**
    *   O aplicativo recebe os dados de áudio em Base64.
    *   Ele decodifica e toca o áudio para o usuário usando um player de áudio HTML5.

Este modelo garante que sua chave de API nunca seja exposta ao público.

---

## 🛠️ Passo a Passo da Implementação

### Passo 1: Pré-requisitos (Configuração do Google Cloud)

1.  **Criar um Projeto no Google Cloud Platform (GCP):** Se você ainda não tiver um, crie um novo projeto no [console do Google Cloud](https://console.cloud.google.com/).
2.  **Ativar a API:** No seu projeto, navegue até "APIs e Serviços" > "Biblioteca" e procure por **"Cloud Text-to-Speech API"**. Clique em "Ativar".
3.  **Gerar Chave de API:** Vá para "APIs e Serviços" > "Credenciais", clique em "Criar Credenciais" e selecione "Chave de API". Copie essa chave. **Guarde-a com segurança!**
4.  **Configurar Faturamento:** A API do Google Cloud tem um nível de uso gratuito generoso, mas requer que o faturamento esteja ativado no projeto.

### Passo 2: Criar a Função de Backend (Exemplo em Node.js)

Vamos criar uma função serverless. Se você estiver usando uma plataforma como a Vercel, pode simplesmente criar um arquivo em uma pasta `/api`.

**Arquivo: `api/generate-speech.js`**
```javascript
// Exemplo usando a sintaxe comum de funções serverless (similar a Express.js)

export default async function handler(req, res) {
  // 1. Apenas permitir requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Obter o texto do corpo da requisição
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // 3. Obter a chave de API de uma variável de ambiente (NUNCA diretamente no código)
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  try {
    // 4. Montar a requisição para a API do Google
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: text },
        // Voz do "TitiNauta" - Começar com uma voz padrão de alta qualidade
        // Para uma voz infantil, a melhor opção é o serviço de "Custom Voice" do Google,
        // mas para começar, uma voz WaveNet padrão já é excelente.
        voice: {
          languageCode: 'pt-BR',
          name: 'pt-BR-Wavenet-D', // Uma voz feminina agradável e de alta qualidade
          ssmlGender: 'FEMALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google TTS API Error:', errorData);
      throw new Error('Failed to generate speech from Google API');
    }

    const data = await response.json();

    // 5. Enviar o áudio (em Base64) de volta para o frontend
    res.status(200).json({ audioContent: data.audioContent });

  } catch (error) {
    console.error('Server-side error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}
```

### Passo 3: Modificar o Frontend (`index.js`)

A função `_toggleAudioPlayback` no arquivo `index.js` precisará ser completamente reescrita.

```javascript
// Variável no escopo da classe para controlar o áudio
// this.audioPlayer = new Audio();

async _toggleAudioPlayback(text, buttonElement) {
    if (!text || text.trim() === '') {
        console.warn('No text to speak.');
        return;
    }

    // Se o áudio estiver tocando e for o mesmo botão, pause/retome
    if (this.activeAudioButton === buttonElement && !this.audioPlayer.paused) {
        this.audioPlayer.pause();
        this._updateAudioUI(buttonElement, 'paused');
        return;
    }
    if (this.activeAudioButton === buttonElement && this.audioPlayer.paused) {
        this.audioPlayer.play();
        this._updateAudioUI(buttonElement, 'playing');
        return;
    }

    // Parar qualquer áudio que esteja tocando
    this._stopAudio();
    this.activeAudioButton = buttonElement;
    
    try {
        // 1. Mostrar estado de carregamento
        this._updateAudioUI(buttonElement, 'loading'); // Você precisará criar este estado na UI

        // 2. Chamar nosso novo backend
        const response = await fetch('/api/generate-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: this._personalizeText(text) }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch audio from backend');
        }

        const { audioContent } = await response.json();

        // 3. Tocar o áudio recebido
        const audioSource = `data:audio/mp3;base64,${audioContent}`;
        this.audioPlayer = new Audio(audioSource);

        this.audioPlayer.onplay = () => this._updateAudioUI(buttonElement, 'playing');
        this.audioPlayer.onpause = () => this._updateAudioUI(buttonElement, 'paused');
        this.audioPlayer.onended = () => this._stopAudio();
        this.audioPlayer.onerror = () => {
             console.error("Error playing generated audio.");
             this._stopAudio();
        };

        this.audioPlayer.play();

    } catch (error) {
        console.error("Error in audio playback process:", error);
        this._updateAudioUI(buttonElement, 'error'); // Criar estado de erro
        this.activeAudioButton = null;
    }
}

_stopAudio() {
    if (this.audioPlayer && !this.audioPlayer.paused) {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
    }
    if (this.activeAudioButton) {
        this._updateAudioUI(this.activeAudioButton, 'stopped');
    }
    this.activeAudioButton = null;
}
```

### Passo 4: Criando a Voz Infantil do "TitiNauta"

A Google Cloud oferece um serviço chamado **Custom Voice**. Este serviço permite que você treine um modelo de IA com gravações de um locutor específico para criar uma voz única.

*   **Processo:** Envolve gravar um roteiro de várias horas com um ator de voz (com um tom infantil e agradável) e enviar esses áudios para o Google treinar o modelo.
*   **Custo:** É um serviço premium com custos associados ao treinamento e ao uso.
*   **Recomendação:** Comece com uma voz `WaveNet` padrão de alta qualidade (`pt-BR-Wavenet-D` ou `pt-BR-Wavenet-C`). Após validar a arquitetura, planeje o projeto de gravação e treinamento para a voz customizada do TitiNauta. Isso garante que a experiência do usuário melhore imediatamente, enquanto você trabalha no aprimoramento final.

# Landing Page BPMday 2026 - Captação de Patrocinadores (ABPMP Ceará)

Landing page institucional, moderna, responsiva e focada prioritariamente na visualização **mobile**, criada para captar empresas e tomadores de decisão interessados em patrocinar o evento **BPMday 2026**, promovido pela **ABPMP Ceará (ABPMP CE)**.

A aplicação foi desenvolvida em HTML5, CSS3 vanilla e JavaScript estático para hospedar gratuitamente no **GitHub Pages**, utilizando integração segura com **Google Workspace (Google Sheets + Google Apps Script + E-mail)** sem necessidade de backend próprio ou exposição de credenciais no código-fonte.

---

## 📁 Estrutura do Projeto

```text
/
├── index.html                    # Estrutura principal semântica e acessível (SEO/Meta Tags)
├── css/
│   └── style.css                 # Estilos CSS3 Mobile-First, Design Tokens, temas Dark/Gold e animações
├── js/
│   ├── config.js                 # Configurações centralizadas (FORM_ENDPOINT, LEAD_EMAIL, Links, Mensagens)
│   └── script.js                 # Máscara de telefone, validação de formulário, requisições fetch e Sticky CTA
├── assets/
│   ├── bpmday-logo.png           # Logomarca oficial BPMday 2026
│   ├── bpmday-logo-darkbg.png    # Variação da logo otimizada para fundos escuros
│   ├── ref-hero-executives.jpg   # Imagem de apoio conceitual executiva e painel BPM
│   ├── ref-why-sponsor.jpg       # Elemento visual de apoio para benefícios
│   └── ref-cotas.jpg             # Referência oficial das cotas de patrocínio
├── google-apps-script/
│   └── Code.gs                   # Código backend serverless para colar no Google Apps Script
└── README.md                     # Documentação completa de uso, publicação e integração
```

---

## 💻 Como Executar Localmente

Como o projeto é estático (HTML/CSS/JS), você pode testá-lo facilmente localmente sem compilar nada.

### Opção 1: Servidor Python (Recomendado)
No terminal, dentro da pasta do projeto, execute:
```bash
python3 -m http.server 8000
```
Abra o navegador em: `http://localhost:8000`

### Opção 2: Node.js / NPX
```bash
npx serve .
```

### Opção 3: Extensão "Live Server" (VS Code)
Abra a pasta do projeto no VS Code, clique com o botão direito no `index.html` e selecione **Open with Live Server**.

---

## 🚀 Como Publicar no GitHub Pages

1. Crie um novo repositório público no seu GitHub (ex: `bpmday2026`).
2. Adicione os arquivos do projeto e faça o push para a branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Landing Page BPMday 2026"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/bpmday2026.git
   git push -u origin main
   ```
3. No GitHub, acesse as configurações do repositório:
   - Clique em **Settings** -> **Pages** (no menu lateral esquerdo).
   - Em **Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione `main` e a pasta `/ (root)`.
   - Clique em **Save**.
4. Em poucos minutos, a sua landing page estará publicada e acessível publicamente na URL:
   `https://SEU-USUARIO.github.io/bpmday2026/`

---

## ⚙️ Passo a Passo: Configuração do Google Workspace

A captação de leads utiliza uma arquitetura baseada no **Google Apps Script**, que funciona como um Web App intermediário seguro.

O fluxo de dados é:  
**Visitante → Landing Page → Google Apps Script → Google Sheets + E-mail do Responsável**

### 1. Criar a Planilha no Google Sheets
1. Acesse o [Google Drive](https://drive.google.com/) com a conta da ABPMP CE (ou conta do Google Workspace).
2. Crie uma nova planilha vazia e renomeie-a para **`Leads BPMday 2026`**.

### 2. Abrir o Editor do Google Apps Script
1. Na planilha criada, clique no menu superior em **Extensões** → **Apps Script**.
2. Apague todo o código padrão e cole exatamente o conteúdo do arquivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).

### 3. Ajustar o E-mail Destinatário
No topo do código colado no Apps Script, localize a variável `RECIPIENT_EMAIL` e configure o e-mail do responsável pelo contato com patrocinadores:
```javascript
var RECIPIENT_EMAIL = "patrocinio@abpmpceara.com.br";
```

### 4. Publicar o Apps Script como Web App
1. No canto superior direito do Apps Script, clique no botão azul **Implantar** (Deploy) → **Nova implantação** (New deployment).
2. No ícone de engrenagem ao lado de "Selecione o tipo", escolha **App da Web** (Web app).
3. Preencha as configurações:
   - **Descrição**: `Endpoint Leads BPMday 2026`
   - **Executar como** (Execute as): **`Eu`** (`Me` - seu-email@domain.com)
   - **Quem tem acesso** (Who has access): **`Qualquer pessoa`** (`Anyone`)
4. Clique em **Implantar**.
5. O Google pedirá autorização de acesso às permissões do Google Sheets e do Gmail/MailApp. Aceite as permissões.
6. Copie a **URL do App da Web** gerada (começa com `https://script.google.com/macros/s/.../exec`).

### 5. Configurar a URL na Landing Page
1. No projeto da landing page, abra o arquivo [`js/config.js`](js/config.js).
2. Cole a URL copiada na propriedade `FORM_ENDPOINT`:
```javascript
const SITE_CONFIG = {
  // ...
  FORM_ENDPOINT: "https://script.google.com/macros/s/SUA_URL_GERADA_AQUI/exec",
  LEAD_EMAIL: "patrocinio@abpmpceara.com.br",
  // ...
};
```
3. Salve o arquivo e faça o commit/push para o GitHub Pages.

---

## 🧪 Como Testar o Recebimento dos Leads

1. Acesse a landing page no navegador ou celular.
2. Role até a seção do formulário ou clique nos botões **QUERO SER PATROCINADOR**.
3. Preencha os dois campos obrigatórios:
   - **Nome**: Ex: `Carlos Silva`
   - **Telefone / WhatsApp**: Ex: `(85) 99999-8888`
4. Clique em **QUERO CONHECER AS COTAS**.
5. Verifique se o botão exibe o indicador de carregamento e, em seguida, exibe a caixa de confirmação:
   > **Recebemos seus dados!**  
   > *Obrigado pelo interesse em patrocinar o BPMday 2026. A equipe da ABPMP CE entrará em contato em breve para apresentar as oportunidades de patrocínio.*
6. Acesse a planilha no Google Sheets para confirmar a inserção da linha com a data/hora, nome, telefone e origem.
7. Acesse a caixa de entrada do e-mail configurado para confirmar o recebimento do e-mail formatado:

**Assunto**: `Novo interessado em patrocinar o BPMday 2026`  
**Corpo**:
> **NOVO INTERESSADO EM PATROCÍNIO**  
> **Evento**: BPMday 2026  
> **Nome**: Carlos Silva  
> **Telefone/WhatsApp**: (85) 99999-8888  
> **Data/hora**: 08/09/2026 10:15:30  
> **Origem**: Landing Page BPMday 2026  

---

## 🛠️ Como Realizar Alterações no Conteúdo

Todas as configurações e textos principais estão centralizados em [`js/config.js`](js/config.js):

- **Links de Redes Sociais e Política de Privacidade**:
  Atualize o objeto `SITE_CONFIG.LINKS` em `js/config.js`:
  ```javascript
  LINKS: {
    INSTAGRAM: "https://www.instagram.com/abpmpceara/",
    LINKEDIN: "https://www.linkedin.com/company/abpmp-ceara/",
    SITE_OFICIAL: "https://www.abpmp-br.org/",
    PRIVACY_POLICY: "#politica-privacidade"
  }
  ```

- **Substituir Imagens ou Atualizar a Logo**:
  Basta substituir o arquivo correspondente na pasta `assets/` mantendo o mesmo nome:
  - Logomarca oficial: `assets/bpmday-logo-darkbg.png`
  - Imagem do Hero: `assets/ref-hero-executives.jpg`

---

## 🔒 Segurança e LGPD

- **Sem exposição de credenciais**: A landing page envia requisições HTTP estáticas via POST para o Web App do Google Apps Script. Nenhuma senha, token ou chave de API do Google Workspace fica exposta no frontend JavaScript.
- **Conformidade LGPD**: O formulário coleta exclusivamente o **Nome** e **Telefone/WhatsApp** estritamente necessários para o contato institucional sobre cotas de patrocínio, exibindo aviso claro de consentimento de privacidade conforme exigido pela legislação vigente.

/**
 * CONFIGURAÇÕES GERAIS DA LANDING PAGE BPMday 2026
 * 
 * Este arquivo centraliza todas as configurações editáveis do projeto.
 * Não altere a estrutura dos objetos, apenas os valores das propriedades.
 */

const SITE_CONFIG = {
  // Dados Institucionais do Evento
  EVENT_NAME: "BPMday",
  EVENT_YEAR: "2026",
  ORGANIZATION_NAME: "ABPMP Ceará",
  ORGANIZATION_FULL_NAME: "ABPMP Ceará (ABPMP CE)",
  SLOGAN: "Sua marca no centro das conexões que transformam negócios.",

  // Configurações da Integração com Google Workspace
  // Insira aqui a URL do seu Web App publicado no Google Apps Script.
  // Exemplo: "https://script.google.com/macros/s/AKfycbx.../exec"
  FORM_ENDPOINT: "https://script.google.com/macros/s/AKfycbwImzGue71SOnpdeN6WwOy22ImJswA8nU3efC3gGQ77QfRccHGgG5OWgghHFrs3XDmq/exec",

  // E-mail do responsável pela captação de patrocinadores (utilizado no e-mail disparado pelo Apps Script)
  LEAD_EMAIL: "pedropbrito@gmail.com",

  // Modo de Demonstração (Simulação local quando o FORM_ENDPOINT for placeholder ou estiver offline)
  DEMO_MODE: false,

  // Links Institucionais e Redes Sociais (Placeholders editáveis)
  LINKS: {
    INSTAGRAM: "https://www.instagram.com/abpmpceara/",
    LINKEDIN: "https://www.linkedin.com/company/abpmp-ceara/",
    SITE_OFICIAL: "https://www.abpmp-br.org/",
    PRIVACY_POLICY: "#politica-privacidade"
  },

  // Mensagens do Formulário
  MESSAGES: {
    SUCCESS_TITLE: "Recebemos seus dados!",
    SUCCESS_TEXT: "Obrigado pelo interesse em patrocinar o BPMday 2026. A equipe da ABPMP CE entrará em contato em breve para apresentar as oportunidades de patrocínio.",
    ERROR_TEXT: "Não foi possível enviar seus dados. Verifique sua conexão e tente novamente.",
    REQUIRED_NAME: "Por favor, digite seu nome completo.",
    REQUIRED_PHONE: "Por favor, digite um telefone/WhatsApp válido com DDD."
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}

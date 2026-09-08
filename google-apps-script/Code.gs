/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - RECEBIMENTO DE LEADS BPMday 2026 (ABPMP CEARÁ)
 * ============================================================================
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Abra a sua Planilha no Google Sheets (ex: "Leads BPMday 2026").
 * 2. No menu superior, clique em "Extensões" -> "Apps Script".
 * 3. Substitua todo o código do editor por este arquivo.
 * 4. Altere a variável RECIPIENT_EMAIL com o e-mail de destino padrão da ABPMP CE.
 * 5. Clique em "Implantar" (Deploy) -> "Nova implantação" (New deployment).
 * 6. Escolha o tipo "App da Web" (Web App).
 * 7. Configure:
 *    - Executar como: "Eu" (Me)
 *    - Quem tem acesso: "Qualquer pessoa" (Anyone)
 * 8. Clique em "Implantar", autorize as permissões solicitadas e copie a URL gerada.
 * 9. Cole a URL gerada no arquivo `js/config.js` da landing page na variável `FORM_ENDPOINT`.
 */

// E-mail padrão do responsável pela captação de patrocinadores (altere se necessário)
var RECIPIENT_EMAIL = "pedropbrito@gmail.com";

/**
 * Função responsável por receber as requisições POST enviadas pelo formulário da Landing Page
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Aguarda até 10 segundos para evitar concorrência simultânea na planilha
  lock.tryLock(10000);

  try {
    var params = {};

    // Verifica se os dados vieram via parâmetro de formulário ou JSON raw
    if (e.parameter && e.parameter.nome) {
      params = e.parameter;
    } else if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        params = e.parameter || {};
      }
    }

    var nome = params.nome || "Não informado";
    var telefone = params.telefone || "Não informado";
    var dataHora = params.dataHora || new Date().toLocaleString("pt-BR", { timeZone: "America/Fortaleza" });
    var origem = params.origem || "Landing Page BPMday 2026";
    var recipient = params.leadEmail || RECIPIENT_EMAIL;

    // 1. Gravar dados na Planilha ativa do Google Sheets
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Se a planilha estiver vazia, insere o cabeçalho
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data/Hora", "Nome", "Telefone/WhatsApp", "Origem", "Destinatário E-mail"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#0f172a").setFontColor("#f59e0b");
    }

    sheet.appendRow([dataHora, nome, telefone, origem, recipient]);

    // 2. Enviar e-mail de notificação para a ABPMP CE
    var subject = "Novo interessado em patrocinar o BPMday 2026";
    
    var plainBody = "NOVO INTERESSADO EM PATROCÍNIO\n\n" +
                    "Evento: BPMday 2026\n" +
                    "Nome: " + nome + "\n" +
                    "Telefone/WhatsApp: " + telefone + "\n" +
                    "Data/hora: " + dataHora + "\n" +
                    "Origem: " + origem + "\n";

    var htmlBody = "<div style='font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;'>" +
                   "<h2 style='color: #d97706; margin-top: 0;'>NOVO INTERESSADO EM PATROCÍNIO</h2>" +
                   "<p style='font-size: 16px;'><strong>Evento:</strong> BPMday 2026</p>" +
                   "<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;' />" +
                   "<p style='font-size: 15px;'><strong>Nome:</strong> " + nome + "</p>" +
                   "<p style='font-size: 15px;'><strong>Telefone/WhatsApp:</strong> " + telefone + "</p>" +
                   "<p style='font-size: 15px;'><strong>Data/Hora do Envio:</strong> " + dataHora + "</p>" +
                   "<p style='font-size: 15px;'><strong>Origem:</strong> " + origem + "</p>" +
                   "<hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;' />" +
                   "<p style='font-size: 12px; color: #64748b;'>Este e-mail foi gerado automaticamente pela Landing Page de Patrocínios do BPMday 2026 (ABPMP Ceará).</p>" +
                   "</div>";

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });

    // Retorna resposta JSON com sucesso
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Lead registrado e e-mail enviado com sucesso."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Função de teste simples para verificar via navegação GET se o script está ativo
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "BPMday 2026 Lead Service",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

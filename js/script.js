/**
 * LÓGICA E INTERAÇÕES DA LANDING PAGE BPMday 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhoneMask();
  initFormValidation();
  initStickyCTA();
  initSmoothScroll();
  applyConfigLinks();
});

/**
 * Aplica os links e placeholders vindos do SITE_CONFIG aos elementos da página
 */
function applyConfigLinks() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const instaLink = document.getElementById('link-instagram');
  const linkedinLink = document.getElementById('link-linkedin');
  const siteLink = document.getElementById('link-site-oficial');
  const privacyLink = document.getElementById('link-privacidade');

  if (instaLink) instaLink.href = SITE_CONFIG.LINKS.INSTAGRAM || '#';
  if (linkedinLink) linkedinLink.href = SITE_CONFIG.LINKS.LINKEDIN || '#';
  if (siteLink) siteLink.href = SITE_CONFIG.LINKS.SITE_OFICIAL || '#';
  if (privacyLink) privacyLink.href = SITE_CONFIG.LINKS.PRIVACY_POLICY || '#';

  // Atualizar dinamicamente elementos com data-config
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (SITE_CONFIG[key]) {
      el.textContent = SITE_CONFIG[key];
    }
  });
}

/**
 * Máscara interativa em tempo real para Telefone / WhatsApp (Brasil)
 * Formatos: (00) 00000-0000 ou (00) 0000-0000
 */
function initPhoneMask() {
  const phoneInput = document.getElementById('telefone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // remove tudo que não for dígito
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 10) {
      // Celular com 9 dígitos: (XX) XXXXX-XXXX
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      // Telefone com 8 dígitos em progresso: (XX) XXXX-XXXX
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      // DDD adicionado: (XX) XXX...
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      // Digitando DDD: (XX...
      value = value.replace(/^(\d*)$/, '($1');
    }

    e.target.value = value;
    clearFieldError(phoneInput);
  });

  phoneInput.addEventListener('keydown', (e) => {
    // Permite backspace, delete, setas, tab
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      return;
    }
  });
}

/**
 * Inicialização e tratamento do Formulário de Conversão
 */
function initFormValidation() {
  const form = document.getElementById('sponsor-form');
  const nomeInput = document.getElementById('nome');
  const phoneInput = document.getElementById('telefone');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
  const successCard = document.getElementById('form-success');
  const errorCard = document.getElementById('form-error');

  if (!form) return;

  // Limpeza de erros ao digitar
  nomeInput?.addEventListener('input', () => clearFieldError(nomeInput));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset de mensagens de resposta
    if (successCard) successCard.style.display = 'none';
    if (errorCard) errorCard.style.display = 'none';

    // Validação dos campos
    const nomeVal = nomeInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const rawPhoneDigits = phoneVal.replace(/\D/g, '');

    let isValid = true;

    if (!nomeVal || nomeVal.length < 3) {
      showFieldError(nomeInput, SITE_CONFIG.MESSAGES.REQUIRED_NAME || 'Por favor, digite seu nome completo.');
      isValid = false;
    }

    if (!rawPhoneDigits || rawPhoneDigits.length < 10) {
      showFieldError(phoneInput, SITE_CONFIG.MESSAGES.REQUIRED_PHONE || 'Por favor, informe um telefone/WhatsApp válido com DDD.');
      isValid = false;
    }

    if (!isValid) return;

    // Estado de carregamento
    setLoadingState(true);

    const payload = {
      nome: nomeVal,
      telefone: phoneVal,
      dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
      origem: 'Landing Page BPMday 2026',
      leadEmail: SITE_CONFIG.LEAD_EMAIL || 'patrocinio@abpmpceara.com.br'
    };

    const endpoint = SITE_CONFIG.FORM_ENDPOINT;
    const isPlaceholderEndpoint = !endpoint || endpoint.includes('SEU_GOOGLE_APPS_SCRIPT_URL') || endpoint.includes('YOUR_GOOGLE_APPS');

    try {
      if (isPlaceholderEndpoint && SITE_CONFIG.DEMO_MODE) {
        // Simulação de envio com sucesso em modo de demonstração
        console.log('[BPMday 2026 Demo Mode] Lead capturado com sucesso:', payload);
        await new Promise(resolve => setTimeout(resolve, 900)); // Pequeno delay realista
        handleSuccess();
      } else {
        // Envio real ao Google Apps Script Web App
        // Google Apps Script requer envio via URLSearchParams ou FormData com no-cors para evitar bloqueios de redirecionamento CORS em hospedagem estática
        const formData = new URLSearchParams();
        formData.append('nome', payload.nome);
        formData.append('telefone', payload.telefone);
        formData.append('dataHora', payload.dataHora);
        formData.append('origem', payload.origem);
        formData.append('leadEmail', payload.leadEmail);

        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors', // Seguro para chamadas estáticas ao Google Apps Script
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });

        handleSuccess();
      }
    } catch (err) {
      console.error('[BPMday 2026 Form Error]:', err);
      // Caso ocorra erro de conexão no fetch real
      if (SITE_CONFIG.DEMO_MODE) {
        console.warn('[BPMday 2026 Demo Mode] Fallback ativado devido a erro na requisição.');
        handleSuccess();
      } else {
        handleError();
      }
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (btnText) btnText.style.display = loading ? 'none' : 'inline-block';
    if (btnSpinner) btnSpinner.style.display = loading ? 'inline-block' : 'none';
  }

  function handleSuccess() {
    form.reset();
    if (successCard) {
      successCard.style.display = 'block';
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleError() {
    if (errorCard) {
      errorCard.style.display = 'block';
      errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

/**
 * Exibe mensagem de erro abaixo do input
 */
function showFieldError(inputElement, message) {
  if (!inputElement) return;
  inputElement.classList.add('input-error');
  const errorContainer = inputElement.parentElement.querySelector('.field-error-msg');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

/**
 * Limpa mensagem de erro do input
 */
function clearFieldError(inputElement) {
  if (!inputElement) return;
  inputElement.classList.remove('input-error');
  const errorContainer = inputElement.parentElement.querySelector('.field-error-msg');
  if (errorContainer) {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  }
}

/**
 * Controla a exibição da barra CTA Fixa Mobile ao rolar a página
 */
function initStickyCTA() {
  const stickyBar = document.getElementById('mobile-sticky-cta');
  const heroSection = document.getElementById('hero');

  if (!stickyBar || !heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Exibe a barra apenas se o Hero NÃO estiver visível no viewport (usuário rolou a página)
      if (!entry.isIntersecting) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.1
  });

  observer.observe(heroSection);
}

/**
 * Scroll suave para links internos (ex: #formulario)
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   CONFIGURAÇÕES GERAIS E SUPABASE
   ========================================================================== */
const SUPABASE_URL = 'https://vrivgmpdcgpqhuohzkaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaXZnbXBkY2dwcWh1b2h6a2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MjAxODQsImV4cCI6MjEwOTM5NjE4NH0.H7qIvpF3rm-k-moF101qC2JLLe1mHOlqQlMWnzhFGo4';
const NUMERO_WHATSAPP_TESTES = '5575988660943';
const ADMIN_EMAIL = 'matheusgomes2225@hotmail.com';
const PARCEIRA_PREFIXO = 'clarinha2100';

let client = null;
try {
  if (window.supabase) {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {}

/* ==========================================================================
   VARIÁVEIS DE ESTADO (STATE)
   ========================================================================== */
let usuarioLogadoId = null;
let usuarioLogadoEmail = null;
let modoAuth = 'login';
let mesAtual = new Date().toISOString().slice(0, 7);
let contasUsuario = [];
let categoriasUsuario = [];
let transacoesCarregadas = [];
let caixinhasUsuario = [];

let meuGraficoProjecao = null;
let meuGraficoCategorias = null;
let filtroTipoAtivo = 'todos';
let filtroContaIdAtiva = null;
let termoBuscaAtivo = '';
let visaoAtiva = 'pessoal';
let periodoGrafico = '6m'; 
let anoRaioX = new Date().getFullYear();

let transacaoEditandoId = null;
let contaEditandoId = null;
let categoriaEditandoTetoId = null;
let caixinhaEditandoId = null;
let caixinhaAporteId = null;
let tipoMovimentoCaixinha = 'aportar'; 
let enviandoTransacao = false;

let configFeedbackAtivo = true;
let temaAtivo = 'esmeralda';
let modoPrivacidadeAtivo = false;
let modoClaroAtivo = false;

const totaisAnteriores = {
  'card-saldo': 0,
  'card-fatura': 0,
  'card-receita': 0,
  'card-despesa': 0
};
const animacoesContagemAtivas = {};

try {
  configFeedbackAtivo = localStorage.getItem('fc_feedback_ativo') !== 'false';
  temaAtivo = localStorage.getItem('fc_tema_app') || 'esmeralda';
  modoPrivacidadeAtivo = localStorage.getItem('fc_privacidade_ativa') === 'true';
  modoClaroAtivo = localStorage.getItem('fc_modo_claro') === 'true';
} catch (e) {}

/* ==========================================================================
   MAPEAMENTO DE ELEMENTOS DOM
   ========================================================================== */
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const authForm = document.getElementById('auth-form');
const authMsg = document.getElementById('auth-msg');
const authBtnSubmit = document.getElementById('auth-btn-submit');
const btnEsqueceuSenha = document.getElementById('btn-esqueceu-senha');
const campoCadastroNome = document.getElementById('campo-cadastro-nome');
const campoCadastroTelefone = document.getElementById('campo-cadastro-telefone');
const authNome = document.getElementById('auth-nome');
const authTelefone = document.getElementById('auth-telefone');
const labelSaudacaoUsuario = document.getElementById('label-saudacao-usuario');

const filtroMes = document.getElementById('filtro-mes');
const btnMesAnterior = document.getElementById('btn-mes-anterior');
const btnMesProximo = document.getElementById('btn-mes-proximo');
const filtroBusca = document.getElementById('filtro-busca');
const contadorTransacoes = document.getElementById('contador-transacoes');
const btnFabAdicionar = document.getElementById('btn-fab-adicionar');
const btnModoPrivacidade = document.getElementById('btn-modo-privacidade');
const btnDropdownExportar = document.getElementById('btn-dropdown-exportar');
const menuDropdownExportar = document.getElementById('menu-dropdown-exportar');

const configUserEmailInput = document.getElementById('config-user-email-input');
const configNomeInput = document.getElementById('config-nome-input');
const configTelefoneInput = document.getElementById('config-telefone-input');
const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');
const btnFeedbackWpp = document.getElementById('btn-enviar-feedback-wpp');
const btnToggleSenhaSection = document.getElementById('btn-toggle-senha-section');
const containerFormSenha = document.getElementById('container-form-senha');
const iconeSetaSenha = document.getElementById('icone-seta-senha');
const novaSenhaInput = document.getElementById('nova-senha-input');
const confirmaSenhaInput = document.getElementById('confirma-senha-input');
const btnSalvarNovaSenha = document.getElementById('btn-salvar-nova-senha');
const toggleSomSwitch = document.getElementById('toggle-som-switch');
const toggleSomKnob = document.getElementById('toggle-som-knob');

const formTransacao = document.getElementById('form-transacao');
const txTipo = document.getElementById('tx-tipo');
const txValor = document.getElementById('tx-valor');
const txData = document.getElementById('tx-data');
const txConta = document.getElementById('tx-conta');
const txCategoria = document.getElementById('tx-categoria');
const txParcelas = document.getElementById('tx-parcelas');
const containerParcelas = document.getElementById('container-parcelamento');
const previaParcelamento = document.getElementById('previa-parcelamento');
const containerAtribuicao = document.getElementById('container-atribuicao');
const txAtribuicaoPredefinida = document.getElementById('tx-atribuicao-predefinida');
const txAtribuicaoEmail = document.getElementById('tx-atribuicao-email');
const containerChipsEmails = document.getElementById('container-chips-emails');
const listaChipsEmailsFrequentes = document.getElementById('lista-chips-emails-frequentes');
const txRecorrente = document.getElementById('tx-recorrente');
const opcoesRecorrencia = document.getElementById('opcoes-recorrencia');
const txRecorrenteMeses = document.getElementById('tx-recorrente-meses');
const containerRecorrencia = document.getElementById('container-recorrencia');

const formConta = document.getElementById('form-conta');
const contaTipo = document.getElementById('conta-tipo');
const camposCartao = document.getElementById('campos-especificos-cartao');

const formCategoria = document.getElementById('form-categoria');
const categoriaTipoFluxo = document.getElementById('categoria-tipo-fluxo');
const campoContainerTeto = document.getElementById('campo-container-teto');
const campoContainerIcone = document.getElementById('campo-container-icone');
const categoriaTeto = document.getElementById('categoria-teto');
const selectCategoriaIcone = document.getElementById('categoria-icone');
const previewIconeCategoria = document.getElementById('preview-icone-categoria');

const formCaixinha = document.getElementById('form-caixinha');
const formAporteCaixinha = document.getElementById('form-aporte-caixinha');

/* ==========================================================================
   ÁUDIO, VIBRAÇÃO, FORMATAÇÃO E CONTAGEM SUAVE
   ========================================================================== */
let audioCtx = null;
function obterAudioContext() {
  if (!audioCtx) {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (AudioClass) audioCtx = new AudioClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function reproduzirSomFeedback(tipo = 'clique') {
  try {
    const ctx = obterAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const agora = ctx.currentTime;
    if (tipo === 'clique') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, agora);
      osc.frequency.exponentialRampToValueAtTime(140, agora + 0.035);
      gain.gain.setValueAtTime(0.08, agora);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.035);
      osc.start(agora);
      osc.stop(agora + 0.035);
    } else if (tipo === 'sucesso') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, agora);
      osc.frequency.exponentialRampToValueAtTime(880, agora + 0.08);
      gain.gain.setValueAtTime(0.07, agora);
      gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.09);
      osc.start(agora);
      osc.stop(agora + 0.09);
    }
  } catch (e) {}
}

function executarFeedback(tipo = 'clique') {
  if (!configFeedbackAtivo) return;
  if ('vibrate' in navigator) navigator.vibrate(tipo === 'clique' ? 12 : [20, 30, 20]);
  reproduzirSomFeedback(tipo);
}

function formatarMoeda(valor) {
  if (modoPrivacidadeAtivo) return 'R$ •••••';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function animarContadorMoeda(elementId, valorFinal, duracao = 460) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (animacoesContagemAtivas[elementId]) {
    cancelAnimationFrame(animacoesContagemAtivas[elementId]);
    delete animacoesContagemAtivas[elementId];
  }

  if (modoPrivacidadeAtivo) {
    totaisAnteriores[elementId] = valorFinal;
    el.innerText = 'R$ •••••';
    return;
  }

  const valorInicial = Number(totaisAnteriores[elementId] || 0);
  if (Math.abs(valorFinal - valorInicial) < 0.01) {
    totaisAnteriores[elementId] = valorFinal;
    el.innerText = formatarMoeda(valorFinal);
    return;
  }

  const inicio = performance.now();
  const passo = (agora) => {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const eased = 1 - Math.pow(1 - progresso, 3);
    const atual = valorInicial + (valorFinal - valorInicial) * eased;

    el.innerText = Number(atual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (progresso < 1) {
      animacoesContagemAtivas[elementId] = requestAnimationFrame(passo);
    } else {
      totaisAnteriores[elementId] = valorFinal;
      el.innerText = formatarMoeda(valorFinal);
      delete animacoesContagemAtivas[elementId];
    }
  };

  animacoesContagemAtivas[elementId] = requestAnimationFrame(passo);
}

function aplicarMascaraTelefone(inputEl) {
  if (!inputEl) return;
  inputEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}
aplicarMascaraTelefone(authTelefone);
aplicarMascaraTelefone(configTelefoneInput);

/* ==========================================================================
   TEMAS E MODO CLARO/ESCURO (DEFINIDOS NO TOPO)
   ========================================================================== */
const PALETAS_TEMA = {
  esmeralda: { main: '#10b981', hover: '#059669', soft: 'rgba(16, 185, 129, 0.16)', border: 'rgba(16, 185, 129, 0.35)', text: '#34d399', btn: 'bg-emerald-500 hover:bg-emerald-600' },
  azul:      { main: '#0ea5e9', hover: '#0284c7', soft: 'rgba(14, 165, 233, 0.16)', border: 'rgba(14, 165, 233, 0.35)', text: '#38bdf8', btn: 'bg-sky-500 hover:bg-sky-600' },
  roxo:      { main: '#8b5cf6', hover: '#7c3aed', soft: 'rgba(139, 92, 246, 0.16)', border: 'rgba(139, 92, 246, 0.35)', text: '#a78bfa', btn: 'bg-violet-500 hover:bg-violet-600' },
  ambar:     { main: '#f59e0b', hover: '#d97706', soft: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.35)', text: '#fbbf24', btn: 'bg-amber-500 hover:bg-amber-600' },
  rosa:      { main: '#f43f5e', hover: '#e11d48', soft: 'rgba(244, 63, 94, 0.16)',  border: 'rgba(244, 63, 94, 0.35)',  text: '#fb7185', btn: 'bg-rose-500 hover:bg-rose-600' }
};

function aplicarTemaNaInterface() {
  const paleta = PALETAS_TEMA[temaAtivo] || PALETAS_TEMA.esmeralda;
  const root = document.documentElement;

  root.style.setProperty('--accent-main', paleta.main);
  root.style.setProperty('--accent-hover', paleta.hover);
  root.style.setProperty('--accent-soft', paleta.soft);
  root.style.setProperty('--accent-border', paleta.border);
  root.style.setProperty('--accent-text', paleta.text);

  document.body.classList.add('has-custom-theme');

  const fabBox = document.getElementById('btn-fab-icone-box');
  if (fabBox) {
    fabBox.className = `w-12 h-12 rounded-2xl ${paleta.btn} text-slate-950 flex items-center justify-center shadow-lg border-2 border-slate-950 transition-transform duration-200 group-active:scale-90`;
  }
  const btnModal = document.getElementById('btn-abrir-modal');
  if (btnModal) {
    btnModal.className = `flex items-center justify-center gap-1.5 ${paleta.btn} text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition shadow-md active:scale-95`;
  }

  document.querySelectorAll('.btn-cor-tema').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-white', 'border-white');
  });
  const btnAtivo = document.getElementById(`tema-btn-${temaAtivo}`);
  if (btnAtivo) {
    btnAtivo.classList.add('ring-2', 'ring-white');
  }

  atualizarAbaBottomAtiva('inicio');
}

function aplicarModoClaroEscuro() {
  document.body.classList.toggle('light-mode', modoClaroAtivo);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', modoClaroAtivo ? '#f1f5f9' : '#020617');

  document.querySelectorAll('.btn-toggle-tema-modo').forEach(btn => {
    btn.innerHTML = `<i data-lucide="${modoClaroAtivo ? 'moon' : 'sun'}" class="w-4 h-4 ${modoClaroAtivo ? 'text-slate-700' : 'text-amber-400'}"></i>`;
  });
  if (window.lucide) lucide.createIcons();
}

window.alternarModoClaroEscuro = function() {
  executarFeedback('clique');
  modoClaroAtivo = !modoClaroAtivo;
  try { localStorage.setItem('fc_modo_claro', modoClaroAtivo); } catch (e) {}
  aplicarModoClaroEscuro();
};

window.definirTema = function(cor) {
  temaAtivo = cor;
  try { localStorage.setItem('fc_tema_app', cor); } catch (e) {}
  aplicarTemaNaInterface();
  if (meuGraficoProjecao) carregarGraficoProjecao();
  executarFeedback('clique');
};

function atualizarIconePrivacidade() {
  if (btnModoPrivacidade) {
    btnModoPrivacidade.innerHTML = `<i data-lucide="${modoPrivacidadeAtivo ? 'eye-off' : 'eye'}" class="w-4 h-4 ${modoPrivacidadeAtivo ? 'text-amber-400' : ''}"></i>`;
    if (window.lucide) lucide.createIcons();
  }
}

window.alternarPrivacidade = async function() {
  executarFeedback('clique');
  modoPrivacidadeAtivo = !modoPrivacidadeAtivo;
  try { localStorage.setItem('fc_privacidade_ativa', modoPrivacidadeAtivo); } catch (e) {}
  atualizarIconePrivacidade();
  verificarAlertasVencimento();
  atualizarTotais();
  renderizarCaixinhas();
  renderizarGridContas();
  renderizarGridCategorias();
  renderizarGraficoCategorias();
  renderizarTransacoes();
  await carregarComprometimentoFuturo();
};

/* ==========================================================================
   BADGES DE CATEGORIA COLORIDOS (PÍLULAS DINÂMICAS)
   ========================================================================== */
const CORES_CATEGORIA_PALETA = [
  { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-300', icone: 'text-emerald-400' },
  { bg: 'bg-sky-500/15', border: 'border-sky-500/30', text: 'text-sky-300', icone: 'text-sky-400' },
  { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-300', icone: 'text-violet-400' },
  { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-300', icone: 'text-amber-400' },
  { bg: 'bg-rose-500/15', border: 'border-rose-500/30', text: 'text-rose-300', icone: 'text-rose-400' },
  { bg: 'bg-teal-500/15', border: 'border-teal-500/30', text: 'text-teal-300', icone: 'text-teal-400' },
  { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-300', icone: 'text-indigo-400' },
  { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-300', icone: 'text-orange-400' }
];

function obterEstiloCategoria(catId) {
  if (!catId) return CORES_CATEGORIA_PALETA[0];
  let hash = 0;
  for (let i = 0; i < catId.length; i++) {
    hash = catId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CORES_CATEGORIA_PALETA.length;
  return CORES_CATEGORIA_PALETA[index];
}

/* ==========================================================================
   NAVEGAÇÃO BOTTOM TAB BAR MOBILE
   ========================================================================== */
function atualizarAbaBottomAtiva(aba = 'inicio') {
  const paleta = PALETAS_TEMA[temaAtivo] || PALETAS_TEMA.esmeralda;
  document.querySelectorAll('.nav-bottom-item').forEach(btn => {
    btn.style.color = '';
    btn.classList.remove('text-emerald-400', 'font-bold');
    btn.classList.add('text-slate-400');
  });

  const alvo = document.getElementById(`nav-tab-${aba}`);
  if (alvo) {
    alvo.classList.remove('text-slate-400');
    alvo.style.color = paleta.text;
  }
}

window.navegarBottomBar = function(destino) {
  executarFeedback('clique');
  atualizarAbaBottomAtiva(destino);

  if (destino === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (destino === 'raiox') {
    abrirModalRaioX();
  } else if (destino === 'ajustes') {
    document.getElementById('btn-abrir-config')?.click();
  }
};

/* ==========================================================================
   LIMITES E IDENTIDADE VISUAL REALISTA DOS CARTÕES
   ========================================================================== */
function obterLimitesCartoes() {
  try {
    const raw = localStorage.getItem('fc_limites_cartoes');
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === 'object' ? obj : {};
  } catch (e) {
    return {};
  }
}

function salvarLimiteCartao(contaId, limite) {
  if (!contaId) return;
  const limites = obterLimitesCartoes();
  if (limite && limite > 0) {
    limites[contaId] = Number(limite);
  } else {
    delete limites[contaId];
  }
  try {
    localStorage.setItem('fc_limites_cartoes', JSON.stringify(limites));
  } catch (e) {}
}

function detectarEstiloBanco(nome, isCartao) {
  const n = (nome || '').toLowerCase();

  if (!isCartao) {
    return {
      gradiente: 'from-emerald-950 via-slate-900 to-teal-950',
      borda: 'border-emerald-500/30',
      badge: 'CONTA CORRENTE',
      bandeira: 'corrente'
    };
  }

  if (n.includes('nubank') || n.includes('nu ') || n === 'nu' || n.includes('ultravioleta')) {
    return {
      gradiente: 'from-[#4c0575] via-[#6b119e] to-[#2e0249]',
      borda: 'border-purple-400/30',
      badge: 'NUBANK',
      bandeira: 'mastercard'
    };
  }
  if (n.includes('mercado') || n.includes('mp')) {
    return {
      gradiente: 'from-[#004e92] via-[#0073cc] to-[#002b54]',
      borda: 'border-sky-400/35',
      badge: 'MERCADO PAGO',
      bandeira: 'visa'
    };
  }
  if (n.includes('inter')) {
    return {
      gradiente: 'from-[#9a3412] via-[#ea580c] to-[#431407]',
      borda: 'border-orange-400/35',
      badge: 'INTER',
      bandeira: 'mastercard'
    };
  }
  if (n.includes('itaú') || n.includes('itau')) {
    return {
      gradiente: 'from-[#1e3a8a] via-[#c2410c] to-[#172554]',
      borda: 'border-amber-400/35',
      badge: 'ITAÚ',
      bandeira: 'visa'
    };
  }
  if (n.includes('santander')) {
    return {
      gradiente: 'from-[#7f1d1d] via-[#b91c1c] to-[#450a0a]',
      borda: 'border-rose-400/35',
      badge: 'SANTANDER',
      bandeira: 'mastercard'
    };
  }
  if (n.includes('bradesco')) {
    return {
      gradiente: 'from-[#881337] via-[#be123c] to-[#4c0519]',
      borda: 'border-rose-400/35',
      badge: 'BRADESCO',
      bandeira: 'visa'
    };
  }
  if (n.includes('c6')) {
    return {
      gradiente: 'from-[#18181b] via-[#27272a] to-[#09090b]',
      borda: 'border-zinc-500/40',
      badge: 'C6 BANK',
      bandeira: 'mastercard'
    };
  }
  if (n.includes('caixa')) {
    return {
      gradiente: 'from-[#1d4ed8] via-[#0369a1] to-[#1e3a8a]',
      borda: 'border-sky-400/35',
      badge: 'CAIXA',
      bandeira: 'visa'
    };
  }
  if (n.includes('brasil') || n === 'bb' || n.includes('ourocard')) {
    return {
      gradiente: 'from-[#1e3a8a] via-[#1d4ed8] to-[#854d0e]',
      borda: 'border-yellow-400/35',
      badge: 'BANCO DO BRASIL',
      bandeira: 'visa'
    };
  }
  if (n.includes('picpay')) {
    return {
      gradiente: 'from-[#065f46] via-[#10b981] to-[#022c22]',
      borda: 'border-emerald-400/35',
      badge: 'PICPAY',
      bandeira: 'mastercard'
    };
  }
  if (n.includes('xp') || n.includes('btg') || n.includes('black') || n.includes('infinite')) {
    return {
      gradiente: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
      borda: 'border-amber-400/35',
      badge: 'BLACK / INFINITE',
      bandeira: 'visa'
    };
  }

  return {
    gradiente: 'from-slate-800 via-slate-900 to-slate-950',
    borda: 'border-amber-400/25',
    badge: 'CRÉDITO',
    bandeira: 'mastercard'
  };
}

function renderizarBandeiraSVG(tipo) {
  if (tipo === 'visa') {
    return `<span class="text-[11px] font-black italic tracking-wider text-white/90 select-none">VISA</span>`;
  }
  if (tipo === 'corrente') {
    return `<i data-lucide="landmark" class="w-4 h-4 text-emerald-300/80"></i>`;
  }
  return `
    <span class="inline-flex items-center select-none" title="Mastercard">
      <span class="w-3.5 h-3.5 rounded-full bg-rose-500/90 inline-block"></span>
      <span class="w-3.5 h-3.5 rounded-full bg-amber-400/90 -ml-1.5 inline-block"></span>
    </span>
  `;
}

/* ==========================================================================
   CAIXINHAS / METAS DE ECONOMIA (COMPARTILHADO VIA SUPABASE)
   ========================================================================== */
async function carregarCaixinhas() {
  if (!client) return;
  try {
    const { data, error } = await client
      .from('caixinhas')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    caixinhasUsuario = data || [];
  } catch (e) {
    caixinhasUsuario = [];
  }
  renderizarCaixinhas();
}

function renderizarCaixinhas() {
  const container = document.getElementById('grid-caixinhas-metas');
  const badgeTotal = document.getElementById('badge-total-caixinhas');
  if (!container) return;

  const totalGuardado = caixinhasUsuario.reduce((acc, c) => acc + Number(c.valor_atual || 0), 0);
  if (badgeTotal) {
    badgeTotal.textContent = `Guardado: ${formatarMoeda(totalGuardado)}`;
  }

  if (caixinhasUsuario.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-6 px-4 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-2.5">
        <div class="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <i data-lucide="piggy-bank" class="w-5 h-5"></i>
        </div>
        <div class="space-y-1 max-w-sm">
          <h4 class="text-xs sm:text-sm font-bold text-slate-200">Nenhuma caixinha criada ainda</h4>
          <p class="text-[11px] text-slate-400 leading-relaxed">Crie metas como Reserva de Emergência, Obra ou Viagem para acompanhar seu progresso separado do saldo mensal.</p>
        </div>
        <button type="button" onclick="abrirModalCaixinha()" class="mt-1 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Criar primeira caixinha
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = caixinhasUsuario.map(c => {
    const atual = Number(c.valor_atual || 0);
    const meta = Number(c.valor_meta || 1);
    const pctReal = meta > 0 ? Math.round((atual / meta) * 100) : 0;
    const pctBarra = Math.min(pctReal, 100);
    const concluida = atual >= meta;
    const falta = Math.max(meta - atual, 0);

    return `
      <div class="p-3.5 rounded-2xl bg-slate-950/75 border ${concluida ? 'border-emerald-500/40' : 'border-slate-800/90'} flex flex-col justify-between space-y-2.5">
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <div class="w-7 h-7 rounded-lg ${concluida ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/15 text-sky-400'} flex items-center justify-center shrink-0">
                <i data-lucide="${c.icone || 'piggy-bank'}" class="w-3.5 h-3.5"></i>
              </div>
              <h3 class="text-xs font-bold text-white truncate" title="${c.nome}">${c.nome}</h3>
            </div>
            <div class="flex items-center gap-0.5 shrink-0">
              <button type="button" onclick="editarCaixinha('${c.id}')" title="Editar caixinha" class="p-1 text-slate-500 hover:text-sky-400 transition"><i data-lucide="pencil" class="w-3 h-3"></i></button>
              <button type="button" onclick="deletarCaixinha('${c.id}')" title="Excluir caixinha" class="p-1 text-slate-500 hover:text-rose-400 transition"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
            </div>
          </div>

          <div class="flex items-baseline justify-between">
            <span class="text-sm font-bold font-mono ${concluida ? 'text-emerald-400' : 'text-white'}">${formatarMoeda(atual)}</span>
            <span class="text-[11px] font-mono font-semibold ${concluida ? 'text-emerald-400' : 'text-sky-400'}">${pctReal}%</span>
          </div>

          <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div class="${concluida ? 'bg-emerald-500' : 'bg-sky-500'} h-full transition-all duration-500" style="width:${pctBarra}%"></div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Meta: ${formatarMoeda(meta)}</span>
            <span>${concluida ? 'Meta atingida!' : `Falta: ${formatarMoeda(falta)}`}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/70">
          <button type="button" onclick="abrirModalAporte('${c.id}', 'aportar')" class="py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1 transition active:scale-95">
            <i data-lucide="plus" class="w-3 h-3"></i> Aportar
          </button>
          <button type="button" onclick="abrirModalAporte('${c.id}', 'resgatar')" class="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 font-semibold text-[11px] flex items-center justify-center gap-1 transition active:scale-95">
            <i data-lucide="minus" class="w-3 h-3"></i> Resgatar
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

window.abrirModalCaixinha = function() {
  executarFeedback('clique');
  caixinhaEditandoId = null;
  document.getElementById('modal-caixinha-titulo').innerHTML = '<i data-lucide="piggy-bank" class="w-4 h-4 text-emerald-400"></i> Nova Caixinha';
  document.getElementById('btn-salvar-caixinha').innerText = 'Salvar Caixinha';
  formCaixinha?.reset();
  abrirModalAnimado('modal-caixinha', 'modal-caixinha-content');
  if (window.lucide) lucide.createIcons();
};

window.fecharModalCaixinha = function() {
  fecharModalAnimado('modal-caixinha', 'modal-caixinha-content', () => {
    formCaixinha?.reset();
    caixinhaEditandoId = null;
  });
};

window.editarCaixinha = function(id) {
  const c = caixinhasUsuario.find(item => item.id === id);
  if (!c) return;
  executarFeedback('clique');
  caixinhaEditandoId = id;
  document.getElementById('modal-caixinha-titulo').innerHTML = '<i data-lucide="piggy-bank" class="w-4 h-4 text-sky-400"></i> Editar Caixinha';
  document.getElementById('btn-salvar-caixinha').innerText = 'Atualizar Caixinha';
  document.getElementById('caixinha-nome').value = c.nome || '';
  document.getElementById('caixinha-meta').value = Number(c.valor_meta || 0).toFixed(2);
  document.getElementById('caixinha-atual').value = Number(c.valor_atual || 0).toFixed(2);
  document.getElementById('caixinha-icone').value = c.icone || 'piggy-bank';
  abrirModalAnimado('modal-caixinha', 'modal-caixinha-content');
  if (window.lucide) lucide.createIcons();
};

window.deletarCaixinha = async function(id) {
  if (!client) return;
  const c = caixinhasUsuario.find(item => item.id === id);
  if (!c) return;
  if (await customConfirm(`Excluir a caixinha "${c.nome}"?`, 'perigo')) {
    const { error } = await client.from('caixinhas').delete().eq('id', id);
    if (error) {
      mostrarToast('Erro ao excluir caixinha: ' + error.message, 'erro');
    } else {
      mostrarToast('Caixinha excluída!', 'sucesso');
      await carregarCaixinhas();
    }
  }
};

formCaixinha?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client) return;

  const btn = document.getElementById('btn-salvar-caixinha');
  const nome = document.getElementById('caixinha-nome').value.trim();
  const valorMeta = parseFloat(document.getElementById('caixinha-meta').value) || 0;
  const valorAtual = parseFloat(document.getElementById('caixinha-atual').value) || 0;
  const icone = document.getElementById('caixinha-icone').value || 'piggy-bank';

  if (!nome || valorMeta <= 0) {
    return mostrarToast('Preencha o nome e um valor de meta válido.', 'aviso');
  }

  btn.disabled = true;
  btn.innerText = 'Salvando...';

  try {
    if (caixinhaEditandoId) {
      const { error } = await client
        .from('caixinhas')
        .update({ nome, valor_meta: valorMeta, valor_atual: valorAtual, icone })
        .eq('id', caixinhaEditandoId);
      if (error) throw error;
      mostrarToast('Caixinha atualizada!', 'sucesso');
    } else {
      const { error } = await client
        .from('caixinhas')
        .insert([{ user_id: usuarioLogadoId, nome, valor_meta: valorMeta, valor_atual: valorAtual, icone }]);
      if (error) throw error;
      mostrarToast('Caixinha criada!', 'sucesso');
    }

    fecharModalCaixinha();
    await carregarCaixinhas();
  } catch (err) {
    mostrarToast('Erro ao salvar caixinha: ' + err.message, 'erro');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Salvar Caixinha';
  }
});

window.abrirModalAporte = function(id, tipo = 'aportar') {
  const c = caixinhasUsuario.find(item => item.id === id);
  if (!c) return;
  executarFeedback('clique');
  caixinhaAporteId = id;
  tipoMovimentoCaixinha = tipo;

  const tituloEl = document.getElementById('aporte-modal-titulo');
  const btnConfirmar = document.getElementById('btn-confirmar-aporte');
  document.getElementById('aporte-caixinha-nome').textContent = c.nome;
  document.getElementById('aporte-valor-input').value = '';

  if (tipo === 'aportar') {
    tituloEl.innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 text-emerald-400"></i> Registrar Aporte';
    btnConfirmar.className = 'px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition';
    btnConfirmar.textContent = 'Confirmar Aporte';
  } else {
    tituloEl.innerHTML = '<i data-lucide="minus-circle" class="w-4 h-4 text-amber-400"></i> Resgatar Valor';
    btnConfirmar.className = 'px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition';
    btnConfirmar.textContent = 'Confirmar Resgate';
  }

  abrirModalAnimado('modal-aporte-caixinha', 'modal-aporte-content');
  if (window.lucide) lucide.createIcons();
  setTimeout(() => document.getElementById('aporte-valor-input')?.focus(), 250);
};

window.fecharModalAporte = function() {
  fecharModalAnimado('modal-aporte-caixinha', 'modal-aporte-content', () => {
    formAporteCaixinha?.reset();
    caixinhaAporteId = null;
  });
};

formAporteCaixinha?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client || !caixinhaAporteId) return;

  const val = parseFloat(document.getElementById('aporte-valor-input').value) || 0;
  if (val <= 0) return mostrarToast('Informe um valor maior que zero.', 'aviso');

  const c = caixinhasUsuario.find(item => item.id === caixinhaAporteId);
  if (!c) return;

  const atual = Number(c.valor_atual || 0);
  let novoValor = atual;

  if (tipoMovimentoCaixinha === 'aportar') {
    novoValor = Number((atual + val).toFixed(2));
  } else {
    if (val > atual) {
      return mostrarToast('O valor de resgate é maior que o saldo guardado na caixinha.', 'erro');
    }
    novoValor = Number((atual - val).toFixed(2));
  }

  const btn = document.getElementById('btn-confirmar-aporte');
  btn.disabled = true;

  try {
    const { error } = await client
      .from('caixinhas')
      .update({ valor_atual: novoValor })
      .eq('id', caixinhaAporteId);

    if (error) throw error;

    const msgSucesso = tipoMovimentoCaixinha === 'aportar'
      ? `Aporte de ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} registrado!`
      : `Resgate de ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} realizado!`;

    mostrarToast(msgSucesso, 'sucesso');
    fecharModalAporte();
    await carregarCaixinhas();
  } catch (err) {
    mostrarToast('Erro ao atualizar caixinha: ' + err.message, 'erro');
  } finally {
    btn.disabled = false;
  }
});

/* ==========================================================================
   PAGAMENTO DE FATURA EM 1 CLIQUE (APENAS QUITAÇÃO)
   ========================================================================== */
window.pagarFaturaEmUmClique = async function(contaId) {
  if (!client) return;
  executarFeedback('clique');

  const cartao = contasUsuario.find(c => c.id === contaId);
  if (!cartao) return;

  const pendentes = obterTransacoesDaVisao().filter(
    t => t.conta_id === contaId &&
         t.tipo !== 'Receita' &&
         t.status !== 'Pago' &&
         (!t.user_id || t.user_id === usuarioLogadoId)
  );

  if (pendentes.length === 0) {
    return mostrarToast(`Nenhuma pendência na fatura ${cartao.nome}.`, 'aviso');
  }

  const totalFatura = pendentes.reduce((acc, t) => acc + Number(t.valor), 0);
  const totalFmt = totalFatura.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const confirmouQuitacao = await customConfirm(
    `Quitar ${pendentes.length} lançamento(s) da fatura "${cartao.nome}" (${mesAtual}) no valor total de ${totalFmt}?`,
    'info',
    'Pagar Fatura'
  );
  if (!confirmouQuitacao) return;

  try {
    const idsParaQuitar = pendentes.map(t => t.id);
    const { error } = await client.from('transacoes').update({ status: 'Pago' }).in('id', idsParaQuitar);
    if (error) throw error;

    mostrarToast(`Fatura ${cartao.nome} marcada como paga!`, 'sucesso');
    await carregarTransacoes();
  } catch (err) {
    mostrarToast('Erro ao pagar fatura: ' + err.message, 'erro');
  }
};

/* ==========================================================================
   ALERTAS DE VENCIMENTO DE FATURA (<= 3 DIAS)
   ========================================================================== */
window.filtrarFaturaAlerta = function(contaId) {
  executarFeedback('clique');
  filtroContaIdAtiva = contaId;
  const badge = document.getElementById('badge-filtro-conta');
  const textoBadge = document.getElementById('texto-filtro-conta');
  if (badge && textoBadge) {
    const c = contasUsuario.find(c => c.id === contaId);
    textoBadge.textContent = c ? c.nome : 'Cartão';
    badge.classList.remove('hidden');
  }
  aplicarFiltroTipo('pendentes');
  renderizarGridContas();
  document.getElementById('filtro-busca')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

function verificarAlertasVencimento() {
  const container = document.getElementById('container-alerta-vencimento');
  if (!container) return;

  const hoje = new Date();
  const mesSistema = hoje.toISOString().slice(0, 7);

  if (mesAtual !== mesSistema) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const diaHoje = hoje.getDate();
  const anoAtual = hoje.getFullYear();
  const mesIndex = hoje.getMonth();
  const ultimoDiaMes = new Date(anoAtual, mesIndex + 1, 0).getDate();

  const alertas = [];
  const transacoesVisao = obterTransacoesDaVisao();

  contasUsuario.forEach(conta => {
    if (conta.tipo !== 'Cartão de Crédito' || !conta.dia_vencimento) return;

    const diaVenc = Math.min(Number(conta.dia_vencimento), ultimoDiaMes);
    const diffDias = diaVenc - diaHoje;

    if (diffDias >= 0 && diffDias <= 3) {
      const pendentesCartao = transacoesVisao.filter(
        t => t.conta_id === conta.id && t.tipo !== 'Receita' && t.status !== 'Pago'
      );

      if (pendentesCartao.length > 0) {
        const valorPendente = pendentesCartao.reduce((acc, t) => acc + Number(t.valor), 0);
        alertas.push({
          contaId: conta.id,
          nome: conta.nome,
          diaVenc,
          diffDias,
          valorPendente
        });
      }
    }
  });

  if (alertas.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = alertas.map(a => {
    const isHoje = a.diffDias === 0;
    const textoPrazo = isHoje
      ? 'vence hoje!'
      : a.diffDias === 1
        ? 'vence amanhã (dia ' + a.diaVenc + ')'
        : `vence em ${a.diffDias} dias (dia ${a.diaVenc})`;

    return `
      <div class="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border transition ${isHoje ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'}">
        <div class="flex items-center gap-2 text-xs">
          <i data-lucide="bell-ring" class="w-4 h-4 shrink-0 ${isHoje ? 'text-rose-400 animate-bounce' : 'text-amber-400'}"></i>
          <span>
            Fatura <strong class="text-white">${a.nome}</strong> ${textoPrazo} — 
            <strong class="font-mono ${isHoje ? 'text-rose-300' : 'text-amber-300'}">${formatarMoeda(a.valorPendente)}</strong> pendente.
          </span>
        </div>
        <div class="flex items-center gap-1.5 ml-auto">
          <button type="button" onclick="filtrarFaturaAlerta('${a.contaId}')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition active:scale-95 bg-slate-900/70 hover:bg-slate-900 text-slate-200 border border-slate-700/60">
            Ver Itens
          </button>
          <button type="button" onclick="pagarFaturaEmUmClique('${a.contaId}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition active:scale-95 bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-1">
            <i data-lucide="check-circle-2" class="w-3 h-3"></i> Pagar Fatura
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   VISÃO DE COMPROMETIMENTO FUTURO (PRÓXIMOS 3 MESES)
   ========================================================================== */
async function carregarComprometimentoFuturo() {
  const container = document.getElementById('grid-comprometimento-futuro');
  const legendaEl = document.getElementById('legenda-base-renda-futura');
  if (!client || !container) return;

  const mesesFuturos = [];
  let [a, m] = mesAtual.split('-').map(Number);

  for (let i = 1; i <= 3; i++) {
    m++;
    if (m > 12) { m = 1; a++; }
    const compStr = `${a}-${String(m).padStart(2, '0')}`;
    const nomeMes = new Date(a, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
    mesesFuturos.push({
      comp: compStr,
      titulo: `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}/${String(a).slice(2)}`
    });
  }

  const codigosMeses = mesesFuturos.map(x => x.comp);
  let q = client.from('transacoes')
    .select('valor, tipo, mes_competencia, parcela_total, id_agrupador, user_id, atribuido_para_email')
    .in('mes_competencia', codigosMeses);

  if (usuarioLogadoId) {
    q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);
  }

  const { data } = await q;
  const listaVisao = obterTransacoesDaVisao(data || []);

  const rendaMesAtual = obterTransacoesDaVisao()
    .filter(t => t.tipo === 'Receita')
    .reduce((acc, t) => acc + Number(t.valor), 0);

  let usouReferenciaAtual = false;

  container.innerHTML = mesesFuturos.map(mf => {
    const txsMes = listaVisao.filter(t => t.mes_competencia === mf.comp);
    const rendaMesFuturo = txsMes
      .filter(t => t.tipo === 'Receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const baseRenda = rendaMesFuturo > 0 ? rendaMesFuturo : rendaMesAtual;
    if (rendaMesFuturo === 0 && rendaMesAtual > 0) usouReferenciaAtual = true;

    let totalParcelas = 0;
    let totalFixas = 0;

    txsMes.forEach(t => {
      if (t.tipo === 'Receita') return;
      const val = Number(t.valor);
      const isParcela = Number(t.parcela_total) > 1;
      const isFixa = t.id_agrupador && String(t.id_agrupador).startsWith('fixo_');

      if (isParcela) totalParcelas += val;
      else if (isFixa) totalFixas += val;
    });

    const totalTravado = totalParcelas + totalFixas;
    const pct = baseRenda > 0 ? Math.min(Math.round((totalTravado / baseRenda) * 100), 100) : 0;
    const pctReal = baseRenda > 0 ? Math.round((totalTravado / baseRenda) * 100) : 0;

    let corBarra = 'bg-emerald-500';
    let corTextoPct = 'text-emerald-400';
    if (pctReal >= 80) {
      corBarra = 'bg-rose-500';
      corTextoPct = 'text-rose-400';
    } else if (pctReal >= 50) {
      corBarra = 'bg-amber-500';
      corTextoPct = 'text-amber-400';
    }

    const livreEstimado = baseRenda > 0 ? baseRenda - totalTravado : 0;

    return `
      <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">${mf.titulo}</span>
          <span class="text-xs font-mono font-bold ${baseRenda > 0 ? corTextoPct : 'text-slate-400'}">
            ${baseRenda > 0 ? `${pctReal}% travado` : 'Sem renda base'}
          </span>
        </div>

        <div class="flex items-baseline justify-between">
          <span class="text-sm sm:text-base font-bold font-mono text-slate-100">${formatarMoeda(totalTravado)}</span>
          ${baseRenda > 0 ? `<span class="text-[10px] font-mono ${livreEstimado < 0 ? 'text-rose-400' : 'text-slate-400'}">Livre: ${formatarMoeda(livreEstimado)}</span>` : ''}
        </div>

        <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
          <div class="${corBarra} h-full transition-all duration-500" style="width:${baseRenda > 0 ? pct : 0}%"></div>
        </div>

        <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/70 font-mono">
          <span>Parc.: <strong class="text-slate-200">${formatarMoeda(totalParcelas)}</strong></span>
          <span>Fixas: <strong class="text-slate-200">${formatarMoeda(totalFixas)}</strong></span>
        </div>
      </div>
    `;
  }).join('');

  if (legendaEl) {
    legendaEl.textContent = usouReferenciaAtual
      ? 'Baseado na receita prevista ou na renda do mês atual'
      : 'Renda já travada com parcelas e contas fixas';
  }
}

/* ==========================================================================
   RENDERIZAÇÃO DO EXTRATO (COM BADGES DE CATEGORIA COLORIDOS E EMPTY STATE)
   ========================================================================== */
function renderizarTransacoes() {
  const cm = document.getElementById('lista-transacoes-mobile');
  const cd = document.getElementById('lista-transacoes-desktop');
  if (!cm || !cd) return;

  const f = obterTransacoesDaVisao().filter(t => {
    if (filtroContaIdAtiva && t.conta_id !== filtroContaIdAtiva) return false;
    if (filtroTipoAtivo === 'pendentes' && t.status === 'Pago') return false;
    if (filtroTipoAtivo !== 'todos' && filtroTipoAtivo !== 'pendentes' && t.tipo !== filtroTipoAtivo) return false;
    if (termoBuscaAtivo) {
      const cat = (categoriasUsuario.find(c => c.id === t.categoria_id) || { nome: '' }).nome.toLowerCase();
      const desc = (t.descricao || '').toLowerCase();
      const atr = (t.atribuido_para_email || '').toLowerCase();
      return desc.includes(termoBuscaAtivo) || cat.includes(termoBuscaAtivo) || atr.includes(termoBuscaAtivo);
    }
    return true;
  });

  if (contadorTransacoes) contadorTransacoes.innerText = `${f.length} registro${f.length !== 1 ? 's' : ''}`;

  if (!f.length) {
    const temFiltroAtivo = Boolean(termoBuscaAtivo || filtroContaIdAtiva || filtroTipoAtivo !== 'todos');
    const iconeVazio = temFiltroAtivo ? 'search-x' : 'receipt';
    const tituloVazio = temFiltroAtivo ? 'Nenhum lançamento encontrado' : 'Nenhum lançamento neste mês';
    const subtituloVazio = temFiltroAtivo
      ? 'Nenhum registro corresponde aos filtros ou busca atual.'
      : 'Seu extrato está limpo por enquanto. Que tal registrar a primeira movimentação?';

    const botaoAcaoVazio = temFiltroAtivo
      ? `<button type="button" onclick="limparTodosFiltrosExtrato()" class="mt-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition active:scale-95">
           <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Limpar filtros
         </button>`
      : `<button type="button" onclick="abrirModalNovaTx()" class="mt-1 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95">
           <i data-lucide="plus" class="w-3.5 h-3.5"></i> Adicionar primeiro gasto
         </button>`;

    const emptyStateHtml = `
      <div class="py-10 px-4 flex flex-col items-center justify-center text-center space-y-2.5">
        <div class="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-emerald-400 shadow-inner">
          <i data-lucide="${iconeVazio}" class="w-5 h-5"></i>
        </div>
        <div class="space-y-1 max-w-xs">
          <h4 class="text-sm font-bold text-slate-200">${tituloVazio}</h4>
          <p class="text-xs text-slate-400 leading-relaxed">${subtituloVazio}</p>
        </div>
        ${botaoAcaoVazio}
      </div>
    `;

    cm.innerHTML = emptyStateHtml;
    cd.innerHTML = `<tr><td colspan="9">${emptyStateHtml}</td></tr>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  cm.innerHTML = f.map(t => {
    const v = formatarMoeda(t.valor), isR = t.tipo === 'Receita', isL = t.status === 'Pago';
    const pB = t.parcela_total > 1 ? `<span class="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">${t.parcela_atual}/${t.parcela_total}</span>` : '';
    const nCt = (contasUsuario.find(c => c.id === t.conta_id) || { nome: 'Conta' }).nome;
    const catObj = categoriasUsuario.find(c => c.id === t.categoria_id);
    const estCat = obterEstiloCategoria(catObj?.id);
    const nCat = catObj ? catObj.nome : 'Geral';
    const sD = !t.user_id || t.user_id === usuarioLogadoId;
    const cM = t.atribuido_para_email === usuarioLogadoEmail && !sD;
    const bC = cM ? `<span class="bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><i data-lucide="lock" class="w-2.5 h-2.5"></i> ${t.criador_nome || 'Admin'}</span>` : (t.atribuido_para_email ? `<span class="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><i data-lucide="user" class="w-2.5 h-2.5"></i> ${t.atribuido_para_email}</span>` : '');
    const cS = isL ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : (isR ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40');
    const iS = isL ? 'check-circle-2' : (isR ? 'arrow-down-left' : 'clock');
    const tS = isR ? (isL ? 'Recebido' : 'A Receber') : (isL ? 'Pago' : 'Previsto');

    return `
      <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 flex-wrap"><h4 class="text-sm font-bold text-white">${t.descricao}</h4>${pB}${bC}</div>
            <div class="flex items-center gap-2 text-[11px] text-slate-400">
              <span class="font-mono text-slate-500">${t.data_movimento.split('-').reverse().join('/')}</span>
              <span>•</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${estCat.bg} border ${estCat.border} ${estCat.text} text-[10px] font-medium">
                <i data-lucide="${catObj ? catObj.icone : 'tag'}" class="w-3 h-3 ${estCat.icone}"></i>${nCat}
              </span>
              <span>•</span>
              <span>${nCt}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-sm font-bold font-mono ${isR ? 'text-emerald-400' : 'text-slate-100'}">${isR ? '+' : '-'} ${v}</span>
            <span class="block text-[10px] text-slate-500">${t.tipo}</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
          ${sD ? `<button onclick="alternarStatus('${t.id}', '${t.status}')" class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition active:scale-95 ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS}</button>` : `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border opacity-80 cursor-default ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS} (Leitura)</span>`}
          ${sD ? `<div class="flex items-center gap-1"><button onclick="duplicarTransacao('${t.id}')" title="Duplicar lançamento" class="p-2 text-slate-500 hover:text-emerald-400 transition"><i data-lucide="copy" class="w-4 h-4"></i></button><button onclick="editarTransacao('${t.id}')" title="Editar lançamento" class="p-2 text-slate-500 hover:text-sky-400 transition"><i data-lucide="pencil" class="w-4 h-4"></i></button><button onclick="deletarTransacao('${t.id}', '${t.id_agrupador || null}')" title="Excluir lançamento" class="p-2 text-slate-500 hover:text-rose-400 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>` : `<span class="p-2 text-slate-600"><i data-lucide="lock" class="w-4 h-4"></i></span>`}
        </div>
      </div>`;
  }).join('');

  cd.innerHTML = f.map(t => {
    const v = formatarMoeda(t.valor), isR = t.tipo === 'Receita', isL = t.status === 'Pago';
    const pB = t.parcela_total > 1 ? `<span class="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">${t.parcela_atual}/${t.parcela_total}</span>` : '-';
    const nCt = (contasUsuario.find(c => c.id === t.conta_id) || { nome: 'Padrão' }).nome;
    const catObj = categoriasUsuario.find(c => c.id === t.categoria_id);
    const estCat = obterEstiloCategoria(catObj?.id);
    const nCat = catObj ? catObj.nome : 'Sem Categoria';
    const sD = !t.user_id || t.user_id === usuarioLogadoId;
    const cM = t.atribuido_para_email === usuarioLogadoEmail && !sD;
    const bC = cM ? `<span class="ml-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1"><i data-lucide="lock" class="w-2.5 h-2.5"></i> ${t.criador_nome || 'Admin'}</span>` : (t.atribuido_para_email ? `<span class="ml-1.5 bg-slate-800 border border-slate-700 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1"><i data-lucide="user" class="w-2.5 h-2.5"></i> ${t.atribuido_para_email.split('@')[0]}</span>` : '');
    const cS = isL ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : (isR ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40');
    const iS = isL ? 'check-circle-2' : (isR ? 'arrow-down-left' : 'clock');
    const tS = isR ? (isL ? 'Recebido' : 'A Receber') : (isL ? 'Pago' : 'Previsto');

    return `
      <tr class="hover:bg-slate-800/20 transition group">
        <td class="py-2.5 font-mono text-slate-400">${t.data_movimento.split('-').reverse().join('/')}</td>
        <td class="py-2.5 font-medium text-white flex items-center">${t.descricao}${bC}</td>
        <td class="py-2.5 text-slate-300">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${estCat.bg} border ${estCat.border} ${estCat.text} text-[11px]">
            <i data-lucide="${catObj ? catObj.icone : 'tag'}" class="w-3 h-3 ${estCat.icone}"></i>${nCat}
          </span>
        </td>
        <td class="py-2.5 text-slate-400 font-medium">${nCt}</td>
        <td class="py-2.5"><span class="px-2 py-0.5 rounded text-[10px] ${isR ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${t.tipo}</span></td>
        <td class="py-2.5">${pB}</td>
        <td class="py-2.5 text-right font-mono font-medium ${isR ? 'text-emerald-400' : 'text-slate-200'}">${isR ? '+' : '-'} ${v}</td>
        <td class="py-2.5 text-center">${sD ? `<button onclick="alternarStatus('${t.id}', '${t.status}')" class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition active:scale-95 ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS}</button>` : `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border opacity-75 cursor-default ${cS}"><i data-lucide="lock" class="w-3 h-3"></i>${tS}</span>`}</td>
        <td class="py-2.5 text-center">${sD ? `<div class="flex items-center justify-center gap-1"><button onclick="duplicarTransacao('${t.id}')" title="Duplicar lançamento" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-emerald-400 transition"><i data-lucide="copy" class="w-4 h-4"></i></button><button onclick="editarTransacao('${t.id}')" title="Editar lançamento" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-sky-400 transition"><i data-lucide="pencil" class="w-4 h-4"></i></button><button onclick="deletarTransacao('${t.id}', '${t.id_agrupador || null}')" title="Excluir lançamento" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>` : `<span class="p-1 text-slate-600"><i data-lucide="lock" class="w-3.5 h-3.5 inline"></i></span>`}</td>
      </tr>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function atualizarTotais() {
  let fat = 0, rec = 0, desp = 0;
  obterTransacoesDaVisao().forEach(t => {
    const v = Number(t.valor);
    if (t.tipo === 'Receita') rec += v;
    else if (t.tipo === 'Despesa Cartão') fat += v;
    else desp += v;
  });

  const totalDespesas = fat + desp;
  const saldoMes = rec - totalDespesas;

  animarContadorMoeda('card-fatura', fat);
  animarContadorMoeda('card-receita', rec);
  animarContadorMoeda('card-despesa', totalDespesas);
  animarContadorMoeda('card-saldo', saldoMes);
}

/* ==========================================================================
   AÇÕES DE CONFIGURAÇÕES, CONTAS, CATEGORIAS E TRANSAÇÕES
   ========================================================================== */
function atualizarSwitchVisual() {
  if (!toggleSomSwitch || !toggleSomKnob) return;
  if (configFeedbackAtivo) {
    toggleSomSwitch.className = 'w-11 h-6 rounded-full bg-emerald-500 p-0.5 transition-colors relative flex items-center cursor-pointer';
    toggleSomKnob.className = 'w-5 h-5 rounded-full bg-white shadow transform translate-x-5 transition-transform';
  } else {
    toggleSomSwitch.className = 'w-11 h-6 rounded-full bg-slate-800 p-0.5 transition-colors relative flex items-center cursor-pointer';
    toggleSomKnob.className = 'w-5 h-5 rounded-full bg-slate-400 shadow transform translate-x-0 transition-transform';
  }
}

document.getElementById('btn-abrir-config')?.addEventListener('click', () => {
  executarFeedback('clique');
  if (client) {
    client.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (configUserEmailInput) configUserEmailInput.value = user.email || '';
        if (configNomeInput) configNomeInput.value = user.user_metadata?.nome || '';
        if (configTelefoneInput) configTelefoneInput.value = user.user_metadata?.telefone || '';
      }
    });
  }
  atualizarSwitchVisual();
  aplicarTemaNaInterface();
  atualizarAbaBottomAtiva('ajustes');
  containerFormSenha?.classList.add('hidden');
  iconeSetaSenha?.classList.remove('rotate-180');
  abrirModalAnimado('modal-configuracoes', 'modal-config-content');
});

document.getElementById('btn-fechar-config')?.addEventListener('click', () => {
  fecharModalAnimado('modal-configuracoes', 'modal-config-content', () => {
    atualizarAbaBottomAtiva('inicio');
  });
});

document.getElementById('config-btn-logout')?.addEventListener('click', async () => {
  fecharModalAnimado('modal-configuracoes', 'modal-config-content');
  if (client) await client.auth.signOut();
});

btnSalvarPerfil?.addEventListener('click', async () => {
  if (!client) return;
  const novoNome = configNomeInput?.value.trim();
  const novoTelefone = configTelefoneInput?.value.trim() || '';
  if (!novoNome) return mostrarToast('Informe seu nome.', 'aviso');

  btnSalvarPerfil.disabled = true;
  btnSalvarPerfil.innerText = 'Salvando...';
  try {
    const { error } = await client.auth.updateUser({ data: { nome: novoNome, telefone: novoTelefone } });
    if (error) throw error;
    if (labelSaudacaoUsuario) labelSaudacaoUsuario.textContent = `Olá, ${novoNome}!`;
    mostrarToast('Perfil atualizado!', 'sucesso');
  } catch (err) {
    mostrarToast('Erro: ' + err.message, 'erro');
  } finally {
    btnSalvarPerfil.disabled = false;
    btnSalvarPerfil.innerText = 'Salvar Perfil';
  }
});

toggleSomSwitch?.addEventListener('click', () => {
  configFeedbackAtivo = !configFeedbackAtivo;
  try { localStorage.setItem('fc_feedback_ativo', configFeedbackAtivo); } catch (e) {}
  atualizarSwitchVisual();
  if (configFeedbackAtivo) executarFeedback('clique');
});

btnToggleSenhaSection?.addEventListener('click', () => {
  executarFeedback('clique');
  const aberto = !containerFormSenha.classList.contains('hidden');
  containerFormSenha.classList.toggle('hidden', aberto);
  iconeSetaSenha?.classList.toggle('rotate-180', !aberto);
});

btnSalvarNovaSenha?.addEventListener('click', async () => {
  if (!client) return;
  const n1 = novaSenhaInput?.value || '';
  const n2 = confirmaSenhaInput?.value || '';
  if (n1.length < 6) return mostrarToast('Mínimo 6 caracteres.', 'aviso');
  if (n1 !== n2) return mostrarToast('As senhas não coincidem.', 'erro');

  btnSalvarNovaSenha.disabled = true;
  btnSalvarNovaSenha.innerText = 'Atualizando...';
  try {
    const { error } = await client.auth.updateUser({ password: n1 });
    if (error) throw error;
    mostrarToast('Senha atualizada!', 'sucesso');
    novaSenhaInput.value = '';
    confirmaSenhaInput.value = '';
    containerFormSenha.classList.add('hidden');
  } catch (err) {
    mostrarToast('Erro: ' + err.message, 'erro');
  } finally {
    btnSalvarNovaSenha.disabled = false;
    btnSalvarNovaSenha.innerText = 'Atualizar Senha';
  }
});

btnFeedbackWpp?.addEventListener('click', async () => {
  executarFeedback('clique');
  let nome = 'Testador', email = 'Não informado';
  if (client) {
    const { data: { user } } = await client.auth.getUser();
    nome = user?.user_metadata?.nome || 'Testador';
    email = user?.email || 'Não informado';
  }
  const msg = `Fala Matheus! Testando o *FinanceControl*.\n\n*Testador:* ${nome}\n*E-mail:* ${email}\n\n*Relato:*\n`;
  window.open(`https://wa.me/${NUMERO_WHATSAPP_TESTES}?text=${encodeURIComponent(msg)}`, '_blank');
});

// --- Categorias ---
function atualizarVisibilidadeTetoCategoria() {
  if (!categoriaTipoFluxo) return;
  if (categoriaTipoFluxo.value === 'Receita') {
    campoContainerTeto?.classList.add('hidden');
    if (campoContainerIcone) campoContainerIcone.className = 'col-span-2';
    if (categoriaTeto) categoriaTeto.value = '';
  } else {
    campoContainerTeto?.classList.remove('hidden');
    if (campoContainerIcone) campoContainerIcone.className = 'col-span-1';
  }
}

categoriaTipoFluxo?.addEventListener('change', atualizarVisibilidadeTetoCategoria);
selectCategoriaIcone?.addEventListener('change', () => {
  if (previewIconeCategoria) {
    previewIconeCategoria.innerHTML = `<i data-lucide="${selectCategoriaIcone.value || 'tag'}" class="w-4 h-4"></i>`;
    if (window.lucide) lucide.createIcons();
  }
});

window.abrirModalCategoriaRapido = function() {
  atualizarVisibilidadeTetoCategoria();
  abrirModalAnimado('modal-categoria', 'modal-categoria-content');
};

document.getElementById('btn-abrir-modal-categoria')?.addEventListener('click', abrirModalCategoriaRapido);

function fecharModalCategoria() {
  fecharModalAnimado('modal-categoria', 'modal-categoria-content', () => formCategoria?.reset());
}
document.getElementById('btn-fechar-modal-categoria')?.addEventListener('click', fecharModalCategoria);
document.getElementById('btn-cancelar-modal-categoria')?.addEventListener('click', fecharModalCategoria);

formCategoria?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client) return;
  const btn = document.getElementById('btn-salvar-categoria');
  btn.disabled = true;
  btn.innerText = 'Salvando...';

  const nome = document.getElementById('categoria-nome').value.trim();
  const tipo = categoriaTipoFluxo.value;
  const tetoMensal = tipo === 'Despesa' ? (parseFloat(categoriaTeto.value) || null) : null;
  const icone = selectCategoriaIcone.value;

  try {
    const { error } = await client.from('categorias').insert([{ nome, tipo, teto_mensal: tetoMensal, icone, user_id: usuarioLogadoId }]);
    if (error) throw error;
    mostrarToast('Categoria salva!', 'sucesso');
    fecharModalCategoria();
    await buscarOuCriarCategorias();
    await carregarTransacoes();
  } catch (err) {
    mostrarToast('Erro: ' + err.message, 'erro');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Salvar';
  }
});

window.editarTetoCategoria = function(id, nome, tetoAtual) {
  categoriaEditandoTetoId = id;
  document.getElementById('teto-categoria-nome').textContent = nome;
  document.getElementById('teto-novo-valor').value = Number(tetoAtual || 0).toFixed(2);
  abrirModalAnimado('modal-editar-teto', 'modal-teto-content');
  setTimeout(() => document.getElementById('teto-novo-valor').focus(), 300);
};
window.fecharModalTeto = () => fecharModalAnimado('modal-editar-teto', 'modal-teto-content', () => categoriaEditandoTetoId = null);

document.getElementById('form-editar-teto')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client || !categoriaEditandoTetoId) return;
  const t = parseFloat(document.getElementById('teto-novo-valor').value);
  if (isNaN(t) || t < 0) return mostrarToast('Valor inválido', 'erro');
  const { error } = await client.from('categorias').update({ teto_mensal: t === 0 ? null : t }).eq('id', categoriaEditandoTetoId);
  if (error) mostrarToast('Erro: ' + error.message, 'erro');
  else {
    mostrarToast('Limite atualizado!', 'sucesso');
    fecharModalTeto();
    await buscarOuCriarCategorias();
    renderizarGridCategorias();
  }
});

window.deletarCategoria = async function(id, nome) {
  if (await customConfirm(`Excluir categoria "${nome}"?`, 'perigo')) {
    const { error } = await client.from('categorias').delete().eq('id', id);
    if (error) mostrarToast('Existem lançamentos vinculados.', 'erro');
    else {
      mostrarToast('Excluída!', 'sucesso');
      await buscarOuCriarCategorias();
      await carregarTransacoes();
    }
  }
};

// --- Contas / Cartões ---
contaTipo?.addEventListener('change', () => {
  camposCartao?.classList.toggle('hidden', contaTipo.value !== 'Cartão de Crédito');
});

window.abrirModalContaRapido = function() {
  const inpLimite = document.getElementById('conta-limite');
  if (inpLimite) inpLimite.value = '';
  abrirModalAnimado('modal-conta', 'modal-conta-content');
};

document.getElementById('btn-abrir-modal-conta')?.addEventListener('click', abrirModalContaRapido);

function fecharModalConta() {
  fecharModalAnimado('modal-conta', 'modal-conta-content', () => {
    formConta?.reset();
    contaEditandoId = null;
    document.getElementById('modal-conta-titulo').innerHTML = '<i data-lucide="credit-card" class="w-4 h-4 text-emerald-400"></i> Conta ou Cartão';
    document.getElementById('btn-salvar-conta').innerText = 'Salvar';
    camposCartao?.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  });
}
document.getElementById('btn-fechar-modal-conta')?.addEventListener('click', fecharModalConta);
document.getElementById('btn-cancelar-modal-conta')?.addEventListener('click', fecharModalConta);

window.editarConta = function(id) {
  const c = contasUsuario.find(i => i.id === id);
  if (!c) return;
  contaEditandoId = id;
  document.getElementById('modal-conta-titulo').innerHTML = '<i data-lucide="credit-card" class="w-4 h-4 text-sky-400"></i> Editar Conta';
  document.getElementById('btn-salvar-conta').innerText = 'Atualizar';
  document.getElementById('conta-nome').value = c.nome || '';
  contaTipo.value = c.tipo || 'Cartão de Crédito';

  const limitesSalvos = obterLimitesCartoes();
  const inpLimite = document.getElementById('conta-limite');

  if (c.tipo === 'Cartão de Crédito') {
    camposCartao?.classList.remove('hidden');
    document.getElementById('conta-fechamento').value = c.dia_fechamento || '';
    document.getElementById('conta-vencimento').value = c.dia_vencimento || '';
    if (inpLimite) inpLimite.value = limitesSalvos[c.id] ? Number(limitesSalvos[c.id]).toFixed(2) : '';
  } else {
    camposCartao?.classList.add('hidden');
    if (inpLimite) inpLimite.value = '';
  }

  document.getElementById('conta-saldo-inicial').value = Number(c.saldo_inicial || 0).toFixed(2);
  abrirModalAnimado('modal-conta', 'modal-conta-content');
  if (window.lucide) lucide.createIcons();
};

window.deletarConta = async function(id, nome) {
  if (await customConfirm(`Excluir conta "${nome}"?`, 'perigo')) {
    const { error } = await client.from('contas').delete().eq('id', id);
    if (error) mostrarToast('Existem lançamentos vinculados.', 'erro');
    else {
      salvarLimiteCartao(id, 0);
      mostrarToast('Excluída!', 'sucesso');
      if (filtroContaIdAtiva === id) alternarFiltroConta(null);
      await buscarOuCriarContas();
      await carregarTransacoes();
    }
  }
};

formConta?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client) return;
  const b = document.getElementById('btn-salvar-conta');
  b.disabled = true;
  b.innerText = 'Salvando...';

  const n = document.getElementById('conta-nome').value;
  const t = contaTipo.value;
  const f = t === 'Cartão de Crédito' ? parseInt(document.getElementById('conta-fechamento').value) || null : null;
  const v = t === 'Cartão de Crédito' ? parseInt(document.getElementById('conta-vencimento').value) || null : null;
  const lim = t === 'Cartão de Crédito' ? parseFloat(document.getElementById('conta-limite')?.value) || 0 : 0;
  const s = parseFloat(document.getElementById('conta-saldo-inicial').value) || 0;

  try {
    if (contaEditandoId) {
      const { error } = await client.from('contas').update({ nome: n, tipo: t, dia_fechamento: f, dia_vencimento: v, saldo_inicial: s }).eq('id', contaEditandoId);
      if (error) throw error;
      salvarLimiteCartao(contaEditandoId, lim);
    } else {
      const { data: novaConta, error } = await client
        .from('contas')
        .insert([{ nome: n, tipo: t, dia_fechamento: f, dia_vencimento: v, saldo_inicial: s, user_id: usuarioLogadoId }])
        .select()
        .single();
      if (error) throw error;
      if (novaConta && novaConta.id) salvarLimiteCartao(novaConta.id, lim);
    }
    mostrarToast(contaEditandoId ? 'Conta atualizada!' : 'Conta criada!', 'sucesso');
    fecharModalConta();
    await buscarOuCriarContas();
    renderizarTransacoes();
  } catch (er) {
    mostrarToast('Erro: ' + er.message, 'erro');
  } finally {
    b.disabled = false;
    b.innerText = 'Salvar';
  }
});

// --- Transações ---
function atualizarEstadoTipo() {
  const isAdm = usuarioLogadoEmail && usuarioLogadoEmail.toLowerCase() === ADMIN_EMAIL;
  if (txTipo.value === 'Despesa Cartão') {
    if (!transacaoEditandoId && (!txRecorrente || !txRecorrente.checked)) containerParcelas?.classList.remove('hidden');
    if (isAdm) {
      atualizarSelectEmailsFrequentes();
      containerAtribuicao?.classList.remove('hidden');
    } else {
      containerAtribuicao?.classList.add('hidden');
    }
  } else {
    containerParcelas?.classList.add('hidden');
    containerAtribuicao?.classList.add('hidden');
  }
}

function calcularCompetencia(d, cId) {
  const c = contasUsuario.find(i => i.id === cId);
  const dt = new Date(d + 'T00:00:00');
  let a = dt.getFullYear(), m = dt.getMonth() + 1;
  if (c && c.tipo === 'Cartão de Crédito' && c.dia_fechamento) {
    if (dt.getDate() > c.dia_fechamento) { m++; if (m > 12) { m = 1; a++; } }
  }
  return { ano: a, mes: m, str: `${a}-${String(m).padStart(2, '0')}` };
}

function calcularPrevia() {
  if (!previaParcelamento) return;
  if (txTipo.value !== 'Despesa Cartão' || transacaoEditandoId || (txRecorrente && txRecorrente.checked)) {
    previaParcelamento.innerText = '';
    return;
  }
  const v = parseFloat(txValor.value) || 0, p = parseInt(txParcelas.value) || 1, dt = txData.value, c = txConta.value;
  if (!dt || v <= 0) { previaParcelamento.innerText = ''; return; }
  previaParcelamento.innerText = `${p}x de R$ ${(v / p).toFixed(2)} (1ª em ${calcularCompetencia(dt, c).str})`;
}

txTipo?.addEventListener('change', () => { atualizarEstadoTipo(); atualizarOpcoesCategoriasNoModal(); calcularPrevia(); });
txValor?.addEventListener('input', calcularPrevia);
txData?.addEventListener('change', calcularPrevia);
txConta?.addEventListener('change', calcularPrevia);
txParcelas?.addEventListener('change', calcularPrevia);

txAtribuicaoPredefinida?.addEventListener('change', () => {
  if (txAtribuicaoPredefinida.value === 'outro') {
    txAtribuicaoEmail?.classList.remove('hidden');
    txAtribuicaoEmail?.focus();
  } else {
    txAtribuicaoEmail?.classList.add('hidden');
    if (txAtribuicaoEmail) txAtribuicaoEmail.value = '';
  }
});

txRecorrente?.addEventListener('change', () => {
  if (txRecorrente.checked) {
    opcoesRecorrencia?.classList.remove('hidden');
    containerParcelas?.classList.add('hidden');
    if (txParcelas) txParcelas.value = '1';
    if (previaParcelamento) previaParcelamento.innerText = '';
  } else {
    opcoesRecorrencia?.classList.add('hidden');
    atualizarEstadoTipo();
    calcularPrevia();
  }
});

window.abrirModalNovaTx = function() {
  executarFeedback('clique');
  atualizarEstadoTipo();
  atualizarOpcoesCategoriasNoModal();
  calcularPrevia();
  abrirModalAnimado('modal-transacao', 'modal-tx-content');
};
document.getElementById('btn-abrir-modal')?.addEventListener('click', abrirModalNovaTx);

function fecharModal() {
  fecharModalAnimado('modal-transacao', 'modal-tx-content', () => {
    formTransacao?.reset();
    transacaoEditandoId = null;
    if (txData) txData.value = new Date().toISOString().slice(0, 10);
    if (previaParcelamento) previaParcelamento.innerText = '';
    txAtribuicaoEmail?.classList.add('hidden');
    opcoesRecorrencia?.classList.add('hidden');
    containerRecorrencia?.classList.remove('hidden');
    document.getElementById('modal-tx-titulo').innerText = 'Novo Lançamento';
    document.getElementById('btn-salvar-tx').innerText = 'Salvar';
  });
}
document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModal);
document.getElementById('btn-cancelar-modal')?.addEventListener('click', fecharModal);

window.duplicarTransacao = function(id) {
  const t = transacoesCarregadas.find(i => i.id === id);
  if (!t) return;

  executarFeedback('clique');
  transacaoEditandoId = null;
  document.getElementById('modal-tx-titulo').innerText = 'Duplicar Lançamento';
  document.getElementById('btn-salvar-tx').innerText = 'Salvar';

  txTipo.value = t.tipo;
  atualizarEstadoTipo();
  atualizarOpcoesCategoriasNoModal();

  const descLimpa = (t.descricao || '').replace(/\s*\(\d+\/\d+\)\s*$/, '').trim();
  txValor.value = Number(t.valor);
  document.getElementById('tx-descricao').value = descLimpa;
  txCategoria.value = t.categoria_id;
  txConta.value = t.conta_id;
  txData.value = new Date().toISOString().slice(0, 10);

  if (t.atribuido_para_email) {
    salvarEmailFrequente(t.atribuido_para_email);
    const emLimpo = t.atribuido_para_email.trim().toLowerCase();
    const emailsSalvos = obterEmailsFrequentes();

    if (emailsSalvos.includes(emLimpo)) {
      txAtribuicaoPredefinida.value = emLimpo;
      txAtribuicaoEmail.classList.add('hidden');
      txAtribuicaoEmail.value = '';
    } else {
      txAtribuicaoPredefinida.value = 'outro';
      txAtribuicaoEmail.classList.remove('hidden');
      txAtribuicaoEmail.value = t.atribuido_para_email;
    }
  } else {
    txAtribuicaoPredefinida.value = '';
    txAtribuicaoEmail.classList.add('hidden');
    txAtribuicaoEmail.value = '';
  }

  if (txParcelas) txParcelas.value = '1';
  if (txRecorrente) txRecorrente.checked = false;
  opcoesRecorrencia?.classList.add('hidden');
  containerRecorrencia?.classList.remove('hidden');
  calcularPrevia();

  abrirModalAnimado('modal-transacao', 'modal-tx-content');
};

window.editarTransacao = function(id) {
  const t = transacoesCarregadas.find(i => i.id === id);
  if (!t) return;
  if (t.user_id && t.user_id !== usuarioLogadoId) return mostrarToast('Apenas o dono pode editar.', 'aviso');

  executarFeedback('clique');
  transacaoEditandoId = id;
  document.getElementById('modal-tx-titulo').innerText = 'Editar Lançamento';
  document.getElementById('btn-salvar-tx').innerText = 'Salvar Alterações';

  txTipo.value = t.tipo;
  atualizarEstadoTipo();
  atualizarOpcoesCategoriasNoModal();

  txValor.value = Number(t.valor);
  document.getElementById('tx-descricao').value = t.descricao;
  txCategoria.value = t.categoria_id;
  txConta.value = t.conta_id;
  txData.value = t.data_movimento;

  if (t.atribuido_para_email) {
    salvarEmailFrequente(t.atribuido_para_email);
    const emLimpo = t.atribuido_para_email.trim().toLowerCase();
    const emailsSalvos = obterEmailsFrequentes();

    if (emailsSalvos.includes(emLimpo)) {
      txAtribuicaoPredefinida.value = emLimpo;
      txAtribuicaoEmail.classList.add('hidden');
      txAtribuicaoEmail.value = '';
    } else {
      txAtribuicaoPredefinida.value = 'outro';
      txAtribuicaoEmail.classList.remove('hidden');
      txAtribuicaoEmail.value = t.atribuido_para_email;
    }
  } else {
    txAtribuicaoPredefinida.value = '';
    txAtribuicaoEmail.classList.add('hidden');
    txAtribuicaoEmail.value = '';
  }

  containerParcelas?.classList.add('hidden');
  containerRecorrencia?.classList.add('hidden');
  previaParcelamento.innerText = '';
  abrirModalAnimado('modal-transacao', 'modal-tx-content');
};

window.alternarStatus = async function(id, s) {
  if (!client) return;
  const t = transacoesCarregadas.find(i => i.id === id);
  if (t && t.user_id && t.user_id !== usuarioLogadoId) return mostrarToast('Apenas o dono pode alterar.', 'aviso');

  executarFeedback('clique');
  const ns = s === 'Pago' ? 'Previsto' : 'Pago';
  const idx = transacoesCarregadas.findIndex(i => i.id === id);
  if (idx !== -1) {
    transacoesCarregadas[idx].status = ns;
    verificarAlertasVencimento();
    renderizarGridContas();
    renderizarTransacoes();
    atualizarTotais();
  }
  const { error } = await client.from('transacoes').update({ status: ns }).eq('id', id);
  if (error) {
    mostrarToast('Erro: ' + error.message, 'erro');
    carregarTransacoes();
  }
};

window.deletarTransacao = async function(id, grp) {
  if (!client) return;
  const t = transacoesCarregadas.find(i => i.id === id);
  if (t && t.user_id && t.user_id !== usuarioLogadoId) return mostrarToast('Apenas o dono pode excluir.', 'aviso');

  if (grp && grp !== 'null' && grp !== 'undefined') {
    const msg = 'Lançamento parcelado ou fixo!\n\n• [Sim, Excluir]: apaga TODAS as parcelas vinculadas.\n• [Cancelar]: escolhe apagar APENAS este mês.';
    if (await customConfirm(msg, 'perigo', 'Excluir Vínculos')) {
      const { error } = await client.from('transacoes').delete().eq('id_agrupador', grp);
      if (error) mostrarToast('Erro: ' + error.message, 'erro');
      else { mostrarToast('Registros excluídos!', 'sucesso'); carregarTransacoes(); }
      return;
    }
    if (!await customConfirm('Deseja excluir APENAS este mês atual?', 'perigo', 'Exclusão Única')) return;
  } else {
    if (!await customConfirm('Deseja excluir definitivamente?', 'perigo')) return;
  }

  const { error } = await client.from('transacoes').delete().eq('id', id);
  if (error) mostrarToast('Erro: ' + error.message, 'erro');
  else {
    mostrarToast('Lançamento excluído!', 'sucesso');
    carregarTransacoes();
  }
};

formTransacao?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client || enviandoTransacao) return;
  enviandoTransacao = true;
  const b = document.getElementById('btn-salvar-tx');
  b.disabled = true;
  b.innerText = 'Gravando...';

  try {
    const tp = txTipo.value, vl = parseFloat(txValor.value), desc = document.getElementById('tx-descricao').value;
    const catId = txCategoria.value, dt = txData.value, ctId = txConta.value;
    let emAtr = null;

    const isAdm = usuarioLogadoEmail && usuarioLogadoEmail.toLowerCase() === ADMIN_EMAIL;
    if (isAdm && tp === 'Despesa Cartão') {
      emAtr = txAtribuicaoPredefinida.value === 'outro'
        ? txAtribuicaoEmail.value.trim().toLowerCase() || null
        : (txAtribuicaoPredefinida.value.trim().toLowerCase() || null);

      if (emAtr) salvarEmailFrequente(emAtr);
    }

    if (transacaoEditandoId) {
      const tO = transacoesCarregadas.find(i => i.id === transacaoEditandoId);
      let uG = false;
      if (tO && tO.id_agrupador) {
        uG = await customConfirm('Compra parcelada/fixa!\n\n• [Sim, Continuar]: altera TODAS as parcelas.\n• [Cancelar]: altera SÓ este mês.', 'info', 'Aplicar Lote');
      }
      if (uG && tO.id_agrupador) {
        const dG = { tipo: tp, valor: vl, categoria_id: catId, conta_id: ctId, atribuido_para_email: emAtr };
        if (tO.id_agrupador.startsWith('fixo_')) dG.descricao = desc;
        const { error: eG } = await client.from('transacoes').update(dG).eq('id_agrupador', tO.id_agrupador);
        if (eG) throw eG;
        const { error: eA } = await client.from('transacoes').update({ descricao: desc, data_movimento: dt }).eq('id', transacaoEditandoId);
        if (eA) throw eA;
      } else {
        const { error } = await client.from('transacoes').update({ tipo: tp, valor: vl, descricao: desc, categoria_id: catId, conta_id: ctId, data_movimento: dt, atribuido_para_email: emAtr }).eq('id', transacaoEditandoId);
        if (error) throw error;
      }
    } else {
      const eR = txRecorrente && txRecorrente.checked;
      const tR = eR ? parseInt(txRecorrenteMeses.value) : (tp === 'Despesa Cartão' ? parseInt(txParcelas.value) : 1);
      const cN = (await client.auth.getUser()).data.user?.user_metadata?.nome || 'Admin';
      const cI = calcularCompetencia(dt, ctId);
      let an = Number(cI.ano), ms = Number(cI.mes);
      const vP = eR ? vl : parseFloat((vl / tR).toFixed(2));
      const cent = eR ? 0 : parseFloat((vl - (vP * tR)).toFixed(2));
      const idA = tR > 1 ? (eR ? 'fixo_' : 'grp_') + Date.now() : null;
      const ls = [];

      for (let i = 1; i <= tR; i++) {
        ls.push({
          id_agrupador: idA,
          data_movimento: dt,
          mes_competencia: `${an}-${String(ms).padStart(2, '0')}`,
          descricao: (!eR && tR > 1) ? `${desc} (${i}/${tR})` : desc,
          tipo: tp,
          valor: (i === 1 ? vP + cent : vP),
          conta_id: ctId,
          categoria_id: catId,
          parcela_atual: eR ? 1 : i,
          parcela_total: eR ? 1 : tR,
          status: 'Previsto',
          user_id: usuarioLogadoId,
          atribuido_para_email: emAtr,
          criador_nome: cN
        });
        ms++;
        if (ms > 12) { ms = 1; an++; }
      }
      const { error } = await client.from('transacoes').insert(ls);
      if (error) throw error;
    }

    mostrarToast(transacaoEditandoId ? 'Atualizado!' : 'Criado!', 'sucesso');
    fecharModal();
    await carregarTransacoes();
  } catch (er) {
    mostrarToast('Erro: ' + er.message, 'erro');
  } finally {
    enviandoTransacao = false;
    b.disabled = false;
    b.innerText = 'Salvar';
  }
});

/* ==========================================================================
   INICIALIZAÇÃO DO APP E SERVICE WORKER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  if (filtroMes) filtroMes.value = mesAtual;
  if (txData) txData.value = new Date().toISOString().slice(0, 10);
  aplicarTemaNaInterface();
  aplicarModoClaroEscuro();
  atualizarIconePrivacidade();
  atualizarSelectEmailsFrequentes();

  if (client) {
    client.auth.onAuthStateChange(async (evt, session) => {
      if (evt === 'PASSWORD_RECOVERY') {
        authScreen?.classList.add('hidden');
        dashboardScreen?.classList.remove('hidden');
        abrirModalAnimado('modal-configuracoes', 'modal-config-content');
        containerFormSenha?.classList.remove('hidden');
        iconeSetaSenha?.classList.add('rotate-180');
        novaSenhaInput?.focus();
        mostrarToast('Defina sua nova senha abaixo.', 'info');
        return;
      }

      if (session) {
        authScreen?.classList.add('hidden');
        dashboardScreen?.classList.remove('hidden');
        usuarioLogadoId = session.user.id;
        usuarioLogadoEmail = session.user.email;
        if (labelSaudacaoUsuario) {
          labelSaudacaoUsuario.textContent = `Olá, ${session.user.user_metadata?.nome || session.user.email.split('@')[0]}!`;
        }
        carregarDadosApp();
      } else {
        usuarioLogadoId = null;
        usuarioLogadoEmail = null;
        dashboardScreen?.classList.add('hidden');
        authScreen?.classList.remove('hidden');
      }
    });
  }

  filtroBusca?.addEventListener('input', (e) => {
    termoBuscaAtivo = e.target.value.toLowerCase().trim();
    renderizarTransacoes();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

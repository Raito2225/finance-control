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
  if (!window.supabase) throw new Error('Biblioteca do Supabase não carregou.');
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  setTimeout(() => {
    if (window.mostrarToast) window.mostrarToast('Erro ao iniciar: ' + err.message, 'erro');
  }, 800);
}

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
let periodoGrafico = '6m'; // '6m' | '3m' | 'ano'
let anoRaioX = new Date().getFullYear();

let transacaoEditandoId = null;
let contaEditandoId = null;
let categoriaEditandoTetoId = null;
let caixinhaEditandoId = null;
let caixinhaAporteId = null;
let tipoMovimentoCaixinha = 'aportar'; // 'aportar' | 'resgatar'
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
   RAIO-X ANUAL (COMPARATIVO MÊS A MÊS DE JAN A DEZ)
   ========================================================================== */
window.abrirModalRaioX = async function() {
  executarFeedback('clique');
  anoRaioX = Number(mesAtual.split('-')[0]) || new Date().getFullYear();
  abrirModalAnimado('modal-raiox', 'modal-raiox-content');
  await carregarDadosRaioX();
};

window.fecharModalRaioX = function() {
  fecharModalAnimado('modal-raiox', 'modal-raiox-content', () => {
    atualizarAbaBottomAtiva('inicio');
  });
};

window.alterarAnoRaioX = async function(delta) {
  executarFeedback('clique');
  anoRaioX += delta;
  await carregarDadosRaioX();
};

window.irParaMesDoRaioX = function(compStr) {
  executarFeedback('clique');
  fecharModalRaioX();
  mesAtual = compStr;
  if (filtroMes) filtroMes.value = mesAtual;
  carregarTransacoes();
};

async function carregarDadosRaioX() {
  const labelAno = document.getElementById('label-ano-raiox');
  const tbody = document.getElementById('tabela-corpo-raiox');
  if (!client || !tbody) return;

  if (labelAno) labelAno.textContent = anoRaioX;
  tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-500 font-sans">Calculando dados de ${anoRaioX}...</td></tr>`;

  const mesesAno = Array.from({ length: 12 }, (_, i) => `${anoRaioX}-${String(i + 1).padStart(2, '0')}`);

  let q = client.from('transacoes')
    .select('valor, tipo, mes_competencia, user_id, atribuido_para_email')
    .in('mes_competencia', mesesAno);

  if (usuarioLogadoId) {
    q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);
  }

  const { data } = await q;
  const listaVisao = obterTransacoesDaVisao(data || []);

  let somaAnualRec = 0;
  let somaAnualDesp = 0;

  tbody.innerHTML = mesesAno.map((comp, idx) => {
    const txs = listaVisao.filter(t => t.mes_competencia === comp);
    let rec = 0;
    let desp = 0;

    txs.forEach(t => {
      const v = Number(t.valor);
      if (t.tipo === 'Receita') rec += v;
      else desp += v;
    });

    somaAnualRec += rec;
    somaAnualDesp += desp;
    const saldo = rec - desp;
    const pct = rec > 0 ? Math.round((desp / rec) * 100) : (desp > 0 ? 100 : 0);

    const nomeMes = new Date(anoRaioX, idx, 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
    const isMesAtual = comp === mesAtual;

    let badgePct = '<span class="text-slate-600">-</span>';
    if (rec > 0 || desp > 0) {
      const corBadge = pct > 90
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        : pct > 70
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      badgePct = `<span class="px-2 py-0.5 rounded-full text-[10px] border ${corBadge}">${pct}%</span>`;
    }

    return `
      <tr onclick="irParaMesDoRaioX('${comp}')" class="cursor-pointer hover:bg-slate-800/40 transition ${isMesAtual ? 'bg-violet-500/10' : ''}">
        <td class="py-2.5 px-3 font-sans font-bold text-white flex items-center gap-1.5">
          ${nomeMes}
          ${isMesAtual ? '<span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>' : ''}
        </td>
        <td class="py-2.5 px-3 text-right text-emerald-400">${formatarMoeda(rec)}</td>
        <td class="py-2.5 px-3 text-right text-rose-400">${formatarMoeda(desp)}</td>
        <td class="py-2.5 px-3 text-right font-bold ${saldo < 0 ? 'text-rose-400' : 'text-slate-100'}">${formatarMoeda(saldo)}</td>
        <td class="py-2.5 px-3 text-center">${badgePct}</td>
      </tr>
    `;
  }).join('');

  const balancoAnual = somaAnualRec - somaAnualDesp;
  document.getElementById('raiox-total-receita').textContent = formatarMoeda(somaAnualRec);
  document.getElementById('raiox-total-despesa').textContent = formatarMoeda(somaAnualDesp);
  const elSaldoAnual = document.getElementById('raiox-total-saldo');
  elSaldoAnual.textContent = formatarMoeda(balancoAnual);
  elSaldoAnual.className = `text-xs sm:text-sm font-mono font-bold ${balancoAnual < 0 ? 'text-rose-400' : 'text-emerald-400'}`;

  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   GERENCIAMENTO DE E-MAILS FREQUENTES (CONTATOS SALVOS)
   ========================================================================== */
function obterEmailsFrequentes() {
  try {
    const raw = localStorage.getItem('fc_emails_frequentes');
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function salvarEmailFrequente(email) {
  if (!email) return;
  const limpo = email.trim().toLowerCase();
  if (!limpo || !limpo.includes('@') || limpo === usuarioLogadoEmail?.toLowerCase()) return;

  const lista = obterEmailsFrequentes();
  const filtrada = lista.filter(e => e !== limpo);
  filtrada.unshift(limpo);
  try {
    localStorage.setItem('fc_emails_frequentes', JSON.stringify(filtrada.slice(0, 10)));
  } catch (e) {}
  atualizarSelectEmailsFrequentes();
}

window.removerEmailFrequente = function(email) {
  executarFeedback('clique');
  const lista = obterEmailsFrequentes().filter(e => e !== email);
  try {
    localStorage.setItem('fc_emails_frequentes', JSON.stringify(lista));
  } catch (e) {}
  atualizarSelectEmailsFrequentes();
};

window.selecionarEmailFrequenteChip = function(email) {
  executarFeedback('clique');
  if (!txAtribuicaoPredefinida) return;
  txAtribuicaoPredefinida.value = email;
  txAtribuicaoEmail?.classList.add('hidden');
  if (txAtribuicaoEmail) txAtribuicaoEmail.value = '';
};

function atualizarSelectEmailsFrequentes() {
  if (!txAtribuicaoPredefinida) return;
  const valorAtual = txAtribuicaoPredefinida.value;
  const emails = obterEmailsFrequentes();

  let htmlOptions = '<option value="">Meu Gasto</option>';
  emails.forEach(em => {
    htmlOptions += `<option value="${em}">${em}</option>`;
  });
  htmlOptions += '<option value="outro">+ Compartilhar com outro e-mail...</option>';
  txAtribuicaoPredefinida.innerHTML = htmlOptions;

  if (valorAtual && (emails.includes(valorAtual) || valorAtual === 'outro')) {
    txAtribuicaoPredefinida.value = valorAtual;
  }

  if (containerChipsEmails && listaChipsEmailsFrequentes) {
    if (emails.length > 0) {
      containerChipsEmails.classList.remove('hidden');
      listaChipsEmailsFrequentes.innerHTML = emails.map(em => `
        <div class="inline-flex items-center bg-slate-900 border border-slate-700/80 rounded-lg overflow-hidden text-[11px]">
          <button type="button" onclick="selecionarEmailFrequenteChip('${em}')" class="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 transition truncate max-w-[160px]" title="${em}">
            ${em.split('@')[0]}
          </button>
          <button type="button" onclick="removerEmailFrequente('${em}')" class="px-1.5 py-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition border-l border-slate-800" title="Remover contato">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      `).join('');
      if (window.lucide) lucide.createIcons();
    } else {
      containerChipsEmails.classList.add('hidden');
    }
  }
}

/* ==========================================================================
   MODAIS ANIMADOS, TOASTS E CONFIRM
   ========================================================================== */
window.abrirModalAnimado = function(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (!modal || !content) return;

  modal.classList.remove('hidden');
  void modal.offsetWidth;

  modal.classList.remove('opacity-0');
  content.classList.remove('translate-y-full', 'sm:translate-y-10', 'sm:scale-95', 'scale-95', 'opacity-0');
  content.classList.add('translate-y-0', 'scale-100', 'opacity-100');
};

window.fecharModalAnimado = function(modalId, contentId, callback) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (!modal || !content) {
    if (callback) callback();
    return;
  }

  modal.classList.add('opacity-0');
  content.classList.remove('translate-y-0', 'scale-100', 'opacity-100');

  if (content.hasAttribute('data-centered')) {
    content.classList.add('scale-95', 'opacity-0');
  } else {
    content.classList.add('translate-y-full', 'sm:translate-y-10', 'sm:scale-95', 'opacity-0');
  }

  setTimeout(() => {
    modal.classList.add('hidden');
    if (callback) callback();
  }, 300);
};

const mapaModaisBackdrop = [
  ['modal-configuracoes', 'modal-config-content'],
  ['modal-categoria', 'modal-categoria-content'],
  ['modal-conta', 'modal-conta-content'],
  ['modal-transacao', 'modal-tx-content'],
  ['modal-editar-teto', 'modal-teto-content'],
  ['modal-caixinha', 'modal-caixinha-content'],
  ['modal-aporte-caixinha', 'modal-aporte-content'],
  ['modal-raiox', 'modal-raiox-content']
];

mapaModaisBackdrop.forEach(([modalId, contentId]) => {
  const modalEl = document.getElementById(modalId);
  modalEl?.addEventListener('click', (e) => {
    if (e.target === modalEl) {
      fecharModalAnimado(modalId, contentId, () => {
        if (modalId === 'modal-configuracoes' || modalId === 'modal-raiox') {
          atualizarAbaBottomAtiva('inicio');
        }
      });
    }
  });
});

const toastContainer = document.getElementById('toast-container');
window.mostrarToast = function(mensagem, tipo = 'erro') {
  if (!toastContainer) return;
  executarFeedback(tipo === 'erro' ? 'clique' : 'sucesso');
  const toast = document.createElement('div');

  let cores, icone;
  if (tipo === 'sucesso') {
    cores = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    icone = 'check-circle-2';
  } else if (tipo === 'info' || tipo === 'aviso') {
    cores = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    icone = 'alert-circle';
  } else {
    cores = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    icone = 'x-octagon';
  }

  toast.className = `flex items-center gap-3 p-3.5 rounded-xl border bg-slate-900 shadow-xl pointer-events-auto transform transition-all duration-300 translate-y-10 opacity-0 ${cores}`;
  toast.innerHTML = `
    <i data-lucide="${icone}" class="w-5 h-5 shrink-0"></i>
    <p class="text-xs font-medium">${mensagem}</p>
    <button type="button" class="ml-auto text-slate-400" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

let confirmResolve = null;
window.customConfirm = function(mensagem, tipo = 'perigo', titulo = 'Confirmação') {
  return new Promise((resolve) => {
    executarFeedback('clique');
    confirmResolve = resolve;
    document.getElementById('modal-confirm-titulo').textContent = titulo;
    document.getElementById('modal-confirm-mensagem').textContent = mensagem;

    const iconEl = document.getElementById('modal-confirm-icon');
    const okBtn = document.getElementById('btn-confirm-ok');

    if (tipo === 'perigo') {
      iconEl.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-500/20 text-rose-400';
      iconEl.innerHTML = '<i data-lucide="alert-triangle" class="w-5 h-5"></i>';
      okBtn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition text-slate-950 bg-rose-500 hover:bg-rose-600 active:scale-95';
      okBtn.textContent = 'Sim, Excluir';
    } else {
      iconEl.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-500/20 text-sky-400';
      iconEl.innerHTML = '<i data-lucide="help-circle" class="w-5 h-5"></i>';
      okBtn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition text-slate-950 bg-sky-500 hover:bg-sky-600 active:scale-95';
      okBtn.textContent = 'Sim, Continuar';
    }

    abrirModalAnimado('modal-confirm', 'modal-confirm-content');
    if (window.lucide) lucide.createIcons();
  });
};

function fecharModalConfirm(resultado) {
  fecharModalAnimado('modal-confirm', 'modal-confirm-content', () => {
    if (confirmResolve) {
      confirmResolve(resultado);
      confirmResolve = null;
    }
  });
}

document.getElementById('btn-confirm-cancel')?.addEventListener('click', () => fecharModalConfirm(false));
document.getElementById('btn-confirm-ok')?.addEventListener('click', () => fecharModalConfirm(true));

/* ==========================================================================
   TEMAS, MODO CLARO/ESCURO, PRIVACIDADE E SKELETONS
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

function exibirSkeletons() {
  ['card-saldo', 'card-fatura', 'card-receita', 'card-despesa'].forEach(id => {
    if (animacoesContagemAtivas[id]) {
      cancelAnimationFrame(animacoesContagemAtivas[id]);
      delete animacoesContagemAtivas[id];
    }
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="h-6 sm:h-7 w-24 bg-slate-800 rounded-lg animate-pulse mt-1"></div>';
  });

  const gridFuturo = document.getElementById('grid-comprometimento-futuro');
  if (gridFuturo) {
    gridFuturo.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 animate-pulse"><div class="flex justify-between"><div class="h-3.5 w-20 bg-slate-800 rounded"></div><div class="h-3.5 w-16 bg-slate-800 rounded"></div></div><div class="h-4 w-24 bg-slate-800 rounded"></div><div class="w-full bg-slate-800 rounded-full h-1.5"></div></div>`).join('');
  }

  const gridContas = document.getElementById('grid-cartoes-contas');
  if (gridContas) {
    gridContas.innerHTML = Array(3).fill(`<div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 h-32 flex flex-col justify-between animate-pulse"><div class="flex justify-between"><div class="h-4 w-24 bg-slate-800 rounded"></div><div class="h-4 w-12 bg-slate-800 rounded"></div></div><div class="h-6 w-28 bg-slate-800 rounded"></div></div>`).join('');
  }

  const gridCategorias = document.getElementById('grid-categorias-orcamento');
  if (gridCategorias) {
    gridCategorias.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 animate-pulse"><div class="flex justify-between"><div class="h-3.5 w-24 bg-slate-800 rounded"></div></div><div class="w-full bg-slate-800 rounded-full h-1.5"></div></div>`).join('');
  }

  const listaMobile = document.getElementById('lista-transacoes-mobile');
  if (listaMobile) {
    listaMobile.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-pulse"><div class="flex justify-between"><div class="space-y-1.5"><div class="h-4 w-32 bg-slate-800 rounded"></div><div class="h-3 w-40 bg-slate-800/70 rounded"></div></div><div class="h-4 w-16 bg-slate-800 rounded"></div></div></div>`).join('');
  }
}

/* ==========================================================================
   AUTENTICAÇÃO (LOGIN, CADASTRO E ESQUECI A SENHA)
   ========================================================================== */
function setModoAuth(modo) {
  modoAuth = modo;
  if (authMsg) authMsg.classList.add('hidden');
  if (modo === 'login') {
    tabLogin.className = 'flex-1 py-2.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 transition-all';
    tabSignup.className = 'flex-1 py-2.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition-all';
    authBtnSubmit.innerText = 'Acessar Painel';
    btnEsqueceuSenha?.classList.remove('hidden');
    campoCadastroNome?.classList.add('hidden');
    campoCadastroTelefone?.classList.add('hidden');
    if (authNome) authNome.required = false;
    if (authTelefone) authTelefone.required = false;
  } else {
    tabSignup.className = 'flex-1 py-2.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 transition-all';
    tabLogin.className = 'flex-1 py-2.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition-all';
    authBtnSubmit.innerText = 'Cadastrar e Começar';
    btnEsqueceuSenha?.classList.add('hidden');
    campoCadastroNome?.classList.remove('hidden');
    campoCadastroTelefone?.classList.remove('hidden');
    if (authNome) authNome.required = true;
    if (authTelefone) authTelefone.required = true;
  }
}

tabLogin?.addEventListener('click', () => setModoAuth('login'));
tabSignup?.addEventListener('click', () => setModoAuth('signup'));

btnEsqueceuSenha?.addEventListener('click', async () => {
  if (!client) return mostrarToast('Conexão com o servidor indisponível.', 'erro');
  executarFeedback('clique');
  const email = document.getElementById('auth-email').value.trim();

  if (!email) {
    authMsg.textContent = 'Digite seu e-mail acima para receber o link de recuperação.';
    authMsg.className = 'text-xs p-3 rounded-lg mb-4 bg-amber-500/15 border border-amber-500/30 text-amber-300';
    authMsg.classList.remove('hidden');
    return;
  }

  authBtnSubmit.disabled = true;
  authMsg.classList.add('hidden');

  try {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });
    if (error) throw error;
    executarFeedback('sucesso');
    authMsg.textContent = 'Link de recuperação enviado! Verifique seu e-mail.';
    authMsg.className = 'text-xs p-3 rounded-lg mb-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
    authMsg.classList.remove('hidden');
  } catch (err) {
    authMsg.textContent = err.message || 'Falha ao enviar e-mail de recuperação.';
    authMsg.className = 'text-xs p-3 rounded-lg mb-4 bg-rose-500/15 border border-rose-500/30 text-rose-300';
    authMsg.classList.remove('hidden');
  } finally {
    authBtnSubmit.disabled = false;
  }
});

authForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!client) return mostrarToast('Erro de conexão com o servidor.', 'erro');

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;

  authBtnSubmit.disabled = true;
  authBtnSubmit.innerText = 'Conectando...';
  authMsg.classList.add('hidden');

  try {
    if (modoAuth === 'login') {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } else {
      const nome = authNome?.value.trim() || '';
      const telefone = authTelefone?.value.trim() || '';
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { data: { nome, telefone } }
      });
      if (error) throw error;

      authMsg.textContent = 'Conta cadastrada com sucesso! Faça login para começar.';
      authMsg.className = 'text-xs p-3 rounded-lg mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      authMsg.classList.remove('hidden');
      setModoAuth('login');
    }
  } catch (err) {
    authMsg.textContent = err.message || 'Erro de autenticação.';
    authMsg.className = 'text-xs p-3 rounded-lg mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400';
    authMsg.classList.remove('hidden');
  } finally {
    authBtnSubmit.disabled = false;
    authBtnSubmit.innerText = modoAuth === 'login' ? 'Acessar Painel' : 'Cadastrar e Começar';
  }
});

/* ==========================================================================
   NAVEGAÇÃO DE MÊS, FILTROS E VISÕES COMPARTILHADAS
   ========================================================================== */
function navegarMes(dir) {
  let [a, m] = mesAtual.split('-').map(Number);
  m += dir;
  if (m > 12) { m = 1; a++; }
  else if (m < 1) { m = 12; a--; }
  mesAtual = `${a}-${String(m).padStart(2, '0')}`;
  if (filtroMes) filtroMes.value = mesAtual;
  carregarTransacoes();
}

btnMesAnterior?.addEventListener('click', () => navegarMes(-1));
btnMesProximo?.addEventListener('click', () => navegarMes(1));
filtroMes?.addEventListener('change', (e) => {
  mesAtual = e.target.value;
  carregarTransacoes();
});

window.aplicarFiltroTipo = function(tipo) {
  filtroTipoAtivo = tipo;
  document.querySelectorAll('.btn-filtro').forEach(b => {
    b.className = 'btn-filtro px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-slate-400 hover:text-white';
  });
  const mapId = {
    'todos': 'btn-filtro-todos',
    'Despesa Cartão': 'btn-filtro-cartao',
    'Débito/Pix': 'btn-filtro-debito',
    'Receita': 'btn-filtro-receita',
    'pendentes': 'btn-filtro-pendentes'
  };
  const alvo = document.getElementById(mapId[tipo]);
  if (alvo) {
    alvo.className = `btn-filtro px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1 ${tipo === 'pendentes' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`;
  }
  renderizarTransacoes();
};

window.alternarFiltroConta = function(contaId) {
  executarFeedback('clique');
  filtroContaIdAtiva = (contaId === null || filtroContaIdAtiva === contaId) ? null : contaId;
  const badge = document.getElementById('badge-filtro-conta');
  const textoBadge = document.getElementById('texto-filtro-conta');
  if (badge && textoBadge) {
    if (filtroContaIdAtiva) {
      const c = contasUsuario.find(c => c.id === filtroContaIdAtiva);
      textoBadge.textContent = c ? c.nome : 'Cartão';
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
  renderizarGridContas();
  renderizarTransacoes();
};

window.limparTodosFiltrosExtrato = function() {
  executarFeedback('clique');
  termoBuscaAtivo = '';
  if (filtroBusca) filtroBusca.value = '';
  alternarFiltroConta(null);
  aplicarFiltroTipo('todos');
};

function obterTransacoesDaVisao(lista = transacoesCarregadas) {
  return lista.filter(t => {
    if (visaoAtiva === 'geral') return true;
    if (visaoAtiva === 'pessoal') return (t.user_id === usuarioLogadoId && !t.atribuido_para_email) || (t.atribuido_para_email === usuarioLogadoEmail);
    return t.atribuido_para_email === visaoAtiva;
  });
}

window.selecionarVisao = async function(novaVisao) {
  executarFeedback('clique');
  visaoAtiva = novaVisao;
  verificarAlertasVencimento();
  renderizarAbasVisao();
  renderizarTransacoes();
  atualizarTotais();
  renderizarCaixinhas();
  renderizarGridContas();
  renderizarGridCategorias();
  renderizarGraficoCategorias();
  await Promise.all([carregarGraficoProjecao(), carregarComprometimentoFuturo()]);
};

function renderizarAbasVisao() {
  const container = document.getElementById('container-abas-visao');
  const barraAcoes = document.getElementById('barra-acoes-compartilhadas');
  const labelNome = document.getElementById('label-nome-compartilhado');
  if (!container) return;

  const emails = new Set();
  transacoesCarregadas.forEach(t => {
    if (t.user_id === usuarioLogadoId && t.atribuido_para_email) emails.add(t.atribuido_para_email);
  });

  if (emails.size === 0 && visaoAtiva === 'pessoal') {
    container.classList.add('hidden');
    barraAcoes?.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const estiloInativo = 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800 font-medium';
  let html = `<button type="button" onclick="selecionarVisao('pessoal')" class="px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition flex items-center gap-1.5 ${visaoAtiva === 'pessoal' ? 'bg-emerald-500 text-slate-950 font-bold' : estiloInativo}"><i data-lucide="user" class="w-3.5 h-3.5"></i> Meu Painel</button>`;

  emails.forEach(e => {
    html += `<button type="button" onclick="selecionarVisao('${e}')" class="px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition flex items-center gap-1.5 ${visaoAtiva === e ? 'bg-sky-500 text-slate-950 font-bold' : estiloInativo}"><i data-lucide="users" class="w-3.5 h-3.5"></i> ${e.split('@')[0]}</button>`;
  });

  html += `<button type="button" onclick="selecionarVisao('geral')" class="px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition flex items-center gap-1.5 ${visaoAtiva === 'geral' ? 'bg-amber-500 text-slate-950 font-bold' : estiloInativo}"><i data-lucide="layers" class="w-3.5 h-3.5"></i> Visão Geral</button>`;
  container.innerHTML = html;

  if (barraAcoes) {
    if (visaoAtiva !== 'pessoal' && visaoAtiva !== 'geral') {
      if (labelNome) labelNome.textContent = visaoAtiva.split('@')[0];
      barraAcoes.classList.remove('hidden');
    } else {
      barraAcoes.classList.add('hidden');
    }
  }
  if (window.lucide) lucide.createIcons();
}

window.enviarResumoWhatsApp = function() {
  executarFeedback('clique');
  const lista = obterTransacoesDaVisao();
  if (lista.length === 0) return mostrarToast('Não há lançamentos nesta aba.', 'aviso');

  let tGeral = 0, tPendente = 0;
  const linhas = lista.map(t => {
    if (t.tipo !== 'Receita') {
      tGeral += Number(t.valor);
      if (t.status !== 'Pago') tPendente += Number(t.valor);
    }
    return `${t.status === 'Pago' ? '✅' : '⏳'} ${t.descricao} — *${Number(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`;
  }).join('\n');

  const msg = `Resumo de ${mesAtual} (${visaoAtiva.split('@')[0]}):\n\n${linhas}\n\n*Total:* ${tGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n*Falta Pagar:* ${tPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
};

window.marcarTudoComoPagoVisao = async function() {
  if (!client) return;
  const pendentes = obterTransacoesDaVisao().filter(t => t.status !== 'Pago' && t.user_id === usuarioLogadoId);
  if (pendentes.length === 0) return mostrarToast('Tudo já está pago!', 'aviso');

  const totalFmt = pendentes.reduce((a, t) => a + Number(t.valor), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  if (!(await customConfirm(`Confirmar quitação de ${pendentes.length} iten(s) totalizando ${totalFmt}?`, 'info', 'Quitação Lote'))) return;

  const { error } = await client.from('transacoes').update({ status: 'Pago' }).in('id', pendentes.map(t => t.id));
  if (error) mostrarToast('Erro: ' + error.message, 'erro');
  else {
    mostrarToast('Atualizado!', 'sucesso');
    carregarTransacoes();
  }
};

/* ==========================================================================
   EXPORTAÇÃO (CSV, XLSX, PDF)
   ========================================================================== */
if (btnDropdownExportar && menuDropdownExportar) {
  btnDropdownExportar.addEventListener('click', (e) => {
    e.stopPropagation();
    executarFeedback('clique');
    menuDropdownExportar.classList.toggle('hidden');
  });
  document.addEventListener('click', () => menuDropdownExportar.classList.add('hidden'));
}

window.exportarDados = function(fmt) {
  executarFeedback('clique');
  menuDropdownExportar?.classList.add('hidden');
  const lista = obterTransacoesDaVisao().filter(t => {
    if (filtroContaIdAtiva && t.conta_id !== filtroContaIdAtiva) return false;
    if (filtroTipoAtivo === 'pendentes') return t.status !== 'Pago';
    if (filtroTipoAtivo !== 'todos' && t.tipo !== filtroTipoAtivo) return false;
    return true;
  });

  if (lista.length === 0) return mostrarToast('Nenhum dado para exportar.', 'aviso');

  const dados = lista.map(t => ({
    Data: t.data_movimento.split('-').reverse().join('/'),
    Descricao: t.descricao || '',
    Categoria: (categoriasUsuario.find(c => c.id === t.categoria_id) || { nome: 'Geral' }).nome,
    Conta: (contasUsuario.find(c => c.id === t.conta_id) || { nome: 'Padrão' }).nome,
    Tipo: t.tipo,
    Parcela: t.parcela_total > 1 ? `${t.parcela_atual}/${t.parcela_total}` : '1/1',
    Valor: Number(t.valor),
    Status: t.status,
    Atribuido: t.atribuido_para_email || 'Pessoal'
  }));

  if (fmt === 'csv') exportarCSV(dados, `Extrato_${mesAtual}.csv`);
  else if (fmt === 'xlsx') exportarXLSX(dados, `Extrato_${mesAtual}.xlsx`);
  else exportarPDF(dados, `Extrato_${mesAtual}.pdf`);
};

function exportarCSV(dados, nome) {
  let csv = '\uFEFFData;Descrição;Categoria;Conta;Tipo;Parcela;Valor;Status;Responsável\n' +
    dados.map(r => `${r.Data};"${r.Descricao}";"${r.Categoria}";"${r.Conta}";"${r.Tipo}";${r.Parcela};${r.Valor.toFixed(2).replace('.', ',')};${r.Status};"${r.Atribuido}"`).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
  mostrarToast('CSV exportado!', 'sucesso');
}

function exportarXLSX(dados, nome) {
  if (typeof XLSX === 'undefined') return mostrarToast('SheetJS indisponível', 'erro');
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Extrato');
  XLSX.writeFile(wb, nome);
  mostrarToast('Excel exportado!', 'sucesso');
}

function exportarPDF(dados, nome) {
  if (!window.jspdf) return mostrarToast('jsPDF indisponível', 'erro');
  const doc = new window.jspdf.jsPDF();
  doc.text(`Extrato ${mesAtual}`, 14, 20);
  doc.autoTable({ startY: 30, head: [Object.keys(dados[0])], body: dados.map(Object.values) });
  doc.save(nome);
  mostrarToast('PDF exportado!', 'sucesso');
}

/* ==========================================================================
   CARGA E RENDERIZAÇÃO DE CONTAS, CATEGORIAS E TRANSAÇÕES
   ========================================================================== */
async function carregarDadosApp() {
  exibirSkeletons();
  await Promise.all([buscarOuCriarContas(), buscarOuCriarCategorias(), carregarCaixinhas()]);
  await carregarTransacoes();
}

async function buscarOuCriarContas() {
  if (!client) return;
  const { data } = await client.from('contas').select('*').order('nome');
  if (!data || data.length === 0) {
    const { data: novas } = await client.from('contas').insert([
      { nome: 'Corrente', tipo: 'Corrente', saldo_inicial: 0, user_id: usuarioLogadoId },
      { nome: 'Cartão', tipo: 'Cartão de Crédito', dia_fechamento: 30, dia_vencimento: 5, user_id: usuarioLogadoId }
    ]).select();
    contasUsuario = novas || [];
  } else {
    contasUsuario = data;
  }
  if (txConta) txConta.innerHTML = contasUsuario.map(c => `<option value="${c.id}">${c.nome} (${c.tipo})</option>`).join('');
  renderizarGridContas();
  verificarAlertasVencimento();
}

async function buscarOuCriarCategorias() {
  if (!client) return;
  const { data } = await client.from('categorias').select('*').order('nome');
  if (!data || data.length === 0) {
    const std = [
      { nome: 'Alimentação', icone: 'utensils', teto_mensal: 1200, tipo: 'Despesa' },
      { nome: 'Moradia', icone: 'home', teto_mensal: 1500, tipo: 'Despesa' },
      { nome: 'Saúde', icone: 'activity', teto_mensal: 300, tipo: 'Despesa' },
      { nome: 'Salário', icone: 'wallet', tipo: 'Receita' }
    ];
    const { data: n } = await client.from('categorias').insert(std).select();
    categoriasUsuario = n || [];
  } else {
    categoriasUsuario = data;
  }
  atualizarOpcoesCategoriasNoModal();
  renderizarGridCategorias();
}

function atualizarOpcoesCategoriasNoModal() {
  if (!txCategoria || !txTipo) return;
  const isR = txTipo.value === 'Receita';
  const pts = categoriasUsuario.filter(c => (c.tipo || 'Despesa') === (isR ? 'Receita' : 'Despesa'));
  txCategoria.innerHTML = pts.length ? pts.map(c => `<option value="${c.id}">${c.nome}</option>`).join('') : '<option value="">Sem categoria</option>';
}

function renderizarGridContas() {
  const container = document.getElementById('grid-cartoes-contas');
  if (!container) return;

  const transacoesVisao = obterTransacoesDaVisao();
  const limitesSalvos = obterLimitesCartoes();

  container.innerHTML = contasUsuario.map(c => {
    const isC = c.tipo === 'Cartão de Crédito';
    const estilo = detectarEstiloBanco(c.nome, isC);
    const selecionado = filtroContaIdAtiva === c.id;

    let tot = 0;
    let pendenteFatura = 0;

    transacoesVisao.forEach(t => {
      if (t.conta_id === c.id) {
        tot += Number(t.valor);
        if (isC && t.tipo !== 'Receita' && t.status !== 'Pago' && (!t.user_id || t.user_id === usuarioLogadoId)) {
          pendenteFatura += Number(t.valor);
        }
      }
    });

    const limiteTotal = isC ? Number(limitesSalvos[c.id] || 0) : 0;
    let htmlBarraLimite = '';
    if (isC && limiteTotal > 0) {
      const pctLimite = Math.min(Math.round((tot / limiteTotal) * 100), 100);
      const pctReal = Math.round((tot / limiteTotal) * 100);
      const disponivel = Math.max(limiteTotal - tot, 0);
      const corBarra = pctReal >= 90 ? 'bg-rose-400' : pctReal >= 70 ? 'bg-amber-300' : 'bg-emerald-300';

      htmlBarraLimite = `
        <div class="space-y-1 pt-1">
          <div class="w-full bg-black/35 rounded-full h-1 overflow-hidden">
            <div class="${corBarra} h-full transition-all duration-500" style="width:${pctLimite}%"></div>
          </div>
          <div class="flex items-center justify-between text-[10px] font-mono text-white/75">
            <span>Disp.: ${formatarMoeda(disponivel)}</span>
            <span>${pctReal}% de ${formatarMoeda(limiteTotal)}</span>
          </div>
        </div>
      `;
    }

    const btnPagarCard = (isC && pendenteFatura > 0)
      ? `<button type="button" onclick="event.stopPropagation(); pagarFaturaEmUmClique('${c.id}')" class="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition active:scale-95">
           <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-300"></i> Pagar Fatura (${formatarMoeda(pendenteFatura)})
         </button>`
      : '';

    return `
      <div onclick="alternarFiltroConta('${c.id}')" class="cartao-fisico-card relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${estilo.gradiente} border ${selecionado ? 'border-white ring-2 ring-white/80' : estilo.borda} shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-[0.99]">
        <div class="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-xl"></div>

        <div class="space-y-2.5 relative z-10">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              ${isC
                ? `<span class="w-6 h-4 rounded-[4px] bg-gradient-to-tr from-amber-300/80 via-yellow-200/90 to-amber-400/80 border border-amber-200/50 inline-flex items-center justify-center shrink-0 shadow-inner">
                     <span class="w-3.5 h-2 border border-amber-700/40 rounded-[2px]"></span>
                   </span>
                   <i data-lucide="wifi" class="w-3.5 h-3.5 text-white/60 rotate-90 shrink-0"></i>`
                : `<span class="w-6 h-6 rounded-lg bg-white/15 border border-white/20 inline-flex items-center justify-center text-emerald-300 shrink-0">
                     <i data-lucide="wallet" class="w-3.5 h-3.5"></i>
                   </span>`
              }
              <span class="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-black/25 text-white/85 truncate">${estilo.badge}</span>
            </div>

            <div class="flex items-center gap-0.5 shrink-0">
              <button type="button" onclick="event.stopPropagation(); editarConta('${c.id}')" title="Editar" class="p-1 text-white/65 hover:text-white transition"><i data-lucide="pencil" class="w-3 h-3"></i></button>
              <button type="button" onclick="event.stopPropagation(); deletarConta('${c.id}', '${(c.nome || '').replace(/'/g, "\\'")}')" title="Excluir" class="p-1 text-white/65 hover:text-rose-300 transition"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
            </div>
          </div>

          <div class="flex items-end justify-between gap-2">
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-white truncate">${c.nome}</h3>
              <div class="text-[10px] font-mono text-white/75 mt-0.5">
                ${isC ? `Fecha dia ${c.dia_fechamento || '--'} • Vence dia ${c.dia_vencimento || '--'}` : 'Movimentação no mês'}
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-[9px] uppercase tracking-wider text-white/70 block">${isC ? 'Fatura Atual' : 'Total Mês'}</span>
              <span class="text-base font-extrabold font-mono text-white block leading-tight">${formatarMoeda(tot)}</span>
            </div>
          </div>

          ${htmlBarraLimite}
        </div>

        <div class="relative z-10">
          ${btnPagarCard}
          <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10">
            <span class="text-[10px] font-mono tracking-widest text-white/55">•••• ••••</span>
            ${renderizarBandeiraSVG(estilo.bandeira)}
          </div>
        </div>
      </div>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function renderizarGridCategorias() {
  const container = document.getElementById('grid-categorias-orcamento');
  if (!container) return;

  const cats = categoriasUsuario.filter(c => c.tipo !== 'Receita' && Number(c.teto_mensal) > 0);
  if (!cats.length) {
    container.innerHTML = `
      <div class="col-span-full py-5 px-4 rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <i data-lucide="target" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-200">Nenhum teto de gastos definido</h4>
            <p class="text-[11px] text-slate-400">Defina metas mensais por categoria para receber alertas visuais antes de estourar o orçamento.</p>
          </div>
        </div>
        <button type="button" onclick="abrirModalCategoriaRapido()" class="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-bold text-xs inline-flex items-center gap-1.5 transition active:scale-95 shrink-0">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Definir limite
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = cats.map(c => {
    let gt = 0;
    obterTransacoesDaVisao().forEach(t => { if (t.categoria_id === c.id && t.tipo !== 'Receita') gt += Number(t.valor); });

    const pct = Math.min(Math.round((gt / Number(c.teto_mensal)) * 100), 100);
    const est = gt > Number(c.teto_mensal);

    return `
      <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div class="flex justify-between">
          <div class="flex items-center gap-1">
            <i data-lucide="${c.icone || 'tag'}" class="w-3.5 h-3.5 text-sky-400"></i>
            <h4 class="text-xs font-bold">${c.nome}</h4>
            <button onclick="editarTetoCategoria('${c.id}', '${(c.nome || '').replace(/'/g, "\\'")}', ${c.teto_mensal})" class="p-1 text-slate-500 hover:text-sky-400"><i data-lucide="pencil" class="w-3 h-3"></i></button>
            <button onclick="deletarCategoria('${c.id}', '${(c.nome || '').replace(/'/g, "\\'")}')" class="p-1 text-slate-500 hover:text-rose-400"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
          </div>
          <span class="text-xs font-mono font-bold ${est ? 'text-rose-400' : 'text-slate-200'}">${formatarMoeda(gt)}</span>
        </div>
        <div class="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
          <div class="${est ? 'bg-rose-500' : (pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500')} h-full" style="width:${pct}%"></div>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500">
          <span>Meta: ${formatarMoeda(c.teto_mensal)}</span>
          <span class="${est ? 'text-rose-400 font-semibold' : ''}">${pct}%</span>
        </div>
      </div>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   GRÁFICOS (PROJEÇÃO / HISTÓRICO E ROSCA POR CATEGORIA)
   ========================================================================== */
window.alterarPeriodoGrafico = function(novoPeriodo) {
  executarFeedback('clique');
  periodoGrafico = novoPeriodo;

  document.querySelectorAll('.btn-graf-periodo').forEach(btn => {
    btn.className = 'btn-graf-periodo px-2 py-1 rounded-md text-slate-400 hover:text-white transition';
  });

  const btnAtivo = document.getElementById(`btn-graf-${novoPeriodo}`);
  if (btnAtivo) {
    btnAtivo.className = 'btn-graf-periodo px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 transition';
  }

  carregarGraficoProjecao();
};

async function carregarGraficoProjecao() {
  if (!client) return;
  const ml = [], mc = [];
  let [anoBase, mesBase] = mesAtual.split('-').map(Number);

  const tituloEl = document.getElementById('titulo-grafico-projecao');

  if (periodoGrafico === 'ano') {
    if (tituloEl) tituloEl.innerHTML = `<i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i> Histórico ${anoBase}`;
    for (let m = 1; m <= 12; m++) {
      mc.push(`${anoBase}-${String(m).padStart(2, '0')}`);
      ml.push(new Date(anoBase, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3).toUpperCase());
    }
  } else if (periodoGrafico === '3m') {
    if (tituloEl) tituloEl.innerHTML = `<i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i> Últimos 3 Meses`;
    for (let i = 2; i >= 0; i--) {
      let a = anoBase, m = mesBase - i;
      while (m < 1) { m += 12; a--; }
      mc.push(`${a}-${String(m).padStart(2, '0')}`);
      ml.push(new Date(a, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3).toUpperCase());
    }
  } else {
    if (tituloEl) tituloEl.innerHTML = `<i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i> Projeção 6 Meses`;
    for (let i = 0; i < 6; i++) {
      mc.push(`${anoBase}-${String(mesBase).padStart(2, '0')}`);
      ml.push(new Date(anoBase, mesBase - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3).toUpperCase());
      mesBase++;
      if (mesBase > 12) { mesBase = 1; anoBase++; }
    }
  }

  if (window.lucide) lucide.createIcons();

  let q = client.from('transacoes').select('valor, tipo, mes_competencia, user_id, atribuido_para_email').in('mes_competencia', mc);
  if (usuarioLogadoId) q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);
  const { data } = await q;
  const d = obterTransacoesDaVisao(data || []);

  const rec = Array(mc.length).fill(0);
  const sai = Array(mc.length).fill(0);

  d.forEach(t => {
    const idx = mc.indexOf(t.mes_competencia);
    if (idx !== -1) {
      if (t.tipo === 'Receita') rec[idx] += Number(t.valor);
      else sai[idx] += Number(t.valor);
    }
  });

  let soma = 0, cc = 0;
  for (let i = 0; i < mc.length; i++) {
    if (rec[i] > 0) { soma += (sai[i] / rec[i]) * 100; cc++; }
  }

  const md = cc > 0 ? Math.round(soma / cc) : 0;
  const em = document.getElementById('val-media-comp');
  if (em) {
    em.textContent = `${md}%`;
    em.className = md > 80 ? 'font-bold text-rose-400' : (md > 60 ? 'font-bold text-amber-400' : 'font-bold text-emerald-400');
  }

  const paleta = PALETAS_TEMA[temaAtivo] || PALETAS_TEMA.esmeralda;

  if (meuGraficoProjecao) meuGraficoProjecao.destroy();
  const canvasProj = document.getElementById('grafico-projecao');
  if (window.Chart && canvasProj) {
    meuGraficoProjecao = new Chart(canvasProj.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ml,
        datasets: [
          { label: 'Entradas', data: rec, backgroundColor: paleta.main, borderRadius: 4 },
          { label: 'Saídas', data: sai, backgroundColor: 'rgba(244, 63, 94, 0.8)', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8', font: { size: 9 } } }
        }
      }
    });
  }
}

function renderizarGraficoCategorias() {
  if (!window.Chart) return;
  const cv = document.getElementById('grafico-categorias');
  const msg = document.getElementById('msg-grafico-categorias-vazio');
  if (!cv) return;

  const d = obterTransacoesDaVisao().filter(t => t.tipo !== 'Receita');
  const gc = {};
  d.forEach(t => {
    const n = (categoriasUsuario.find(c => c.id === t.categoria_id) || { nome: 'Outros' }).nome;
    gc[n] = (gc[n] || 0) + Number(t.valor);
  });

  const ent = Object.entries(gc).sort((a, b) => b[1] - a[1]);
  if (meuGraficoCategorias) { meuGraficoCategorias.destroy(); meuGraficoCategorias = null; }
  if (ent.length === 0) { msg?.classList.remove('hidden'); return; }

  msg?.classList.add('hidden');
  const cores = ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

  meuGraficoCategorias = new Chart(cv.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ent.map(e => e[0]),
      datasets: [{
        data: ent.map(e => e[1]),
        backgroundColor: ent.map((_, i) => cores[i % cores.length]),
        borderColor: modoClaroAtivo ? '#ffffff' : '#0f172a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 }, padding: 10 } },
        tooltip: {
          callbacks: {
            label: function(c) {
              const v = c.raw, tot = c.dataset.data.reduce((a, b) => a + b, 0);
              const p = tot > 0 ? Math.round((v / tot) * 100) : 0;
              return ` ${c.label}: ${modoPrivacidadeAtivo ? 'R$ •••••' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${p}%)`;
            }
          }
        }
      }
    }
  });
}

async function carregarTransacoes() {
  if (!client) return;
  exibirSkeletons();

  let q = client.from('transacoes').select('*').eq('mes_competencia', mesAtual);
  if (usuarioLogadoId) q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);

  const { data } = await q.order('data_movimento', { ascending: false });
  transacoesCarregadas = data || [];

  transacoesCarregadas.forEach(t => {
    if (t.user_id === usuarioLogadoId && t.atribuido_para_email) {
      salvarEmailFrequente(t.atribuido_para_email);
    }
  });

  verificarAlertasVencimento();
  renderizarAbasVisao();
  renderizarTransacoes();
  atualizarTotais();
  renderizarCaixinhas();
  renderizarGridContas();
  renderizarGridCategorias();
  renderizarGraficoCategorias();
  await Promise.all([carregarGraficoProjecao(), carregarComprometimentoFuturo()]);
}

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

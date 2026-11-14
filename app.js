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

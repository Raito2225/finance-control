/* ==========================================================================
   CONFIGURAÇÕES GERAIS E SUPABASE
   ========================================================================== */
const SUPABASE_URL = 'https://vrivgmpdcgpqhuohzkaf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaXZnbXBkY2dwcWh1b2h6a2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MjAxODQsImV4cCI6MjEwOTM5NjE4NH0.H7qIvpF3rm-k-moF101qC2JLLe1mHOlqQlMWnzhFGo4';
const NUMERO_WHATSAPP_TESTES = '5575988660943';

let client = null;
try {
  if (!window.supabase) throw new Error('Biblioteca do Supabase não carregou.');
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  setTimeout(() => mostrarToast('Erro ao iniciar: ' + err.message, 'erro'), 1000);
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

let meuGraficoProjecao = null;
let meuGraficoCategorias = null;
let filtroTipoAtivo = 'todos';
let filtroContaIdAtiva = null;
let termoBuscaAtivo = '';
let visaoAtiva = 'pessoal';

// Controle de Modais de Edição
let transacaoEditandoId = null;
let contaEditandoId = null;
let categoriaEditandoTetoId = null;

// Preferências do Usuário (localStorage)
let configFeedbackAtivo = true;
let temaAtivo = 'esmeralda';
let modoPrivacidadeAtivo = false;

try {
  configFeedbackAtivo = localStorage.getItem('fc_feedback_ativo') !== 'false';
  temaAtivo = localStorage.getItem('fc_tema_app') || 'esmeralda';
  modoPrivacidadeAtivo = localStorage.getItem('fc_privacidade_ativa') === 'true';
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
const txRecorrente = document.getElementById('tx-recorrente');
const opcoesRecorrencia = document.getElementById('opcoes-recorrencia');
const txRecorrenteMeses = document.getElementById('tx-recorrente-meses');

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


/* ==========================================================================
   FUNÇÕES GLOBAIS DE UI E FEEDBACK
   ========================================================================== */

// --- Áudio e Vibração ---
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

// --- Formatação ---
function formatarMoeda(valor) {
  if (modoPrivacidadeAtivo) return 'R$ •••••';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

// --- Animações de Modais ---
window.abrirModalAnimado = function(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (!modal || !content) return;
  
  modal.classList.remove('hidden');
  void modal.offsetWidth; // Força o reflow
  
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

// --- Toasts e Confirm ---
const toastContainer = document.getElementById('toast-container');
const modalConfirmTitulo = document.getElementById('modal-confirm-titulo');
const modalConfirmMensagem = document.getElementById('modal-confirm-mensagem');
const modalConfirmIcon = document.getElementById('modal-confirm-icon');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
const btnConfirmOk = document.getElementById('btn-confirm-ok');
let confirmResolve = null;

window.mostrarToast = function(mensagem, tipo = 'erro') {
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

window.customConfirm = function(mensagem, tipo = 'perigo', titulo = 'Confirmação') {
  return new Promise((resolve) => {
    executarFeedback('clique');
    confirmResolve = resolve;
    modalConfirmTitulo.textContent = titulo;
    modalConfirmMensagem.textContent = mensagem;

    if (tipo === 'perigo') {
      modalConfirmIcon.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-500/20 text-rose-400';
      modalConfirmIcon.innerHTML = '<i data-lucide="alert-triangle" class="w-5 h-5"></i>';
      btnConfirmOk.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition text-slate-950 bg-rose-500 hover:bg-rose-600 active:scale-95';
      btnConfirmOk.textContent = 'Sim, Excluir';
    } else {
      modalConfirmIcon.className = 'w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-500/20 text-sky-400';
      modalConfirmIcon.innerHTML = '<i data-lucide="help-circle" class="w-5 h-5"></i>';
      btnConfirmOk.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition text-slate-950 bg-sky-500 hover:bg-sky-600 active:scale-95';
      btnConfirmOk.textContent = 'Sim, Continuar';
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
btnConfirmCancel.addEventListener('click', () => fecharModalConfirm(false));
btnConfirmOk.addEventListener('click', () => fecharModalConfirm(true));

// --- Skeletons ---
window.exibirSkeletons = function() {
  ['card-saldo', 'card-fatura', 'card-receita', 'card-despesa'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="h-6 sm:h-7 w-24 bg-slate-800 rounded-lg animate-pulse mt-1"></div>';
  });
  
  const gridContas = document.getElementById('grid-cartoes-contas');
  if (gridContas) gridContas.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between animate-pulse"><div class="space-y-2"><div class="h-3.5 w-24 bg-slate-800 rounded"></div><div class="h-3 w-32 bg-slate-800/70 rounded"></div></div><div class="space-y-1.5 text-right"><div class="h-2.5 w-10 bg-slate-800/70 rounded ml-auto"></div><div class="h-4 w-16 bg-slate-800 rounded"></div></div></div>`).join('');
  
  const gridCategorias = document.getElementById('grid-categorias-orcamento');
  if (gridCategorias) gridCategorias.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 animate-pulse"><div class="flex justify-between"><div class="h-3.5 w-24 bg-slate-800 rounded"></div></div><div class="w-full bg-slate-800 rounded-full h-1.5"></div></div>`).join('');
  
  const listaMobile = document.getElementById('lista-transacoes-mobile');
  if (listaMobile) listaMobile.innerHTML = Array(3).fill(`<div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-pulse"><div class="flex justify-between"><div class="space-y-1.5"><div class="h-4 w-32 bg-slate-800 rounded"></div><div class="h-3 w-40 bg-slate-800/70 rounded"></div></div><div class="h-4 w-16 bg-slate-800 rounded"></div></div></div>`).join('');
};

function atualizarIconePrivacidade() {
  if (btnModoPrivacidade) {
    btnModoPrivacidade.innerHTML = `<i data-lucide="${modoPrivacidadeAtivo ? 'eye-off' : 'eye'}" class="w-4 h-4 ${modoPrivacidadeAtivo ? 'text-amber-400' : ''}"></i>`;
    if (window.lucide) lucide.createIcons();
  }
}


/* ==========================================================================
   LÓGICA DE NEGÓCIO E CARREGAMENTO
   ========================================================================== */

window.alternarPrivacidade = function() {
  executarFeedback('clique'); 
  modoPrivacidadeAtivo = !modoPrivacidadeAtivo;
  try { localStorage.setItem('fc_privacidade_ativa', modoPrivacidadeAtivo); } catch (e) {}
  atualizarIconePrivacidade(); 
  atualizarTotais(); 
  renderizarGridContas(); 
  renderizarGridCategorias(); 
  renderizarGraficoCategorias(); 
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
  renderizarAbasVisao(); 
  renderizarTransacoes(); 
  atualizarTotais(); 
  renderizarGridContas(); 
  renderizarGridCategorias(); 
  renderizarGraficoCategorias(); 
  await carregarGraficoProjecao();
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
    if (barraAcoes) barraAcoes.classList.add('hidden'); 
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
    return `${t.status === 'Pago' ? '✅' : '⏳'} ${t.descricao} — *${Number(t.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}*`;
  }).join('\n');
  
  const msg = `Resumo de ${mesAtual} (${visaoAtiva.split('@')[0]}):\n\n${linhas}\n\n*Total:* ${tGeral.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}\n*Falta Pagar:* ${tPendente.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
};

window.marcarTudoComoPagoVisao = async function() {
  if (!client) return;
  const pendentes = obterTransacoesDaVisao().filter(t => t.status !== 'Pago' && t.user_id === usuarioLogadoId);
  if (pendentes.length === 0) return mostrarToast('Tudo já está pago!', 'aviso');
  
  const totalFmt = pendentes.reduce((a, t) => a + Number(t.valor), 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  if (!(await customConfirm(`Confirmar quitação de ${pendentes.length} iten(s) totalizando ${totalFmt}?`, 'info', 'Quitação Lote'))) return;
  
  const { error } = await client.from('transacoes').update({ status: 'Pago' }).in('id', pendentes.map(t=>t.id));
  if (error) {
    mostrarToast('Erro: ' + error.message, 'erro');
  } else { 
    mostrarToast('Atualizado!', 'sucesso'); 
    carregarTransacoes(); 
  }
};

// TEMAS E EXPORT
function aplicarTemaNaInterface() {
  const cfg = { 
    esmeralda: 'bg-emerald-500 hover:bg-emerald-600', 
    azul: 'bg-sky-500 hover:bg-sky-600', 
    roxo: 'bg-violet-500 hover:bg-violet-600', 
    ambar: 'bg-amber-500 hover:bg-amber-600' 
  }[temaAtivo] || 'bg-emerald-500 hover:bg-emerald-600';
  
  const btnFab = document.getElementById('btn-fab-adicionar');
  if(btnFab) btnFab.className = `fixed bottom-6 right-6 z-40 sm:hidden w-14 h-14 rounded-full ${cfg} active:scale-95 text-slate-950 flex items-center justify-center shadow-lg border border-white/10 transition`;
  
  const btnModal = document.getElementById('btn-abrir-modal');
  if(btnModal) btnModal.className = `flex-1 sm:flex-none flex items-center justify-center gap-1.5 ${cfg} text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition shadow-md active:scale-95`;
}

window.definirTema = function(cor) {
  temaAtivo = cor; 
  try { localStorage.setItem('fc_tema_app', cor); } catch (e) {}
  aplicarTemaNaInterface();
  executarFeedback('clique');
};

window.exportarDados = function(fmt) {
  executarFeedback('clique'); 
  menuDropdownExportar.classList.add('hidden');
  const lista = obterTransacoesDaVisao().filter(t => {
    if(filtroContaIdAtiva && t.conta_id !== filtroContaIdAtiva) return false;
    if(filtroTipoAtivo === 'pendentes') return t.status !== 'Pago';
    if(filtroTipoAtivo !== 'todos' && t.tipo !== filtroTipoAtivo) return false;
    return true;
  });
  
  if (lista.length === 0) return mostrarToast('Nenhum dado para exportar.', 'aviso');
  
  const dados = lista.map(t => ({
    Data: t.data_movimento.split('-').reverse().join('/'), 
    Descricao: t.descricao || '',
    Categoria: (categoriasUsuario.find(c => c.id === t.categoria_id) || {nome:'Geral'}).nome,
    Conta: (contasUsuario.find(c => c.id === t.conta_id) || {nome:'Padrão'}).nome,
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
            dados.map(r => `${r.Data};"${r.Descricao}";"${r.Categoria}";"${r.Conta}";"${r.Tipo}";${r.Parcela};${r.Valor.toFixed(2).replace('.',',')};${r.Status};"${r.Atribuido}"`).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8;'}));
  const a = document.createElement('a'); 
  a.href = url; a.download = nome; a.click(); 
  URL.revokeObjectURL(url); 
  mostrarToast('CSV exportado!', 'sucesso');
}

function exportarXLSX(dados, nome) {
  if (typeof XLSX === 'undefined') return mostrarToast('SheetJS indisponível', 'erro');
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new(); 
  XLSX.utils.book_append_sheet(wb, ws, "Extrato"); 
  XLSX.writeFile(wb, nome); 
  mostrarToast('Excel exportado!', 'sucesso');
}

function exportarPDF(dados, nome) {
  if (!window.jspdf) return mostrarToast('jsPDF indisponível', 'erro');
  const doc = new window.jspdf.jsPDF(); 
  doc.text(`Extrato ${mesAtual}`, 14, 20); 
  doc.autoTable({ startY:30, head:[Object.keys(dados[0])], body:dados.map(Object.values) }); 
  doc.save(nome); 
  mostrarToast('PDF exportado!', 'sucesso');
}

// --- Funções de Inicialização e Supabase ---
async function carregarDadosApp() {
  exibirSkeletons();
  await Promise.all([buscarOuCriarContas(), buscarOuCriarCategorias()]);
  await carregarTransacoes();
}

async function buscarOuCriarContas() {
  if(!client) return; 
  const { data } = await client.from('contas').select('*').order('nome');
  
  if(!data || data.length === 0) { 
    const { data: novas } = await client.from('contas').insert([
      {nome:'Corrente',tipo:'Corrente',saldo_inicial:0,user_id:usuarioLogadoId},
      {nome:'Cartão',tipo:'Cartão de Crédito',dia_fechamento:30,dia_vencimento:5,user_id:usuarioLogadoId}
    ]).select(); 
    contasUsuario = novas || []; 
  } else {
    contasUsuario = data;
  }
  txConta.innerHTML = contasUsuario.map(c => `<option value="${c.id}">${c.nome} (${c.tipo})</option>`).join(''); 
  renderizarGridContas();
}

async function buscarOuCriarCategorias() {
  if(!client) return; 
  const { data } = await client.from('categorias').select('*').order('nome');
  
  if(!data || data.length === 0) { 
    const std = [
      {nome:'Alimentação',icone:'utensils',teto_mensal:1200,tipo:'Despesa'},
      {nome:'Moradia',icone:'home',teto_mensal:1500,tipo:'Despesa'},
      {nome:'Saúde',icone:'activity',teto_mensal:300,tipo:'Despesa'},
      {nome:'Salário',icone:'wallet',tipo:'Receita'}
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
  const isR = txTipo.value === 'Receita'; 
  const pts = categoriasUsuario.filter(c => (c.tipo || 'Despesa') === (isR ? 'Receita' : 'Despesa'));
  txCategoria.innerHTML = pts.length ? pts.map(c => `<option value="${c.id}">${c.nome}</option>`).join('') : '<option value="">Sem categoria</option>';
}

function renderizarGridContas() {
  const container = document.getElementById('grid-cartoes-contas'); 
  if(!container) return;
  
  container.innerHTML = contasUsuario.map(c => {
    const isC = c.tipo === 'Cartão de Crédito'; 
    let tot = 0; 
    obterTransacoesDaVisao().forEach(t => { if(t.conta_id === c.id) tot += Number(t.valor); });
    
    return `
      <div onclick="alternarFiltroConta('${c.id}')" class="p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition active:scale-95 ${filtroContaIdAtiva === c.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'}">
        <div>
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full mr-0.5 ${isC ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
            <h3 class="text-xs font-bold">${c.nome}</h3>
            <button type="button" onclick="event.stopPropagation(); editarConta('${c.id}')" class="p-1 text-slate-500 hover:text-sky-400"><i data-lucide="pencil" class="w-3 h-3"></i></button>
            <button type="button" onclick="event.stopPropagation(); deletarConta('${c.id}', '${(c.nome||'').replace(/'/g,"\\'")}')" class="p-1 text-slate-500 hover:text-rose-400"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
          </div>
          <div class="text-[11px] font-mono text-slate-400 mt-1">${isC ? `Fecha ${c.dia_fechamento} • Vence ${c.dia_vencimento}` : 'Corrente'}</div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-500">${isC ? 'Fatura' : 'Movi.'}</span>
          <span class="text-sm font-bold font-mono ${isC ? 'text-amber-300' : 'text-white'} block">${formatarMoeda(tot)}</span>
        </div>
      </div>`;
  }).join('');
  if(window.lucide) lucide.createIcons();
}

function renderizarGridCategorias() {
  const container = document.getElementById('grid-categorias-orcamento'); 
  if(!container) return;
  
  const cats = categoriasUsuario.filter(c => c.tipo !== 'Receita' && Number(c.teto_mensal) > 0);
  if(!cats.length) {
    container.innerHTML = `<p class="text-xs text-slate-500 py-3 col-span-full">Nenhum limite estipulado.</p>`;
    return;
  }
  
  container.innerHTML = cats.map(c => {
    let gt = 0; 
    obterTransacoesDaVisao().forEach(t => { if(t.categoria_id === c.id && t.tipo !== 'Receita') gt += Number(t.valor); });
    
    const pct = Math.min(Math.round((gt / Number(c.teto_mensal)) * 100), 100);
    const est = gt > Number(c.teto_mensal);
    
    return `
      <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div class="flex justify-between">
          <div class="flex items-center gap-1">
            <i data-lucide="${c.icone||'tag'}" class="w-3.5 h-3.5 text-sky-400"></i>
            <h4 class="text-xs font-bold">${c.nome}</h4>
            <button onclick="editarTetoCategoria('${c.id}', '${(c.nome||'').replace(/'/g,"\\'")}', ${c.teto_mensal})" class="p-1 text-slate-500 hover:text-sky-400"><i data-lucide="pencil" class="w-3 h-3"></i></button>
            <button onclick="deletarCategoria('${c.id}', '${(c.nome||'').replace(/'/g,"\\'")}')" class="p-1 text-slate-500 hover:text-rose-400"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
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
  if(window.lucide) lucide.createIcons();
}

// --- Funções de Edição (Deletar/Alterar) ---
window.editarTetoCategoria = function(id, nome, tetoAtual) {
  categoriaEditandoTetoId = id; 
  document.getElementById('teto-categoria-nome').textContent = nome;
  document.getElementById('teto-novo-valor').value = Number(tetoAtual || 0).toFixed(2);
  abrirModalAnimado('modal-editar-teto', 'modal-teto-content');
  setTimeout(() => document.getElementById('teto-novo-valor').focus(), 300);
};

window.fecharModalTeto = () => fecharModalAnimado('modal-editar-teto', 'modal-teto-content', () => categoriaEditandoTetoId = null);

document.getElementById('form-editar-teto').addEventListener('submit', async e => {
  e.preventDefault(); 
  if(!client || !categoriaEditandoTetoId) return;
  const t = parseFloat(document.getElementById('teto-novo-valor').value); 
  if(isNaN(t) || t < 0) return mostrarToast('Valor inválido', 'erro');
  
  const {error} = await client.from('categorias').update({teto_mensal: t === 0 ? null : t}).eq('id', categoriaEditandoTetoId);
  if(error) {
    mostrarToast('Erro: '+error.message, 'erro');
  } else { 
    mostrarToast('Limite atualizado!', 'sucesso'); 
    fecharModalTeto(); 
    buscarOuCriarCategorias(); 
    renderizarGridCategorias(); 
  }
});

window.editarConta = function(id) {
  const c = contasUsuario.find(i => i.id === id); 
  if(!c) return; 
  contaEditandoId = id;
  
  document.getElementById('modal-conta-titulo').innerHTML = '<i data-lucide="credit-card" class="w-4 h-4 text-sky-400"></i> Editar Conta'; 
  document.getElementById('btn-salvar-conta').innerText = 'Atualizar';
  document.getElementById('conta-nome').value = c.nome || ''; 
  contaTipo.value = c.tipo || 'Cartão de Crédito';
  
  if(c.tipo === 'Cartão de Crédito') { 
    camposCartao.classList.remove('hidden'); 
    document.getElementById('conta-fechamento').value = c.dia_fechamento || ''; 
    document.getElementById('conta-vencimento').value = c.dia_vencimento || ''; 
  } else {
    camposCartao.classList.add('hidden');
  }
  
  document.getElementById('conta-saldo-inicial').value = Number(c.saldo_inicial || 0).toFixed(2);
  abrirModalAnimado('modal-conta', 'modal-conta-content'); 
  if(window.lucide) lucide.createIcons();
};

window.deletarConta = async function(id, nome) {
  if(await customConfirm(`Excluir conta "${nome}"?`, 'perigo')) {
    const {error} = await client.from('contas').delete().eq('id', id);
    if(error) {
      mostrarToast('Existem lançamentos vinculados.', 'erro'); 
    } else { 
      mostrarToast('Excluída!', 'sucesso'); 
      if(filtroContaIdAtiva === id) alternarFiltroConta(null); 
      buscarOuCriarContas(); 
      carregarTransacoes(); 
    }
  }
};

window.deletarCategoria = async function(id, nome) {
  if(await customConfirm(`Excluir categoria "${nome}"?`, 'perigo')) {
    const {error} = await client.from('categorias').delete().eq('id', id);
    if(error) {
      mostrarToast('Existem lançamentos vinculados.', 'erro'); 
    } else { 
      mostrarToast('Excluída!', 'sucesso'); 
      buscarOuCriarCategorias(); 
      carregarTransacoes(); 
    }
  }
};

// --- Gráficos Chart.js ---
async function carregarGraficoProjecao() {
  if(!client) return; 
  const ml = [], mc = []; 
  let [a, m] = mesAtual.split('-').map(Number);
  
  for(let i=0; i<6; i++) { 
    mc.push(`${a}-${String(m).padStart(2,'0')}`); 
    ml.push(new Date(a, m-1, 1).toLocaleDateString('pt-BR', {month: 'short'}).slice(0,3).toUpperCase()); 
    m++; 
    if(m > 12) { m = 1; a++; } 
  }
  
  let q = client.from('transacoes').select('valor, tipo, mes_competencia, user_id, atribuido_para_email').in('mes_competencia', mc);
  if(usuarioLogadoId) q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);
  const { data } = await q; 
  const d = obterTransacoesDaVisao(data || []);
  
  const rec = [0,0,0,0,0,0], sai = [0,0,0,0,0,0];
  d.forEach(t => { 
    const idx = mc.indexOf(t.mes_competencia); 
    if(idx !== -1) { 
      if(t.tipo === 'Receita') rec[idx] += Number(t.valor); 
      else sai[idx] += Number(t.valor); 
    } 
  });
  
  let soma = 0, cc = 0; 
  for(let i=0; i<6; i++) { 
    if(rec[i] > 0) { soma += (sai[i]/rec[i])*100; cc++; } 
  }
  
  const md = cc > 0 ? Math.round(soma/cc) : 0; 
  const em = document.getElementById('val-media-comp');
  if(em) { 
    em.textContent = `${md}%`; 
    em.className = md > 80 ? 'font-bold text-rose-400' : (md > 60 ? 'font-bold text-amber-400' : 'font-bold text-emerald-400'); 
  }
  
  if(meuGraficoProjecao) meuGraficoProjecao.destroy();
  if(window.Chart) {
    meuGraficoProjecao = new Chart(document.getElementById('grafico-projecao').getContext('2d'), { 
      type: 'bar', 
      data: { 
        labels: ml, 
        datasets: [
          {label:'Entradas', data:rec, backgroundColor:'rgba(16, 185, 129, 0.8)', borderRadius:4}, 
          {label:'Saídas', data:sai, backgroundColor:'rgba(244, 63, 94, 0.8)', borderRadius:4}
        ] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: {legend: {labels: {color: '#94a3b8', font: {size: 10}}}}, 
        scales: {
          x: {grid: {display: false}, ticks: {color: '#94a3b8'}},
          y: {grid: {color: 'rgba(51, 65, 85, 0.2)'}, ticks: {color: '#94a3b8'}}
        } 
      } 
    });
  }
}

function renderizarGraficoCategorias() {
  if(!window.Chart) return; 
  const cv = document.getElementById('grafico-categorias');
  const msg = document.getElementById('msg-grafico-categorias-vazio');
  
  const d = obterTransacoesDaVisao().filter(t => t.tipo !== 'Receita'); 
  const gc = {};
  
  d.forEach(t => { 
    const n = (categoriasUsuario.find(c => c.id === t.categoria_id) || {nome: 'Outros'}).nome; 
    gc[n] = (gc[n] || 0) + Number(t.valor); 
  });
  
  const ent = Object.entries(gc).sort((a,b) => b[1] - a[1]);
  if(meuGraficoCategorias) { meuGraficoCategorias.destroy(); meuGraficoCategorias = null; }
  if(ent.length === 0) { if(msg) msg.classList.remove('hidden'); return; }
  
  if(msg) msg.classList.add('hidden');
  const cores = ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'];
  
  meuGraficoCategorias = new Chart(cv.getContext('2d'), { 
    type: 'doughnut', 
    data: { 
      labels: ent.map(e => e[0]), 
      datasets:[{ 
        data: ent.map(e => e[1]), 
        backgroundColor: ent.map((_,i) => cores[i % cores.length]), 
        borderColor: '#0f172a', 
        borderWidth: 2 
      }] 
    }, 
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      cutout: '65%', 
      plugins: { 
        legend: {position: 'bottom', labels: {color: '#94a3b8', font: {size: 10}, padding: 10}}, 
        tooltip: {
          callbacks: {
            label: function(c) { 
              const v = c.raw, tot = c.dataset.data.reduce((a,b) => a + b, 0);
              const p = tot > 0 ? Math.round((v/tot)*100) : 0; 
              return ` ${c.label}: ${modoPrivacidadeAtivo ? 'R$ •••••' : v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})} (${p}%)`; 
            }
          }
        } 
      } 
    } 
  });
}

// --- Transações Principais ---
async function carregarTransacoes() {
  if(!client) return; 
  exibirSkeletons();
  
  let q = client.from('transacoes').select('*').eq('mes_competencia', mesAtual);
  if(usuarioLogadoId) q = q.or(`user_id.eq.${usuarioLogadoId},atribuido_para_email.eq.${usuarioLogadoEmail}`);
  
  const { data } = await q.order('data_movimento', {ascending: false});
  transacoesCarregadas = data || [];
  
  renderizarAbasVisao(); 
  renderizarTransacoes(); 
  atualizarTotais(); 
  renderizarGridContas(); 
  renderizarGridCategorias(); 
  renderizarGraficoCategorias(); 
  await carregarGraficoProjecao();
}

function renderizarTransacoes() {
  const cm = document.getElementById('lista-transacoes-mobile');
  const cd = document.getElementById('lista-transacoes-desktop');
  if(!cm || !cd) return;
  
  const f = obterTransacoesDaVisao().filter(t => {
    if(filtroContaIdAtiva && t.conta_id !== filtroContaIdAtiva) return false;
    if(filtroTipoAtivo === 'pendentes' && t.status === 'Pago') return false;
    if(filtroTipoAtivo !== 'todos' && filtroTipoAtivo !== 'pendentes' && t.tipo !== filtroTipoAtivo) return false;
    if(termoBuscaAtivo) {
      const cat = (categoriasUsuario.find(c => c.id === t.categoria_id) || {nome:''}).nome.toLowerCase();
      const desc = t.descricao.toLowerCase();
      const atr = (t.atribuido_para_email || '').toLowerCase();
      return desc.includes(termoBuscaAtivo) || cat.includes(termoBuscaAtivo) || atr.includes(termoBuscaAtivo);
    }
    return true;
  });
  
  contadorTransacoes.innerText = `${f.length} registro${f.length !== 1 ? 's' : ''}`;
  
  if(!f.length) { 
    cm.innerHTML = `<div class="py-8 text-center text-xs text-slate-500">Nenhum lançamento.</div>`; 
    cd.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-500">Nenhum lançamento.</td></tr>`; 
    return; 
  }

  cm.innerHTML = f.map(t => {
    const v = formatarMoeda(t.valor), isR = t.tipo === 'Receita', isL = t.status === 'Pago';
    const pB = t.parcela_total > 1 ? `<span class="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">${t.parcela_atual}/${t.parcela_total}</span>` : '';
    const nCt = (contasUsuario.find(c => c.id === t.conta_id) || {nome: 'Conta'}).nome;
    const nCat = (categoriasUsuario.find(c => c.id === t.categoria_id) || {nome: 'Geral'}).nome;
    
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
            <div class="flex items-center gap-2 text-[11px] text-slate-400"><span class="font-mono text-slate-500">${t.data_movimento.split('-').reverse().join('/')}</span><span>•</span><span>${nCat}</span><span>•</span><span>${nCt}</span></div>
          </div>
          <div class="text-right">
            <span class="text-sm font-bold font-mono ${isR ? 'text-emerald-400' : 'text-slate-100'}">${isR ? '+' : '-'} ${v}</span>
            <span class="block text-[10px] text-slate-500">${t.tipo}</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
          ${sD ? `<button onclick="alternarStatus('${t.id}', '${t.status}')" class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition active:scale-95 ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS}</button>` : `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border opacity-80 cursor-default ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS} (Leitura)</span>`}
          ${sD ? `<div class="flex items-center gap-1"><button onclick="editarTransacao('${t.id}')" class="p-2 text-slate-500 hover:text-sky-400 transition"><i data-lucide="pencil" class="w-4 h-4"></i></button><button onclick="deletarTransacao('${t.id}', '${t.id_agrupador || null}')" class="p-2 text-slate-500 hover:text-rose-400 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>` : `<span class="p-2 text-slate-600"><i data-lucide="lock" class="w-4 h-4"></i></span>`}
        </div>
      </div>`;
  }).join('');

  cd.innerHTML = f.map(t => {
    const v = formatarMoeda(t.valor), isR = t.tipo === 'Receita', isL = t.status === 'Pago';
    const pB = t.parcela_total > 1 ? `<span class="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">${t.parcela_atual}/${t.parcela_total}</span>` : '-';
    const nCt = (contasUsuario.find(c => c.id === t.conta_id) || {nome: 'Padrão'}).nome;
    const catObj = categoriasUsuario.find(c => c.id === t.categoria_id);
    
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
        <td class="py-2.5 text-slate-300"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px]"><i data-lucide="${catObj ? catObj.icone : 'tag'}" class="w-3 h-3 text-sky-400"></i>${catObj ? catObj.nome : 'Sem Categoria'}</span></td>
        <td class="py-2.5 text-slate-400 font-medium">${nCt}</td>
        <td class="py-2.5"><span class="px-2 py-0.5 rounded text-[10px] ${isR ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${t.tipo}</span></td>
        <td class="py-2.5">${pB}</td>
        <td class="py-2.5 text-right font-mono font-medium ${isR ? 'text-emerald-400' : 'text-slate-200'}">${isR ? '+' : '-'} ${v}</td>
        <td class="py-2.5 text-center">${sD ? `<button onclick="alternarStatus('${t.id}', '${t.status}')" class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition active:scale-95 ${cS}"><i data-lucide="${iS}" class="w-3.5 h-3.5"></i>${tS}</button>` : `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border opacity-75 cursor-default ${cS}"><i data-lucide="lock" class="w-3 h-3"></i>${tS}</span>`}</td>
        <td class="py-2.5 text-center">${sD ? `<div class="flex items-center justify-center gap-1"><button onclick="editarTransacao('${t.id}')" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-sky-400 transition"><i data-lucide="pencil" class="w-4 h-4"></i></button><button onclick="deletarTransacao('${t.id}', '${t.id_agrupador || null}')" class="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>` : `<span class="p-1 text-slate-600"><i data-lucide="lock" class="w-3.5 h-3.5 inline"></i></span>`}</td>
      </tr>`;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

window.editarTransacao = function(id) {
  const t = transacoesCarregadas.find(i => i.id === id); 
  if(!t) return;
  
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
    txAtribuicaoPredefinida.value = 'outro'; 
    txAtribuicaoEmail.classList.remove('hidden'); 
    txAtribuicaoEmail.value = t.atribuido_para_email; 
  } else { 
    txAtribuicaoPredefinida.value = ''; 
    txAtribuicaoEmail.classList.add('hidden'); 
    txAtribuicaoEmail.value = ''; 
  }
  
  containerParcelas.classList.add('hidden'); 
  containerRecorrencia.classList.add('hidden'); 
  previaParcelamento.innerText = '';
  
  abrirModalAnimado('modal-transacao', 'modal-tx-content');
};

window.alternarStatus = async function(id, s) {
  if(!client) return; 
  const t = transacoesCarregadas.find(i => i.id === id); 
  if(t && t.user_id && t.user_id !== usuarioLogadoId) return mostrarToast('Apenas o dono pode alterar.', 'aviso');
  
  executarFeedback('clique'); 
  const ns = s === 'Pago' ? 'Previsto' : 'Pago';
  
  const idx = transacoesCarregadas.findIndex(i => i.id === id); 
  if(idx !== -1){ 
    transacoesCarregadas[idx].status = ns; 
    renderizarTransacoes(); 
    atualizarTotais(); 
  }
  
  const {error} = await client.from('transacoes').update({status: ns}).eq('id', id); 
  if(error) { 
    mostrarToast('Erro: '+error.message, 'erro'); 
    carregarTransacoes(); 
  }
};

window.deletarTransacao = async function(id, grp) {
  if(!client) return; 
  const t = transacoesCarregadas.find(i => i.id === id); 
  if(t && t.user_id && t.user_id !== usuarioLogadoId) return mostrarToast('Apenas o dono pode excluir.', 'aviso');
  
  if (grp && grp !== 'null' && grp !== 'undefined') {
    const msg = 'Lançamento parcelado ou fixo!\n\n• [Sim, Excluir]: apaga TODAS as parcelas vinculadas.\n• [Cancelar]: escolhe apagar APENAS este mês.';
    if (await customConfirm(msg, 'perigo', 'Excluir Vínculos')) {
      const {error} = await client.from('transacoes').delete().eq('id_agrupador', grp); 
      if(error) mostrarToast('Erro: '+error.message, 'erro'); 
      else { mostrarToast('Registros excluídos!', 'sucesso'); carregarTransacoes(); } 
      return;
    }
    if(!await customConfirm('Deseja excluir APENAS este mês atual?', 'perigo', 'Exclusão Única')) return;
  } else { 
    if(!await customConfirm('Deseja excluir definitivamente?', 'perigo')) return; 
  }
  
  const {error} = await client.from('transacoes').delete().eq('id', id);
  if(error) mostrarToast('Erro: '+error.message, 'erro'); 
  else { mostrarToast('Lançamento excluído!', 'sucesso'); carregarTransacoes(); }
};

function atualizarTotais() {
  let fat = 0, rec = 0, desp = 0;
  obterTransacoesDaVisao().forEach(t => { 
    const v = Number(t.valor); 
    if(t.tipo === 'Receita') rec += v; 
    else if(t.tipo === 'Despesa Cartão') fat += v; 
    else desp += v; 
  });
  
  document.getElementById('card-fatura').innerText = formatarMoeda(fat); 
  document.getElementById('card-receita').innerText = formatarMoeda(rec);
  document.getElementById('card-despesa').innerText = formatarMoeda(fat + desp); 
  document.getElementById('card-saldo').innerText = formatarMoeda(rec - (fat + desp));
}

function atualizarEstadoTipo() {
  const isAdm = usuarioLogadoEmail && usuarioLogadoEmail.toLowerCase() === 'matheusgomes2225@hotmail.com';
  if(txTipo.value === 'Despesa Cartão') {
    if(!transacaoEditandoId && (!txRecorrente || !txRecorrente.checked)) containerParcelas.classList.remove('hidden');
    if(isAdm) containerAtribuicao.classList.remove('hidden'); 
    else containerAtribuicao.classList.add('hidden');
  } else { 
    containerParcelas.classList.add('hidden'); 
    containerAtribuicao.classList.add('hidden'); 
  }
}

function calcularCompetencia(d, cId) {
  const c = contasUsuario.find(i => i.id === cId); 
  const dt = new Date(d + 'T00:00:00'); 
  let a = dt.getFullYear(), m = dt.getMonth() + 1;
  if(c && c.tipo === 'Cartão de Crédito' && c.dia_fechamento) { 
    if(dt.getDate() > c.dia_fechamento){ m++; if(m > 12) { m = 1; a++; } } 
  }
  return {ano: a, mes: m, str: `${a}-${String(m).padStart(2,'0')}`};
}

function calcularPrevia() {
  if(txTipo.value !== 'Despesa Cartão' || transacaoEditandoId || (txRecorrente && txRecorrente.checked)){ 
    previaParcelamento.innerText = ''; 
    return; 
  }
  const v = parseFloat(txValor.value) || 0, p = parseInt(txParcelas.value) || 1, dt = txData.value, c = txConta.value;
  if(!dt || v <= 0){ previaParcelamento.innerText = ''; return; }
  previaParcelamento.innerText = `${p}x de R$ ${(v/p).toFixed(2)} (1ª em ${calcularCompetencia(dt,c).str})`;
}


/* ==========================================================================
   EVENT LISTENERS - INICIALIZAÇÃO E AÇÕES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  filtroMes.value = mesAtual; 
  txData.value = new Date().toISOString().slice(0, 10);
  aplicarTemaNaInterface(); 
  atualizarIconePrivacidade();
  
  if (client) {
    client.auth.onAuthStateChange(async (evt, session) => {
      if (session) {
        authScreen.classList.add('hidden'); 
        dashboardScreen.classList.remove('hidden');
        usuarioLogadoId = session.user.id; 
        usuarioLogadoEmail = session.user.email;
        if (labelSaudacaoUsuario) labelSaudacaoUsuario.textContent = `Olá, ${(session.user.user_metadata?.nome || session.user.email.split('@')[0])}!`;
        carregarDadosApp();
      } else {
        usuarioLogadoId = null; 
        usuarioLogadoEmail = null;
        dashboardScreen.classList.add('hidden'); 
        authScreen.classList.remove('hidden');
      }
    });
  }
  filtroBusca.addEventListener('input', e => { 
    termoBuscaAtivo = e.target.value.toLowerCase().trim(); 
    renderizarTransacoes(); 
  });
});

// Eventos de Abertura de Modais
document.getElementById('btn-abrir-config').addEventListener('click', () => {
  if (client) client.auth.getUser().then(({data:{user}}) => {
    if(user) { 
      configUserEmailInput.value = user.email || ''; 
      configNomeInput.value = user.user_metadata?.nome || ''; 
      configTelefoneInput.value = user.user_metadata?.telefone || ''; 
    }
  });
  abrirModalAnimado('modal-configuracoes', 'modal-config-content');
});

document.getElementById('btn-fechar-config').addEventListener('click', () => fecharModalAnimado('modal-configuracoes', 'modal-config-content'));
document.getElementById('config-btn-logout').addEventListener('click', async () => { fecharModalAnimado('modal-configuracoes', 'modal-config-content'); if(client) await client.auth.signOut(); });

document.getElementById('btn-abrir-modal-categoria').addEventListener('click', () => { 
  atualizarVisibilidadeTetoCategoria(); 
  atualizarPreviewIconeCategoria(); 
  abrirModalAnimado('modal-categoria', 'modal-categoria-content'); 
});

function fecharModalCategoria() { fecharModalAnimado('modal-categoria', 'modal-categoria-content', () => formCategoria.reset()); }
document.getElementById('btn-fechar-modal-categoria').addEventListener('click', fecharModalCategoria); 
document.getElementById('btn-cancelar-modal-categoria').addEventListener('click', fecharModalCategoria);

document.getElementById('btn-abrir-modal-conta').addEventListener('click', () => abrirModalAnimado('modal-conta', 'modal-conta-content'));
function fecharModalConta() { 
  fecharModalAnimado('modal-conta', 'modal-conta-content', () => { 
    formConta.reset(); 
    contaEditandoId = null; 
    document.getElementById('modal-conta-titulo').innerHTML='<i data-lucide="credit-card" class="w-4 h-4 text-emerald-400"></i> Conta'; 
    document.getElementById('btn-salvar-conta').innerText='Salvar'; 
    camposCartao.classList.remove('hidden'); 
    if(window.lucide) lucide.createIcons(); 
  }); 
}
document.getElementById('btn-fechar-modal-conta').addEventListener('click', fecharModalConta); 
document.getElementById('btn-cancelar-modal-conta').addEventListener('click', fecharModalConta);

btnFabAdicionar.addEventListener('click', () => { atualizarEstadoTipo(); atualizarOpcoesCategoriasNoModal(); calcularPrevia(); abrirModalAnimado('modal-transacao', 'modal-tx-content'); });
document.getElementById('btn-abrir-modal').addEventListener('click', () => { atualizarEstadoTipo(); atualizarOpcoesCategoriasNoModal(); calcularPrevia(); abrirModalAnimado('modal-transacao', 'modal-tx-content'); });

function fecharModal() { 
  fecharModalAnimado('modal-transacao', 'modal-tx-content', () => { 
    formTransacao.reset(); 
    transacaoEditandoId=null; 
    txData.value=new Date().toISOString().slice(0,10); 
    previaParcelamento.innerText=''; 
    txAtribuicaoEmail.classList.add('hidden'); 
    if(opcoesRecorrencia) opcoesRecorrencia.classList.add('hidden'); 
    document.getElementById('modal-tx-titulo').innerText='Novo Lançamento'; 
    document.getElementById('btn-salvar-tx').innerText='Salvar'; 
  }); 
}
document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal); 
document.getElementById('btn-cancelar-modal').addEventListener('click', fecharModal);

// Formulário Transação
let envTx = false;
formTransacao.addEventListener('submit', async e => {
  e.preventDefault(); if(!client||envTx) return; envTx = true;
  const b = document.getElementById('btn-salvar-tx'); b.disabled = true; b.innerText = 'Gravando...';
  
  try {
    const tp = txTipo.value, vl = parseFloat(txValor.value), desc = document.getElementById('tx-descricao').value;
    const catId = txCategoria.value, dt = txData.value, ctId = txConta.value;
    let emAtr = null; 
    
    const isAdm = usuarioLogadoEmail && usuarioLogadoEmail.toLowerCase() === 'matheusgomes2225@hotmail.com';
    if(isAdm && tp === 'Despesa Cartão') emAtr = txAtribuicaoPredefinida.value === 'outro' ? txAtribuicaoEmail.value.trim().toLowerCase() || null : (txAtribuicaoPredefinida.value.trim().toLowerCase() || null);

    if(transacaoEditandoId) {
      const tO = transacoesCarregadas.find(i => i.id === transacaoEditandoId); 
      let uG = false;
      
      if(tO && tO.id_agrupador) uG = await customConfirm('Compra parcelada/fixa!\n\n• [Sim, Continuar]: altera TODAS as parcelas.\n• [Cancelar]: altera SÓ este mês.', 'info', 'Aplicar Lote');
      
      if(uG && tO.id_agrupador) {
        const dG = {tipo:tp, valor:vl, categoria_id:catId, conta_id:ctId, atribuido_para_email:emAtr};
        if(tO.id_agrupador.startsWith('fixo_')) dG.descricao = desc;
        const {error: eG} = await client.from('transacoes').update(dG).eq('id_agrupador', tO.id_agrupador); if(eG) throw eG;
        const {error: eA} = await client.from('transacoes').update({descricao:desc, data_movimento:dt}).eq('id', transacaoEditandoId); if(eA) throw eA;
      } else { 
        const {error} = await client.from('transacoes').update({tipo:tp, valor:vl, descricao:desc, categoria_id:catId, conta_id:ctId, data_movimento:dt, atribuido_para_email:emAtr}).eq('id', transacaoEditandoId); 
        if(error) throw error; 
      }
    } else {
      const eR = txRecorrente && txRecorrente.checked;
      const tR = eR ? parseInt(txRecorrenteMeses.value) : (tp === 'Despesa Cartão' ? parseInt(txParcelas.value) : 1);
      const cN = (await client.auth.getUser()).data.user?.user_metadata?.nome || 'Admin';
      const cI = calcularCompetencia(dt, ctId); 
      let an = Number(cI.ano), ms = Number(cI.mes);
      const vP = eR ? vl : parseFloat((vl/tR).toFixed(2)), cent = eR ? 0 : parseFloat((vl-(vP*tR)).toFixed(2));
      const idA = tR > 1 ? (eR ? 'fixo_' : 'grp_') + Date.now() : null;
      const ls = [];
      
      for(let i=1; i<=tR; i++) {
        ls.push({ 
          id_agrupador: idA, data_movimento: dt, mes_competencia: `${an}-${String(ms).padStart(2,'0')}`, 
          descricao: (!eR && tR > 1) ? `${desc} (${i}/${tR})` : desc, 
          tipo: tp, valor: (i === 1 ? vP + cent : vP), conta_id: ctId, categoria_id: catId, 
          parcela_atual: eR ? 1 : i, parcela_total: eR ? 1 : tR, status: 'Previsto', 
          user_id: usuarioLogadoId, atribuido_para_email: emAtr, criador_nome: cN 
        });
        ms++; if(ms > 12){ ms = 1; an++; }
      }
      const {error} = await client.from('transacoes').insert(ls); 
      if(error) throw error;
    }
    mostrarToast(transacaoEditandoId ? 'Atualizado!' : 'Criado!', 'sucesso'); 
    fecharModal(); 
    await carregarTransacoes();
  } catch(er) { 
    mostrarToast('Erro: '+er.message, 'erro'); 
  } finally { 
    envTx = false; b.disabled = false; b.innerText = 'Salvar'; 
  }
});

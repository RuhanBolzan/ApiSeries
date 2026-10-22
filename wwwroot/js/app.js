
/**
 * app.js — ApiSeries AP2
 * Interface integrada à API REST com persistência SQLite.
 */

'use strict';

/* ============================================================
   1. CONFIGURAÇÃO E ESTADO
   ============================================================ */

const API_BASE = '/api/series';

let series = [];
let idEmEdicao = null;
let idParaExcluir = null;
let termoBusca = '';

/* ============================================================
   2. ELEMENTOS DO HTML
   ============================================================ */

const form = document.getElementById('serie-form');
const campoId = document.getElementById('campo-id');
const campoTitulo = document.getElementById('campo-titulo');
const campoGenero = document.getElementById('campo-genero');
const campoAno = document.getElementById('campo-ano');
const campoTemporadas = document.getElementById('campo-temporadas');

const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-title');

const erroTitulo = document.getElementById('erro-titulo');
const erroGenero = document.getElementById('erro-genero');
const erroAno = document.getElementById('erro-ano');
const erroTemporadas = document.getElementById('erro-temporadas');

const toastEl = document.getElementById('toast');
const corpoTabela = document.getElementById('corpo-tabela');
const contadorSeries = document.getElementById('contador-series');
const estadoVazio = document.getElementById('estado-vazio');
const campoBusca = document.getElementById('campo-busca');
const statusApi = document.getElementById('status-api');

const modalOverlay = document.getElementById('modal-overlay');
const modalCorpo = document.getElementById('modal-corpo');
const btnConfirmarExcl =
  document.getElementById('btn-confirmar-exclusao');
const btnCancelarModal =
  document.getElementById('btn-cancelar-modal');

/* ============================================================
   3. RENDERIZAÇÃO DA TABELA
   ============================================================ */

function renderizarTabela() {
  const termo = termoBusca.toLowerCase().trim();

  const seriesFiltradas = termo
    ? series.filter(s =>
        s.titulo.toLowerCase().includes(termo) ||
        s.genero.toLowerCase().includes(termo)
      )
    : series;

  corpoTabela.innerHTML = '';

  if (seriesFiltradas.length === 0) {
    estadoVazio.hidden = false;
  } else {
    estadoVazio.hidden = true;

    seriesFiltradas.forEach(serie => {
      const tr = document.createElement('tr');

      if (idEmEdicao === serie.id) {
        tr.classList.add('row-editando');
      }

      tr.innerHTML = `
        <td class="td-id">${serie.id}</td>
        <td class="td-titulo">${escaparHtml(serie.titulo)}</td>
        <td>
          <span class="pill-genero">
            ${escaparHtml(serie.genero)}
          </span>
        </td>
        <td>${serie.anoLancamento}</td>
        <td>${serie.temporadas}</td>
        <td class="td-acoes">
          <div class="acoes-grupo">
            <button
              class="btn-icon-only btn-editar"
              title="Editar série"
              aria-label="Editar ${escaparHtml(serie.titulo)}"
              data-id="${serie.id}"
              data-acao="editar"
            >✏️</button>

            <button
              class="btn-icon-only btn-excluir"
              title="Excluir série"
              aria-label="Excluir ${escaparHtml(serie.titulo)}"
              data-id="${serie.id}"
              data-acao="excluir"
            >🗑️</button>
          </div>
        </td>
      `;

      corpoTabela.appendChild(tr);
    });
  }

  contadorSeries.textContent = series.length;
}

/* ============================================================
   4. VALIDAÇÃO DO FORMULÁRIO
   ============================================================ */

function validarFormulario() {
  let valido = true;

  if (campoTitulo.value.trim() === '') {
    definirErro(campoTitulo, erroTitulo, 'O título é obrigatório.');
    valido = false;
  } else {
    limparErro(campoTitulo, erroTitulo);
  }

  if (campoGenero.value.trim() === '') {
    definirErro(campoGenero, erroGenero, 'O gênero é obrigatório.');
    valido = false;
  } else {
    limparErro(campoGenero, erroGenero);
  }

  const ano = Number(campoAno.value);

  if (
    campoAno.value.trim() === '' ||
    !Number.isInteger(ano) ||
    ano < 1900 ||
    ano > 2099
  ) {
    definirErro(
      campoAno,
      erroAno,
      'Informe um ano válido entre 1900 e 2099.'
    );
    valido = false;
  } else {
    limparErro(campoAno, erroAno);
  }

  const temporadas = Number(campoTemporadas.value);

  if (
    campoTemporadas.value.trim() === '' ||
    !Number.isInteger(temporadas) ||
    temporadas < 1 ||
    temporadas > 99
  ) {
    definirErro(
      campoTemporadas,
      erroTemporadas,
      'Informe um número entre 1 e 99.'
    );
    valido = false;
  } else {
    limparErro(campoTemporadas, erroTemporadas);
  }

  return valido;
}

function definirErro(input, spanErro, mensagem) {
  input.classList.add('input-error');
  spanErro.textContent = mensagem;
}

function limparErro(input, spanErro) {
  input.classList.remove('input-error');
  spanErro.textContent = '';
}

function limparTodosErros() {
  [
    campoTitulo,
    campoGenero,
    campoAno,
    campoTemporadas
  ].forEach(campo => campo.classList.remove('input-error'));

  [
    erroTitulo,
    erroGenero,
    erroAno,
    erroTemporadas
  ].forEach(erro => erro.textContent = '');
}

/* ============================================================
   5. COMUNICAÇÃO COM A API
   ============================================================ */

async function apiFetch(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers
    }
  });

  if (!resposta.ok) {
    const texto = await resposta.text().catch(() => '');
    throw new Error(
      `Erro ${resposta.status}${texto ? ': ' + texto : ''}`
    );
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

async function carregarSeries() {
  try {
    const dados = await apiFetch(API_BASE);

    series = dados;
    statusApi.textContent = '✅ Conectado';
    renderizarTabela();
  } catch (erro) {
    statusApi.textContent = '⚠️ Erro de conexão';

    // Evita mostrar dados antigos se a API estiver indisponível.
    series = [];
    renderizarTabela();

    mostrarToast(
      'Não foi possível carregar as séries. Verifique se a API está no ar.',
      'error'
    );

    console.error('Erro ao carregar séries:', erro);
  }
}

async function cadastrarSerie(dados) {
  return apiFetch(API_BASE, {
    method: 'POST',
    body: JSON.stringify(dados)
  });
}

async function atualizarSerie(id, dados) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  });
}

async function excluirSerie(id) {
  return apiFetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
}

/* ============================================================
   6. GERENCIAMENTO DO FORMULÁRIO
   ============================================================ */

function resetarFormulario() {
  form.reset();
  campoId.value = '';
  idEmEdicao = null;

  formTitulo.textContent = 'Cadastrar Nova Série';
  btnSalvar.innerHTML =
    '<span class="btn-icon">＋</span> Cadastrar Série';

  btnCancelar.hidden = true;

  limparTodosErros();
  renderizarTabela();
}

function iniciarEdicao(id) {
  const serie = series.find(s => s.id === id);

  if (!serie) return;

  idEmEdicao = id;

  campoId.value = serie.id;
  campoTitulo.value = serie.titulo;
  campoGenero.value = serie.genero;
  campoAno.value = serie.anoLancamento;
  campoTemporadas.value = serie.temporadas;

  formTitulo.textContent = `Editando: ${serie.titulo}`;
  btnSalvar.innerHTML = '💾 Salvar Alterações';
  btnCancelar.hidden = false;

  limparTodosErros();
  renderizarTabela();

  form.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  campoTitulo.focus();
}

/* ============================================================
   7. MODAL DE EXCLUSÃO
   ============================================================ */

function abrirModalExclusao(id) {
  const serie = series.find(s => s.id === id);

  if (!serie) return;

  idParaExcluir = id;

  modalCorpo.textContent =
    `Tem certeza que deseja excluir "${serie.titulo}"? ` +
    'Esta ação não pode ser desfeita.';

  modalOverlay.hidden = false;
}

function fecharModal() {
  modalOverlay.hidden = true;
  idParaExcluir = null;
}

/* ============================================================
   8. MENSAGENS DE FEEDBACK
   ============================================================ */

let toastTimer = null;

function mostrarToast(mensagem, tipo = 'success') {
  clearTimeout(toastTimer);

  toastEl.textContent =
    (tipo === 'success' ? '✅ ' : '❌ ') + mensagem;

  toastEl.className = `toast show toast--${tipo}`;

  toastTimer = setTimeout(() => {
    toastEl.className = 'toast';
  }, 3500);
}

/* ============================================================
   9. SEGURANÇA HTML
   ============================================================ */

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   10. EVENTOS
   ============================================================ */

// Cadastro e edição
form.addEventListener('submit', async evento => {
  evento.preventDefault();

  if (!validarFormulario()) return;

  const dados = {
    titulo: campoTitulo.value.trim(),
    genero: campoGenero.value.trim(),
    anoLancamento: Number(campoAno.value),
    temporadas: Number(campoTemporadas.value)
  };

  btnSalvar.disabled = true;

  try {
    if (idEmEdicao !== null) {
      const atualizada = await atualizarSerie(idEmEdicao, dados);

      mostrarToast(
        `"${atualizada.titulo}" atualizada com sucesso!`
      );
    } else {
      const nova = await cadastrarSerie(dados);

      mostrarToast(
        `"${nova.titulo}" cadastrada com sucesso!`
      );
    }

    resetarFormulario();
    await carregarSeries();
  } catch (erro) {
    console.error('Erro ao salvar série:', erro);
    mostrarToast('Erro ao salvar. Tente novamente.', 'error');
  } finally {
    btnSalvar.disabled = false;
  }
});

// Cancelar edição
btnCancelar.addEventListener('click', () => {
  resetarFormulario();
});

// Botões de editar e excluir na tabela
corpoTabela.addEventListener('click', evento => {
  const btn = evento.target.closest('[data-acao]');

  if (!btn) return;

  const id = Number(btn.dataset.id);
  const acao = btn.dataset.acao;

  if (acao === 'editar') {
    iniciarEdicao(id);
  } else if (acao === 'excluir') {
    abrirModalExclusao(id);
  }
});

// Confirmar exclusão — CORRIGIDO
btnConfirmarExcl.addEventListener('click', async () => {
  // Guardamos o ID ANTES de fechar o modal.
  const id = idParaExcluir;

  if (id === null) return;

  const serie = series.find(s => s.id === id);
  const titulo = serie?.titulo ?? '';

  // Impede dois cliques durante a requisição.
  btnConfirmarExcl.disabled = true;

  // fecharModal limpa idParaExcluir, mas o ID já está guardado em "id".
  fecharModal();

  try {
    await excluirSerie(id);

    if (idEmEdicao === id) {
      resetarFormulario();
    }

    mostrarToast(`"${titulo}" excluída com sucesso!`);

    await carregarSeries();
  } catch (erro) {
    console.error('Erro ao excluir série:', erro);
    mostrarToast('Erro ao excluir. Tente novamente.', 'error');
  } finally {
    btnConfirmarExcl.disabled = false;
  }
});

// Cancelar exclusão
btnCancelarModal.addEventListener('click', fecharModal);

// Fechar modal clicando fora dele
modalOverlay.addEventListener('click', evento => {
  if (evento.target === modalOverlay) {
    fecharModal();
  }
});

// Fechar modal com Escape
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && !modalOverlay.hidden) {
    fecharModal();
  }
});

// Busca por título ou gênero
campoBusca.addEventListener('input', () => {
  termoBusca = campoBusca.value;
  renderizarTabela();
});

// Limpar erros enquanto o usuário digita
campoTitulo.addEventListener('input', () => {
  limparErro(campoTitulo, erroTitulo);
});

campoGenero.addEventListener('input', () => {
  limparErro(campoGenero, erroGenero);
});

campoAno.addEventListener('input', () => {
  limparErro(campoAno, erroAno);
});

campoTemporadas.addEventListener('input', () => {
  limparErro(campoTemporadas, erroTemporadas);
});

/* ============================================================
   11. INICIALIZAÇÃO
   ============================================================ */

function inicializar() {
  carregarSeries();
}

inicializar();

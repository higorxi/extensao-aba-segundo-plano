// Função para inicializar o popup com as configurações salvas
function inicializarPopup() {
  // Configurações de posição dos radio buttons
  chrome.storage.sync.get(['linkPosition', 'openOnClick', 'activateOnExit'], function (data) {
    if (data.linkPosition) {
      // Seleciona o radio button com base no valor recuperado
      document.querySelector('input[name="linkPosition"][value="' + data.linkPosition + '"]').checked = true;
    }

    if (data.openOnClick) {
      document.getElementById('openOnClick').checked = data.openOncClick === 'true';
    }

    if (data.activateOnExit) {
      document.getElementById('activateOnExit').checked = data.activateOnExit === 'true';
    }
  });
}

// Adicionar listener para o botão de fechar
document.getElementById('closeButton').addEventListener('click', function () {
  window.close();
});

// Adicionar listener para salvar configurações do radio button ao alterar
const radioButtons = document.querySelectorAll('input[name="linkPosition"]');
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('change', function () {
    const value = this.value;

    const items = {
      linkPosition: value,
    };

    chrome.storage.sync.set(items);

    chrome.runtime.sendMessage({ type: "configuracoes", ...items });
    
  });
});

// Adicionar listener para salvar configurações dos checkboxes ao alterar
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    const id = this.id;
    const value = this.checked.toString();

    const items = {};
    items[id] = value;
    
    chrome.runtime.sendMessage({ type: "configuracoesAcessoAba", ...items });
  });
});

// Inicializar o popup com as configurações armazenadas ao carregar
document.addEventListener('DOMContentLoaded', function () {
  inicializarPopup();
});

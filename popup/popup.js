
document.getElementById("activateAll").addEventListener("click", ativarTodasAbas);

document.getElementById("desactivateAll").addEventListener("click", desativarTodasAbas);

document.getElementById("confirmButton").addEventListener("click", configuracoes);

document.getElementById("activateSelected").addEventListener("click", ativarSelecionadas)

document.getElementById("desactivateSelected").addEventListener("click", desativarSelecionadas)


// Função para ativar todas as abas inativas
function ativarTodasAbas(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "activateTabs" });
}

function desativarTodasAbas(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "inactivateTabs" });
}

function configuracoes(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "configuracoes", positionLink: document.querySelector('input[name="linkPosition"]:checked').value})
    window.close();
}

function ativarSelecionadas(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "ativarSelecionadas"})
}

function desativarSelecionadas(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({ type: "desativarSelecionadas"})
}
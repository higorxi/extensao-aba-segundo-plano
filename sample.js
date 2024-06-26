let pageObjectsArray = [];

// Variável para armazenar a posição recuperada
let positionForPageHTML = '';
let activeInEnterPage = null;
let desactivePageInExit = null;

// Função para obter e configurar a posição inicial
function obterPosicaoInicial() {
  chrome.storage.sync.get('linkPosition', function(data) {
    if (data.linkPosition) {
      positionForPageHTML = data.linkPosition;
    } else if(data.linkPosition === undefined 	|| data.linkPosition === null){
      positionForPageHTML = 'center';
    } else {  
      console.log('Nenhuma posição inicial encontrada no armazenamento.');
    }
  });

  chrome.storage.sync.get(['openOnClick', 'activateOnExit'], function(data) {
    if (data.openOnClick !== undefined && data.activateOnExit !== undefined) {
      activeInEnterPage = data.openOnClick
      desactivePageInExit  = data.activateOnExit
    } else {
      activeInEnterPage = false
      desactivePageInExit  = false
      console.log('Nenhuma posição inicial encontrada no armazenamento.');
    }
  });
}

// Listener para quando a extensão é iniciada
chrome.runtime.onInstalled.addListener(function() {
  obterPosicaoInicial();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openWith2Plano',
    title: 'Abrir com 2PLANO',
    contexts: ['link'],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  const contextMenuItems = [
    { id: 'activateTabs', title: 'Ativar LinkIN em todas as guias' },
    { id: 'inactivateTabs', title: 'Desativar LinkIN em todas as guias' },
    { id: 'ativarSelecionadas', title: 'Ativar LinkIN nas guias selecionadas' },
    { id: 'desativarSelecionadas', title: 'Desativar LinkIN nas guias selecionadas' },
  ];

  contextMenuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ['action'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'openWith2Plano':
      break;
    case 'activateTabs':
      ativarTodasAbas(pageObjectsArray);
      break;
    case 'inactivateTabs':
      desativarTodasAbas(pageObjectsArray);
      break;
    case 'ativarSelecionadas':
      ativarTodasAbasSelecionadas();
      break;
    case 'desativarSelecionadas':
      desativarTodasAbasSelecionadas();
      break;
    default:
      console.log('Item do menu de contexto desconhecido');
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openWith2Plano') {
    const pageUrl = encodeURIComponent(info.linkUrl);
    const pageInitial = tab.title;
    const actualPage = encodeURIComponent(tab.url);

    const decodedUrl = decodeURIComponent(pageUrl);

    const urlParts = decodedUrl.split('/');

    let lastPart = urlParts[urlParts.length - 1];

    if (lastPart.trim() === '') {
      lastPart = urlParts[urlParts.length - 2];
    }

    const title = lastPart.replace(/[-_]/g, ' ').replace(/\.\w+$/, '');

    const capitalizedTitle = title.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    const faviconAlvo = `https://www.google.com/s2/favicons?domain=${pageUrl}`;

    const faviconUrl = tab.favIconUrl || `chrome://favicon/${tab.url}`;

    let newPageHtml = '';

    if (positionForPageHTML === 'left') {
      newPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title id="pageTitle">LinkIN &gt; ${capitalizedTitle ? capitalizedTitle : pageInitial}</title>
  <link rel="shortcut icon" type="image/x-icon" href="${faviconAlvo}">
  <style>
    body {
      display: flex;
      justify-content: flex-start; /* Alinha o container à esquerda horizontalmente */
      align-items: center; /* Centraliza verticalmente */
      height: 100vh;
      margin: 0;
      padding-left: 20px; /* Ajuste a margem esquerda conforme necessário */
    }
    #container {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1rem;
      padding-left: 20px;
    }
    img {
      width: 32px;
      height: 32px;
    }
    #dynamicTitle a {
      color: black;
      text-decoration: none;
      max-width: 600px;
      word-wrap: break-word;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
    }
    #dynamicTitle {
      margin-top: 10px;
    }
    #link {
      margin-top: 5px;
    }
    span {
      text-align: center;
    }
  </style>
</head>
<body>
  <link rel="shortcut icon" type="image/x-icon" href="${faviconUrl}">
  <div id="container">
    <img src="${faviconAlvo}" alt="Favicon" />
    <h1><span id="extensaoTitle">LinkIN</span></h1>
    <h1>
      <span id="dynamicTitle"><a href="${decodedUrl}">${capitalizedTitle ? capitalizedTitle : pageInitial}</a></span>
    </h1>
  </div>
  <script>
    
  </script>
</body>
</html>`;
    } else if (positionForPageHTML === 'right') {
      newPageHtml = `<!DOCTYPE html>
<html>
<head>
  <title id="pageTitle">LinkIN &gt; ${capitalizedTitle ? capitalizedTitle : pageInitial}</title>
  <link rel="shortcut icon" type="image/x-icon" href="${faviconAlvo}">
  <style>
    body {
      display: flex;
      justify-content: flex-end; 
      align-items: center; 
      height: 100vh;
      margin: 0;
      padding-left: 20px; 
    }
    #container {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1rem;
      padding-left: 20px;
    }
    img {
      width: 32px;
      height: 32px;
    }
    #dynamicTitle a {
      color: black;
      text-decoration: none;
      max-width: 600px;
      word-wrap: break-word;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
    }
    #dynamicTitle {
      margin-top: 10px;
    }
    #link {
      margin-top: 5px;
    }
    span {
      text-align: center;
    }
  </style>
</head>
<body>
  <link rel="shortcut icon" type="image/x-icon" href="${faviconUrl}">
  <div id="container">
    <img src="${faviconAlvo}" alt="Favicon" />
    <h1><span id="extensaoTitle">LinkIN</span></h1>
    <h1>
      <span id="dynamicTitle"><a href="${decodedUrl}">${capitalizedTitle ? capitalizedTitle : pageInitial}</a></span>
    </h1>
  </div>
  <script>
    
  </script>
</body>
</html>`;

    } else if (positionForPageHTML === 'center') {
      newPageHtml = `<!DOCTYPE html>
    <html>
    <head>
      <title id="pageTitle">LinkIN &gt; ${capitalizedTitle ? capitalizedTitle : pageInitial}</title>
      <link rel="shortcut icon" type="image/x-icon" href="${faviconAlvo}">
      <style>
        body {
          text-align: left;
          margin-top: 5rem;
          
        }
        #container {
          display: flex;
          flex-direction: column;
          align-items: ${positionForPageHTML};
          height: 100%;
          margin: auto;
          font-size: 1rem;
          padding-left: 20px;
        }
        img {
          width: 32px;
          height: 32px;
        }
        #dynamicTitle a {
          color: black;
          text-decoration: none;
          max-width: 600px; 
          word-wrap: break-word; 
          display: inline-block;
          overflow: hidden; 
          text-overflow: ellipsis; 
          width: 100%;
          text-aling: center:
        }
        #dynamicTitle {
          margin-top: 10px;
        }
        #link {
          margin-top: 5px;
        }
        span{
        text-align: center
        }
      </style>
    </head>
    <body>
      <link rel="shortcut icon" type="image/x-icon" href="${faviconUrl}">
      <div id="container">
        <img src="${faviconAlvo}" alt="Favicon" />
        <h1><span id="extensaoTitle">LinkIN</span></h1>
        <h1>
          <span id="dynamicTitle"><a href="${decodedUrl}">${
        capitalizedTitle ? capitalizedTitle : pageInitial
      }</a></span>
        </h1>
      </div>
      <script>
        
      </script>
    </body>
    </html>`;
    } else {
      console.log(positionForPageHTML, "position")
      console.error('posição incorreta');
    }

    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
      const currentIndex = tabs[0].index;
      const newTab = await chrome.tabs.create({
        url: 'data:text/html;charset=utf-8,' + encodeURIComponent(newPageHtml),
        index: currentIndex + 1,
        active: false,
      });
      const pageObject = {
        id: newTab.id,
        pageTitle: newTab.pageTitle,
        pageUrlActive: decodeURIComponent(pageUrl),
        inactivePage: newTab.pendingUrl,
      };

      pageObjectsArray.push(pageObject);
      console.log(pageObjectsArray);
    });
  }
});

function ativarTodasAbas() {
  try {
    pageObjectsArray.forEach((pageObject) => {
      const id = pageObject.id;
      const url = pageObject.pageUrlActive;

      chrome.tabs.get(id, (tab) => {
        if (tab) {
          chrome.tabs.update(id, { url: url });
        } else {
          const index = pageObjectsArray.findIndex((obj) => obj.id === id);
          if (index !== -1) {
            pageObjectsArray.splice(index, 1);
          }
        }
      });
    });
  } catch (e) {
    console.error('Erro ao ativar abas:', e);
  }
}

function desativarTodasAbas() {
  try {
    const updatedPageObjectsArray = [];

    // Cria uma lista de promessas para todas as operações de aba
    const promises = pageObjectsArray.map((pageObject) => {
      return new Promise((resolve, reject) => {
        const id = pageObject.id;
        const url = pageObject.inactivePage;

        chrome.tabs.get(id, (tab) => {
          if (tab) {
            const index = tab.index;
            chrome.tabs.remove(id, () => {
              if (chrome.runtime.lastError) {
                console.error(`Erro ao remover a aba: ${chrome.runtime.lastError.message}`);
                reject(chrome.runtime.lastError);
                return;
              }
              chrome.tabs.create({ url: url, active: false, index: index }, (newTab) => {
                if (chrome.runtime.lastError) {
                  console.error(`Erro ao criar a nova aba: ${chrome.runtime.lastError.message}`);
                  reject(chrome.runtime.lastError);
                  return;
                }
                const newPageObject = {
                  id: newTab.id,
                  pageTitle: newTab.title,
                  pageUrlActive: pageObject.pageUrlActive,
                  inactivePage: url,
                };
                updatedPageObjectsArray.push(newPageObject);
                resolve();
              });
            });
          } else {
            const index = pageObjectsArray.findIndex((obj) => obj.id === id);
            if (index !== -1) {
              pageObjectsArray.splice(index, 1);
            }
            resolve();
          }
        });
      });
    });

    // Espera todas as promessas serem resolvidas
    Promise.all(promises)
      .then(() => {
        pageObjectsArray.length = 0; 
        Array.prototype.push.apply(pageObjectsArray, updatedPageObjectsArray); 
      })
      .catch((error) => {
        console.error('Erro ao desativar abas:', error);
      });

  } catch (e) {
    console.error('Erro ao desativar abas:', e);
  }
}

function configuracoesCenter() {
  try {
    positionForPageHTML = 'center';
  } catch (e) {
    console.error('Error configuration tabs:', e);
  }
}

function configuracoesLeft() {
  try {
    positionForPageHTML = 'left';
  } catch (e) {
    console.error('Error configuration tabs:', e);
  }
}

function configuracoesRight() {
  try {
    positionForPageHTML = 'right';
  } catch (e) {
    console.error('Error configuration tabs:', e);
  }
}

function ativarTodasAbasSelecionadas() {
  try {
    chrome.tabs.query({ highlighted: true }, function (highlightedTabs) {
      highlightedTabs.forEach(function (tab) {
        const pageObject = pageObjectsArray.find((obj) => obj.id === tab.id);
        if (pageObject) {
          chrome.tabs.update(tab.id, { url: pageObject.pageUrlActive });
        }
      });
    });
  } catch (e) {
    console.error('Erro ao ativar abas selecionadas:', e);
  }
}

function desativarTodasAbasSelecionadas() {
  try {
    const updatedPageObjectsArray = [];

    chrome.tabs.query({ highlighted: true }, function (highlightedTabs) {
      const promises = highlightedTabs.map((tab) => {
        return new Promise((resolve, reject) => {
          const pageObject = pageObjectsArray.find((obj) => obj.id === tab.id);
          if (pageObject && pageObject.inactivePage) {
            const index = tab.index;
            chrome.tabs.remove(tab.id, () => {
              if (chrome.runtime.lastError) {
                console.error(`Erro ao remover a aba: ${chrome.runtime.lastError.message}`);
                reject(chrome.runtime.lastError);
                return;
              }
              chrome.tabs.create({ url: pageObject.inactivePage, active: false, index: index }, (newTab) => {
                if (chrome.runtime.lastError) {
                  console.error(`Erro ao criar a nova aba: ${chrome.runtime.lastError.message}`);
                  reject(chrome.runtime.lastError);
                  return;
                }
                const newPageObject = {
                  id: newTab.id,
                  pageTitle: newTab.title,
                  pageUrlActive: pageObject.pageUrlActive,
                  inactivePage: pageObject.inactivePage,
                };
                updatedPageObjectsArray.push(newPageObject);
                resolve();
              });
            });
          } else {
            resolve();
          }
        });
      });

      // Espera todas as promessas serem resolvidas
      Promise.all(promises)
        .then(() => {
          pageObjectsArray = pageObjectsArray.filter((obj) => !highlightedTabs.some((tab) => tab.id === obj.id));
          Array.prototype.push.apply(pageObjectsArray, updatedPageObjectsArray);
        })
        .catch((error) => {
          console.error('Erro ao desativar abas selecionadas:', error);
        });
    });
  } catch (e) {
    console.error('Erro ao desativar abas selecionadas:', e);
  }
}

function configuracoesOpenOnClick(config) {
  try {
    activeInEnterPage = config;
  } catch (e) {
    console.error('Error configuracoesOpenOnClick:', e);
  }
}

function configuracoesActivateOnExit(config) {
  try {
    desactivePageInExit = config;
  } catch (e) {
    console.error('Error configuracoesActivateOnExit:', e);
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'configuracoes') {
    switch (request.linkPosition) {
      case 'center':
        configuracoesCenter(positionForPageHTML);
        break;
      case 'left':
        configuracoesLeft(positionForPageHTML);
        break;
      case 'right':
        configuracoesRight(positionForPageHTML);
        break;
      default:
        console.error('Erro ao definir request.positionlink');
        break;
    }
  }

    if (request.openOnClick !== undefined) {
      if (request.openOnClick) {
        configuracoesOpenOnClick(request.openOnClick);
      } else {
        console.error('Erro ao configurar o abrir site ao clicar na guia:', e);
      }
    }

    if (request.activateOnExit !== undefined) {
      if (request.activateOnExit) {
        configuracoesActivateOnExit(request.activateOnExit);
      } else {
        console.error('Erro ao configurar o ativar LinkIN na saída de abas:', e);
      }
    }

});

const pageObjectsArray = [];
var positionForPageHTML = 'center';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openWith2Plano",
    title: "Abrir com 2PLANO",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openWith2Plano") {
    const pageUrl = encodeURIComponent(info.linkUrl);
    const pageInitial = tab.title;
    const actualPage = encodeURIComponent(tab.url);


    const decodedUrl = decodeURIComponent(pageUrl);

    const urlParts = decodedUrl.split('/');

    let lastPart = urlParts[urlParts.length - 1];

    if (lastPart.trim() === "") {
      lastPart = urlParts[urlParts.length - 2];
    }

    const title = lastPart.replace(/[-_]/g, ' ').replace(/\.\w+$/, '');

    const capitalizedTitle = title.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    const faviconAlvo = `https://www.google.com/s2/favicons?domain=${pageUrl}`

    const faviconUrl = tab.favIconUrl || `chrome://favicon/${tab.url}`;

    const newPageHtml = `<!DOCTYPE html>
    <html>
    <head>
      <title id="pageTitle">LinkIN &gt; ${capitalizedTitle ? capitalizedTitle : pageInitial}</title>
      <link rel="shortcut icon" type="image/x-icon" href="${faviconAlvo}">
      <style>
        body {
          text-align: left;
          margin-top: 11rem;
        }
        #container {
          display: flex;
          flex-direction: column;
          align-items: ${positionForPageHTML};
          height: 100%;
          margin: 0 auto;
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
          max-width: 400px; 
          word-wrap: break-word; 
          display: inline-block;
          overflow: hidden; 
          text-overflow: ellipsis; 
          width: 600px
        }
        #dynamicTitle {
          margin-top: 10px;
        }
        #link {
          margin-top: 10px;
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

    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
      const currentIndex = tabs[0].index;
      const newTab = await chrome.tabs.create({
        url: "data:text/html;charset=utf-8," + encodeURIComponent(newPageHtml),
        index: currentIndex + 1,
        active: false,
      });
      const pageObject = {
        id: newTab.id,
        pageTitle: newTab.pageTitle,
        pageUrlActive: decodeURIComponent(pageUrl),
        inactivePage: newTab.pendingUrl
      };

      pageObjectsArray.push(pageObject);
      console.log(pageObjectsArray);
    });
  }
});


function ativarTodasAbas() {
  try {
    pageObjectsArray.forEach(pageObject => {
      const id = pageObject.id;
      const url = pageObject.pageUrlActive;

      chrome.tabs.get(id, tab => {
        if (tab) {
          chrome.tabs.update(id, { url: url });
        } else {
          const index = pageObjectsArray.findIndex(obj => obj.id === id);
          if (index !== -1) {
            pageObjectsArray.splice(index, 1);
          }
        }
      });
    });
  } catch (e) {
    console.error("Erro ao ativar abas:", e);
  }
}

function desativarTodasAbas() {
  try {
    pageObjectsArray.forEach(pageObject => {
      const id = pageObject.id;
      const url = pageObject.inactivePage;

      chrome.tabs.get(id, tab => {
        if (tab) {
          chrome.tabs.remove(id, () => {
            chrome.tabs.create({ url: url, active: false }, newTab => {
              const newPageObject = {
                id: newTab.id,
                pageTitle: newTab.pageTitle,
                pageUrlActive: pageObject.pageUrlActive,
                inactivePage: url
              };
              pageObjectsArray.push(newPageObject); 
            });
          });
        } else {
          const index = pageObjectsArray.findIndex(obj => obj.id === id);
          if (index !== -1) {
            pageObjectsArray.splice(index, 1);
          }
        }
      });
    });
  } catch (e) {
    console.error("Erro ao desativar abas:", e);
  }
}

function configuracoesCenter() {
  try {
    positionForPageHTML = 'center'
  } catch (e) {
    console.error("Error configuration tabs:", e);
  }
}

function configuracoesLeft() {
  try {
    positionForPageHTML = 'flex-start'
  } catch (e) {
    console.error("Error configuration tabs:", e);
  }
}

function configuracoesRight() {
  try {
    positionForPageHTML = 'flex-end'
  } catch (e) {
    console.error("Error configuration tabs:", e);
  }
}

function ativarTodasAbasSelecionadas() {
  try {
    chrome.tabs.query({ highlighted: true }, function (highlightedTabs) {
      highlightedTabs.forEach(function (tab) {
        const pageObject = pageObjectsArray.find(obj => obj.id === tab.id);
        if (pageObject) {
          chrome.tabs.update(tab.id, { url: pageObject.pageUrlActive });
        }
      });
    });
  } catch (e) {
    console.error("Erro ao ativar abas selecionadas:", e);
  }
}


function desativarTodasAbasSelecionadas() {
  try {
    chrome.tabs.query({ highlighted: true }, function (highlightedTabs) {
      highlightedTabs.forEach(function (tab) {
        const pageObject = pageObjectsArray.find(obj => obj.id === tab.id);
        if (pageObject && pageObject.inactivePage) {
          chrome.tabs.remove(tab.id, () => {
            chrome.tabs.create({ url: pageObject.inactivePage, active: false }, newTab => {
              const newPageObject = {
                id: newTab.id,
                pageTitle: newTab.pageTitle,
                pageUrlActive: pageObject.pageUrlActive,
                inactivePage: pageObject.inactivePage
              };
              pageObjectsArray.push(newPageObject); 
            });
          });
        }
      });
    });
  } catch (e) {
    console.error("Erro ao desativar abas selecionadas:", e);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "activateTabs") {
    ativarTodasAbas(pageObjectsArray);
  }
  if (request.type === "inactivateTabs") {
    desativarTodasAbas(pageObjectsArray)
  }
  if (request.type === "configuracoes") {
    switch (request.positionLink) {
      case "center":
        configuracoesCenter(positionForPageHTML);
        break;
      case "left":
        configuracoesLeft(positionForPageHTML);
        break;
      case "right":
        configuracoesRight(positionForPageHTML);
        break;
      default:
        console.error("Erro ao definir request.positionlink")
        break;
    }
  }
  if (request.type === "ativarSelecionadas") {
    ativarTodasAbasSelecionadas()
  }
  if (request.type === "desativarSelecionadas") {
    desativarTodasAbasSelecionadas()
  }
});











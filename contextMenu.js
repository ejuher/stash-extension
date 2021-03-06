const parent = chrome.contextMenus.create({"title": "STASH", "contexts":['link']});
const tags = ["AUDIO", "VIDEO", "ARTICLE", "EVENT", "PURCHASE", "OTHER"];

let menuItems = {};
for (let i = 0; i < tags.length; i++) {
  let id = chrome.contextMenus.create({"title": tags[i], "parentId": parent, "contexts":['link'], 
                                       "onclick": stash});
  menuItems[id] = tags[i];
}

function stash(info, tab) {
  const tag = menuItems[info.menuItemId];
  let url = info.linkUrl;
  if (tab.url.startsWith('https://www.google.com/search')) {
    // Links on a google search result page go to a google.com url that then redirects to the desired url.
    // The server's url parser can't process these urls, but the final destination url is in the query params.
    // Take the desired url from the query params:
    url = url.match(/url=(.+)&/)[1].replace(/%2F/g, '/').replace(/%3A/,':')
  }
  stashURL(null, url, tag);
}

function stashURL(title, url, tag) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://stashh.herokuapp.com/links');
  // xhr.open('POST', 'http://localhost:3000/links'); //stashing only works at this url when active
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-type", "application/json");
  var data = { data: { attributes: { title: title, url: url, tag: tag }, type: 'links' } };
  xhr.send(JSON.stringify(data));
}

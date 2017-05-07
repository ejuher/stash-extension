const parent = chrome.contextMenus.create({"title": "STASH"});
const tags = ["AUDIO", "VIDEO", "ARTICLE", "OTHER"];

let menuItems = {};
for (let i = 0; i < tags.length; i++) {
  let id = chrome.contextMenus.create({"title": tags[i], "parentId": parent, "onclick": stash});
  menuItems[id] = tags[i]
}

function stash(info, tab) {
  debugger
  const tag = menuItems[info.menuItemId];
  const url = tab.url;
  const title = tab.title;
  stashURL(title, url, tag);
}

function stashURL(title, url, tag) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://damp-beach-68679.herokuapp.com/links');
  // xhr.open('POST', 'http://localhost:3000/links'); //stashing only works at this url when active
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-type", "application/json");
  var data = { data: { attributes: { title: title, url: url, tag: tag }, type: 'links' } };
  xhr.send(JSON.stringify(data));
}

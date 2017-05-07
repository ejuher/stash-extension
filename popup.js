// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabThenStash(tag) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    var title = tab.title;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    stashURL(title, url, tag);
  });
}

function stashURL(title, url, tag) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://damp-beach-68679.herokuapp.com/links');
  // xhr.open('POST', 'http://localhost:3000/links'); //stashing only works at this url when active
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      renderStatus('STASHED!')
      window.setTimeout(function() {
        window.close();
      }, 3500);
    } else {
      renderStatus('ERROR!', xhr.statusText)
    }
  };
  var data = { data: { attributes: { title: title, url: url, tag: tag }, type: 'links' } };
  xhr.send(JSON.stringify(data));
}

function renderStatus(title, url) {
  document.getElementById('title').textContent = title;
  document.getElementById('url').textContent = url;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('tag-selector').addEventListener('click', function(event) {
    var tag = event.target.innerText;
    event.currentTarget.classList.add('hidden');
    renderStatus('STASHING...');
    getCurrentTabThenStash(tag);
  });
});

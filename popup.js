// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
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

    callback(title, url);
  });
}

function stashURL(title, url) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://damp-beach-68679.herokuapp.com/links');
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
  var data = { data: { attributes: {title: title, url: url}, type: 'links' } };
  xhr.send(JSON.stringify(data));
}

function renderStatus(title, url) {
  document.getElementById('title').textContent = title;
  document.getElementById('url').textContent = url;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(title, url) {
    renderStatus('STASHING...');
    stashURL(title, url)
  });
});

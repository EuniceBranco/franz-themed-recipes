"use strict";
const path = require('path');
const fs = require('fs');

module.exports = Franz => {
  const cssFiles = fs.readdirSync(__dirname)
    .filter((fileName) => (fileName.startsWith('theme-') && fileName.endsWith('.css')))
    .map((fileName) => path.join(__dirname, fileName));
  Franz.injectCSS(...cssFiles);

  const fixLikeIcon = function fixLikeIcon() {
    const likes = document.querySelectorAll('._2poz._ui9._576q');
    [...likes].forEach(like => {
      const svg = like.querySelector('svg');
      const mask = svg.querySelector('mask');
      if (mask) {
        const path = svg.querySelector('mask > path');
        path.setAttribute('fill', '#0099ff');
        svg.appendChild(path);
        svg.removeChild(mask);
        const otherRect = svg.querySelector('rect');
        svg.removeChild(otherRect);
        like.querySelector('div')
          .parentNode
          .removeChild(like.querySelector('div'));
      }
    })
  };
  fixLikeIcon();

  const getMessages = function getMessages() {
    let count = document.querySelectorAll('._5fx8:not(._569x),._1ht3:not(._569x)').length;
    const messageRequestsElement = document.querySelector('._5nxf');

    if (messageRequestsElement) {
      count += parseInt(messageRequestsElement.innerHTML, 10);
    }

    Franz.setBadge(count);
  };

  Franz.loop(getMessages);
  Franz.loop(fixLikeIcon);

  localStorage.setItem('_cs_desktopNotifsEnabled', JSON.stringify({
    __t: new Date().getTime(),
    __v: true,
  }));

  if (typeof Franz.onNotify === 'function') {
    Franz.onNotify(notification => {
      if (typeof notification.title !== 'string') {
        notification.title = ((notification.title.props || {}).content || [])[0] || 'Messenger';
      }

      if (typeof notification.options.body !== 'string') {
        notification.options.body = (((notification.options.body || {}).props || {}).content || [])[0] || '';
      }

      return notification;
    });

  }
};

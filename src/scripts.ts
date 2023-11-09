document.querySelectorAll('main>article').forEach((article) => {
  const dl = article.querySelector('dl');
  const h2 = article.querySelector('h2');
  if (!dl || !h2) {
    return;
  }

  // 作品タイトルの移動
  const dt = document.createElement('dt');
  dt.appendChild(document.createTextNode('タイトル'));
  dl.insertBefore(dt, dl.firstChild);

  const dd = document.createElement('dd');
  while (h2.firstChild) dd.appendChild(h2.firstChild);
  dl.insertBefore(dd, dt.nextSibling);
  (h2.parentNode as HTMLElement).id = h2.id;
  h2.parentNode!.removeChild(h2);

  // サムネイル下への電子版リンクコピー
  const figure = article.querySelector('figure');
  if (!figure) {
    return;
  }

  [...dl.querySelectorAll('dt')]
    .filter(
      (node) => node.textContent === '電子版' && (dt.nextSibling as HTMLElement).tagName === 'DD',
    )
    .forEach((dt) => {
      (dt.nextSibling as HTMLElement).querySelectorAll('ul').forEach((ul) => {
        figure.appendChild(ul.cloneNode(true));
      });
    });
});

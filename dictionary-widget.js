(() => {
  if (window.self !== window.top || document.querySelector('.dictionary-widget')) return;

  const script = document.currentScript;
  const fullDictionaryUrl = new URL('dictionary.html', script.src).href;
  const dictionaryUrl = new URL('dictionary.html?embed=1', script.src).href;
  const widget = document.createElement('aside');
  widget.className = 'dictionary-widget';
  widget.setAttribute('aria-label', 'Floating Tujia dictionary');
  widget.innerHTML = `
    <button class="dictionary-widget-button" type="button" aria-expanded="false" aria-controls="dictionary-widget-panel">
      <span aria-hidden="true">⌕</span> Dictionary
    </button>
    <section class="dictionary-widget-panel" id="dictionary-widget-panel" aria-hidden="true">
      <div class="dictionary-widget-bar">
        <div><strong>Dictionary</strong><small>Look up words while reading</small></div>
        <div class="dictionary-widget-actions">
          <a href="${fullDictionaryUrl}" target="_blank" rel="noopener" aria-label="Open full dictionary">↗</a>
          <button type="button" aria-label="Close dictionary">×</button>
        </div>
      </div>
      <iframe title="Tujia dictionary" data-src="${dictionaryUrl}"></iframe>
    </section>`;

  document.body.appendChild(widget);
  const openButton = widget.querySelector('.dictionary-widget-button');
  const panel = widget.querySelector('.dictionary-widget-panel');
  const closeButton = widget.querySelector('.dictionary-widget-actions button');
  const popoutLink = widget.querySelector('.dictionary-widget-actions a');
  const frame = widget.querySelector('iframe');

  const updatePopoutLink = state => {
    const url = new URL(fullDictionaryUrl);
    if (state.q) url.searchParams.set('q', state.q);
    if (state.dialect) url.searchParams.set('dialect', state.dialect);
    if (state.mode) url.searchParams.set('mode', state.mode);
    popoutLink.href = url.href;
  };

  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.data?.type !== 'tujia-dictionary-state') return;
    updatePopoutLink(event.data);
  });

  // Some browsers create an empty tab instead of navigating directly from one
  // local file to another. In local mode, open a same-origin wrapper and load
  // the stateful dictionary inside it. Hosted sites keep the normal link.
  popoutLink.addEventListener('click', event => {
    if (location.protocol !== 'file:') return;
    event.preventDefault();
    const popup = window.open('', 'tujia-dictionary-window');
    if (!popup) return;
    popup.document.open();
    popup.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tujia Dictionary</title><style>html,body,iframe{width:100%;height:100%;margin:0;border:0;background:#fff}iframe{display:block}</style></head><body><iframe id="dictionary-frame" title="Tujia Dictionary"></iframe></body></html>');
    popup.document.close();
    popup.document.getElementById('dictionary-frame').src = popoutLink.href;
    popup.focus();
  });

  const open = () => {
    if (!frame.src) frame.src = frame.dataset.src;
    widget.classList.add('is-open');
    openButton.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    closeButton.focus();
  };

  const close = () => {
    widget.classList.remove('is-open');
    openButton.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    openButton.focus();
  };

  openButton.addEventListener('click', () => {
    if (widget.classList.contains('is-open')) close();
    else open();
  });
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.classList.contains('is-open')) close();
  });
})();

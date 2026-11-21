(() => {
  const gameGroups = [
    { id: 'lotto', label: '六合彩', names: ['极速六合彩', 'IG六合彩', '十分六合彩', '澳门六合彩', '新澳门六合彩'] },
    { id: 'pk10', label: '赛车 / 飞艇', names: ['极速赛车', '一分赛车', '比特币一分赛车', '三分赛车', '澳洲赛车', '比特币三分赛车', 'IG赛车', 'IG飞艇', '比特币飞艇', '新幸运飞艇', '幸运飞艇'] },
    { id: 'ssc', label: '时时彩', names: ['极速时时彩', '一分时时彩', '比特币一分时时彩', '三分时时彩', '威尼斯时时彩', '澳洲幸运5', 'IG时时彩', '河内一分彩', '河内五分彩'] },
    { id: 'klc', label: '快乐十分', names: ['极速快乐十分', '三分快乐十分', '米兰快乐十分', '里昂快乐十分', '湖南快乐十分', '幸运农场', '广东快乐十分'] },
    { id: 'x115', label: '11选5', names: ['极速十一选五', '三分十一选五', '罗马十一选五', '巴黎十一选五', '江西十一选五', '山东十一选五', '辽宁十一选五', '湖北十一选五', '广东十一选五'] },
    { id: 'k8', label: '快乐8', names: ['极速快乐八', '三分快乐八', '戛纳快乐八', '柏林快乐八', '斯洛伐克快乐八', '台湾快乐八', '北京快乐八'] },
    { id: 'k3', label: '快3', names: ['秒速快三', '一分快三', '极速快三', '三分快三', '马德里快三', '莫斯科快三', '江苏骰宝', '安徽快三', '上海快三', '湖北快三'] },
    { id: '3d', label: '3D', names: ['极速3D', '三分3D', '日内瓦3D', '维也纳3D', '福彩3D', '排列三3D'] },
    { id: 'pcdd', label: 'PC蛋蛋', names: ['极速PC蛋蛋', '比特币PC蛋蛋', '三分PC蛋蛋', '戛纳PC蛋蛋', '柏林PC蛋蛋', '斯洛伐克PC蛋蛋', '台湾PC蛋蛋', '北京PC蛋蛋'] },
  ].map(group => ({ ...group, games: group.names.map((name, index) => [name, `${group.id}-${String(index).padStart(2, '0')}`]) }));
  const drawSamples = {
    lotto: [40, 21, 41, 32, 28, 3, 4], pk10: [2, 9, 10, 7, 6, 1, 8, 3, 5, 4],
    ssc: [6, 9, 2, 8, 4], klc: [3, 16, 8, 19, 5, 12, 1, 20], x115: [4, 8, 10, 1, 7],
    k8: [2, 6, 9, 13, 17, 21, 25, 28, 33, 37, 41, 45, 48, 52, 57, 61, 66, 70, 74, 79],
    k3: [2, 5, 6], '3d': [5, 2, 8], pcdd: [3, 6, 8],
  };
  const issueSamples = { lotto: 467338, pk10: 260051, ssc: 259689, klc: 886420, x115: 721559, k8: 319204, k3: 680230, '3d': 452188, pcdd: 1894229 };
  const countdownSamples = { lotto: 40, pk10: 825, ssc: 36, klc: 75, x115: 58, k8: 130, k3: 27, '3d': 220, pcdd: 49 };
  const cards = [
    { id: 0, group: 'pk10', game: '澳洲赛车', logo: 'pk10-04', issue: 260052, last: 260051, remaining: 825, draw: [2, 9, 10, 7, 6, 1, 8, 3, 5, 4], full: true, muted: true, selected: new Set() },
    { id: 1, group: 'lotto', game: '极速六合彩', logo: 'lotto-00', issue: 467339, last: 467338, remaining: 40, draw: [40, 21, 41, 32, 28, 3, 4], full: false, muted: true, selected: new Set() },
    { id: 2, group: 'pk10', game: '一分赛车', logo: 'pk10-01', issue: 201008, last: 201007, remaining: 42, draw: [9, 6, 2, 7, 8, 3, 4, 10, 5, 1], full: false, muted: true, selected: new Set() },
  ];
  const sourceData = window.mobileSourceReference || {};
  let lottoData = [];
  let pendingChange = null;
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const clock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const wave = number => [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46].includes(Number(number)) ? 'wave-red' : [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48].includes(Number(number)) ? 'wave-blue' : 'wave-green';
  const cardData = card => card.group === 'lotto' ? lottoData : sourceData[card.group] || [];
  const logo = key => `../多彩同投/assets/logos/${key}.png`;
  const soundIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path class="slash" d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function drawMarkup(card, draw = card.draw) {
    return `<div class="balls ${card.group}">${draw.map((number, index) => `${card.group === 'lotto' && index === 6 ? '<span class="draw-plus">+</span>' : ''}<span class="ball ${card.group === 'lotto' ? wave(number) : card.group === 'pk10' ? `rank-${number}` : card.group === 'k3' ? 'die' : ''} ${card.group === 'lotto' && index === 6 ? 'special' : ''}">${card.group === 'k3' ? ['','⚀','⚁','⚂','⚃','⚄','⚅'][number] : ['lotto','klc','x115','k8'].includes(card.group) ? String(number).padStart(2, '0') : number}</span>`).join('')}${card.group === 'pcdd' ? `<span class="draw-plus">=</span><span class="ball sum">${draw.reduce((a, b) => a + b, 0)}</span>` : ''}</div>`;
  }
  function historyMarkup(card) {
    const rows = Array.from({ length: 10 }, (_, index) => {
      const draw = index ? card.draw.map((_, position) => card.draw[(position + index) % card.draw.length]) : card.draw;
      const time = new Date(Date.UTC(2026, 0, 1, 21, 0) - index * 20 * 60000).toISOString().slice(11, 16);
      return `<div class="history-row"><div class="history-period"><strong>${card.last - index}</strong><small>${time}</small></div>${drawMarkup(card, draw)}</div>`;
    }).join('');
    return `<section class="history-panel" aria-label="${esc(card.game)}开奖记录"><div class="history-heading"><span>期号 / 时间</span><span>开奖号码</span></div><div class="history-rows">${rows}</div><p class="history-note">展示数据仅供原型预览</p></section>`;
  }
  function optionMarkup(card, groupIndex, sectionIndex, item, itemIndex) {
    const value = String(item.value);
    const numeric = /^\d{1,2}$/.test(value);
    const key = `${groupIndex}|${sectionIndex}|${itemIndex}|${value}`;
    const active = card.selected.has(key);
    return `<button type="button" class="option ${active ? 'selected' : ''}" data-bet="${card.id}" data-key="${esc(key)}" data-description="${esc(`${cardData(card)[groupIndex].title} · ${value}`)}" aria-pressed="${active}"><b class="${numeric && card.group === 'lotto' ? wave(value) : ''}">${esc(numeric && card.group === 'lotto' ? value.padStart(2, '0') : value)}</b><small>${esc(item.odds || '—')}</small></button>`;
  }
  function sectionsFor(card, group, groupIndex) {
    let sections = group.sections || [{ title: group.title, items: group.items || [] }];
    if (card.group === 'lotto' && group.title === '特码') sections = [{ title: '特码A', items: group.items.slice(0, 49) }, { title: '特码两面', items: group.items.slice(49) }];
    if (card.group === 'lotto' && group.title === '连码') sections = [{ title: '二全中 · 复式', items: group.items.slice(0, 49) }];
    return sections.map((section, sectionIndex) => {
      const items = section.items || [];
      const numeric = items.length > 0 && items.slice(0, Math.min(items.length, 8)).every(item => /^\d{1,2}$/.test(String(item.value)));
      return `<section class="board-section"><h2>${esc(section.title || group.title)}<small>${items.length} 项</small></h2><div class="option-grid ${numeric ? 'numbers' : ''} ${numeric && card.group === 'lotto' ? 'lotto' : ''}">${items.map((item, itemIndex) => optionMarkup(card, groupIndex, sectionIndex, item, itemIndex)).join('')}</div></section>`;
    }).join('');
  }
  function cardMarkup(card) {
    const data = cardData(card);
    return `<article class="desk group-${card.group} ${card.full ? 'full' : ''}" data-card="${card.id}">
      <div class="desk-head"><img class="desk-logo" src="${logo(card.logo)}" alt=""><strong class="desk-title">${esc(card.game)}</strong><button type="button" class="change-game" data-change="${card.id}">⇄ 换游戏</button><button type="button" class="sound ${card.muted ? 'is-muted' : ''}" data-sound="${card.id}" aria-label="${card.muted ? '开启声音' : '关闭声音'}">${soundIcon}</button><button type="button" class="size-toggle" data-size="${card.id}" aria-label="${card.full ? '切换半屏高度' : '切换完整高度'}">${card.full ? '完整' : '1/2'}</button></div>
      <div class="desk-content"><div class="results"><div class="result-line"><span class="period">${card.last}期</span>${drawMarkup(card)}<button type="button" class="history-button ${card.showHistory ? 'is-open' : ''}" data-history="${card.id}" aria-label="${card.showHistory ? '返回投注区' : '查看开奖记录'}" aria-expanded="${Boolean(card.showHistory)}">${card.showHistory ? '⌃' : '⌄'}</button></div><div class="issue-line"><span>${card.issue}期　封盘 <strong data-countdown="${card.id}">${clock(card.remaining)}</strong></span><div class="utility-tabs">${['路子', '两面长龙', '遗漏'].map(label => `<button type="button" data-utility="${card.id}" data-utility-name="${label}">${label}</button>`).join('')}</div></div>
      ${card.showHistory ? historyMarkup(card) : `<div class="board-layout"><nav class="side-nav" aria-label="${esc(card.game)}玩法">${data.map((group, index) => `<button type="button" data-jump="${card.id}" data-index="${index}" class="${index === 0 ? 'active' : ''}">${esc(group.title)}</button>`).join('')}</nav><div class="board">${data.map((group, index) => `<div class="board-group" data-group="${index}">${sectionsFor(card, group, index)}</div>`).join('')}</div></div>`}</div>
    </article>`;
  }
  function render(resetCard = -1) {
    const pageY = window.scrollY;
    const positions = cards.map(card => document.querySelector(`[data-card="${card.id}"] .desk-content`)?.scrollTop || 0);
    $('#desk-list').innerHTML = cards.map(cardMarkup).join('');
    cards.forEach((card, index) => { const body = document.querySelector(`[data-card="${card.id}"] .desk-content`); if (body) body.scrollTop = card.id === resetCard ? 0 : positions[index]; });
    window.scrollTo({ top: pageY, behavior: 'instant' });
    updateSummary();
  }
  function updateSummary() {
    const count = cards.reduce((total, card) => total + card.selected.size, 0);
    $('#bet-count').textContent = count;
    $('#bet-total').textContent = `¥${count * 10}`;
    $('#review-button').disabled = count === 0;
  }
  function showModal(content) { $('#modal-root').innerHTML = `<div class="modal-backdrop" data-backdrop><section class="modal" role="dialog" aria-modal="true">${content}</section></div>`; }
  function closeModal() { $('#modal-root').innerHTML = ''; pendingChange = null; }
  function modalHeader(text) { return `<div class="modal-head"><strong>${esc(text)}</strong><button type="button" data-close aria-label="关闭">×</button></div>`; }
  function gamePicker(card) {
    const categories = `<nav class="picker-categories" aria-label="彩种中类">${gameGroups.map(group => `<button type="button" class="group-${group.id}" data-picker-group="${group.id}">${group.label}</button>`).join('')}</nav>`;
    const body = gameGroups.map(group => `<section class="game-group group-${group.id}"><h3>${group.label}<small>${group.games.length} 种</small></h3><div class="game-grid">${group.games.map(([name, key]) => `<button type="button" data-select-game="${card.id}" data-game="${esc(name)}" data-logo="${key}" data-group-id="${group.id}" class="${card.game === name ? 'current' : ''}">${esc(name)}</button>`).join('')}</div></section>`).join('');
    showModal(modalHeader('更换游戏') + `${categories}<div class="modal-body">${body}</div>`);
  }
  function changeGame(card, name, key, group) {
    card.game = name; card.logo = key; card.group = group; card.selected.clear(); card.showHistory = false;
    card.draw = name === '一分赛车' ? [9, 6, 2, 7, 8, 3, 4, 10, 5, 1] : [...drawSamples[group]];
    card.last = issueSamples[group]; card.issue = card.last + 1; card.remaining = countdownSamples[group];
    closeModal(); render(card.id);
  }
  let toastTimer;
  function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 1800); }
  function review() {
    const rows = cards.filter(card => card.selected.size).map(card => {
      const labels = [...card.selected].map(key => { const parts = key.split('|'); return `${cardData(card)[Number(parts[0])]?.title || ''} ${parts.at(-1)}`; });
      return `<div class="review-row"><strong>${esc(card.game)} · ${card.issue}期 · ${card.selected.size} 注</strong><small>${esc(labels.join('、'))}</small></div>`;
    }).join('');
    const count = cards.reduce((n, card) => n + card.selected.size, 0);
    showModal(modalHeader('确认注单') + `<div class="modal-body">${rows}<div class="review-total"><span>合计 ${count} 注</span><b>¥${count * 10}</b></div></div><div class="modal-actions"><button type="button" data-close>返回调整</button><button type="button" class="primary" data-submit>确认投注</button></div>`);
  }
  function history(card, kind = '近期开奖') {
    const result = card.group === 'lotto' ? `${card.draw.slice(0, 6).map(n => String(n).padStart(2, '0')).join('　')}　+ ${String(card.draw[6]).padStart(2, '0')}` : card.group === 'pcdd' ? `${card.draw.join('　')}　= ${card.draw.reduce((a, b) => a + b, 0)}` : card.draw.map(n => String(n).padStart(2, '0')).join('　');
    const rows = Array.from({ length: 7 }, (_, index) => `<span>${card.last - index}期</span><span>${result}</span>`).join('');
    showModal(modalHeader(`${card.game} · ${kind}`) + `<div class="modal-body"><p class="modal-copy">以下为配色提案的示意资料，正式结果以原站为准。</p><div class="trend-grid">${rows}</div></div>`);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-close') || event.target.matches('[data-backdrop]')) { closeModal(); return; }
    if (button.hasAttribute('data-picker-group')) {
      const section = document.querySelector(`.game-group.group-${button.dataset.pickerGroup}`);
      const body = section?.closest('.modal-body');
      if (section && body) body.scrollTop += section.getBoundingClientRect().top - body.getBoundingClientRect().top;
      return;
    }
    const cardId = Number(button.dataset.bet ?? button.dataset.jump ?? button.dataset.change ?? button.dataset.sound ?? button.dataset.size ?? button.dataset.history ?? button.dataset.utility ?? button.dataset.selectGame);
    const card = cards[cardId];
    if (button.hasAttribute('data-bet')) {
      const key = button.dataset.key;
      card.selected.has(key) ? card.selected.delete(key) : card.selected.add(key);
      button.classList.toggle('selected', card.selected.has(key));
      button.setAttribute('aria-pressed', String(card.selected.has(key)));
      updateSummary();
    } else if (button.hasAttribute('data-jump')) {
      const container = button.closest('.desk-content');
      const section = container.querySelector(`[data-group="${button.dataset.index}"]`);
      container.scrollTop += section.getBoundingClientRect().top - container.getBoundingClientRect().top - 6;
      button.parentElement.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    } else if (button.hasAttribute('data-size')) { card.full = !card.full; render(); }
    else if (button.hasAttribute('data-sound')) { card.muted = !card.muted; button.classList.toggle('is-muted', card.muted); button.setAttribute('aria-label', card.muted ? '开启声音' : '关闭声音'); toast(card.muted ? '声音已关闭' : '声音已开启（示意）'); }
    else if (button.hasAttribute('data-change')) gamePicker(card);
    else if (button.hasAttribute('data-select-game')) {
      if (card.game === button.dataset.game) { closeModal(); return; }
      const alreadyUsed = cards.some(other => other.id !== card.id && other.game === button.dataset.game);
      if (alreadyUsed) { toast('该游戏已经显示在其他桌'); return; }
      const next = { card, name: button.dataset.game, key: button.dataset.logo, group: button.dataset.groupId };
      if (card.selected.size) { pendingChange = next; showModal(modalHeader('更换游戏？') + `<div class="modal-body"><p class="modal-copy">${esc(card.game)} 已选 ${card.selected.size} 注。更换游戏后，本桌尚未提交的选择会清空。</p></div><div class="modal-actions"><button type="button" data-close>保留原桌</button><button type="button" class="primary" data-confirm-change>确认更换</button></div>`); }
      else changeGame(card, next.name, next.key, next.group);
    } else if (button.hasAttribute('data-confirm-change') && pendingChange) changeGame(pendingChange.card, pendingChange.name, pendingChange.key, pendingChange.group);
    else if (button.hasAttribute('data-history')) { card.showHistory = !card.showHistory; render(card.id); }
    else if (button.hasAttribute('data-utility')) history(card, button.dataset.utilityName);
    else if (button.id === 'review-button') review();
    else if (button.hasAttribute('data-submit')) { const count = cards.reduce((n, item) => n + item.selected.size, 0); cards.forEach(item => item.selected.clear()); closeModal(); render(); toast(`${count} 注已确认（原型演示）`); }
  });
  document.addEventListener('click', event => { if (event.target.matches('[data-backdrop]')) closeModal(); });
  setInterval(() => cards.forEach(card => { if (card.remaining > 0) card.remaining -= 1; const timer = document.querySelector(`[data-countdown="${card.id}"]`); if (timer) timer.textContent = clock(card.remaining); }), 1000);
  fetch('../多彩同投/reference-mobile-lotto.json').then(response => response.json()).then(data => { lottoData = data; render(); }).catch(() => { lottoData = [{ title: '特码', items: Array.from({ length: 49 }, (_, index) => ({ value: index + 1, odds: '48.72' })) }]; render(); });
  render();
})();

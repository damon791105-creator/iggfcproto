(() => {
  const groups = [
    { id: 'lotto', label: '六合', game: '极速六合彩', issue: '462482', close: '01:50', play: '特码', kind: 'number', values: Array.from({ length: 49 }, (_, i) => String(i + 1)), amount: 10 },
    { id: 'pk10', label: 'PK10', game: '一分赛车', issue: '5107781', close: '00:42', play: '两面盘', kind: 'odds', values: ['大', '小', '单', '双', '龙', '虎'], amount: 10 },
    { id: 'ssc', label: '时时彩', game: '极速时时彩', issue: '259690', close: '00:36', play: '两面盘', kind: 'odds', values: ['大', '小', '单', '双'], amount: 10 },
    { id: 'klc', label: '快乐十分', game: '极速快乐十分', issue: '886421', close: '01:15', play: '两面盘', kind: 'odds', values: ['大', '小', '单', '双'], amount: 10 },
    { id: 'x115', label: '11选5', game: '极速十一选五', issue: '721560', close: '00:58', play: '两面盘', kind: 'odds', values: ['大', '小', '单', '双'], amount: 10 },
    { id: 'k8', label: '快乐8', game: '极速快乐八', issue: '319205', close: '02:10', play: '两面盘', kind: 'number', values: Array.from({ length: 80 }, (_, i) => String(i + 1)), amount: 10 },
    { id: 'k3', label: '快3', game: '极速快三', issue: '680231', close: '00:27', play: '三军、大小', kind: 'odds', values: ['大', '小', '单', '双'], amount: 10 },
    { id: '3d', label: '3D', game: '极速3D', issue: '452189', close: '03:40', play: '正确号码', kind: 'digits', values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], amount: 10 },
    { id: 'pcdd', label: 'PC蛋蛋', game: '极速PC蛋蛋', issue: '1894230', close: '00:49', play: '主势盘', kind: 'odds', values: ['大', '小', '单', '双'], amount: 10 },
  ];
  const catalog = {
    lotto: ['极速六合彩', 'IG六合彩', '十分六合彩', '澳门六合彩', '新澳门六合彩'],
    pk10: ['极速赛车', '一分赛车', '比特币一分赛车', '三分赛车', '澳洲赛车', '比特币三分赛车', 'IG赛车', 'IG飞艇', '比特币飞艇', '新幸运飞艇', '幸运飞艇'],
    ssc: ['极速时时彩', '一分时时彩', '比特币一分时时彩', '三分时时彩', '威尼斯时时彩', '澳洲幸运5', 'IG时时彩', '河内一分彩', '河内五分彩'],
    klc: ['极速快乐十分', '三分快乐十分', '米兰快乐十分', '里昂快乐十分', '湖南', '幸运农场', '广东'],
    x115: ['极速十一选五', '三分十一选五', '罗马十一选五', '巴黎十一选五', '江西', '山东', '辽宁', '湖北', '广东'],
    k8: ['极速快乐八', '三分快乐八', '戛纳快乐八', '柏林快乐八', '斯洛伐克', '台湾', '北京'],
    k3: ['秒速快三', '一分快三', '极速快三', '三分快三', '马德里快三', '莫斯科快三', '江苏骰宝', '安徽', '上海', '湖北'],
    '3d': ['极速3D', '三分3D', '日内瓦3D', '维也纳3D', '福彩3D', '排列三3D'],
    pcdd: ['极速PC蛋蛋', '比特币PC蛋蛋', '三分PC蛋蛋', '戛纳PC蛋蛋', '柏林PC蛋蛋', '斯洛伐克', '台湾', '北京'],
  };
  const seq = (start, end, pad = false) => Array.from({ length: end - start + 1 }, (_, i) => pad ? String(start + i).padStart(2, '0') : String(start + i));
  const digits = seq(0, 9);
  const asOptions = (values, odds = '1.98') => values.map(value => ({ value, odds }));
  const posNames = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];
  const fiveBallNames = ['第一球', '第二球', '第三球', '第四球', '第五球'];
  const eightBallNames = ['一', '二', '三', '四', '五', '六', '七', '八'].map(n => `第${n}球`);
  const threeDNames = ['第一球(佰)', '第二球(拾)', '第三球(个)'];
  const sscSides = ['大', '小', '单', '双'];
  const dicePips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  const dieMarkup = (value, className) => `<span class="${className}">${dicePips[value].map(position => `<i class="pip pip-${position}"></i>`).join('')}</span>`;
  // 六合彩 1–49 的波色表；开奖、选号与代表号码共用，其他彩种不套用。
  const lottoWaveNumbers = {
    'ball-red': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    'ball-blue': [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    'ball-green': [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
  };
  const lottoWaveByNumber = new Map(Object.entries(lottoWaveNumbers).flatMap(([wave, numbers]) => numbers.map(number => [number, wave])));
  const lottoColor = value => lottoWaveByNumber.get(Number(value)) || '';
  const zodiacNames = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const lottoNumbers = (odds = '48.72') => asOptions(seq(1, 49), odds);
  const lottoSides = () => ['大', '小', '单', '双', '合单', '合双', '尾大', '尾小', '红波', '蓝波', '绿波'].map((value, i) => ({ value, odds: i === 8 ? '2.85' : i > 8 ? '2.95' : '1.98' }));
  const zodiacStarts = { '鼠': 7, '牛': 6, '虎': 5, '兔': 4, '龙': 3, '蛇': 2, '马': 1, '羊': 12, '猴': 11, '鸡': 10, '狗': 9, '猪': 8 };
  const zodiacNumbers = value => seq(1, 49).filter(n => (Number(n) - zodiacStarts[value]) % 12 === 0).map(n => n.padStart(2, '0'));
  const zodiacItems = (odds, horseOdds = odds) => zodiacNames.map(value => ({ value, odds: value === '马' ? horseOdds : odds, hint: zodiacNumbers(value).join(' ') }));
  const lottoHintMarkup = hint => `<em class="choice-hint" aria-label="代表号码 ${esc(hint.replace(/\s+/g, '、'))}">${hint.split(/\s+/).filter(Boolean).map(number => `<b class="wave-number ${lottoColor(number)}" aria-hidden="true">${esc(number)}</b>`).join('')}</em>`;
  const elementNumbers = {
    '金': '01 06 11 16 21 26 31 36 41 46', '木': '02 07 12 17 22 27 32 37 42 47',
    '水': '03 08 13 18 23 28 33 38 43 48', '火': '04 09 14 19 24 29 34 39 44 49',
    '土': '05 10 15 20 25 30 35 40 45',
  };
  const halfWaveNumbers = {
    '红单': '01 07 13 19 23 29 35 45', '红双': '02 08 12 18 24 30 34 40 46',
    '红大': '29 30 34 35 40 45 46', '红小': '01 02 07 08 12 13 18 19 23 24',
    '蓝单': '03 09 15 25 31 37 41 47', '蓝双': '04 10 14 20 26 36 42 48',
    '蓝大': '25 26 31 36 37 41 42 47 48', '蓝小': '03 04 09 10 14 15 20',
    '绿单': '05 11 17 21 27 33 39 43', '绿双': '06 16 22 28 32 38 44',
    '绿大': '27 28 32 33 38 39 43 44', '绿小': '05 06 11 16 17 21 22',
  };
  const tailItems = odds => seq(0, 9).map((n, i) => ({ value: `${n}尾`, odds: Array.isArray(odds) ? odds[i] : odds }));
  const tabbedCombo = (name, tabs, values, odds, kind = 'number') => { const items = value => values === zodiacNames ? zodiacItems(value) : asOptions(values, value); return { name, kind, values, sections: [{ title: name, tabs, items: items(odds[0]), tabItems: Object.fromEntries(tabs.map((tab, i) => [tab, items(odds[i])])) }] }; };
  const singleSectionPlay = (name, kind, items) => ({ name, kind, values: items.map(item => String(item.value)), sections: [{ title: name, items }] });
  const playCatalog = {
    lotto: [
      { name: '特码', kind: 'number', values: seq(1, 49), sections: [{ title: '特码', tabs: ['特码A', '特码B'], items: lottoNumbers() }, { title: '特码两面', items: lottoSides() }] },
      { name: '正码', kind: 'number', values: seq(1, 49), sections: [{ title: '正码', tabs: ['正码A', '正码B'], items: lottoNumbers('8.00') }, { title: '正码总和', items: asOptions(['总大', '总小', '总单', '总双'], '1.98') }] },
      { name: '正码特', kind: 'number', values: seq(1, 49), sections: [{ title: '正码特', tabs: ['正1特', '正2特', '正3特', '正4特', '正5特', '正6特'], items: lottoNumbers() }, { title: '正码特两面', items: lottoSides() }] },
      tabbedCombo('连码', ['二全中', '二中特', '特串', '三中二', '三全中'], seq(1, 49), ['63', '51', '155', '20', '700']),
      { name: '过关', kind: 'odds', values: ['单', '双', '大', '小', '红波', '蓝波', '绿波'], sections: ['一', '二', '三', '四', '五', '六'].map(n => ({ title: `正码${n}`, items: ['单', '双', '大', '小', '红波', '蓝波', '绿波'].map((value, i) => ({ value, odds: i < 4 ? '1.76' : i === 4 ? '2.36' : '2.41' })) })) },
      { name: '特肖', kind: 'odds', values: zodiacNames, sections: [{ title: '特肖', items: zodiacItems('11.80', '9.45') }] },
      { name: '特码头尾', kind: 'odds', values: [...seq(0, 4).map(x => `${x}头`), ...seq(0, 9).map(x => `${x}尾`)], sections: [{ title: '特码头', items: seq(0, 4).map((n, i) => ({ value: `${n}头`, odds: i ? '4.56' : '5.07' })) }, { title: '特码尾', items: tailItems(['11.65', ...Array(9).fill('9.32')]) }] },
      { name: '五行', kind: 'odds', values: ['金', '木', '水', '火', '土'], sections: [{ title: '五行', items: ['金', '木', '水', '火', '土'].map((value, i) => ({ value, odds: i === 4 ? '4.85' : '4.70', hint: elementNumbers[value] })) }] },
      { name: '半波', kind: 'odds', values: ['红单', '红双', '红大', '红小', '蓝单', '蓝双', '蓝大', '蓝小', '绿单', '绿双', '绿大', '绿小'], sections: [{ title: '半波', items: ['红单', '红双', '红大', '红小', '蓝单', '蓝双', '蓝大', '蓝小', '绿单', '绿双', '绿大', '绿小'].map((value, i) => ({ value, odds: ['5.70', '5.14', '6.60', '4.60', '5.70', '5.70', '5.14', '6.60', '5.70', '6.60', '5.32', '6.60'][i], hint: halfWaveNumbers[value] })) }] },
      { name: '七码', kind: 'odds', values: ['单0', '双0', '大0', '小0'], sections: ['单', '双', '大', '小'].map((type, i) => ({ title: `七码${type}`, items: seq(0, 7).map((n, j) => ({ value: `${type}${n}`, odds: (i % 2 === 0 ? ['230', '24.5', '6.58', '3.38', '3.18', '5.58', '18.9', '168'] : ['168', '18.9', '5.58', '3.18', '3.38', '6.58', '24.5', '230'])[j] })) })) },
      { name: '六肖', kind: 'odds', values: zodiacNames, sections: [{ title: '六肖', tabs: ['二肖', '三肖', '四肖', '五肖', '六肖'], items: zodiacItems('5.81'), tabItems: Object.fromEntries(['二肖', '三肖', '四肖', '五肖', '六肖'].map((tab, i) => [tab, zodiacItems(['5.81', '3.87', '2.90', '2.32', '1.96'][i])])) }] },
      { name: '一肖尾数', kind: 'odds', values: zodiacNames, sections: [{ title: '一肖尾数', tabs: ['一肖', '一肖不中', '尾数', '尾数不中'], items: zodiacItems('2.075', '1.80'), tabItems: { '一肖': zodiacItems('2.075', '1.80'), '一肖不中': zodiacItems('1.85', '2.19'), '尾数': tailItems(['2.07', ...Array(9).fill('1.77')]), '尾数不中': tailItems(['1.77', ...Array(9).fill('2.07')]) } }] },
      tabbedCombo('生肖连', ['二肖连[中]', '三肖连[中]', '四肖连[中]', '五肖连[中]', '二肖连[不中]', '三肖连[不中]', '四肖连[不中]', '五肖连[不中]'], zodiacNames, ['4.20', '10.60', '30.70', '108', '3.60', '8.00', '20.00', '30.00'], 'odds'),
      tabbedCombo('尾数连', ['二尾连[中]', '三尾连[中]', '四尾连[中]', '二尾连[不中]', '三尾连[不中]', '四尾连[不中]'], seq(0, 9).map(n => `${n}尾`), ['3.00', '6.95', '15.50', '5.00', '15.00', '50.00'], 'odds'),
      tabbedCombo('不中', ['五不中', '六不中', '七不中', '八不中', '九不中', '十不中'], seq(1, 49), ['2.10', '2.50', '3.00', '3.60', '4.30', '—']),
      tabbedCombo('多选中一', ['五选中一', '六选中一', '七选中一', '八选中一', '九选中一', '十选中一'], seq(1, 49), ['2.35', '—', '—', '—', '—', '—']),
      tabbedCombo('特平中', ['一粒任中', '二粒任中', '三粒任中', '四粒任中', '五粒任中'], seq(1, 49), ['6.50', '—', '—', '—', '1.70']),
    ],
  };
  // 投注内容以手机原站实际渲染的注区为准；只重新编排入口，不增造投注项。
  const sourceReference = window.mobileSourceReference || {};
  const sourceVariants = window.mobileSourceVariants || {};
  const refItems = (section, filter = () => true) => (section?.items || []).filter(filter).map(item => ({
    value: String(item.value), odds: String(item.odds), ...(item.position ? { position: item.position } : {}),
  }));
  const refSections = group => (group?.sections || []).map(section => ({ title: section.title, items: refItems(section) }));
  const refPlay = (name, group, kind = 'odds') => ({
    name, kind, values: refItems(group?.sections?.[0]).map(item => item.value), sections: refSections(group),
  });
  const refVariantItems = (id, group, tab, sectionIndex = 0) => refItems(sourceVariants[id]?.[group.title]?.[tab]?.[sectionIndex] || group.sections[sectionIndex]);
  const refTabs = (name, group, kind = 'number', id = '') => {
    const items = refItems(group?.sections?.[0]);
    const tabItems = id ? Object.fromEntries(group.tabs.map(tab => [tab, refVariantItems(id, group, tab)])) : undefined;
    return { name, kind, values: items.map(item => item.value), sections: [{ title: name, tabs: group.tabs, items, ...(tabItems ? { tabItems } : {}) }] };
  };
  const groupedTabs = (name, labels, itemGroups, kind = 'number') => ({
    name, kind, values: itemGroups[0].map(item => item.value), sections: [{ title: name, tabs: labels, items: itemGroups[0], tabItems: Object.fromEntries(labels.map((label, index) => [label, itemGroups[index]])) }],
  });
  const positionItems = (positions, odds) => positions.flatMap(position => digits.map(value => ({ position, value, odds })));
  const klcDirectionNumbers = {
    '东': '01 05 09 13 17', '南': '02 06 10 14 18', '西': '03 07 11 15 19', '北': '04 08 12 16 20',
    '中': '01 02 03 04 05 06 07', '发': '08 09 10 11 12 13 14', '白': '15 16 17 18 19 20',
  };
  const sscGroupedSection = group => ({
    title: group.title,
    tabs: group.tabs,
    items: refItems(group.sections[0]),
    tabItems: Object.fromEntries(group.tabs.map(tab => [tab, refVariantItems('ssc', group, tab)])),
  });
  if (sourceReference.ssc) {
    const src = sourceReference.ssc;
    const numeric = fiveBallNames.map((_, index) => refItems(src[index + 1].sections[0], item => /^\d$/.test(item.value)));
    const pairPositions = [['万位', '仟位'], ['万位', '佰位'], ['万位', '拾位'], ['万位', '个位'], ['仟位', '佰位'], ['仟位', '拾位'], ['仟位', '个位'], ['佰位', '拾位'], ['佰位', '个位'], ['拾位', '个位']];
    const triplePositions = [['万位', '仟位', '佰位'], ['仟位', '佰位', '拾位'], ['佰位', '拾位', '个位']];
    const pairOdds = src[10].sections[0].items[0].odds;
    const tripleOdds = src[11].sections[0].items[0].odds;
    playCatalog.ssc = [
      refPlay('两面盘', src[0]),
      groupedTabs('正确号码', fiveBallNames, numeric),
      refPlay('前中后', src[6]),
      { name: '组合/定位', kind: 'digits', grouped: true, values: [], sections: [
        ...[7, 8, 9].map(index => sscGroupedSection(src[index])),
        { title: '二字定位', tabs: src[10].tabs, items: positionItems(pairPositions[0], pairOdds), tabItems: Object.fromEntries(src[10].tabs.map((tab, index) => [tab, positionItems(pairPositions[index], pairOdds)])) },
        { title: '三字定位', tabs: src[11].tabs, items: positionItems(triplePositions[0], tripleOdds), tabItems: Object.fromEntries(src[11].tabs.map((tab, index) => [tab, positionItems(triplePositions[index], tripleOdds)])) },
      ] },
      { name: '组选', kind: 'digits', grouped: true, values: [], sections: [sscGroupedSection(src[12]), sscGroupedSection(src[13])] },
      refTabs(src[14].title, src[14], 'digits', 'ssc'),
      { name: '和数', kind: 'odds', values: [], sections: src[15].sections.map(section => ({ title: section.title, label: section.title.split('和数')[0], items: refItems(section) })) },
    ];
  }
  if (sourceReference.klc) {
    const src = sourceReference.klc;
    playCatalog.klc = [
      refPlay('两面盘', src[0]),
      groupedTabs('正确号码', ['正码', ...eightBallNames], [refItems(src[1].sections[0]), ...src.slice(2, 10).map(group => refItems(group.sections[0]))]),
      groupedTabs('方位/中发白', eightBallNames, src.slice(2, 10).map(group => refItems(group.sections[2]).map(item => ({ ...item, hint: klcDirectionNumbers[item.value] }))), 'odds'),
      { name: '任选', kind: 'number', grouped: true, values: [], sections: [10, 12, 14, 15].map(index => ({ title: src[index].title, items: refItems(src[index].sections[0]) })) },
      ...[11, 13].map(index => refPlay(src[index].title, src[index], 'number')),
    ];
  }
  if (sourceReference.x115) {
    const src = sourceReference.x115;
    const directTwo = refVariantItems('x115', src[8], '前二');
    const directThree = refVariantItems('x115', src[8], '前三');
    playCatalog.x115 = [
      refPlay('两面盘', src[0]),
      groupedTabs('正确号码', fiveBallNames, src.slice(1, 6).map(group => refItems(group.sections[0]))),
      refTabs('任选', src[6], 'number', 'x115'), refTabs('组选', src[7], 'number', 'x115'),
      groupedTabs('直选', ['前二', '前三'], [directTwo.filter(item => item.position !== '第三球'), directThree], 'digits'),
    ];
  }
  if (sourceReference.pk10) {
    const src = sourceReference.pk10;
    playCatalog.pk10 = [
      { name: '两面盘', kind: 'odds', values: sscSides, sections: [{ title: '两面盘', tabs: ['冠/亚军和', ...posNames], items: refItems(src[0].sections[0]), tabItems: Object.fromEntries(src[0].sections.map((section, index) => [[ '冠/亚军和', ...posNames ][index], refItems(section)])) }] },
      groupedTabs('正确号码', ['冠亚和', ...posNames], src.slice(1).map(group => refItems(group.sections[0], item => /^\d+$/.test(item.value)))),
    ];
  }
  if (sourceReference.k8) {
    const src = sourceReference.k8;
    playCatalog.k8 = [refPlay('两面盘', src[0]), refPlay('正确号码', src[1], 'number')];
  }
  if (sourceReference.k3) {
    playCatalog.k3 = sourceReference.k3[0].sections.map(section => singleSectionPlay(section.title, 'odds', refItems(section)));
  }
  if (sourceReference['3d']) {
    const src = sourceReference['3d'];
    const positionOdds = src[8].sections[0].items[0].odds;
    const pairs = [['佰', '拾'], ['佰', '个'], ['拾', '个']];
    const sumSections = pairs.flatMap((pair, index) => src[10].sections.map((section, sectionIndex) => ({ title: `${src[10].tabs[index]}${sectionIndex ? '和数尾数' : '和数'}`, label: `${src[10].tabs[index]}·${sectionIndex ? '尾数' : '和值'}`, items: refVariantItems('3d', src[10], src[10].tabs[index], sectionIndex) })));
    playCatalog['3d'] = [
      { name: '两面盘', kind: 'odds', values: sscSides, sections: threeDNames.map((title, index) => ({ title, items: refItems(src[index].sections[0], item => !/^\d+$/.test(item.value)) })) },
      groupedTabs('正确号码', threeDNames, src.slice(0, 3).map(group => refItems(group.sections[0], item => /^\d+$/.test(item.value))), 'digits'),
      refPlay('整合', src[3]), refPlay('主势盘', src[4]), refPlay('一字组合', src[5]),
      refPlay('二字组合', src[6], 'digits'), refPlay('三字组合', src[7], 'digits'),
      groupedTabs('二字定位', src[8].tabs, pairs.map(pair => positionItems(pair, positionOdds)), 'digits'),
      refPlay('三字定位', src[9], 'digits'),
      { name: '二字和数', kind: 'odds', values: [], sections: sumSections },
      refPlay('三字和数', src[11]),
      refTabs('组选三', src[12], 'digits', '3d'), refTabs('组选六', src[13], 'digits', '3d'),
    ];
  }
  if (sourceReference.pcdd) playCatalog.pcdd = [refPlay('主势盘', sourceReference.pcdd[0])];
  function playDefinition(card) { return playCatalog[card.id].find(p => p.name === card.play) || playCatalog[card.id][0]; }
  const subplayChoices = play => (play.sections || []).flatMap((section, sectionIndex) => !play.grouped && section.tabs?.length
    ? section.tabs.map(tab => ({ section, sectionIndex, tab, label: tab, key: `${sectionIndex}:${tab}` }))
    : [{ section, sectionIndex, tab: '', label: section.label || section.title, key: `${sectionIndex}:` }]);
  const subplayPickCount = (card, choice) => card.selected.filter(value => value.startsWith(`${card.play}-${choice.section.title}|${choice.tab ? `${choice.tab}|` : ''}`)).length;
  function subplayColumnCount(card, choices) {
    if (choices.length <= 3) return choices.length;
    if (choices.length === 4) return 2;
    return 3;
  }
  const groupNames = Object.fromEntries(groups.map(g => [g.id, g.label]));
  const previousResults = {
    lotto: [2, 3, 1, 4, 10, 9, 47],
    pk10: [2, 7, 3, 10, 6, 9, 4, 1, 5, 8],
    ssc: [8, 2, 5, 0, 7],
    klc: [3, 16, 8, 19, 5, 12, 1, 20],
    x115: [2, 7, 9, 11, 4],
    k8: [3, 8, 11, 15, 18, 22, 26, 31, 35, 39, 43, 47, 51, 56, 60, 64, 69, 72, 76, 80],
    k3: [2, 5, 3],
    '3d': [6, 2, 9],
    pcdd: [6, 5, 2],
  };
  const parseClock = value => { const [minutes, seconds] = value.split(':').map(Number); return minutes * 60 + seconds; };
  const formatClock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  // 开奖号码与周期是原型示意；正式版须由彩种开奖及盘口接口提供。
  function demoResult(id, issue, offset = 0, game = groups.find(group => group.id === id).game) {
    if (!offset && game === groups.find(group => group.id === id).game) return [...previousResults[id]];
    const count = { lotto: 7, pk10: 10, ssc: 5, klc: 8, x115: 5, k8: 20, k3: 3, '3d': 3, pcdd: 3 }[id];
    const max = { lotto: 49, pk10: 10, ssc: 10, klc: 20, x115: 11, k8: 80, k3: 6, '3d': 10, pcdd: 10 }[id];
    const unique = ['lotto', 'pk10', 'klc', 'x115', 'k8'].includes(id);
    const gameSeed = [...game].reduce((value, character) => Math.imul(value, 31) + character.codePointAt(0) >>> 0, 0);
    let seed = (Number(issue) * 1103515245 + offset * 12345 + gameSeed) >>> 0;
    const values = [];
    while (values.length < count) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const value = seed % max + (['ssc', '3d', 'pcdd'].includes(id) ? 0 : 1);
      if (!unique || !values.includes(value)) values.push(value);
    }
    return values;
  }
  const demoHistory = g => Array.from({ length: 7 }, (_, index) => ({ issue: String(Number(g.issue) - index - 1), values: demoResult(g.id, Number(g.issue) - index - 1, index, g.game) }));
  const newCardState = (base, key, game = base.game) => ({ ...base, key, game, selected: [], expanded: false, historyExpanded: false, remaining: parseClock(base.close), closedFor: 0, betIssue: base.issue, remindedIssue: '', history: demoHistory({ ...base, game }) });
  const cards = groups.map((g, i) => newCardState(g, `${g.id}-${i}`));
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const formatMoney = n => Number(n).toFixed(2);
  const lianSizes = { '二全中': 2, '二中特': 2, '特串': 2, '三中二': 3, '三全中': 3 };
  const lianModes = ['复式', '拖头', '生肖对碰', '尾数对碰', '生尾对碰', '任意对碰'];
  const lianModesFor = tab => ['二中特', '特串'].includes(tab) ? lianModes : lianModes.slice(0, 2);
  const lianModeFor = (g, tab) => lianModesFor(tab).includes(g.lianModes?.[tab]) ? g.lianModes[tab] : '复式';
  const lianRoleFor = (g, tab) => g.lianRoles?.[tab] || '头';
  const zodiacFirst = zodiacStarts;
  function lianCategories(mode, side) {
    if (mode === '任意对碰') return seq(1, 49).map(label => ({ label, numbers: [Number(label)] }));
    if (mode === '尾数对碰' || mode === '生尾对碰' && side === 'B') return seq(0, 9).map(tail => ({ label: `${tail}尾`, numbers: seq(1, 49).map(Number).filter(number => number % 10 === Number(tail)) }));
    return Object.entries(zodiacFirst).map(([label, first]) => ({ label, numbers: seq(first, 49, false).map(Number).filter(number => (number - first) % 12 === 0) }));
  }
  const combinations = (n, k) => {
    if (k < 0 || n < k) return 0;
    let result = 1;
    for (let i = 1; i <= k; i++) result = result * (n - i + 1) / i;
    return Math.round(result);
  };
  function lianSelection(g, tab, mode, role = '') {
    const prefix = `连码-连码|${tab}|${mode}|${role ? `${role}|` : ''}`;
    return g.selected.filter(value => value.startsWith(prefix));
  }
  function lianBetCount(g, tab, mode) {
    const size = lianSizes[tab];
    if (!size) return 0;
    if (mode === '复式') return combinations(lianSelection(g, tab, mode).length, size);
    if (mode === '拖头') {
      const heads = lianSelection(g, tab, mode, '头').length;
      const legs = lianSelection(g, tab, mode, '拖').length;
      return heads > 0 && heads < size ? combinations(legs, size - heads) : 0;
    }
    const pool = side => {
      const chosen = new Set(lianSelection(g, tab, mode, side).map(value => value.split('|').pop()));
      return new Set(lianCategories(mode, side).filter(category => chosen.has(category.label)).flatMap(category => category.numbers));
    };
    const a = pool('A');
    const b = pool('B');
    if (!a.size || !b.size) return 0;
    const union = new Set([...a, ...b]);
    const aOnly = [...a].filter(number => !b.has(number)).length;
    const bOnly = [...b].filter(number => !a.has(number)).length;
    return combinations(union.size, size) - combinations(aOnly, size) - combinations(bOnly, size);
  }
  const comboPlays = new Set(['生肖连', '尾数连', '不中', '多选中一', '特平中']);
  const comboSize = tab => ({ '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 })[tab[0]] || 1;
  const comboModesFor = play => (typeof play === 'string' ? play : play.play) === '特平中' ? ['复式'] : ['复式', '拖头'];
  const comboModeFor = (g, tab) => comboModesFor(g).includes(g.comboModes?.[tab]) ? g.comboModes[tab] : '复式';
  const comboRoleFor = (g, tab) => g.comboRoles?.[tab] || '头';
  const comboSelection = (g, tab, mode, role = '', playName = g.play) => g.selected.filter(value => value.startsWith(`${playName}-${playName}|${tab}|${mode}|${role ? `${role}|` : ''}`));
  function comboBetCount(g, tab, mode, playName = g.play) {
    const size = comboSize(tab);
    if (mode === '复式') return combinations(comboSelection(g, tab, mode, '', playName).length, size);
    const heads = comboSelection(g, tab, mode, '头', playName).length;
    const legs = comboSelection(g, tab, mode, '拖', playName).length;
    return heads > 0 && heads < size ? combinations(legs, size - heads) : 0;
  }
  function guoguanBetCount(g) {
    const sizes = playCatalog.lotto.find(play => play.name === '过关').sections.map(section => g.selected.filter(value => value.startsWith(`过关-${section.title}|`)).length).filter(Boolean);
    return sizes.length < 2 ? 0 : sizes.reduce((product, size) => product * size, 1);
  }
  function positionBetCount(g, playName) {
    const play = playCatalog[g.id].find(item => item.name === playName);
    const choices = play.grouped
      ? play.sections.filter(section => ['二字定位', '三字定位'].includes(section.title)).flatMap(section => section.tabs.map(tab => ({ section, tab })))
      : subplayChoices(play);
    return choices.reduce((total, choice) => {
      const items = choice.section.tabItems?.[choice.tab] || choice.section.items;
      const positions = [...new Set(items.map(item => item.position).filter(Boolean))];
      if (!positions.length) return total;
      const prefix = `${playName}-${choice.section.title}${choice.tab ? `|${choice.tab}` : ''}|`;
      const counts = positions.map(position => g.selected.filter(value => value.startsWith(`${prefix}${position}·`)).length);
      if (g.id === 'x115' && playName === '直选') {
        const picks = positions.map(position => g.selected.filter(value => value.startsWith(`${prefix}${position}·`)).map(value => value.split('·').pop()));
        const distinctCount = (index, used) => index === picks.length ? 1 : picks[index].reduce((sum, value) => sum + (used.has(value) ? 0 : distinctCount(index + 1, new Set([...used, value]))), 0);
        return total + distinctCount(0, new Set());
      }
      return total + (counts.every(Boolean) ? counts.reduce((product, count) => product * count, 1) : 0);
    }, 0);
  }
  function tabCombinationCount(g, playName, sizes) {
    const play = playCatalog[g.id].find(item => item.name === playName);
    return subplayChoices(play).reduce((total, choice) => {
      const size = sizes[choice.tab];
      const prefix = `${playName}-${choice.section.title}|${choice.tab}|`;
      return total + (size ? combinations(g.selected.filter(value => value.startsWith(prefix)).length, size) : 0);
    }, 0);
  }
  function playBetCount(g, playName) {
    if (g.id !== 'lotto') {
      if (g.id === 'ssc' && playName === '组合/定位') {
        const positioning = positionBetCount(g, playName);
        const combinationBets = g.selected.filter(value => value.startsWith(`${playName}-`) && !value.startsWith(`${playName}-二字定位|`) && !value.startsWith(`${playName}-三字定位|`)).length;
        return positioning + combinationBets;
      }
      if ((['ssc', '3d'].includes(g.id) && ['二字定位', '三字定位'].includes(playName)) || (g.id === 'x115' && playName === '直选')) return positionBetCount(g, playName);
      if (g.id === 'klc' && ['选二连组', '选三前组'].includes(playName)) return combinations(g.selected.filter(value => value.startsWith(`${playName}-`)).length, playName === '选二连组' ? 2 : 3);
      if (g.id === 'klc' && playName === '任选') return [['任选二', 2], ['任选三', 3], ['任选四', 4], ['任选五', 5]].reduce((sum, [title, size]) => sum + combinations(g.selected.filter(value => value.startsWith(`任选-${title}|`)).length, size), 0);
      if (g.id === 'pcdd' && playName === '主势盘') {
        const bao = g.selected.filter(value => value.startsWith('主势盘-包三|')).length;
        return g.selected.filter(value => value.startsWith('主势盘-') && !value.startsWith('主势盘-包三|')).length + (bao === 3 ? 1 : 0);
      }
      if (g.id === 'x115' && playName === '任选') return tabCombinationCount(g, playName, { '一中一': 1, '二中二': 2, '三中三': 3, '四中四': 4, '五中五': 5, '六中五': 6, '七中五': 7, '八中五': 8 });
      if (g.id === 'x115' && playName === '组选') return tabCombinationCount(g, playName, { '前二': 2, '前三': 3 });
      if (g.id === '3d' && ['组选三', '组选六'].includes(playName)) return tabCombinationCount(g, playName, Object.fromEntries(playCatalog['3d'].find(play => play.name === playName).sections[0].tabs.map(tab => [tab, Number(tab[0])])));
      return g.selected.filter(value => value.startsWith(`${playName}-`)).length;
    }
    if (playName === '过关') return guoguanBetCount(g);
    if (playName === '连码') return Object.keys(lianSizes).reduce((sum, tab) => sum + lianModesFor(tab).reduce((modeSum, mode) => modeSum + lianBetCount(g, tab, mode), 0), 0);
    if (comboPlays.has(playName)) return playCatalog.lotto.find(play => play.name === playName).sections[0].tabs.reduce((sum, tab) => sum + comboModesFor(playName).reduce((n, mode) => n + comboBetCount(g, tab, mode, playName), 0), 0);
    return g.selected.filter(value => value.startsWith(`${playName}-`)).length;
  }
  const cardBetCount = g => playCatalog[g.id].reduce((sum, play) => sum + playBetCount(g, play.name), 0);
  const isClosingSoon = g => g.remaining > 0 && g.remaining <= 30 && g.betIssue === g.issue;
  const isBetClosed = g => g.remaining === 0 || g.betIssue !== g.issue;
  const clockLabel = g => g.remaining === 0 ? '已封盘' : g.betIssue !== g.issue && g.selected.length ? '原期已封盘' : formatClock(g.remaining);
  function hasUnformedLianSelection(g) {
    if (g.id === 'pcdd') {
      const bao = g.selected.filter(value => value.startsWith('主势盘-包三|')).length;
      if (bao > 0 && bao < 3) return true;
    }
    if (g.id !== 'lotto') return playCatalog[g.id].some(play => g.selected.some(value => value.startsWith(`${play.name}-`)) && playBetCount(g, play.name) === 0);
    if (g.selected.some(value => value.startsWith('过关-')) && guoguanBetCount(g) === 0) return true;
    if (Object.keys(lianSizes).some(tab => lianModesFor(tab).some(mode => {
      const selected = mode === '拖头' ? lianSelection(g, tab, mode, '头').length + lianSelection(g, tab, mode, '拖').length
        : mode.endsWith('对碰') ? lianSelection(g, tab, mode, 'A').length + lianSelection(g, tab, mode, 'B').length
        : lianSelection(g, tab, mode).length;
      return selected > 0 && lianBetCount(g, tab, mode) === 0;
    }))) return true;
    return playCatalog.lotto.filter(play => comboPlays.has(play.name)).some(play => play.sections[0].tabs.some(tab => comboModesFor(play.name).some(mode => comboSelection(g, tab, mode, '', play.name).length > 0 && comboBetCount(g, tab, mode, play.name) === 0)));
  }
  const selectionDescription = g => `已选 ${g.selected.length} 个选项，组成 ${cardBetCount(g)} 注`;
  let modalFocus = null;

  function navMarkup() {
    $('#category-nav').innerHTML = cards.length ? cards.map(g => {
      const bets = cardBetCount(g);
      return `<button class="nav-game ${bets ? 'has-pending' : ''} ${isClosingSoon(g) ? 'closing-soon' : ''} ${isBetClosed(g) && bets ? 'bet-closed' : ''}" type="button" data-jump="${esc(g.key)}"><strong>${esc(g.game)}</strong><span class="nav-meta">${esc(groupNames[g.id])} <i>·</i> 封盘 <b data-countdown="${esc(g.key)}">${clockLabel(g)}</b></span><span class="nav-pending">${isBetClosed(g) ? '不可提交' : '待投注'} <b>${bets} 注</b></span><span class="nav-bet-count" aria-hidden="true">${bets}</span></button>`;
    }).join('') : '<p class="nav-empty">尚未加入彩种</p>';
  }
  function updateNavOverflow() {
    const nav = $('#category-nav');
    document.querySelector('.nav-label').classList.toggle('has-horizontal-scroll', nav.scrollWidth > nav.clientWidth + 1);
  }

  function resultMarkup(g, values = g.history[0].values) {
    if (g.id === 'pcdd') return `<span class="draw-formula">${values.map((value, index) => `${index ? '<i>+</i>' : ''}<b class="draw-formula-digit">${value}</b>`).join('')}<i>=</i><strong>${values.reduce((a, b) => a + b, 0)}</strong></span>`;
    if (g.id === 'k3') {
      return values.map(value => `<span class="draw-die" role="img" aria-label="${value}点">${dicePips[value].map(position => `<i class="pip pip-${position}"></i>`).join('')}</span>`).join('');
    }
    if (g.id === '3d') return values.map(value => `<span class="draw-ball draw-3d">${value}</span>`).join('');
    return values.map((value, index) => `${g.id === 'lotto' && index === 6 ? '<span class="draw-plus" aria-hidden="true">＋</span>' : ''}<span class="draw-ball ${g.id === 'lotto' ? lottoColor(value) : ''} ${g.id === 'lotto' && index === 6 ? 'draw-special' : ''} ${g.id === 'pk10' ? `race-${index % 5}` : ''}">${String(value).padStart(['lotto', 'pk10', 'k8', 'klc', 'x115'].includes(g.id) ? 2 : 1, '0')}</span>`).join('');
  }

  const resultRule = { lotto: '6 正码 ＋ 1 特别号', pk10: '第 1 至第 10 名', ssc: '五球', klc: '8 个号码', x115: '5 个号码', k8: '20 个号码', k3: '3 颗骰子', '3d': '3 个号码', pcdd: '三码和值' };
  function historyMarkup(g) {
    return `<div class="history-panel" id="history-${esc(g.key)}" ${g.historyExpanded ? '' : 'hidden'}><div class="history-panel-head"><strong>近 7 期开奖</strong><span>原型示意数据</span></div><div class="history-list">${g.history.map(row => `<div class="history-item"><span class="history-issue">${esc(row.issue)} 期</span><div class="draw-balls draw-balls-${g.id}">${resultMarkup(g, row.values)}</div></div>`).join('')}</div></div>`;
  }

  function lianPairMarkup(g, section, tab, mode) {
    return `<div class="lian-pair-board">${['A', 'B'].map(side => {
      const all = lianCategories(mode, side);
      const categories = g.expanded ? all : all.slice(0, 20);
      const chosen = new Set(lianSelection(g, tab, mode, side).map(value => value.split('|').pop()));
      return `<section class="lian-pair-group"><h4>${side} 区 <small>已选 ${chosen.size} 项</small></h4><div class="lian-pair-grid ${mode === '任意对碰' ? 'number-pairs' : ''}">${categories.map(category => {
        const active = chosen.has(category.label);
        return `<button type="button" class="lian-pair-choice ${active ? 'picked' : ''}" data-lian-pair="${esc(g.key)}" data-tab="${esc(tab)}" data-mode="${esc(mode)}" data-side="${side}" data-choice="${esc(category.label)}" aria-pressed="${active}"><strong class="${mode === '任意对碰' ? `wave-number ${lottoColor(category.label)}` : ''}">${esc(category.label)}</strong>${mode === '任意对碰' ? '' : lottoHintMarkup(category.numbers.map(number => String(number).padStart(2, '0')).join(' '))}</button>`;
      }).join('')}</div></section>`;
    }).join('')}</div>`;
  }

  function lianBoardMarkup(g, section, tab, items) {
    const mode = lianModeFor(g, tab);
    const role = lianRoleFor(g, tab);
    const size = lianSizes[tab];
    const heads = lianSelection(g, tab, '拖头', '头').length;
    const legs = lianSelection(g, tab, '拖头', '拖').length;
    const regular = lianSelection(g, tab, '复式').length;
    const count = lianBetCount(g, tab, mode);
    const pairMode = mode.endsWith('对碰');
    const aCount = pairMode ? lianSelection(g, tab, mode, 'A').length : 0;
    const bCount = pairMode ? lianSelection(g, tab, mode, 'B').length : 0;
    const detail = mode === '复式' ? `已选 ${regular} 码 · 每 ${size} 码组成 1 注` : mode === '拖头' ? `头码 ${heads} · 拖码 ${legs} · 共选 ${size} 码成 1 注` : `A 区 ${aCount} 项 · B 区 ${bCount} 项`;
    const controls = `<div class="lian-controls"><div class="lian-mode" role="group" aria-label="${esc(tab)}选号方式"><span>选号方式</span><div class="lian-mode-options ${lianModesFor(tab).length === 2 ? 'two-modes' : ''}">${lianModesFor(tab).map(value => `<button type="button" class="${value === mode ? 'active' : ''}" data-lian-mode="${esc(g.key)}" data-tab="${esc(tab)}" data-mode="${value}" aria-pressed="${value === mode}">${value}</button>`).join('')}</div></div>${mode === '拖头' ? `<div class="lian-role" role="group" aria-label="选择头码或拖码"><span>目前选择</span><button type="button" class="${role === '头' ? 'active' : ''}" data-lian-role="${esc(g.key)}" data-tab="${esc(tab)}" data-role="头" aria-pressed="${role === '头'}">头码</button><button type="button" class="${role === '拖' ? 'active' : ''}" data-lian-role="${esc(g.key)}" data-tab="${esc(tab)}" data-role="拖" aria-pressed="${role === '拖'}">拖码</button></div>` : ''}<div class="lian-live" aria-live="polite"><span>${detail}</span><strong>${count} 注</strong></div></div>`;
    if (pairMode) return controls + lianPairMarkup(g, section, tab, mode);
    return `${controls}<div class="source-play-grid number-board lian-number-board">${items.map(item => {
      const value = String(item.value);
      const fixed = `连码-${section.title}|${tab}|拖头|头|${value}`;
      const drag = `连码-${section.title}|${tab}|拖头|拖|${value}`;
      const simple = `连码-${section.title}|${tab}|复式|${value}`;
      const headPicked = mode === '拖头' && g.selected.includes(fixed);
      const dragPicked = mode === '拖头' && g.selected.includes(drag);
      const active = mode === '复式' ? g.selected.includes(simple) : headPicked || dragPicked;
      const token = `${section.title}|${tab}|${mode}|${mode === '拖头' ? `${role}|` : ''}${value}`;
      return `<button type="button" class="choice number-choice ${active ? 'picked' : ''} ${headPicked ? 'head-pick' : ''} ${dragPicked ? 'drag-pick' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" data-lian-number="${esc(value)}" data-lian-tab="${esc(tab)}" data-lian-pick-mode="${mode}" aria-pressed="${active}"><span class="${lottoColor(value)}">${esc(value)}</span><small>${esc(item.odds)}</small>${headPicked || dragPicked ? `<b class="lian-badge">${headPicked ? '头' : '拖'}</b>` : ''}</button>`;
    }).join('')}</div>`;
  }

  function comboBoardMarkup(g, section, tab, items) {
    const mode = comboModeFor(g, tab);
    const size = comboSize(tab);
    const role = comboRoleFor(g, tab);
    const heads = comboSelection(g, tab, '拖头', '头').length;
    const legs = comboSelection(g, tab, '拖头', '拖').length;
    const regular = comboSelection(g, tab, '复式').length;
    const controls = `<div class="lian-controls"><div class="lian-mode"><span>选号方式</span>${g.play === '特平中' ? '' : `<div class="lian-mode-options two-modes">${comboModesFor(g).map(value => `<button type="button" class="${value === mode ? 'active' : ''}" data-combo-mode="${esc(g.key)}" data-tab="${esc(tab)}" data-mode="${value}" aria-pressed="${value === mode}">${value}</button>`).join('')}</div>`}</div>${mode === '拖头' ? `<div class="lian-role"><span>目前选择</span>${['头', '拖'].map(value => `<button type="button" class="${role === value ? 'active' : ''}" data-combo-role="${esc(g.key)}" data-tab="${esc(tab)}" data-role="${value}" aria-pressed="${role === value}">${value === '头' ? '头码' : '拖码'}</button>`).join('')}</div>` : ''}<div class="lian-live" aria-live="polite"><span>${mode === '拖头' ? `头码 ${heads} · 拖码 ${legs}` : `已选 ${regular} 项 · 每 ${size} 项组成 1 注`}</span><strong>${comboBetCount(g, tab, mode)} 注</strong></div></div>`;
    return `${controls}<div class="source-play-grid ${items.some(item => item.hint) ? 'has-hints' : items.some(item => /^\d+$/.test(String(item.value))) ? 'number-board' : ''}">${items.map(item => {
      const value = String(item.value);
      const headPicked = mode === '拖头' && g.selected.includes(`${g.play}-${section.title}|${tab}|拖头|头|${value}`);
      const dragPicked = mode === '拖头' && g.selected.includes(`${g.play}-${section.title}|${tab}|拖头|拖|${value}`);
      const active = mode === '复式' ? g.selected.includes(`${g.play}-${section.title}|${tab}|复式|${value}`) : headPicked || dragPicked;
      const token = `${section.title}|${tab}|${mode}|${mode === '拖头' ? `${role}|` : ''}${value}`;
      const numeric = /^\d+$/.test(value);
      return `<button type="button" class="choice ${numeric ? 'number-choice' : 'odds-choice'} ${item.hint ? 'has-hint' : ''} ${active ? 'picked' : ''} ${headPicked ? 'head-pick' : ''} ${dragPicked ? 'drag-pick' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" data-combo-choice="${esc(value)}" data-combo-tab="${esc(tab)}" data-combo-mode-value="${mode}" aria-pressed="${active}"><span class="${numeric ? lottoColor(value) : ''}">${esc(value)}</span>${item.hint ? lottoHintMarkup(item.hint) : ''}<small>${esc(item.odds)}</small>${headPicked || dragPicked ? `<b class="lian-badge">${headPicked ? '头' : '拖'}</b>` : ''}</button>`;
    }).join('')}</div>`;
  }

  function pk10RankBoardMarkup(g, section, rank) {
    const numberItems = section.tabItems?.[rank] || section.items;
    const range = rank === '冠亚和' ? '03–19' : '01–10';
    const choices = numberItems.map(item => {
      const token = `${section.title}|${rank}|号码|${item.value}`;
      const active = g.selected.includes(`${g.play}-${token}`);
      return `<button type="button" class="choice number-choice ${active ? 'picked' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" aria-pressed="${active}"><span>${esc(item.value)}</span><small>${esc(item.odds)}</small></button>`;
    }).join('');
    return `<div class="pk10-rank-board"><h4>号码 <small>${range}</small></h4><div class="source-play-grid number-board">${choices}</div></div>`;
  }
  function baoThreeBoardMarkup(g, section) {
    const selected = g.selected.filter(value => value.startsWith(`${g.play}-${section.title}|`)).map(value => value.split('|').pop());
    return `<div class="bao-three-board"><div class="bao-three-instruction"><span>选 3 个不同号码，组成 1 注</span><strong>${selected.length} / 3</strong></div><div class="bao-three-grid" role="group" aria-label="包三选号">${seq(0, 27).map(value => {
      const active = selected.includes(value);
      return `<button type="button" class="bao-three-number ${active ? 'picked' : ''}" data-bao-number="${esc(g.key)}" data-value="${value}" aria-pressed="${active}">${value.padStart(2, '0')}</button>`;
    }).join('')}</div><div class="bao-three-status">${selected.length === 3 ? `已组成 1 注 · 赔率 ${esc(section.items[0].odds)}` : `还需选 ${3 - selected.length} 个号码 · 赔率 ${esc(section.items[0].odds)}`}</div></div>`;
  }
  function sscPositionBoardMarkup(g, section, activeTab, items) {
    const positions = [...new Set(items.map(item => item.position))];
    return `<div class="ssc-position-board">${positions.map(position => {
      const row = items.filter(item => item.position === position);
      return `<div class="ssc-position-row"><div class="ssc-position-label"><strong>${esc(position)}</strong><small>赔率 ${esc(row[0].odds)}</small></div><div class="ssc-position-numbers" role="group" aria-label="${esc(position)}选号">${row.map(item => {
        const token = `${section.title}|${activeTab}|${position}·${item.value}`;
        const active = g.selected.includes(`${g.play}-${token}`);
        return `<button type="button" class="ssc-position-digit ${active ? 'picked' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" aria-label="${esc(position)} ${esc(item.value)} 赔率 ${esc(item.odds)}" aria-pressed="${active}">${esc(item.value)}</button>`;
      }).join('')}</div></div>`;
    }).join('')}</div>`;
  }
  function x115DirectBoardMarkup(g, section, activeTab, items) {
    const positions = [...new Set(items.map(item => item.position))];
    return `<div class="x115-direct-board cols-${positions.length}">${positions.map(position => {
      const row = items.filter(item => item.position === position);
      return `<div class="x115-direct-column"><div class="x115-direct-heading"><strong>${esc(position)}</strong><small>赔率 ${esc(row[0].odds)}</small></div><div class="x115-direct-values" role="group" aria-label="${esc(position)}选号">${row.map(item => {
        const token = `${section.title}|${activeTab}|${position}·${item.value}`;
        const active = g.selected.includes(`${g.play}-${token}`);
        return `<button type="button" class="x115-direct-number ${active ? 'picked' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" aria-label="${esc(position)} ${esc(item.value)} 赔率 ${esc(item.odds)}" aria-pressed="${active}">${String(item.value).padStart(2, '0')}</button>`;
      }).join('')}</div></div>`;
    }).join('')}</div>`;
  }

  function cardMarkup(g) {
    const picked = g.selected.length;
    const betCount = cardBetCount(g);
    const play = playDefinition(g);
    const displayedValues = play.values.length > 20 && !g.expanded ? play.values.slice(0, 20) : play.values;
    const options = displayedValues.map((value, i) => {
      const token = play.kind === 'position' ? `${g.position || '百位'}|${value}` : value;
      const id = `${g.play}-${token}`;
      const active = g.selected.includes(id);
      const odds = play.kind === 'odds' || play.odds ? `<small>${play.odds || '1.98'}</small>` : '';
      const numberStyle = ['number', 'digits', 'position'].includes(play.kind);
      return `<button type="button" class="choice ${active ? 'picked' : ''} ${numberStyle ? 'number-choice' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" aria-pressed="${active}">${esc(value)}${odds}</button>`;
    }).join('');
    const areas = ['position', 'digits'].includes(play.kind)
      ? `<div class="position-select">${(g.id === '3d' ? ['百位', '十位', '个位'] : ['百位', '十位', '个位']).map(p => `<button type="button" class="position-tab ${p === (g.position || '百位') ? 'active' : ''}" data-position="${esc(g.key)}" data-value="${p}">${p}</button>`).join('')}</div>`
      : '';
    const subplays = subplayChoices(play);
    const currentSubplay = subplays.find(choice => choice.key === g.subplayChoice?.[g.play]) || subplays[0];
    const selectedInnerTab = currentSubplay && (play.grouped ? (g.innerTabs?.[`${g.play}|${currentSubplay.section.title}`] || currentSubplay.section.tabs?.[0] || '') : currentSubplay.tab);
    const currentItems = currentSubplay && (currentSubplay.section.tabItems?.[selectedInnerTab] || currentSubplay.section.items);
    const itemLimit = currentItems?.some(item => item.position) ? 40 : 20;
    const canExpand = play.sections ? currentItems?.length > itemLimit : play.values.length > 20;
    const more = canExpand ? `<button type="button" class="show-more" data-expand="${esc(g.key)}">${g.expanded ? '收起投注区' : '查看完整投注区'} <span>${g.expanded ? '⌃' : '⌄'}</span></button>` : '';
    const subplayColumns = subplayColumnCount(g, subplays);
    const subplaySwitch = subplays.length > 1 ? `<div class="subplay-switch"><div class="subplay-caption">次玩法</div><div class="subplay-grid cols-${subplayColumns} ${g.id === 'pk10' && subplays.length === 11 ? 'featured-first' : ''}" role="group" aria-label="${esc(g.game)}次玩法">${subplays.map(choice => { const saved = subplayPickCount(g, choice); return `<button type="button" data-subplay-button="${esc(g.key)}" data-subplay-key="${esc(choice.key)}" class="${choice.key === currentSubplay.key ? 'active' : ''}" aria-pressed="${choice.key === currentSubplay.key}">${esc(choice.label)}${saved ? `<b>${saved}</b>` : ''}</button>`; }).join('')}</div></div>` : '';
    const board = play.sections ? `<div class="source-betting-board">${currentSubplay ? [currentSubplay].map(({ section, sectionIndex }) => {
      const activeTab = selectedInnerTab;
      const allItems = section.tabItems?.[activeTab] || section.items;
      const visibleLimit = allItems.some(item => item.position) ? 40 : 20;
      const items = allItems.length > visibleLimit && !g.expanded ? allItems.slice(0, visibleLimit) : allItems;
      const lianMode = g.id === 'lotto' && g.play === '连码' ? lianModeFor(g, activeTab) : '';
      const pairMode = lianMode.endsWith('对碰');
      const rankBoard = g.id === 'pk10' && g.play === '正确号码';
      const baoBoard = g.id === 'pcdd' && section.title === '包三';
      const x115DirectBoard = g.id === 'x115' && g.play === '直选';
      const sscPositionBoard = g.id === 'ssc' && g.play === '组合/定位' && ['二字定位', '三字定位'].includes(section.title);
      const innerTabs = play.grouped && section.tabs?.length ? `<div class="inner-tab-switch"><span>${sscPositionBoard ? '位置组合' : '投注范围'}</span><div role="group" aria-label="${esc(section.title)}${sscPositionBoard ? '位置组合' : '投注范围'}">${section.tabs.map(tab => `<button type="button" data-inner-tab="${esc(g.key)}" data-inner-section="${esc(section.title)}" data-inner-value="${esc(tab)}" class="${tab === activeTab ? 'active' : ''}" aria-pressed="${tab === activeTab}">${esc(tab)}</button>`).join('')}</div></div>` : '';
      const sectionSize = pairMode ? `A ${lianCategories(lianMode, 'A').length} · B ${lianCategories(lianMode, 'B').length} 组` : baoBoard ? '28 号 · 3 码 1 注' : rankBoard ? `${allItems.length} 号` : `${allItems.length} 项`;
      const positionHelp = allItems.some(item => item.position) ? '<p class="position-help">每个位置至少选 1 码，才会形成投注。</p>' : '';
      return `<section class="source-play-section"><h3><span class="section-index">${String(sectionIndex + 1).padStart(2, '0')}</span>${esc(play.grouped ? section.title : activeTab || section.title)}<small>${sectionSize}</small></h3>${innerTabs}${positionHelp}${baoBoard ? baoThreeBoardMarkup(g, section) : x115DirectBoard ? x115DirectBoardMarkup(g, section, activeTab, items) : sscPositionBoard ? sscPositionBoardMarkup(g, section, activeTab, items) : rankBoard ? pk10RankBoardMarkup(g, section, activeTab) : g.id === 'lotto' && g.play === '连码' ? lianBoardMarkup(g, section, activeTab, items) : g.id === 'lotto' && comboPlays.has(g.play) ? comboBoardMarkup(g, section, activeTab, items) : `<div class="source-play-grid ${items.some(item => item.hint) ? 'has-hints' : items.some(item => /^\d+$/.test(String(item.value))) ? 'number-board' : ''}">${items.map((item, itemIndex) => {
        const itemValue = item.position ? `${item.position}·${item.value}` : item.value;
        const token = `${section.title}${activeTab ? `|${activeTab}` : ''}|${itemValue}`;
        const id = `${g.play}-${token}`;
        const active = g.selected.includes(id);
        const numberBall = /^\d+$/.test(String(item.value));
        const dice = g.id === 'k3' && /^[1-6]{1,3}$/.test(item.value);
        const valueMarkup = dice ? `<span class="dice-set dice-count-${item.value.length}" role="img" aria-label="${item.value.split('').join('、')}点骰子">${item.value.split('').map(number => dieMarkup(Number(number), 'bet-die')).join('')}</span>` : `<span class="${g.id === 'lotto' && numberBall ? lottoColor(item.value) : ''}">${esc(item.value)}</span>`;
        const positionHead = item.position && (itemIndex === 0 || items[itemIndex - 1].position !== item.position) ? `<div class="position-group-head">${esc(item.position)}</div>` : '';
        return `${positionHead}<button type="button" class="choice ${active ? 'picked' : ''} ${numberBall ? 'number-choice' : 'odds-choice'} ${item.hint ? 'has-hint' : ''} ${item.position ? 'position-choice' : ''} ${dice ? 'dice-choice' : ''}" data-pick="${esc(g.key)}" data-value="${esc(token)}" aria-label="${item.position ? `${esc(item.position)} ` : ''}${esc(item.value)} ${esc(item.odds)}" aria-pressed="${active}">${valueMarkup}${item.hint ? g.id === 'lotto' ? lottoHintMarkup(item.hint) : `<em class="choice-hint">${esc(item.hint)}</em>` : ''}<small>${esc(item.odds)}</small></button>`;
      }).join('')}</div>`}</section>`;
    }).join('') : ''}</div>` : `<div class="choices ${play.kind === 'sum' ? 'sum-choices' : ''} ${play.values.length > 20 ? 'k8-choices' : ''} ${play.kind === 'odds' ? 'odds-choices' : ''}">${options}</div>`;
    const status = picked ? `<span class="card-count">${isBetClosed(g) ? '已封盘 · ' : ''}已选 ${picked} 项 · ${betCount} 注</span>` : `<span class="card-count muted">尚未选择</span>`;
    const playOptions = playCatalog[g.id].map(item => {
      const saved = g.selected.filter(value => value.startsWith(`${item.name}-`)).length;
      return `<option value="${esc(item.name)}" ${item.name === g.play ? 'selected' : ''}>${esc(item.name)}${saved && item.name !== g.play ? ` · 已选 ${saved} 项` : ''}</option>`;
    }).join('');
    const savedPlayCount = playCatalog[g.id].filter(item => g.selected.some(value => value.startsWith(`${item.name}-`))).length;
    return `<article class="lottery-card ${picked ? 'has-pick' : ''} ${isClosingSoon(g) ? 'closing-soon' : ''} ${isBetClosed(g) && picked ? 'bet-closed' : ''}" id="group-${g.id}" data-card="${esc(g.key)}">
      <header class="card-head">
        <div class="card-head-main"><div class="card-title"><span class="group-logo-placeholder" role="img" aria-label="${esc(groupNames[g.id])}图片额外设计"><span>图片<br>额外设计</span></span><div><h2>${esc(g.game)}</h2><p>第 ${esc(g.issue)} 期 <i></i> 封盘 <em data-countdown="${esc(g.key)}">${clockLabel(g)}</em></p></div></div>
          <button type="button" class="remove-game" data-remove="${esc(g.key)}" aria-label="移除${esc(g.game)}彩种" title="移除彩种">×</button>
          <div class="card-head-actions"><button type="button" class="change-game" data-change="${esc(g.key)}" aria-label="更换${esc(g.game)}">更换彩种</button><button type="button" class="reset-picks" data-reset="${esc(g.key)}" aria-label="重置${esc(g.game)}选号" ${picked ? '' : 'disabled'}>重置选号</button></div></div>
        <div class="draw-row"><div class="draw-heading"><span>上期开奖 <small>示意</small></span><span>${esc(resultRule[g.id])}</span></div><div class="draw-balls draw-balls-${g.id}">${resultMarkup(g)}</div><button type="button" class="history-toggle" data-history="${esc(g.key)}" aria-expanded="${g.historyExpanded}" aria-controls="history-${esc(g.key)}"><span>近 7 期开奖</span><span aria-hidden="true">${g.historyExpanded ? '收起 ↑' : '查看 ↓'}</span></button></div>
        ${historyMarkup(g)}
      </header>
      <div class="play-row"><div class="play-row-main"><span class="play-label">目前玩法</span><select class="play-select" data-play="${esc(g.key)}" aria-label="${esc(g.game)}玩法">${playOptions}</select></div><span class="play-retained">${savedPlayCount ? `已选 ${savedPlayCount} 个玩法 · ${betCount} 注` : ''}</span></div>
      ${subplaySwitch}
      ${play.sections ? '' : areas}
      ${board}
      ${more}
      <div class="card-foot"><div class="card-summary">${status}<span class="subtotal">小计 <b>¥${formatMoney(betCount * g.amount)}</b></span></div><label class="amount-label"><span class="amount-caption">每注金额</span><span class="amount-control"><button type="button" data-amount="${esc(g.key)}" data-delta="-10" aria-label="减少金额">−</button><input type="number" inputmode="decimal" min="1" value="${g.amount}" data-amount-input="${esc(g.key)}" aria-label="${esc(g.game)}每注金额"><button type="button" data-amount="${esc(g.key)}" data-delta="10" aria-label="增加金额">＋</button></span><small>元</small></label></div>
    </article>`;
  }

  function totals() {
    const count = cards.reduce((n, g) => n + (isBetClosed(g) ? 0 : cardBetCount(g)), 0);
    const closedCount = cards.reduce((n, g) => n + (isBetClosed(g) ? cardBetCount(g) : 0), 0);
    const amount = cards.reduce((n, g) => n + (isBetClosed(g) ? 0 : cardBetCount(g) * g.amount), 0);
    $('#selected-count').textContent = cards.length;
    $('#bet-count').textContent = count;
    $('#summary-count').textContent = count;
    $('#closed-count').textContent = closedCount;
    $('#closed-note').hidden = closedCount === 0;
    $('#summary-total').textContent = formatMoney(amount);
    $('#checkout').disabled = count + closedCount === 0;
    $('#checkout').textContent = count ? '确认投注' : closedCount ? '查看封盘项目' : '确认投注';
    cards.forEach(g => {
      const bets = cardBetCount(g);
      const nav = document.querySelector(`[data-jump="${CSS.escape(g.key)}"]`);
      if (nav) {
        nav.classList.toggle('has-pending', bets > 0);
        nav.classList.toggle('bet-closed', isBetClosed(g) && bets > 0);
        nav.querySelector('.nav-pending').firstChild.textContent = isBetClosed(g) ? '不可提交 ' : '待投注 ';
        nav.querySelector('.nav-pending b').textContent = `${bets} 注`;
        const badge = nav.querySelector('.nav-bet-count');
        badge.textContent = bets;
      }
      const node = document.querySelector(`[data-card="${CSS.escape(g.key)}"]`);
      if (!node) return;
      const picked = g.selected.length;
      const status = node.querySelector('.card-count');
      status.textContent = picked ? `${isBetClosed(g) ? '已封盘 · ' : ''}已选 ${picked} 项 · ${bets} 注` : '尚未选择';
      status.classList.toggle('muted', !picked);
      const savedPlayCount = playCatalog[g.id].filter(item => g.selected.some(value => value.startsWith(`${item.name}-`))).length;
      node.querySelector('.play-retained').textContent = savedPlayCount ? `已选 ${savedPlayCount} 个玩法 · ${bets} 注` : '';
      node.querySelectorAll('[data-play] option').forEach(option => {
        const saved = g.selected.filter(value => value.startsWith(`${option.value}-`)).length;
        option.textContent = `${option.value}${saved && option.value !== g.play ? ` · 已选 ${saved} 项` : ''}`;
      });
      node.querySelector('.subtotal b').textContent = `¥${formatMoney(bets * g.amount)}`;
      node.classList.toggle('has-pick', picked > 0);
      node.classList.toggle('bet-closed', isBetClosed(g) && picked > 0);
      node.querySelector('.reset-picks').disabled = picked === 0;
    });
  }

  function render() {
    navMarkup();
    updateNavOverflow();
    $('#cards').innerHTML = cards.length ? cards.map(cardMarkup).join('') : '<div class="empty-desk"><strong>投注桌目前是空的</strong><p>加入彩种后，就能在这里组合投注。</p><button type="button" data-add-empty>添加彩种</button></div>';
    totals();
  }
  function refreshCard(g, focusSelector) {
    const node = document.querySelector(`[data-card="${CSS.escape(g.key)}"]`);
    if (!node) return;
    node.outerHTML = cardMarkup(g);
    totals();
    if (focusSelector) document.querySelector(`[data-card="${CSS.escape(g.key)}"] ${focusSelector}`)?.focus({ preventScroll: true });
  }

  function showModal(html) {
    modalFocus = document.activeElement;
    $('#modal-root').innerHTML = `<div class="modal-backdrop" data-backdrop><section class="modal" role="dialog" aria-modal="true">${html}</section></div>`;
  }
  function closeModal() {
    $('#modal-root').innerHTML = '';
    modalFocus?.focus?.();
    modalFocus = null;
  }
  function gamePicker(key, isAdd = false) {
    const current = cards.find(c => c.key === key);
    const currentName = current?.game;
    const used = new Set(cards.map(c => c.game));
    const body = groups.map(group => `<section class="picker-group"><h3>${esc(group.label)}</h3><div>${catalog[group.id].map(game => {
      const disabled = used.has(game) && game !== currentName;
      return `<button type="button" class="picker-game ${disabled ? 'disabled' : ''}" ${disabled ? 'disabled' : ''} data-select-game="${esc(game)}" data-group="${group.id}" data-target="${esc(key || '')}" data-add="${isAdd}">${esc(game)}${disabled ? '<small>已加入</small>' : ''}</button>`;
    }).join('')}</div></section>`).join('');
    showModal(`<header class="modal-head"><div><small>${isAdd ? '扩充投注组合' : '调整此卡彩种'}</small><h2>${isAdd ? '添加彩种' : '更换彩种'}</h2></div><button type="button" class="modal-close" data-close aria-label="关闭">×</button></header><div class="picker-body">${body}</div>`);
  }
  function changeGame(targetKey, nextGame, nextGroup, isAdd) {
    if (isAdd) {
      const base = groups.find(g => g.id === nextGroup);
      const card = newCardState(base, `${base.id}-${Date.now()}`, nextGame);
      cards.push(card);
      closeModal();
      render();
      document.querySelector(`[data-card="${CSS.escape(card.key)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast(`${nextGame}已加入`);
      return;
    }
    const current = cards.find(c => c.key === targetKey);
    if (!current) return;
    if (current.game === nextGame) { closeModal(); return; }
    const apply = () => {
      const base = groups.find(g => g.id === nextGroup);
      Object.assign(current, newCardState(base, targetKey, nextGame));
      closeModal();
      render();
      toast(`已更换为${nextGame}`);
    };
    if (current.selected.length) {
      showModal(`<div class="confirm-change"><span class="warning-icon">!</span><h2>更换彩种？</h2><p><b>${esc(current.game)}</b> ${selectionDescription(current)}，共 <b>¥${formatMoney(cardBetCount(current) * current.amount)}</b>。更换后，这些投注内容会清除。</p><div class="modal-actions"><button type="button" class="secondary-button" data-back-picker="${esc(targetKey)}">保留投注</button><button type="button" class="primary-button" data-confirm-change="${esc(nextGame)}" data-confirm-group="${nextGroup}" data-target="${esc(targetKey)}">确认更换</button></div></div>`);
      $('#modal-root').dataset.pendingChange = JSON.stringify({ targetKey, nextGame, nextGroup });
    } else apply();
  }
  function applyPlayChange(current, nextPlay) {
    current.play = nextPlay;
    current.expanded = false;
    render();
  }
  function requestPlayChange(cardKey, nextPlay) {
    const current = cards.find(c => c.key === cardKey);
    if (!current || current.play === nextPlay) return;
    applyPlayChange(current, nextPlay);
  }
  let toastTimer;
  function toast(text) {
    const node = $('#toast');
    node.textContent = text;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 1900);
  }
  function submitSummary() {
    const chosen = cards.filter(g => cardBetCount(g) > 0);
    const available = chosen.filter(g => !isBetClosed(g));
    const blocked = chosen.filter(isBetClosed);
    const count = available.reduce((n, g) => n + cardBetCount(g), 0);
    const amount = available.reduce((n, g) => n + cardBetCount(g) * g.amount, 0);
    const readablePick = token => {
      const parts = token.slice(token.indexOf('-') + 1).split('|').filter(Boolean);
      if (parts.length > 2 && parts[0] === parts[1]) parts.shift();
      return parts.join(' · ');
    };
    const rows = chosen.map(g => {
      const plays = playCatalog[g.id].filter(play => g.selected.some(value => value.startsWith(`${play.name}-`)));
      const closed = isBetClosed(g);
      const issue = g.betIssue || g.issue;
      return `<div class="review-game ${closed ? 'review-closed' : ''}"><div class="review-row"><span><strong>${esc(g.game)}</strong><small>${esc(issue)} 期</small></span><b>${cardBetCount(g)} 注　¥${formatMoney(cardBetCount(g) * g.amount)}</b></div><span class="review-state ${closed ? 'state-closed' : 'state-open'}">${closed ? '已封盘 · 不可提交' : '可提交'}</span><div class="review-play-list">${plays.map(play => `<span>${esc(play.name)} ${playBetCount(g, play.name)} 注</span>`).join('')}</div><p class="review-picks">已选项目：${esc(g.selected.map(readablePick).join('、'))}</p></div>`;
    }).join('');
    const partial = cards.some(hasUnformedLianSelection);
    showModal(`<header class="modal-head"><div><small>请核对每个彩种与期号</small><h2>确认投注</h2></div><button type="button" class="modal-close" data-close aria-label="关闭">×</button></header><div class="review-body">${blocked.length ? `<p class="review-warning">${blocked.length} 个彩种已封盘，所选投注不会送出；请重置选号后再选新期。</p>` : ''}${rows}${partial ? '<p class="review-partial">未凑成一注的组合选号不会提交。</p>' : ''}<div class="review-total"><span>可提交 ${available.length} 个彩种 · ${count} 注</span><strong>¥${formatMoney(amount)}</strong></div></div><div class="modal-actions review-actions"><button type="button" class="secondary-button" data-close>返回调整</button><button type="button" class="primary-button" data-submit-all ${available.length ? '' : 'disabled'}>确认提交可投项目</button></div>`);
    $('#modal-root').dataset.reviewSnapshot = JSON.stringify(available.map(g => [g.key, g.issue, cardBetCount(g), g.amount]));
  }
  function maybeShowClosingAlert() {
    if ($('#modal-root').firstElementChild) return;
    const g = cards.find(card => card.remaining > 0 && card.remaining <= 15 && cardBetCount(card) > 0 && card.betIssue === card.issue && card.remindedIssue !== card.issue);
    if (!g) return;
    g.remindedIssue = g.issue;
    const count = cardBetCount(g);
    showModal(`<div class="closing-alert"><span class="closing-alert-icon">15</span><small>即将封盘</small><h2>${esc(g.game)}</h2><p>第 ${esc(g.issue)} 期还有 <b data-alert-countdown="${esc(g.key)}">${formatClock(g.remaining)}</b>，你有 <strong>${count} 注待投注</strong>。请尽快确认，封盘后该期不能送出。</p><div class="closing-alert-actions"><button type="button" class="secondary-button" data-reminder-jump="${esc(g.key)}">跳往彩种</button><button type="button" class="primary-button" data-reminder-review>查看并送单</button></div><button type="button" class="reminder-cancel" data-close>稍后处理</button></div>`);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#back-to-top')) {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    const historyButton = e.target.closest('[data-history]');
    if (historyButton) {
      const g = cards.find(card => card.key === historyButton.dataset.history);
      if (g) {
        g.historyExpanded = !g.historyExpanded;
        historyButton.setAttribute('aria-expanded', String(g.historyExpanded));
        historyButton.lastElementChild.textContent = g.historyExpanded ? '收起 ↑' : '查看 ↓';
        document.getElementById(`history-${g.key}`).hidden = !g.historyExpanded;
      }
      return;
    }
    const reminderJump = e.target.closest('[data-reminder-jump]');
    if (reminderJump) {
      const key = reminderJump.dataset.reminderJump;
      closeModal();
      document.querySelector(`[data-card="${CSS.escape(key)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (e.target.closest('[data-reminder-review]')) { submitSummary(); return; }
    if (e.target.closest('[data-pick], [data-bao-number], [data-lian-pair]')) {
      const cardNode = e.target.closest('[data-card]');
      const g = cards.find(card => card.key === cardNode?.dataset.card);
      if (g && isBetClosed(g)) {
        toast(g.betIssue !== g.issue ? '原期已封盘，请重置选号后投注新期' : '当前彩种已封盘，请等待下一期');
        return;
      }
    }
    const jump = e.target.closest('[data-jump]');
    if (jump) document.querySelector(`[data-card="${CSS.escape(jump.dataset.jump)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const baoNumber = e.target.closest('[data-bao-number]');
    if (baoNumber) {
      const g = cards.find(card => card.key === baoNumber.dataset.baoNumber);
      if (!g) return;
      const id = `主势盘-包三|${baoNumber.dataset.value}`;
      const selected = g.selected.filter(value => value.startsWith('主势盘-包三|'));
      if (g.selected.includes(id)) g.selected = g.selected.filter(value => value !== id);
      else if (selected.length < 3) g.selected.push(id);
      else { toast('包三最多选 3 个号码；请先取消一个已选号码'); return; }
      refreshCard(g, `[data-bao-number][data-value="${CSS.escape(baoNumber.dataset.value)}"]`);
      return;
    }

    const subplayButton = e.target.closest('[data-subplay-button]');
    if (subplayButton) {
      const g = cards.find(c => c.key === subplayButton.dataset.subplayButton);
      const choice = g && subplayChoices(playDefinition(g)).find(item => item.key === subplayButton.dataset.subplayKey);
      if (choice) {
        g.subplayChoice = { ...g.subplayChoice, [g.play]: choice.key };
        g.expanded = false;
        refreshCard(g, `[data-subplay-key="${CSS.escape(choice.key)}"]`);
      }
      return;
    }

    const innerTabButton = e.target.closest('[data-inner-tab]');
    if (innerTabButton) {
      const g = cards.find(c => c.key === innerTabButton.dataset.innerTab);
      const section = g && playDefinition(g).sections.find(item => item.title === innerTabButton.dataset.innerSection);
      const tab = innerTabButton.dataset.innerValue;
      if (section?.tabs?.includes(tab)) {
        g.innerTabs = { ...g.innerTabs, [`${g.play}|${section.title}`]: tab };
        g.expanded = false;
        refreshCard(g, `[data-inner-value="${CSS.escape(tab)}"]`);
      }
      return;
    }

    const lianMode = e.target.closest('[data-lian-mode]');
    if (lianMode) {
      const g = cards.find(c => c.key === lianMode.dataset.lianMode);
      const tab = lianMode.dataset.tab;
      if (g?.play === '连码' && lianModesFor(tab).includes(lianMode.dataset.mode)) {
        g.lianModes = { ...g.lianModes, [tab]: lianMode.dataset.mode };
        refreshCard(g, `[data-lian-mode][data-mode="${CSS.escape(lianMode.dataset.mode)}"]`);
      }
      return;
    }
    const lianRole = e.target.closest('[data-lian-role]');
    if (lianRole) {
      const g = cards.find(c => c.key === lianRole.dataset.lianRole);
      if (g?.play === '连码' && ['头', '拖'].includes(lianRole.dataset.role)) {
        g.lianRoles = { ...g.lianRoles, [lianRole.dataset.tab]: lianRole.dataset.role };
        refreshCard(g, `[data-lian-role][data-role="${CSS.escape(lianRole.dataset.role)}"]`);
      }
      return;
    }
    const lianPair = e.target.closest('[data-lian-pair]');
    if (lianPair) {
      const g = cards.find(c => c.key === lianPair.dataset.lianPair);
      if (g?.play === '连码' && lianModesFor(lianPair.dataset.tab).includes(lianPair.dataset.mode)) {
        const id = `连码-连码|${lianPair.dataset.tab}|${lianPair.dataset.mode}|${lianPair.dataset.side}|${lianPair.dataset.choice}`;
        g.selected = g.selected.includes(id) ? g.selected.filter(value => value !== id) : [...g.selected, id];
        refreshCard(g, `[data-lian-pair][data-side="${lianPair.dataset.side}"][data-choice="${CSS.escape(lianPair.dataset.choice)}"]`);
      }
      return;
    }

    const comboMode = e.target.closest('[data-combo-mode]');
    if (comboMode) {
      const g = cards.find(c => c.key === comboMode.dataset.comboMode);
      if (g && comboPlays.has(g.play) && comboModesFor(g).includes(comboMode.dataset.mode)) {
        g.comboModes = { ...g.comboModes, [comboMode.dataset.tab]: comboMode.dataset.mode };
        refreshCard(g, `[data-combo-mode][data-mode="${CSS.escape(comboMode.dataset.mode)}"]`);
      }
      return;
    }
    const comboRole = e.target.closest('[data-combo-role]');
    if (comboRole) {
      const g = cards.find(c => c.key === comboRole.dataset.comboRole);
      if (g && comboPlays.has(g.play) && ['头', '拖'].includes(comboRole.dataset.role)) {
        g.comboRoles = { ...g.comboRoles, [comboRole.dataset.tab]: comboRole.dataset.role };
        refreshCard(g, `[data-combo-role][data-role="${CSS.escape(comboRole.dataset.role)}"]`);
      }
      return;
    }

    const pick = e.target.closest('[data-pick]');
    if (pick) {
      const g = cards.find(c => c.key === pick.dataset.pick);
      if (g) {
        const id = `${g.play}-${pick.dataset.value}`;
        if (pick.dataset.comboChoice) {
          const tab = pick.dataset.comboTab;
          const mode = pick.dataset.comboModeValue;
          if (g.selected.includes(id)) g.selected = g.selected.filter(value => value !== id);
          else {
            if (mode === '拖头') {
              const role = comboRoleFor(g, tab);
              if (role === '头' && comboSelection(g, tab, mode, '头').length >= comboSize(tab) - 1) {
                toast(`此玩法最多选 ${comboSize(tab) - 1} 个头码`);
                return;
              }
              const other = `${g.play}-${g.play}|${tab}|拖头|${role === '头' ? '拖' : '头'}|${pick.dataset.comboChoice}`;
              g.selected = g.selected.filter(value => value !== other);
            }
            g.selected.push(id);
          }
          refreshCard(g, `[data-combo-choice="${CSS.escape(pick.dataset.comboChoice)}"]`);
          return;
        }
        if (pick.dataset.lianNumber) {
          const tab = pick.dataset.lianTab;
          const mode = pick.dataset.lianPickMode;
          if (g.selected.includes(id)) g.selected = g.selected.filter(value => value !== id);
          else {
            if (mode === '拖头') {
              const role = lianRoleFor(g, tab);
              if (role === '头' && lianSelection(g, tab, mode, '头').length >= lianSizes[tab] - 1) {
                toast(`此玩法最多选 ${lianSizes[tab] - 1} 个头码`);
                return;
              }
              const otherRole = role === '头' ? '拖' : '头';
              const other = `连码-连码|${tab}|拖头|${otherRole}|${pick.dataset.lianNumber}`;
              g.selected = g.selected.filter(value => value !== other);
            }
            g.selected.push(id);
          }
          refreshCard(g, `[data-lian-number="${CSS.escape(pick.dataset.lianNumber)}"]`);
          return;
        }
        g.selected = g.selected.includes(id) ? g.selected.filter(x => x !== id) : [...g.selected, id];
        if (subplayChoices(playDefinition(g)).length > 1) {
          refreshCard(g, `[data-value="${CSS.escape(pick.dataset.value)}"]`);
          return;
        }
        pick.classList.toggle('picked', g.selected.includes(id));
        pick.setAttribute('aria-pressed', String(g.selected.includes(id)));
        totals();
      }
    }

    const plusMinus = e.target.closest('[data-amount]');
    if (plusMinus) {
      const g = cards.find(c => c.key === plusMinus.dataset.amount);
      const input = document.querySelector(`[data-amount-input="${CSS.escape(g.key)}"]`);
      g.amount = Math.max(1, Number(g.amount) + Number(plusMinus.dataset.delta));
      input.value = g.amount;
      totals();
    }

    const expand = e.target.closest('[data-expand]');
    if (expand) {
      const g = cards.find(c => c.key === expand.dataset.expand);
      g.expanded = !g.expanded;
      render();
      document.querySelector(`[data-card="${CSS.escape(g.key)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const change = e.target.closest('[data-change]');
    if (change) gamePicker(change.dataset.change);
    const reset = e.target.closest('[data-reset]');
    if (reset && !reset.disabled) {
      const g = cards.find(c => c.key === reset.dataset.reset);
      if (g?.selected.length) showModal(`<div class="confirm-change"><span class="warning-icon">!</span><h2>重置选号？</h2><p><b>${esc(g.game)}</b> ${selectionDescription(g)}，共 <b>¥${formatMoney(cardBetCount(g) * g.amount)}</b>。重置后彩种与玩法会保留，已选投注项会清空。</p><div class="modal-actions"><button type="button" class="secondary-button" data-close>保留选号</button><button type="button" class="primary-button" data-confirm-reset="${esc(g.key)}">确认重置</button></div></div>`);
    }
    const confirmReset = e.target.closest('[data-confirm-reset]');
    if (confirmReset) {
      const g = cards.find(c => c.key === confirmReset.dataset.confirmReset);
      if (g) { g.selected = []; g.betIssue = g.issue; g.pcddBao = ['', '', '']; closeModal(); render(); toast(`${g.game}已重置选号`); }
    }
    const remove = e.target.closest('[data-remove]');
    if (remove) {
      const g = cards.find(c => c.key === remove.dataset.remove);
      if (g) showModal(`<div class="confirm-change"><span class="warning-icon">!</span><h2>移除彩种？</h2><p><b>${esc(g.game)}</b> 会从投注桌与快速前往中移除。${g.selected.length ? `${selectionDescription(g)}，共 <b>¥${formatMoney(cardBetCount(g) * g.amount)}</b>，也会一并清空。` : ''}之后仍可透过「添加彩种」重新加入。</p><div class="modal-actions"><button type="button" class="secondary-button" data-close>保留彩种</button><button type="button" class="primary-button" data-confirm-remove="${esc(g.key)}">确认移除</button></div></div>`);
    }
    const confirmRemove = e.target.closest('[data-confirm-remove]');
    if (confirmRemove) {
      const index = cards.findIndex(c => c.key === confirmRemove.dataset.confirmRemove);
      if (index !== -1) { const [g] = cards.splice(index, 1); closeModal(); render(); toast(`${g.game}已移除`); }
    }
    if (e.target.closest('#add-game, [data-add-empty]')) gamePicker('', true);
    if (e.target.closest('[data-close]')) closeModal();
    if (e.target.matches('[data-backdrop]')) closeModal();

    const selectGame = e.target.closest('[data-select-game]');
    if (selectGame && !selectGame.disabled) {
      changeGame(selectGame.dataset.target, selectGame.dataset.selectGame, selectGame.dataset.group, selectGame.dataset.add === 'true');
    }

    const backPicker = e.target.closest('[data-back-picker]');
    if (backPicker) gamePicker(backPicker.dataset.backPicker);

    const confirmChange = e.target.closest('[data-confirm-change]');
    if (confirmChange) {
      const data = JSON.parse($('#modal-root').dataset.pendingChange || '{}');
      const current = cards.find(c => c.key === data.targetKey);
      if (current) {
        const base = groups.find(g => g.id === data.nextGroup);
        Object.assign(current, newCardState(base, current.key, data.nextGame));
        delete $('#modal-root').dataset.pendingChange;
        closeModal();
        render();
        toast(`已更换为${data.nextGame}`);
      }
    }

    if (e.target.closest('#checkout')) submitSummary();
    if (e.target.closest('[data-submit-all]')) {
      const available = cards.filter(g => cardBetCount(g) > 0 && !isBetClosed(g));
      const snapshot = JSON.stringify(available.map(g => [g.key, g.issue, cardBetCount(g), g.amount]));
      if (!available.length || snapshot !== $('#modal-root').dataset.reviewSnapshot) {
        submitSummary();
        toast('盘口状态已变化，请重新核对');
        return;
      }
      const count = available.reduce((sum, g) => sum + cardBetCount(g), 0);
      available.forEach(g => { g.selected = []; g.betIssue = g.issue; });
      closeModal();
      render();
      toast(`${count} 注已提交（原型演示）`);
    }
    const position = e.target.closest('[data-position]');
    if (position) {
      const g = cards.find(c => c.key === position.dataset.position);
      if (g) { g.position = position.dataset.value; render(); }
    }
  });

  document.addEventListener('input', e => {
    const input = e.target.closest('[data-amount-input]');
    if (!input) return;
    const g = cards.find(c => c.key === input.dataset.amountInput);
    g.amount = Math.max(1, Number(input.value || 1));
    totals();
  });

  document.addEventListener('change', e => {
    const select = e.target.closest('[data-play]');
    if (!select) return;
    const g = cards.find(card => card.key === select.dataset.play);
    const nextPlay = select.value;
    if (g) select.value = g.play;
    requestPlayChange(select.dataset.play, nextPlay);
  });

  const backToTop = $('#back-to-top');
  const updateBackToTop = () => { backToTop.hidden = window.scrollY < 360; };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('resize', updateNavOverflow, { passive: true });
  render();
  updateBackToTop();
  setInterval(() => {
    let newIssue = false;
    let becameClosed = false;
    cards.forEach(g => {
      if (g.remaining > 0) { g.remaining -= 1; if (g.remaining === 0) becameClosed = true; return; }
      g.closedFor += 1;
      if (g.closedFor < 12) return;
      g.history.unshift({ issue: g.issue, values: demoResult(g.id, g.issue, 8, g.game) });
      g.history = g.history.slice(0, 7);
      g.issue = String(Number(g.issue) + 1);
      g.remaining = parseClock(g.close);
      g.closedFor = 0;
      if (!g.selected.length) g.betIssue = g.issue;
      newIssue = true;
    });
    if (newIssue) render();
    else if (becameClosed) totals();
    document.querySelectorAll('[data-countdown]').forEach(node => {
      const g = cards.find(card => card.key === node.dataset.countdown);
      if (g) node.textContent = clockLabel(g);
    });
    document.querySelectorAll('[data-alert-countdown]').forEach(node => {
      const g = cards.find(card => card.key === node.dataset.alertCountdown);
      if (!g) return;
      if (isBetClosed(g)) {
        const alert = node.closest('.closing-alert');
        alert.querySelector('small').textContent = '本期已封盘';
        alert.querySelector('.closing-alert-icon').textContent = '!';
        alert.querySelector('p').innerHTML = `第 ${esc(g.betIssue)} 期的 <strong>${cardBetCount(g)} 注已选投注</strong>已不可提交。请查看清单或重置选号，切勿送往下一期。`;
        alert.querySelector('[data-reminder-review]').textContent = '查看封盘项目';
      } else node.textContent = formatClock(g.remaining);
    });
    cards.forEach(g => {
      const closingSoon = isClosingSoon(g);
      const nav = document.querySelector(`[data-jump="${CSS.escape(g.key)}"]`);
      const card = document.querySelector(`[data-card="${CSS.escape(g.key)}"]`);
      nav?.classList.toggle('closing-soon', closingSoon);
      card?.classList.toggle('closing-soon', closingSoon);
      nav?.classList.toggle('bet-closed', isBetClosed(g) && cardBetCount(g) > 0);
      card?.classList.toggle('bet-closed', isBetClosed(g) && g.selected.length > 0);
      if (nav) nav.querySelector('.nav-pending').firstChild.textContent = isBetClosed(g) ? '不可提交 ' : '待投注 ';
    });
    maybeShowClosingAlert();
  }, 1000);
})();

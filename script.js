// ============================================================
//  SISTEMA DE LOTERÍA PRO - LÓGICA COMPLETA
//  (Mantiene toda la funcionalidad original)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ====================== TABLAS ======================
    const table1 = [
        [47,42,67,92],[20,45,70,95],[13,38,63,88],[6,31,56,81],[15,40,65,90],[16,41,66,91],
        [2,27,52,77],[18,43,68,93],[19,44,69,94],[12,37,62,87],[10,35,60,85],[22,47,72,97],
        [4,29,54,79],[5,30,55,80],[14,39,64,89],[7,32,57,82],[8,33,58,83],[25,50,75,0],
        [1,26,51,76],[21,46,71,96],[3,28,53,78],[23,48,73,98],[24,49,74,99],[9,34,59,84],[11,36,61,86]
    ];
    const hotTable11x11 = [
        [14,46,69,1,null,62,89,28,null,57,97],[66,37,99,13,79,78,null,17,90,70,null],
        [33,60,12,98,61,null,71,80,10,null,27],[0,21,2,32,91,72,null,77,96,54,81],
        [47,82,53,31,56,null,9,null,35,92,4],[25,68,null,36,7,49,83,16,null,59,null],
        [74,null,40,null,64,11,3,null,41,84,75],[null,76,24,58,93,20,73,45,85,8,null],
        [19,87,48,50,38,null,30,15,63,null,39],[29,42,null,34,52,43,94,51,5,55,86],
        [95,65,44,88,6,22,67,null,18,23,26]
    ];
    const daysOfWeek = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const operadores = [4,7,10,11,15,20,40];

    function ajustarMod100(v) {
        let r = v % 100;
        if (r < 0) r += 100;
        return r;
    }

    // ====================== DOM ELEMENTS ======================
    const elements = {
        weekSelect: document.getElementById('weekSelect'),
        daySelect: document.getElementById('daySelect'),
        timeSelect: document.getElementById('timeSelect'),
        tiroNumberInput: document.getElementById('tiroNumber'),
        saveTiroBtn: document.getElementById('saveTiroBtn'),
        clearBtn: document.getElementById('clearBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        recentNumbersDiv: document.getElementById('recentNumbers'),
        analysisResults: document.getElementById('analysisResults'),
        statsBox: document.getElementById('statsBox'),
        statNumbersCount: document.getElementById('statNumbersCount'),
        statUpCount: document.getElementById('statUpCount'),
        statDownCount: document.getElementById('statDownCount'),
        statTotalUnique: document.getElementById('statTotalUnique'),
        week1Btn: document.getElementById('week1Btn'),
        week2Btn: document.getElementById('week2Btn'),
        weekTitle: document.getElementById('weekTitle'),
        daysContainer: document.getElementById('daysContainer'),
        hotTable: document.getElementById('hotTable'),
        hotAnalysisResults: document.getElementById('hotAnalysisResults'),
        hotStats: document.getElementById('hotStats'),
        hotLinesFound: document.getElementById('hotLinesFound'),
        hotNumbersRecommended: document.getElementById('hotNumbersRecommended'),
        bingoResults: document.getElementById('bingoResults'),
        bingoStats: document.getElementById('bingoStats'),
        bingoTotal: document.getElementById('bingoTotal'),
        bingoWeek: document.getElementById('bingoWeek'),
        analysisTabs: document.querySelectorAll('.analysis-tab'),
        numberAnalysis: document.getElementById('numberAnalysis'),
        thirdRowAnalysis: document.getElementById('thirdRowAnalysis'),
        hotNumbersAnalysis: document.getElementById('hotNumbersAnalysis'),
        bingoAnalysis: document.getElementById('bingoAnalysis'),
        operacionesAnalysis: document.getElementById('operacionesAnalysis'),
        operacionesResults: document.getElementById('operacionesResults'),
        operacionesStats: document.getElementById('operacionesStats'),
        aciertosList: document.getElementById('aciertosList'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        themeToggle: document.getElementById('themeToggle')
    };

    // ====================== DATA ======================
    let lotteryData = { week1: {}, week2: {} };
    let currentWeek = 1;
    let registroHistorial = [];
    let bingoChains = [];
    let lastAnalysisResults = null;
    let prediccionesRealizadas = [];
    let aciertosSumaResta = [];

    // ====================== TEMA OSCURO/CLARO ======================
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        const icon = elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', newTheme);
    }

    function loadTheme() {
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        const icon = elements.themeToggle.querySelector('i');
        icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ====================== HELPERS ======================
    function createBackgroundParticles() {
        const container = document.getElementById('bgAnimation');
        for (let i = 0; i < 25; i++) {
            const s = document.createElement('span');
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDelay = Math.random() * 20 + 's';
            s.style.animationDuration = (12 + Math.random() * 12) + 's';
            container.appendChild(s);
        }
    }

    function showToast(msg, type = 'success') {
        elements.toastMessage.textContent = msg;
        elements.toast.className = 'toast show ' + (type === 'error' ? 'error' : '');
        setTimeout(() => elements.toast.classList.remove('show'), 3000);
    }

    function initializeEmptyData() {
        for (let w = 1; w <= 2; w++) {
            const wk = 'week' + w;
            lotteryData[wk] = {};
            for (let d = 0; d < 7; d++) {
                lotteryData[wk][d] = { morning: null, evening: null };
            }
        }
    }

    function migrateOldData() {
        for (let w = 1; w <= 2; w++) {
            const wk = 'week' + w;
            if (lotteryData[wk]) {
                for (let d = 0; d < 7; d++) {
                    if (lotteryData[wk][d]) {
                        if (Array.isArray(lotteryData[wk][d].morning)) {
                            lotteryData[wk][d].morning = lotteryData[wk][d].morning.length ? lotteryData[wk][d].morning[lotteryData[wk][d].morning.length - 1] : null;
                        }
                        if (Array.isArray(lotteryData[wk][d].evening)) {
                            lotteryData[wk][d].evening = lotteryData[wk][d].evening.length ? lotteryData[wk][d].evening[lotteryData[wk][d].evening.length - 1] : null;
                        }
                    } else {
                        lotteryData[wk][d] = { morning: null, evening: null };
                    }
                }
            } else {
                lotteryData[wk] = {};
                for (let d = 0; d < 7; d++) {
                    lotteryData[wk][d] = { morning: null, evening: null };
                }
            }
        }
    }

    function loadData() {
        const saved = localStorage.getItem('lotteryWeeklyData');
        if (saved) {
            lotteryData = JSON.parse(saved);
            migrateOldData();
        } else {
            initializeEmptyData();
        }
        const hist = localStorage.getItem('lotteryRegistroHistorial');
        if (hist) registroHistorial = JSON.parse(hist);
        const bingo = localStorage.getItem('lotteryBingoChains');
        if (bingo) bingoChains = JSON.parse(bingo);
        const pred = localStorage.getItem('prediccionesSumaResta');
        if (pred) prediccionesRealizadas = JSON.parse(pred);
        const aciertos = localStorage.getItem('aciertosSumaResta');
        if (aciertos) aciertosSumaResta = JSON.parse(aciertos);
    }

    function saveData() {
        localStorage.setItem('lotteryWeeklyData', JSON.stringify(lotteryData));
        localStorage.setItem('lotteryRegistroHistorial', JSON.stringify(registroHistorial));
        localStorage.setItem('lotteryBingoChains', JSON.stringify(bingoChains));
        localStorage.setItem('prediccionesSumaResta', JSON.stringify(prediccionesRealizadas));
        localStorage.setItem('aciertosSumaResta', JSON.stringify(aciertosSumaResta));
    }

    // ====================== RENDER ======================
    function renderWeek(week) {
        const wk = 'week' + week;
        elements.daysContainer.innerHTML = '';
        for (let d = 0; d < 7; d++) {
            const data = lotteryData[wk][d];
            const card = document.createElement('div');
            card.className = 'day-card';
            card.innerHTML = `<div class="day-name"><i class="fas fa-calendar-day"></i> ${daysOfWeek[d]}</div>`;
            const morn = document.createElement('div');
            morn.className = 'tiro-section';
            morn.innerHTML = `<div class="tiro-title"><i class="fas fa-sun" style="color:#f59e0b;"></i> Mañana</div>`;
            if (data.morning !== null) {
                const n = document.createElement('div');
                n.className = 'tiro-number';
                n.textContent = data.morning.toString().padStart(2, '0');
                morn.appendChild(n);
            } else {
                morn.innerHTML += '<div class="empty-tiro">Sin datos</div>';
            }
            card.appendChild(morn);
            const eve = document.createElement('div');
            eve.className = 'tiro-section';
            eve.innerHTML = `<div class="tiro-title"><i class="fas fa-moon" style="color:#6366f1;"></i> Noche</div>`;
            if (data.evening !== null) {
                const n = document.createElement('div');
                n.className = 'tiro-number';
                n.textContent = data.evening.toString().padStart(2, '0');
                eve.appendChild(n);
            } else {
                eve.innerHTML += '<div class="empty-tiro">Sin datos</div>';
            }
            card.appendChild(eve);
            elements.daysContainer.appendChild(card);
        }
    }

    function updateRecentNumbersDisplay() {
        elements.recentNumbersDiv.innerHTML = '';
        const recents = registroHistorial.slice(0, 8);
        if (recents.length === 0) {
            elements.recentNumbersDiv.innerHTML = '<div class="empty-recent">No hay números registrados aún</div>';
            return;
        }
        recents.forEach((r, i) => {
            const d = document.createElement('div');
            d.className = 'recent-number';
            if (i === 0) d.classList.add('most-recent');
            d.innerHTML = `<div>${r.number.toString().padStart(2, '0')}</div><div class="day">${daysOfWeek[r.day].substring(0, 3)}</div>`;
            elements.recentNumbersDiv.appendChild(d);
        });
    }

    // ====================== GUARDAR ======================
    function saveTiro() {
        const week = parseInt(elements.weekSelect.value);
        const day = parseInt(elements.daySelect.value);
        const time = elements.timeSelect.value;
        const number = parseInt(elements.tiroNumberInput.value);
        if (isNaN(number) || number < 0 || number > 99) {
            showToast('Número inválido (0-99)', 'error');
            return;
        }
        const slot = lotteryData['week' + week][day][time];
        if (slot !== null && slot !== undefined) {
            showToast(`Ya existe número ${slot.toString().padStart(2,'0')} para ${daysOfWeek[day]} - ${time === 'morning' ? 'Mañana' : 'Noche'}`, 'error');
            return;
        }
        lotteryData['week' + week][day][time] = number;
        const registro = { number, week, day, time, timestamp: new Date().toISOString() };
        registroHistorial.unshift(registro);
        checkForBingo(registro);
        verificarAciertoSumaResta(number);
        saveData();
        updateRecentNumbersDisplay();
        renderWeek(currentWeek);
        elements.tiroNumberInput.value = '';
        showToast(`¡Tiro guardado! Número ${number.toString().padStart(2, '0')}`);
        performAllAnalyses();
    }

    function switchWeek(week) {
        currentWeek = week;
        elements.week1Btn.classList.toggle('active', week === 1);
        elements.week2Btn.classList.toggle('active', week === 2);
        elements.weekTitle.textContent = 'Semana ' + week;
        renderWeek(week);
    }

    function clearAllData() {
        if (confirm('¿Eliminar TODOS los datos?')) {
            initializeEmptyData();
            registroHistorial = [];
            bingoChains = [];
            prediccionesRealizadas = [];
            aciertosSumaResta = [];
            lastAnalysisResults = null;
            saveData();
            updateRecentNumbersDisplay();
            renderWeek(currentWeek);
            clearHotTableHighlights();
            elements.analysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-chart-bar"></i><p>Registra números para ver el análisis</p></div>';
            elements.hotAnalysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>Analiza números para patrones</p></div>';
            elements.bingoResults.innerHTML = '<div class="empty-results"><i class="fas fa-trophy"></i><p>Sin BINGOS</p></div>';
            elements.operacionesResults.innerHTML = '<div class="empty-results"><i class="fas fa-calculator"></i><p>Registra números para ver operaciones</p></div>';
            elements.statsBox.style.display = 'none';
            elements.hotStats.style.display = 'none';
            elements.bingoStats.style.display = 'none';
            elements.operacionesStats.style.display = 'none';
            showToast('Datos eliminados');
        }
    }

    // ====================== TERCERAS FILAS ======================
    function findNumberInTable(num) {
        for (let r = 0; r < table1.length; r++) {
            for (let c = 0; c < table1[r].length; c++) {
                if (table1[r][c] === num) return { row: r, col: c };
            }
        }
        return null;
    }

    function getThirdRowWithCircularLogic(startRow, dir) {
        let target = dir === 'up' ? startRow - 3 : startRow + 3;
        if (dir === 'up' && target < 0) target = table1.length + target;
        if (dir === 'down' && target >= table1.length) target = target - table1.length;
        if (target < 0) target = 0;
        if (target >= table1.length) target = table1.length - 1;
        return { row: target, numbers: [...table1[target]] };
    }

    function performThirdRowAnalysis() {
        const recent = registroHistorial.slice(0, 4).map(r => r.number);
        if (recent.length === 0) {
            elements.analysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-chart-bar"></i><p>Registra números para análisis</p></div>';
            elements.statsBox.style.display = 'none';
            return;
        }
        lastAnalysisResults = { thirdRowUpResults: [], thirdRowDownResults: [] };
        let allUp = [], allDown = [];
        recent.forEach((num, idx) => {
            const found = findNumberInTable(num);
            if (found) {
                const up = getThirdRowWithCircularLogic(found.row, 'up');
                const down = getThirdRowWithCircularLogic(found.row, 'down');
                lastAnalysisResults.thirdRowUpResults.push({ sourceNumber: num, sourceOrder: idx + 1, row: up.row, numbers: up.numbers });
                lastAnalysisResults.thirdRowDownResults.push({ sourceNumber: num, sourceOrder: idx + 1, row: down.row, numbers: down.numbers });
                allUp.push(...up.numbers);
                allDown.push(...down.numbers);
            }
        });
        elements.analysisResults.innerHTML = '';
        elements.statsBox.style.display = 'block';
        const header = document.createElement('div');
        header.className = 'result-group';
        header.style.borderLeftColor = '#6366f1';
        header.innerHTML = `<h4><i class="fas fa-robot"></i> Análisis de Terceras Filas</h4><div class="source-info"><i class="fas fa-database"></i><strong>Analizados:</strong> ${recent.map(n => n.toString().padStart(2, '0')).join(', ')}</div>`;
        elements.analysisResults.appendChild(header);
        if (allUp.length) {
            const upSec = document.createElement('div');
            upSec.className = 'result-group horizontal-up';
            const uniq = [...new Set(allUp)].sort((a, b) => a - b);
            upSec.innerHTML = `<h4><i class="fas fa-arrow-up"></i> Terceras Filas ARRIBA</h4><div class="numbers-grid">${uniq.map(n => `<div class="number-item horizontal-up">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
            elements.analysisResults.appendChild(upSec);
        }
        if (allDown.length) {
            const downSec = document.createElement('div');
            downSec.className = 'result-group horizontal-down';
            const uniq = [...new Set(allDown)].sort((a, b) => a - b);
            downSec.innerHTML = `<h4><i class="fas fa-arrow-down"></i> Terceras Filas ABAJO</h4><div class="numbers-grid">${uniq.map(n => `<div class="number-item horizontal-down">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
            elements.analysisResults.appendChild(downSec);
        }
        const totalUp = [...new Set(allUp)];
        const totalDown = [...new Set(allDown)];
        const totalAll = [...new Set([...totalUp, ...totalDown])];
        elements.statNumbersCount.textContent = recent.length + ' números';
        elements.statUpCount.textContent = totalUp.length + ' números';
        elements.statDownCount.textContent = totalDown.length + ' números';
        elements.statTotalUnique.textContent = totalAll.length + ' números';
    }

    // ====================== CALIENTES ======================
    function generateHotTable() {
        elements.hotTable.innerHTML = '';
        hotTable11x11.forEach((row, r) => {
            const tr = document.createElement('tr');
            row.forEach((num, c) => {
                const td = document.createElement('td');
                if (num === null) {
                    td.className = 'empty';
                    td.innerHTML = '&nbsp;';
                } else {
                    td.textContent = num.toString().padStart(2, '0');
                    td.title = 'Fila ' + (r + 1) + ', Col ' + (c + 1);
                }
                tr.appendChild(td);
            });
            elements.hotTable.appendChild(tr);
        });
    }

    function findNumberInHotTable(num) {
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 11; c++) {
                if (hotTable11x11[r][c] === num) return { row: r, col: c };
            }
        }
        return null;
    }

    function highlightHotCell(row, col, cls) {
        const cell = document.querySelector(`#hotTable tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
        if (cell && !cell.classList.contains('empty')) cell.classList.add(cls);
    }

    function clearHotTableHighlights() {
        document.querySelectorAll('#hotTable td').forEach(cell => {
            cell.className = '';
            if (!cell.textContent.trim()) cell.classList.add('empty');
        });
    }

    function calculateLineStrength(count, total) {
        const p = count / total;
        if (p >= 0.5) return 0.9;
        if (p >= 0.3) return 0.7;
        return 0.5;
    }

    function calculatePositionPriority(row, col, existing) {
        let min = Infinity;
        existing.forEach(p => {
            const d = Math.abs(row - p.row) + Math.abs(col - p.col);
            if (d < min) min = d;
        });
        return Math.max(0, 3 - min);
    }

    function countLinesThroughCell(row, col, positions) {
        let c = 0;
        if (positions.some(p => p.row === row)) c++;
        if (positions.some(p => p.col === col)) c++;
        if (positions.some(p => p.row - p.col === row - col)) c++;
        if (positions.some(p => p.row + p.col === row + col)) c++;
        return c;
    }

    function findMultiLineNumbers(positions) {
        const cand = [];
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 11; c++) {
                const n = hotTable11x11[r][c];
                if (n !== null && !positions.find(p => p.number === n)) {
                    const lines = countLinesThroughCell(r, c, positions);
                    if (lines >= 2) cand.push({ number: n, row: r, col: c, linesCount: lines });
                }
            }
        }
        return cand.sort((a, b) => b.linesCount - a.linesCount);
    }

    function calculateClusterCenter(cluster) {
        const avgR = cluster.reduce((s, p) => s + p.row, 0) / cluster.length;
        const avgC = cluster.reduce((s, p) => s + p.col, 0) / cluster.length;
        return { row: Math.round(avgR), col: Math.round(avgC) };
    }

    function findNumbersAroundCluster(cluster) {
        const nums = [];
        const visited = new Set();
        cluster.forEach(p => visited.add(p.row + ',' + p.col));
        cluster.forEach(p => {
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const nr = p.row + dr;
                    const nc = p.col + dc;
                    if (nr >= 0 && nr < 11 && nc >= 0 && nc < 11) {
                        const key = nr + ',' + nc;
                        const num = hotTable11x11[nr][nc];
                        if (num !== null && !visited.has(key) && !cluster.find(cp => cp.number === num)) {
                            visited.add(key);
                            nums.push({ number: num, row: nr, col: nc, distance: Math.abs(dr) + Math.abs(dc) });
                        }
                    }
                }
            }
        });
        return nums.sort((a, b) => a.distance - b.distance);
    }

    function findBasicLines(positions, lines) {
        const rowGroups = {};
        const colGroups = {};
        positions.forEach(p => {
            if (!rowGroups[p.row]) rowGroups[p.row] = [];
            rowGroups[p.row].push(p);
            if (!colGroups[p.col]) colGroups[p.col] = [];
            colGroups[p.col].push(p);
        });
        Object.keys(rowGroups).forEach(row => {
            const rp = rowGroups[row];
            if (rp.length >= 2) {
                const rowData = hotTable11x11[row];
                const recs = [];
                const strength = calculateLineStrength(rp.length, 11);
                for (let c = 0; c < rowData.length; c++) {
                    const num = rowData[c];
                    if (num !== null && !positions.find(p => p.number === num)) {
                        recs.push({ number: num, row: parseInt(row), col: c, type: 'horizontal', strength, priority: calculatePositionPriority(row, c, rp) });
                    }
                }
                if (recs.length) {
                    lines.horizontal.push({ row: parseInt(row), positions: rp, recommendedNumbers: recs, count: rp.length, strength, completedPercentage: (rp.length / 11) * 100 });
                    rowData.forEach((num, c) => {
                        if (num !== null) highlightHotCell(parseInt(row), c, 'horizontal');
                    });
                }
            }
        });
        Object.keys(colGroups).forEach(col => {
            const cp = colGroups[col];
            if (cp.length >= 2) {
                const recs = [];
                const strength = calculateLineStrength(cp.length, 11);
                for (let r = 0; r < 11; r++) {
                    const num = hotTable11x11[r][col];
                    if (num !== null && !positions.find(p => p.number === num)) {
                        recs.push({ number: num, row: r, col: parseInt(col), type: 'vertical', strength, priority: calculatePositionPriority(r, parseInt(col), cp) });
                    }
                }
                if (recs.length) {
                    lines.vertical.push({ col: parseInt(col), positions: cp, recommendedNumbers: recs, count: cp.length, strength, completedPercentage: (cp.length / 11) * 100 });
                    for (let r = 0; r < 11; r++) {
                        if (hotTable11x11[r][col] !== null) highlightHotCell(r, parseInt(col), 'vertical');
                    }
                }
            }
        });
        const mainDiag = positions.filter(p => p.row === p.col);
        if (mainDiag.length >= 2) {
            const recs = [];
            const strength = calculateLineStrength(mainDiag.length, 11);
            for (let i = 0; i < 11; i++) {
                const num = hotTable11x11[i][i];
                if (num !== null && !positions.find(p => p.number === num)) {
                    recs.push({ number: num, row: i, col: i, type: 'diagonal', strength, priority: calculatePositionPriority(i, i, mainDiag) });
                }
            }
            if (recs.length) {
                lines.diagonal.push({ type: 'main', positions: mainDiag, recommendedNumbers: recs, count: mainDiag.length, strength, completedPercentage: (mainDiag.length / 11) * 100 });
                for (let i = 0; i < 11; i++) {
                    if (hotTable11x11[i][i] !== null) highlightHotCell(i, i, 'diagonal');
                }
            }
        }
        const secDiag = positions.filter(p => p.row + p.col === 10);
        if (secDiag.length >= 2) {
            const recs = [];
            const strength = calculateLineStrength(secDiag.length, 11);
            for (let i = 0; i < 11; i++) {
                const j = 10 - i;
                const num = hotTable11x11[i][j];
                if (num !== null && !positions.find(p => p.number === num)) {
                    recs.push({ number: num, row: i, col: j, type: 'diagonal', strength, priority: calculatePositionPriority(i, j, secDiag) });
                }
            }
            if (recs.length) {
                lines.diagonal.push({ type: 'secondary', positions: secDiag, recommendedNumbers: recs, count: secDiag.length, strength, completedPercentage: (secDiag.length / 11) * 100 });
                for (let i = 0; i < 11; i++) {
                    const j = 10 - i;
                    if (hotTable11x11[i][j] !== null) highlightHotCell(i, j, 'diagonal');
                }
            }
        }
    }

    function findIntersections(lines) {
        const all = [];
        lines.horizontal.forEach(h => h.recommendedNumbers.forEach(hn => {
            lines.vertical.forEach(v => v.recommendedNumbers.forEach(vn => {
                if (hn.row === vn.row && hn.col === vn.col) {
                    all.push({ ...hn, type: 'intersection', strength: (hn.strength + vn.strength) / 2, priority: Math.max(hn.priority, vn.priority) + 0.5 });
                }
            }));
        }));
        if (all.length) {
            const uniq = [];
            all.forEach(rec => {
                const exist = uniq.find(i => i.number === rec.number);
                if (exist) {
                    exist.strength = Math.max(exist.strength, rec.strength);
                    exist.priority = Math.max(exist.priority, rec.priority);
                } else {
                    uniq.push(rec);
                }
            });
            lines.intersections = uniq.sort((a, b) => b.priority - a.priority);
        }
    }

    function findCompletionPatterns(positions, lines) {
        const pats = [];
        [...lines.horizontal, ...lines.vertical, ...lines.diagonal].forEach(line => {
            if (line.completedPercentage >= 80) {
                pats.push({ type: 'almost_complete', line, missingCount: 11 - line.count, completion: line.completedPercentage });
            }
        });
        const multi = findMultiLineNumbers(positions);
        if (multi.length) pats.push({ type: 'multi_line', numbers: multi, description: multi.length + ' números multi-línea' });
        lines.patterns = pats;
    }

    function findClusters(positions, lines) {
        if (positions.length < 3) return;
        const clusters = [];
        const visited = new Set();
        positions.forEach(pos => {
            if (visited.has(pos.row + ',' + pos.col)) return;
            const cluster = [];
            const queue = [pos];
            while (queue.length) {
                const curr = queue.shift();
                const key = curr.row + ',' + curr.col;
                if (visited.has(key)) continue;
                visited.add(key);
                cluster.push(curr);
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = curr.row + dr;
                        const nc = curr.col + dc;
                        if (nr >= 0 && nr < 11 && nc >= 0 && nc < 11) {
                            const nb = positions.find(p => p.row === nr && p.col === nc);
                            if (nb && !visited.has(nr + ',' + nc)) queue.push(nb);
                        }
                    }
                }
            }
            if (cluster.length >= 3) {
                clusters.push({ positions: cluster, size: cluster.length, center: calculateClusterCenter(cluster), recommendedNumbers: findNumbersAroundCluster(cluster) });
            }
        });
        lines.clusters = clusters;
    }

    function findLinesWithPatterns(recentNumbers) {
        const positions = [];
        recentNumbers.forEach(n => {
            const pos = findNumberInHotTable(n);
            if (pos) positions.push({ ...pos, number: n });
        });
        const lines = { horizontal: [], vertical: [], diagonal: [], intersections: [], patterns: [], clusters: [] };
        findBasicLines(positions, lines);
        findIntersections(lines);
        findCompletionPatterns(positions, lines);
        findClusters(positions, lines);
        return lines;
    }

    function prioritizeNumbers(numbers, lines) {
        const scores = {};
        numbers.forEach(num => {
            scores[num] = 0;
            if (lines.intersections.find(i => i.number === num)) scores[num] += 10;
            lines.patterns.forEach(p => {
                if (p.type === 'almost_complete' && p.line.recommendedNumbers.find(r => r.number === num)) scores[num] += 8;
                if (p.type === 'multi_line' && p.numbers.find(n => n.number === num)) scores[num] += 7;
            });
            [...lines.horizontal, ...lines.vertical, ...lines.diagonal].forEach(line => {
                if (line.recommendedNumbers.find(r => r.number === num)) scores[num] += line.strength * 5;
            });
            if (lines.clusters) {
                lines.clusters.forEach(cl => {
                    if (cl.recommendedNumbers.find(r => r.number === num)) scores[num] += 3;
                });
            }
        });
        return numbers.sort((a, b) => scores[b] - scores[a]);
    }

    function displayHotResults(lines, recentNumbers) {
        const allLines = [...lines.horizontal, ...lines.vertical, ...lines.diagonal];
        const hasPatterns = lines.intersections.length > 0 || lines.patterns.length > 0 || (lines.clusters && lines.clusters.length > 0);
        if (allLines.length === 0 && !hasPatterns) {
            elements.hotAnalysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>No se encontraron patrones calientes</p></div>';
            elements.hotStats.style.display = 'none';
            return;
        }
        elements.hotAnalysisResults.innerHTML = '';
        elements.hotStats.style.display = 'flex';
        let allRecNumbers = [];
        let totalLines = 0;
        allLines.forEach(line => {
            line.recommendedNumbers.forEach(rec => allRecNumbers.push(rec.number));
            totalLines++;
        });
        lines.intersections.forEach(rec => allRecNumbers.push(rec.number));
        lines.patterns.forEach(p => {
            if (p.type === 'multi_line') p.numbers.forEach(n => allRecNumbers.push(n.number));
        });
        if (lines.clusters) {
            lines.clusters.forEach(cl => cl.recommendedNumbers.forEach(rec => allRecNumbers.push(rec.number)));
        }
        const uniqueRec = [...new Set(allRecNumbers)];
        elements.hotLinesFound.textContent = totalLines + lines.intersections.length;
        elements.hotNumbersRecommended.textContent = uniqueRec.length;
        if (allLines.length) {
            const basic = document.createElement('div');
            basic.className = 'hot-line-group horizontal';
            basic.innerHTML = `<h4><i class="fas fa-layer-group"></i> Líneas Básicas (${totalLines})</h4><p style="color:var(--text-secondary);margin-bottom:15px;">Líneas con 2+ números</p>`;
            allLines.forEach(line => {
                const lineNumbers = line.positions.map(p => p.number.toString().padStart(2, '0')).join(', ');
                const recs = [...new Set(line.recommendedNumbers.map(r => r.number))].sort((a, b) => a - b);
                let typeText = line.type === 'horizontal' ? 'Horizontal - Fila ' + (line.row + 1) : (line.type === 'vertical' ? 'Vertical - Columna ' + (line.col + 1) : 'Diagonal ' + (line.type === 'main' ? 'Principal' : 'Secundaria'));
                const div = document.createElement('div');
                div.style.marginBottom = '20px';
                div.style.padding = '15px';
                div.style.backgroundColor = 'var(--slot-bg)';
                div.style.borderRadius = '12px';
                div.innerHTML = `<div style="font-weight:700;color:var(--text-primary);">${typeText} (${line.count} nums - ${line.completedPercentage.toFixed(1)}%)</div><div style="margin:8px 0;color:var(--text-secondary);"><strong>En línea:</strong> ${lineNumbers}</div><div class="hot-numbers-grid">${recs.map(n => `<div class="hot-number-item ${line.type}">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
                basic.appendChild(div);
            });
            elements.hotAnalysisResults.appendChild(basic);
        }
        if (lines.intersections.length) {
            const inter = document.createElement('div');
            inter.className = 'hot-line-group vertical';
            inter.style.borderLeftColor = '#f97316';
            const nums = lines.intersections.map(i => i.number).sort((a, b) => a - b);
            inter.innerHTML = `<h4><i class="fas fa-crosshairs"></i> Intersecciones Clave (${lines.intersections.length})</h4><p style="color:var(--text-secondary);margin-bottom:15px;">Alta probabilidad</p><div class="hot-numbers-grid">${nums.map(n => `<div class="hot-number-item" style="background: linear-gradient(135deg, #f97316, #ea580c);">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
            elements.hotAnalysisResults.appendChild(inter);
        }
        if (lines.patterns.length) {
            const patSec = document.createElement('div');
            patSec.className = 'hot-line-group diagonal';
            patSec.style.borderLeftColor = '#06b6d4';
            patSec.innerHTML = '<h4><i class="fas fa-chart-line"></i> Patrones Detectados</h4>';
            lines.patterns.forEach(p => {
                const div = document.createElement('div');
                div.style.marginBottom = '15px';
                div.style.padding = '15px';
                div.style.backgroundColor = 'var(--slot-bg)';
                div.style.borderRadius = '12px';
                if (p.type === 'almost_complete') {
                    div.innerHTML = `<div style="font-weight:700;color:var(--text-primary);"><i class="fas fa-tachometer-alt" style="color:#06b6d4;"></i> Línea Casi Completa</div><div>Completado: ${p.completion.toFixed(1)}%</div><div>Faltan: ${p.missingCount} números</div>`;
                } else if (p.type === 'multi_line') {
                    const nums = p.numbers.map(n => n.number).sort((a, b) => a - b);
                    div.innerHTML = `<div style="font-weight:700;color:var(--text-primary);"><i class="fas fa-project-diagram" style="color:#06b6d4;"></i> Números Multi-Línea</div><div class="hot-numbers-grid">${nums.map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
                }
                patSec.appendChild(div);
            });
            elements.hotAnalysisResults.appendChild(patSec);
        }
        if (lines.clusters && lines.clusters.length) {
            const clusSec = document.createElement('div');
            clusSec.className = 'hot-line-group';
            clusSec.style.borderLeftColor = '#ec4899';
            clusSec.innerHTML = `<h4><i class="fas fa-object-group"></i> Clusters (${lines.clusters.length})</h4><p style="color:var(--text-secondary);margin-bottom:15px;">Zonas calientes</p>`;
            lines.clusters.forEach((cl, idx) => {
                const clusDiv = document.createElement('div');
                clusDiv.style.marginBottom = '20px';
                clusDiv.style.padding = '15px';
                clusDiv.style.backgroundColor = 'var(--slot-bg)';
                clusDiv.style.borderRadius = '12px';
                const clusterNums = cl.positions.map(p => p.number.toString().padStart(2, '0')).join(', ');
                const recs = [...new Set(cl.recommendedNumbers.map(r => r.number))].slice(0, 6).sort((a, b) => a - b);
                clusDiv.innerHTML = `<div style="font-weight:700;color:var(--text-primary);"><i class="fas fa-dot-circle" style="color:#ec4899;"></i> Cluster ${idx+1} (${cl.size} números)</div><div style="color:var(--text-secondary);">Números: ${clusterNums}</div><div class="hot-numbers-grid">${recs.map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#ec4899,#db2777);">${n.toString().padStart(2, '0')}</div>`).join('')}</div>`;
                clusSec.appendChild(clusDiv);
            });
            elements.hotAnalysisResults.appendChild(clusSec);
        }
        const summary = document.createElement('div');
        summary.className = 'hot-line-group';
        summary.style.borderLeftColor = '#10b981';
        const prioritized = prioritizeNumbers(uniqueRec, lines);
        summary.innerHTML = `<h4><i class="fas fa-star"></i> Resumen Prioritarios</h4><div style="margin-bottom:15px;">Total únicos: ${uniqueRec.length}</div><div style="margin-bottom:15px;font-weight:600;">Top 15:</div><div class="hot-numbers-grid">${prioritized.slice(0, 15).map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#10b981,#059669);">${n.toString().padStart(2, '0')}</div>`).join('')}</div><div style="margin-top:20px;font-size:0.9em;color:var(--text-secondary);"><i class="fas fa-lightbulb" style="color:#f59e0b;"></i> Orden: Intersecciones > Casi completas > Multi-línea > Fuerza</div>`;
        elements.hotAnalysisResults.appendChild(summary);
    }

    function analyzeHotNumbers() {
        const recent = registroHistorial.slice(0, 15).map(r => r.number);
        clearHotTableHighlights();
        if (recent.length < 2) {
            elements.hotAnalysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>Necesitas al menos 2 números</p></div>';
            elements.hotStats.style.display = 'none';
            return;
        }
        recent.forEach(n => {
            const pos = findNumberInHotTable(n);
            if (pos) highlightHotCell(pos.row, pos.col, 'recent');
        });
        const lines = findLinesWithPatterns(recent);
        displayHotResults(lines, recent);
    }

    // ====================== SUMAS / RESTAS ======================
    function generarPredicciones(ultimos) {
        const nuevas = [];
        for (let num of ultimos) {
            for (let op of operadores) {
                const suma = ajustarMod100(num + op);
                const resta = ajustarMod100(num - op);
                nuevas.push({
                    numeroPredicho: suma,
                    operacionTexto: `${num} + ${op} = ${suma.toString().padStart(2, '0')}${(num + op) !== suma ? ' (' + (num + op) + ')' : ''}`,
                    desdeNumero: num,
                    operador: op,
                    tipo: 'suma'
                });
                nuevas.push({
                    numeroPredicho: resta,
                    operacionTexto: `${num} - ${op} = ${resta.toString().padStart(2, '0')}${(num - op) !== resta ? ' (' + (num - op) + ')' : ''}`,
                    desdeNumero: num,
                    operador: op,
                    tipo: 'resta'
                });
            }
        }
        const unique = [];
        const seen = new Set();
        for (let p of nuevas) {
            const key = `${p.desdeNumero}_${p.operador}_${p.tipo}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(p);
            }
        }
        return unique;
    }

    function verificarAciertoSumaResta(nuevoNumero) {
        const encontrados = [];
        for (let p of prediccionesRealizadas) {
            if (p.numeroPredicho === nuevoNumero) encontrados.push(p);
        }
        if (encontrados.length) {
            for (let a of encontrados) {
                aciertosSumaResta.unshift({ ...a, numeroAcertado: nuevoNumero, fechaAcierto: new Date().toISOString() });
                if (aciertosSumaResta.length > 30) aciertosSumaResta.pop();
                showToast('✨ ¡ACERTO POR SUMA/RESTA! ' + a.operacionTexto, 'success');
            }
            saveData();
            actualizarPanelOperaciones();
        }
    }

    function actualizarPanelOperaciones() {
        const ultimos = registroHistorial.slice(0, 4).map(r => r.number);
        if (ultimos.length === 0) {
            elements.operacionesResults.innerHTML = '<div class="empty-results"><i class="fas fa-calculator"></i><p>Registra números para ver las operaciones de suma y resta</p></div>';
            elements.operacionesStats.style.display = 'none';
            return;
        }
        const nuevas = generarPredicciones(ultimos);
        for (let p of nuevas) {
            const existe = prediccionesRealizadas.some(x => x.numeroPredicho === p.numeroPredicho && x.desdeNumero === p.desdeNumero && x.operador === p.operador && x.tipo === p.tipo);
            if (!existe) prediccionesRealizadas.push(p);
        }
        saveData();

        let html = `<div class="result-group" style="border-left-color: var(--accent);"><h4><i class="fas fa-chart-line"></i> Últimos 4: ${ultimos.map(n => n.toString().padStart(2, '0')).join(' → ')}</h4></div>`;
        for (let num of ultimos) {
            const ops = [];
            for (let op of operadores) {
                const suma = ajustarMod100(num + op);
                const resta = ajustarMod100(num - op);
                const sHit = aciertosSumaResta.some(a => a.numeroPredicho === suma && a.desdeNumero === num && a.operador === op && a.tipo === 'suma');
                const rHit = aciertosSumaResta.some(a => a.numeroPredicho === resta && a.desdeNumero === num && a.operador === op && a.tipo === 'resta');
                ops.push({ operacion: `${num} + ${op} = ${suma.toString().padStart(2, '0')}${(num + op) !== suma ? ' (' + (num + op) + ')' : ''}`, resultado: suma, hit: sHit });
                ops.push({ operacion: `${num} - ${op} = ${resta.toString().padStart(2, '0')}${(num - op) !== resta ? ' (' + (num - op) + ')' : ''}`, resultado: resta, hit: rHit });
            }
            ops.sort((a, b) => parseInt(a.operacion.split(' ')[2]) - parseInt(b.operacion.split(' ')[2]));
            html += `<div class="op-card"><div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;border-bottom:2px solid var(--glass-border);padding-bottom:10px;"><span class="base-num">${num.toString().padStart(2, '0')}</span><span style="color:var(--text-secondary);font-size:0.8rem;">Número base</span></div><table class="op-table"><tbody>${ops.map(op => `<tr><td>${op.operacion}</td><td class="${op.hit ? 'hit' : ''}">${op.resultado.toString().padStart(2, '0')}${op.hit ? ' <span class="badge-hit">✔️ acertado</span>' : ''}</td></tr>`).join('')}</tbody></table></div>`;
        }
        elements.operacionesResults.innerHTML = html;
        elements.operacionesStats.style.display = 'block';
        let aHtml = '';
        if (aciertosSumaResta.length === 0) {
            aHtml = '<div style="color:var(--text-secondary);">Sin aciertos aún</div>';
        } else {
            aciertosSumaResta.slice(0, 10).forEach(a => {
                aHtml += `<div style="padding:6px 0;border-bottom:1px solid var(--glass-border);">🎯 ${a.operacionTexto} → ${a.numeroAcertado.toString().padStart(2, '0')} (${new Date(a.fechaAcierto).toLocaleDateString()})</div>`;
            });
        }
        elements.aciertosList.innerHTML = aHtml;
    }

    // ====================== BINGO ======================
    function checkForBingo(newPlay) {
        if (!lastAnalysisResults || registroHistorial.length < 2) return;
        let isBingo = false;
        let sourceInfo = null;
        lastAnalysisResults.thirdRowUpResults.forEach(res => {
            if (res.numbers.includes(newPlay.number)) {
                isBingo = true;
                sourceInfo = { sourceNumber: res.sourceNumber, type: 'Tercera Fila ARRIBA' };
            }
        });
        if (!isBingo) {
            lastAnalysisResults.thirdRowDownResults.forEach(res => {
                if (res.numbers.includes(newPlay.number)) {
                    isBingo = true;
                    sourceInfo = { sourceNumber: res.sourceNumber, type: 'Tercera Fila ABAJO' };
                }
            });
        }
        if (isBingo && sourceInfo) {
            const bingo = { number: newPlay.number, sourceNumber: sourceInfo.sourceNumber, type: sourceInfo.type, date: new Date().toISOString(), week: newPlay.week, day: newPlay.day, time: newPlay.time };
            bingoChains.unshift(bingo);
            if (bingoChains.length > 20) bingoChains = bingoChains.slice(0, 20);
            saveData();
            showToast('🎉 ¡BINGO! Número ' + newPlay.number.toString().padStart(2, '0') + ' acertado', 'success');
        }
    }

    function displayBingoResults() {
        if (bingoChains.length === 0) {
            elements.bingoResults.innerHTML = '<div class="empty-results"><i class="fas fa-trophy"></i><p>No hay BINGOS aún</p></div>';
            elements.bingoStats.style.display = 'none';
            return;
        }
        elements.bingoResults.innerHTML = '';
        elements.bingoStats.style.display = 'flex';
        const thisWeek = bingoChains.filter(b => new Date(b.date) > new Date(Date.now() - 7 * 86400000)).length;
        elements.bingoTotal.textContent = bingoChains.length;
        elements.bingoWeek.textContent = thisWeek;
        bingoChains.forEach((b, idx) => {
            const item = document.createElement('div');
            item.className = 'bingo-chain-item';
            const date = new Date(b.date);
            const dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            item.innerHTML = `<div style="display:flex;justify-content:space-between;"><div style="font-weight:700;"><i class="fas fa-trophy" style="color:#f59e0b;"></i> BINGO #${idx+1}</div><div style="background:rgba(245,158,11,0.15);padding:6px 12px;border-radius:8px;font-size:0.8rem;color:var(--text-secondary);">${dateStr}</div></div><div style="text-align:center;margin:15px 0;"><div style="font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${b.number.toString().padStart(2, '0')}</div><div style="color:var(--text-secondary);font-size:0.9rem;">¡Acertado!</div></div><div style="background:var(--slot-bg);padding:15px;border-radius:12px;"><div><strong>Origen:</strong> Nº ${b.sourceNumber.toString().padStart(2, '0')}</div><div><strong>Tipo:</strong> ${b.type}</div><div><strong>Cuando:</strong> ${daysOfWeek[b.day]} - ${b.time === 'morning' ? 'Mañana' : 'Noche'}</div></div>`;
            elements.bingoResults.appendChild(item);
        });
    }

    // ====================== EJECUTAR TODOS LOS ANÁLISIS ======================
    function performAllAnalyses() {
        performThirdRowAnalysis();
        analyzeHotNumbers();
        actualizarPanelOperaciones();
        displayBingoResults();
    }

    // ====================== EVENTOS Y TABS ======================
    function setupEventListeners() {
        elements.saveTiroBtn.addEventListener('click', saveTiro);
        elements.clearBtn.addEventListener('click', clearAllData);
        elements.refreshBtn.addEventListener('click', performAllAnalyses);
        elements.week1Btn.addEventListener('click', () => switchWeek(1));
        elements.week2Btn.addEventListener('click', () => switchWeek(2));
        elements.tiroNumberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') saveTiro();
        });
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    function setupAnalysisTabs() {
        elements.analysisTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const id = this.getAttribute('data-tab');
                elements.analysisTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                elements.numberAnalysis.classList.remove('active');
                elements.thirdRowAnalysis.classList.remove('active');
                elements.hotNumbersAnalysis.classList.remove('active');
                elements.operacionesAnalysis.classList.remove('active');
                elements.bingoAnalysis.classList.remove('active');
                if (id === 'number') elements.numberAnalysis.classList.add('active');
                else if (id === 'third-row') elements.thirdRowAnalysis.classList.add('active');
                else if (id === 'hot-numbers') elements.hotNumbersAnalysis.classList.add('active');
                else if (id === 'operaciones') elements.operacionesAnalysis.classList.add('active');
                else if (id === 'bingo') elements.bingoAnalysis.classList.add('active');
            });
        });
    }

    // ====================== INICIALIZACIÓN ======================
    function initApp() {
        createBackgroundParticles();
        loadTheme();
        loadData();
        setupEventListeners();
        generateHotTable();
        updateRecentNumbersDisplay();
        renderWeek(currentWeek);
        setupAnalysisTabs();
        performAllAnalyses();
    }

    initApp();
});
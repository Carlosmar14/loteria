document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    //   PRELOADER
    // ============================================================
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.style.display = 'none';
                }
            }, 1000);
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 400);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hidePreloader, 500);
        });
    }
    setTimeout(hidePreloader, 4000);

    // ============================================================
    //   TABLAS
    // ============================================================
    const table1 = [
        [47, 42, 67, 92],
        [20, 45, 70, 95],
        [13, 38, 63, 88],
        [6, 31, 56, 81],
        [15, 40, 65, 90],
        [16, 41, 66, 91],
        [2, 27, 52, 77],
        [18, 43, 68, 93],
        [19, 44, 69, 94],
        [12, 37, 62, 87],
        [10, 35, 60, 85],
        [22, 47, 72, 97],
        [4, 29, 54, 79],
        [5, 30, 55, 80],
        [14, 39, 64, 89],
        [7, 32, 57, 82],
        [8, 33, 58, 83],
        [25, 50, 75, 0],
        [1, 26, 51, 76],
        [21, 46, 71, 96],
        [3, 28, 53, 78],
        [23, 48, 73, 98],
        [24, 49, 74, 99],
        [9, 34, 59, 84],
        [11, 36, 61, 86]
    ];
    const hotTable11x11 = [
        [14, 46, 69, 1, null, 62, 89, 28, null, 57, 97],
        [66, 37, 99, 13, 79, 78, null, 17, 90, 70, null],
        [33, 60, 12, 98, 61, null, 71, 80, 10, null, 27],
        [0, 21, 2, 32, 91, 72, null, 77, 96, 54, 81],
        [47, 82, 53, 31, 56, null, 9, null, 35, 92, 4],
        [25, 68, null, 36, 7, 49, 83, 16, null, 59, null],
        [74, null, 40, null, 64, 11, 3, null, 41, 84, 75],
        [null, 76, 24, 58, 93, 20, 73, 45, 85, 8, null],
        [19, 87, 48, 50, 38, null, 30, 15, 63, null, 39],
        [29, 42, null, 34, 52, 43, 94, 51, 5, 55, 86],
        [95, 65, 44, 88, 6, 22, 67, null, 18, 23, 26]
    ];
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const operadores = [4, 7, 10, 11, 15, 20, 40];

    function ajustarMod100(v) { let r = v % 100; if (r < 0) r += 100; return r; }

    // ============================================================
    //   DECENAS Y TERMINALES MAPS
    // ============================================================
    const decenasMap = {
        '0': [0, 40],
        '1': [10, 60],
        '2': [20, 40, 70],
        '3': [30, 50, 80],
        '4': [20, 70],
        '5': [30, 80],
        '6': [90, 10],
        '7': [20, 40],
        '8': [30, 50],
        '9': [60, 40]
    };

    const terminalesMap = {
        '0': [5],
        '1': [4, 6, 9],
        '2': [7],
        '3': [5, 8],
        '4': [6, 9],
        '5': [3, 8],
        '6': [4, 9],
        '7': [2],
        '8': [3, 5],
        '9': [4, 6]
    };

    // ============================================================
    //   DATA
    // ============================================================
    let lotteryData = { week1: {}, week2: {} };
    let currentWeek = 1;
    let registroHistorial = [];
    let bingoChains = [];
    let lastAnalysisResults = null;
    let prediccionesRealizadas = [];
    let aciertosSumaResta = [];
    // Almacenar líneas calientes para usar en pronósticos
    let lastHotLines = null;

    // ============================================================
    //   DOM ELEMENTS
    // ============================================================
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
        hotResultsContainer: document.getElementById('hotResultsContainer'),
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
        decenasAnalysis: document.getElementById('decenasAnalysis'),
        pronosticosAnalysis: document.getElementById('pronosticosAnalysis'),
        pronosticosResults: document.getElementById('pronosticosResults'),
        pronosticosStats: document.getElementById('pronosticosStats'),
        pronosticoTotal: document.getElementById('pronosticoTotal'),
        pronosticoCalientes: document.getElementById('pronosticoCalientes'),
        pronosticoConfianza: document.getElementById('pronosticoConfianza'),
        operacionesResults: document.getElementById('operacionesResults'),
        operacionesStats: document.getElementById('operacionesStats'),
        aciertosList: document.getElementById('aciertosList'),
        decenasResults: document.getElementById('decenasResults'),
        decenasStats: document.getElementById('decenasStats'),
        decenasContent: document.getElementById('decenasContent'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        themeToggle: document.getElementById('themeToggle'),
        visitorCounter: document.getElementById('visitorCounter')
    };

    // ============================================================
    //   CONTADOR DE VISITAS POR IP
    // ============================================================
    function initVisitorCounter() {
        const counterEl = elements.visitorCounter;
        if (!counterEl) return;
        const storedIP = localStorage.getItem('visitor_ip');
        const storedCount = localStorage.getItem('visitor_count');
        if (storedIP) {
            counterEl.textContent = storedCount || '0';
            return;
        }
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                const ip = data.ip;
                localStorage.setItem('visitor_ip', ip);
                let newCount = parseInt(storedCount || '0') + 1;
                localStorage.setItem('visitor_count', String(newCount));
                counterEl.textContent = String(newCount);
            })
            .catch(() => {
                const fallback = 'fallback_' + Date.now();
                localStorage.setItem('visitor_ip', fallback);
                let newCount = parseInt(storedCount || '0') + 1;
                localStorage.setItem('visitor_count', String(newCount));
                counterEl.textContent = String(newCount);
            });
    }

    // ============================================================
    //   MODO OSCURO / CLARO
    // ============================================================
    function initTheme() {
        const savedTheme = localStorage.getItem('lotoPro_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('light-mode');
            elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        elements.themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('lotoPro_theme', 'light');
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('lotoPro_theme', 'dark');
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    // ============================================================
    //   HELPERS
    // ============================================================
    function createBackgroundParticles() {
        const container = document.getElementById('bgAnimation');
        for (let i = 0; i < 25; i++) {
            let s = document.createElement('span');
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDelay = Math.random() * 20 + 's';
            s.style.animationDuration = (12 + Math.random() * 12) + 's';
            container.appendChild(s);
        }
    }

    function showToast(msg, type = 'success') {
        elements.toastMessage.textContent = msg;
        elements.toast.className = 'toast show ' + type;
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
                            lotteryData[wk][d].morning = lotteryData[wk][d].morning.length ?
                                lotteryData[wk][d].morning[lotteryData[wk][d].morning.length - 1] : null;
                        }
                        if (Array.isArray(lotteryData[wk][d].evening)) {
                            lotteryData[wk][d].evening = lotteryData[wk][d].evening.length ?
                                lotteryData[wk][d].evening[lotteryData[wk][d].evening.length - 1] : null;
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
        if (saved) { lotteryData = JSON.parse(saved);
            migrateOldData(); } else initializeEmptyData();
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

    // ============================================================
    //   RENDER
    // ============================================================
    function renderWeek(week) {
        const wk = 'week' + week;
        elements.daysContainer.innerHTML = '';
        for (let d = 0; d < 7; d++) {
            const data = lotteryData[wk][d];
            const card = document.createElement('div');
            card.className = 'day-card';
            card.innerHTML = `<div class="day-name"><i class="fas fa-calendar-day"></i> ${daysOfWeek[d]}</div>`;
            const morn = document.createElement('div');
            morn.className = 'slot-row';
            if (data.morning !== null) {
                morn.innerHTML = `<span><i class="fas fa-sun" style="color:#f59e0b;"></i> Mañana</span>
                    <span class="slot-num">${data.morning.toString().padStart(2,'0')}</span>
                    <button class="slot-del" data-week="${week}" data-day="${d}" data-time="morning"><i class="fas fa-times-circle"></i></button>`;
            } else {
                morn.innerHTML = `<span><i class="fas fa-sun" style="color:#f59e0b;"></i> Mañana</span>
                    <span class="slot-num" style="background:transparent;border:1px dashed #4f46e5;">—</span>`;
            }
            card.appendChild(morn);
            const eve = document.createElement('div');
            eve.className = 'slot-row';
            if (data.evening !== null) {
                eve.innerHTML = `<span><i class="fas fa-moon" style="color:#6366f1;"></i> Noche</span>
                    <span class="slot-num">${data.evening.toString().padStart(2,'0')}</span>
                    <button class="slot-del" data-week="${week}" data-day="${d}" data-time="evening"><i class="fas fa-times-circle"></i></button>`;
            } else {
                eve.innerHTML = `<span><i class="fas fa-moon" style="color:#6366f1;"></i> Noche</span>
                    <span class="slot-num" style="background:transparent;border:1px dashed #4f46e5;">—</span>`;
            }
            card.appendChild(eve);
            elements.daysContainer.appendChild(card);
        }
        document.querySelectorAll('.slot-del').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const week = parseInt(this.dataset.week);
                const day = parseInt(this.dataset.day);
                const time = this.dataset.time;
                deleteNumber(week, day, time);
            });
        });
    }

    function deleteNumber(week, day, time) {
        const wk = 'week' + week;
        const num = lotteryData[wk][day][time];
        if (num === null) return;
        if (!confirm(`Eliminar ${num.toString().padStart(2,'0')} de ${daysOfWeek[day]} - ${time === 'morning' ? 'Mañana' : 'Noche'}?`)) return;
        lotteryData[wk][day][time] = null;
        const idx = registroHistorial.findIndex(h => h.week === week && h.day === day && h.time === time && h.number === num);
        if (idx !== -1) registroHistorial.splice(idx, 1);
        saveData();
        renderWeek(currentWeek);
        updateRecentNumbersDisplay();
        performAllAnalyses();
        showToast(`Número ${num.toString().padStart(2,'0')} eliminado`);
    }

    function updateRecentNumbersDisplay() {
        const container = elements.recentNumbersDiv;
        container.innerHTML = '';
        const recents = registroHistorial.slice(0, 8);
        if (recents.length === 0) {
            container.innerHTML = '<div class="empty-recent">No hay números registrados aún</div>';
            return;
        }
        recents.forEach((r, i) => {
            const div = document.createElement('div');
            div.className = 'recent-number' + (i === 0 ? ' most-recent' : '');
            div.innerHTML = `<span>${r.number.toString().padStart(2,'0')}</span>
                            <span class="day">${daysOfWeek[r.day].substring(0,3)}</span>`;
            container.appendChild(div);
        });
    }

    // ============================================================
    //   GUARDAR NUEVO TIRO
    // ============================================================
    function saveTiro() {
        const week = parseInt(elements.weekSelect.value);
        const day = parseInt(elements.daySelect.value);
        const time = elements.timeSelect.value;
        const number = parseInt(elements.tiroNumberInput.value);
        if (isNaN(number) || number < 0 || number > 99) {
            showToast('Número inválido (0-99)', 'error');
            return;
        }
        const wk = 'week' + week;
        if (lotteryData[wk][day][time] !== null) {
            showToast(`Ya existe ${lotteryData[wk][day][time].toString().padStart(2,'0')} en ese turno`, 'error');
            return;
        }
        lotteryData[wk][day][time] = number;
        const registro = { number, week, day, time, timestamp: new Date().toISOString() };
        registroHistorial.unshift(registro);
        checkForBingo(registro);
        verificarAciertoSumaResta(number);
        saveData();
        updateRecentNumbersDisplay();
        renderWeek(currentWeek);
        elements.tiroNumberInput.value = '';
        showToast(`¡Tiro guardado! Número ${number.toString().padStart(2,'0')}`);
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
        if (!confirm('⚠️ Eliminar TODOS los datos? No se puede deshacer.')) return;
        initializeEmptyData();
        registroHistorial = [];
        bingoChains = [];
        prediccionesRealizadas = [];
        aciertosSumaResta = [];
        lastAnalysisResults = null;
        lastHotLines = null;
        saveData();
        updateRecentNumbersDisplay();
        renderWeek(currentWeek);
        clearHotTableHighlights();
        elements.analysisResults.innerHTML = '<div class="empty-results"><i class="fas fa-chart-bar"></i><p>Registra números para ver el análisis</p></div>';
        elements.hotResultsContainer.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>Analiza números para patrones</p></div>';
        elements.bingoResults.innerHTML = '<div class="empty-results"><i class="fas fa-trophy"></i><p>Sin BINGOS</p></div>';
        elements.operacionesResults.innerHTML = '<div class="empty-results"><i class="fas fa-calculator"></i><p>Registra números para ver operaciones</p></div>';
        elements.decenasResults.innerHTML = '<div class="empty-results"><i class="fas fa-chart-bar"></i><p>Registra números para ver el análisis de decenas y terminales</p></div>';
        elements.pronosticosResults.innerHTML = '<div class="empty-results"><i class="fas fa-chart-line"></i><p>Registra números para generar pronósticos</p></div>';
        elements.statsBox.style.display = 'none';
        elements.hotStats.style.display = 'none';
        elements.bingoStats.style.display = 'none';
        elements.operacionesStats.style.display = 'none';
        elements.decenasStats.style.display = 'none';
        elements.pronosticosStats.style.display = 'none';
        showToast('Datos eliminados');
    }

    // ============================================================
    //   TERCERAS FILAS
    // ============================================================
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
        let allUp = [],
            allDown = [];
        recent.forEach((num, idx) => {
            let found = findNumberInTable(num);
            if (found) {
                let up = getThirdRowWithCircularLogic(found.row, 'up');
                let down = getThirdRowWithCircularLogic(found.row, 'down');
                lastAnalysisResults.thirdRowUpResults.push({ sourceNumber: num, sourceOrder: idx + 1, row: up.row, numbers: up.numbers });
                lastAnalysisResults.thirdRowDownResults.push({ sourceNumber: num, sourceOrder: idx + 1, row: down.row, numbers: down.numbers });
                allUp.push(...up.numbers);
                allDown.push(...down.numbers);
            }
        });
        elements.analysisResults.innerHTML = '';
        elements.statsBox.style.display = 'block';
        let header = document.createElement('div');
        header.className = 'result-group';
        header.style.borderLeftColor = '#6366f1';
        header.innerHTML = `<h4><i class="fas fa-robot"></i> Análisis de Terceras Filas</h4>
            <div class="source-info"><i class="fas fa-database"></i><strong>Analizados:</strong> ${recent.map(n=>n.toString().padStart(2,'0')).join(', ')}</div>`;
        elements.analysisResults.appendChild(header);
        if (allUp.length) {
            let upSec = document.createElement('div');
            upSec.className = 'result-group horizontal-up';
            let uniq = [...new Set(allUp)].sort((a, b) => a - b);
            upSec.innerHTML = `<h4><i class="fas fa-arrow-up"></i> Terceras Filas ARRIBA</h4>
                <div class="numbers-grid">${uniq.map(n=>`<div class="number-item horizontal-up">${n.toString().padStart(2,'0')}</div>`).join('')}</div>`;
            elements.analysisResults.appendChild(upSec);
        }
        if (allDown.length) {
            let downSec = document.createElement('div');
            downSec.className = 'result-group horizontal-down';
            let uniq = [...new Set(allDown)].sort((a, b) => a - b);
            downSec.innerHTML = `<h4><i class="fas fa-arrow-down"></i> Terceras Filas ABAJO</h4>
                <div class="numbers-grid">${uniq.map(n=>`<div class="number-item horizontal-down">${n.toString().padStart(2,'0')}</div>`).join('')}</div>`;
            elements.analysisResults.appendChild(downSec);
        }
        let totalUp = [...new Set(allUp)],
            totalDown = [...new Set(allDown)],
            totalAll = [...new Set([...totalUp, ...totalDown])];
        elements.statNumbersCount.textContent = `${recent.length} números`;
        elements.statUpCount.textContent = `${totalUp.length} números`;
        elements.statDownCount.textContent = `${totalDown.length} números`;
        elements.statTotalUnique.textContent = `${totalAll.length} números`;
    }

    // ============================================================
    //   NÚMEROS CALIENTES - VERSIÓN MEJORADA
    // ============================================================
    const lineColors = [
        { bg: 'rgba(16, 185, 129, 0.25)', border: '#10b981', highlight: 'highlight-green', label: '🟢' },
        { bg: 'rgba(59, 130, 246, 0.25)', border: '#3b82f6', highlight: 'highlight-blue', label: '🔵' },
        { bg: 'rgba(139, 92, 246, 0.25)', border: '#8b5cf6', highlight: 'highlight-purple', label: '🟣' },
        { bg: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b', highlight: 'highlight-orange', label: '🟠' },
        { bg: 'rgba(236, 72, 153, 0.25)', border: '#ec4899', highlight: 'highlight-pink', label: '🩷' },
        { bg: 'rgba(20, 184, 166, 0.25)', border: '#14b8a6', highlight: 'highlight-teal', label: '🩵' },
        { bg: 'rgba(234, 179, 8, 0.25)', border: '#eab308', highlight: 'highlight-yellow', label: '🟡' },
        { bg: 'rgba(239, 68, 68, 0.25)', border: '#ef4444', highlight: 'highlight-red', label: '🔴' },
    ];

    let selectedLineIndex = -1;
    let currentLinesData = [];

    function generateHotTable() {
        elements.hotTable.innerHTML = '';
        hotTable11x11.forEach((row, r) => {
            let tr = document.createElement('tr');
            row.forEach((num, c) => {
                let td = document.createElement('td');
                if (num === null) {
                    td.className = 'empty';
                    td.innerHTML = '&nbsp;';
                } else {
                    td.textContent = num.toString().padStart(2, '0');
                    td.dataset.row = r;
                    td.dataset.col = c;
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

    function clearHotTableHighlights() {
        document.querySelectorAll('#hotTable td').forEach(cell => {
            cell.className = '';
            if (!cell.textContent.trim()) cell.classList.add('empty');
        });
    }

    function highlightSelectedLine(lineIndex) {
        clearHotTableHighlights();
        const recent = registroHistorial.slice(0, 15).map(r => r.number);
        recent.forEach(n => {
            let pos = findNumberInHotTable(n);
            if (pos) {
                let cell = document.querySelector(`#hotTable tr:nth-child(${pos.row+1}) td:nth-child(${pos.col+1})`);
                if (cell && !cell.classList.contains('empty')) {
                    cell.classList.add('recent');
                }
            }
        });
        if (lineIndex < 0 || lineIndex >= currentLinesData.length) return;
        const line = currentLinesData[lineIndex];
        if (!line || !line.positions) return;
        const colorIndex = lineIndex % lineColors.length;
        const color = lineColors[colorIndex];
        const highlightClass = color.highlight;
        line.positions.forEach(pos => {
            let cell = document.querySelector(`#hotTable tr:nth-child(${pos.row+1}) td:nth-child(${pos.col+1})`);
            if (cell && !cell.classList.contains('empty')) {
                cell.classList.add(highlightClass);
                cell.classList.add('highlight-line');
                cell.classList.add('line-active');
            }
        });
    }

    function calculateLineStrength(count, total) {
        let p = count / total;
        if (p >= 0.5) return 0.9;
        if (p >= 0.3) return 0.7;
        return 0.5;
    }

    function calculatePositionPriority(row, col, existing) {
        let min = Infinity;
        existing.forEach(p => {
            let d = Math.abs(row - p.row) + Math.abs(col - p.col);
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
        let cand = [];
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 11; c++) {
                let n = hotTable11x11[r][c];
                if (n !== null && !positions.find(p => p.number === n)) {
                    let lines = countLinesThroughCell(r, c, positions);
                    if (lines >= 2) cand.push({ number: n, row: r, col: c, linesCount: lines });
                }
            }
        }
        return cand.sort((a, b) => b.linesCount - a.linesCount);
    }

    function calculateClusterCenter(cluster) {
        let avgR = cluster.reduce((s, p) => s + p.row, 0) / cluster.length;
        let avgC = cluster.reduce((s, p) => s + p.col, 0) / cluster.length;
        return { row: Math.round(avgR), col: Math.round(avgC) };
    }

    function findNumbersAroundCluster(cluster) {
        let nums = [],
            visited = new Set();
        cluster.forEach(p => visited.add(`${p.row},${p.col}`));
        cluster.forEach(p => {
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    let nr = p.row + dr,
                        nc = p.col + dc;
                    if (nr >= 0 && nr < 11 && nc >= 0 && nc < 11) {
                        let key = `${nr},${nc}`;
                        let num = hotTable11x11[nr][nc];
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
        let rowGroups = {},
            colGroups = {};
        positions.forEach(p => {
            if (!rowGroups[p.row]) rowGroups[p.row] = [];
            rowGroups[p.row].push(p);
            if (!colGroups[p.col]) colGroups[p.col] = [];
            colGroups[p.col].push(p);
        });
        let lineCounter = 0;
        Object.keys(rowGroups).forEach(row => {
            let rp = rowGroups[row];
            if (rp.length >= 2) {
                let rowData = hotTable11x11[row];
                let recs = [];
                let strength = calculateLineStrength(rp.length, 11);
                for (let c = 0; c < rowData.length; c++) {
                    let num = rowData[c];
                    if (num !== null && !positions.find(p => p.number === num)) {
                        recs.push({ number: num, row: parseInt(row), col: c, type: 'horizontal', strength, priority: calculatePositionPriority(row, c, rp) });
                    }
                }
                if (recs.length) {
                    lines.horizontal.push({
                        id: `H${++lineCounter}`,
                        row: parseInt(row),
                        positions: rp,
                        recommendedNumbers: recs,
                        count: rp.length,
                        strength,
                        completedPercentage: (rp.length / 11) * 100,
                        type: 'horizontal',
                        label: `Horizontal - Fila ${parseInt(row)+1}`,
                        lineType: 'horizontal'
                    });
                }
            }
        });
        Object.keys(colGroups).forEach(col => {
            let cp = colGroups[col];
            if (cp.length >= 2) {
                let recs = [];
                let strength = calculateLineStrength(cp.length, 11);
                for (let r = 0; r < 11; r++) {
                    let num = hotTable11x11[r][col];
                    if (num !== null && !positions.find(p => p.number === num)) {
                        recs.push({ number: num, row: r, col: parseInt(col), type: 'vertical', strength, priority: calculatePositionPriority(r, parseInt(col), cp) });
                    }
                }
                if (recs.length) {
                    lines.vertical.push({
                        id: `V${++lineCounter}`,
                        col: parseInt(col),
                        positions: cp,
                        recommendedNumbers: recs,
                        count: cp.length,
                        strength,
                        completedPercentage: (cp.length / 11) * 100,
                        type: 'vertical',
                        label: `Vertical - Columna ${parseInt(col)+1}`,
                        lineType: 'vertical'
                    });
                }
            }
        });
        let mainDiag = positions.filter(p => p.row === p.col);
        if (mainDiag.length >= 2) {
            let recs = [];
            let strength = calculateLineStrength(mainDiag.length, 11);
            for (let i = 0; i < 11; i++) {
                let num = hotTable11x11[i][i];
                if (num !== null && !positions.find(p => p.number === num)) {
                    recs.push({ number: num, row: i, col: i, type: 'diagonal', strength, priority: calculatePositionPriority(i, i, mainDiag) });
                }
            }
            if (recs.length) {
                lines.diagonal.push({
                    id: `D${++lineCounter}`,
                    type: 'main',
                    positions: mainDiag,
                    recommendedNumbers: recs,
                    count: mainDiag.length,
                    strength,
                    completedPercentage: (mainDiag.length / 11) * 100,
                    lineType: 'diagonal',
                    label: 'Diagonal Principal'
                });
            }
        }
        let secDiag = positions.filter(p => p.row + p.col === 10);
        if (secDiag.length >= 2) {
            let recs = [];
            let strength = calculateLineStrength(secDiag.length, 11);
            for (let i = 0; i < 11; i++) {
                let j = 10 - i;
                let num = hotTable11x11[i][j];
                if (num !== null && !positions.find(p => p.number === num)) {
                    recs.push({ number: num, row: i, col: j, type: 'diagonal', strength, priority: calculatePositionPriority(i, j, secDiag) });
                }
            }
            if (recs.length) {
                lines.diagonal.push({
                    id: `D${++lineCounter}`,
                    type: 'secondary',
                    positions: secDiag,
                    recommendedNumbers: recs,
                    count: secDiag.length,
                    strength,
                    completedPercentage: (secDiag.length / 11) * 100,
                    lineType: 'diagonal',
                    label: 'Diagonal Secundaria'
                });
            }
        }
    }

    function findIntersections(lines) {
        let all = [];
        lines.horizontal.forEach(h => h.recommendedNumbers.forEach(hn => {
            lines.vertical.forEach(v => v.recommendedNumbers.forEach(vn => {
                if (hn.row === vn.row && hn.col === vn.col) {
                    all.push({ ...hn, type: 'intersection', strength: (hn.strength + vn.strength) / 2, priority: Math.max(hn.priority, vn.priority) + 0.5 });
                }
            }));
        }));
        // También diagonales con horizontales y verticales
        lines.diagonal.forEach(d => d.recommendedNumbers.forEach(dn => {
            lines.horizontal.forEach(h => h.recommendedNumbers.forEach(hn => {
                if (dn.row === hn.row && dn.col === hn.col) {
                    all.push({ ...dn, type: 'intersection', strength: (dn.strength + hn.strength) / 2, priority: Math.max(dn.priority, hn.priority) + 0.5 });
                }
            }));
            lines.vertical.forEach(v => v.recommendedNumbers.forEach(vn => {
                if (dn.row === vn.row && dn.col === vn.col) {
                    all.push({ ...dn, type: 'intersection', strength: (dn.strength + vn.strength) / 2, priority: Math.max(dn.priority, vn.priority) + 0.5 });
                }
            }));
        }));
        if (all.length) {
            let uniq = [];
            all.forEach(rec => {
                let exist = uniq.find(i => i.number === rec.number);
                if (exist) {
                    exist.strength = Math.max(exist.strength, rec.strength);
                    exist.priority = Math.max(exist.priority, rec.priority);
                } else uniq.push(rec);
            });
            lines.intersections = uniq.sort((a, b) => b.priority - a.priority);
        }
    }

    function findCompletionPatterns(positions, lines) {
        let pats = [];
        [...lines.horizontal, ...lines.vertical, ...lines.diagonal].forEach(line => {
            if (line.completedPercentage >= 80) {
                pats.push({ type: 'almost_complete', line, missingCount: 11 - line.count, completion: line.completedPercentage });
            }
            // Líneas con bajo porcentaje (priorizar)
            if (line.completedPercentage <= 40 && line.count >= 2) {
                pats.push({ type: 'low_percentage', line, completion: line.completedPercentage, lineType: line.lineType || 'unknown' });
            }
        });
        let multi = findMultiLineNumbers(positions);
        if (multi.length) pats.push({ type: 'multi_line', numbers: multi, description: `${multi.length} números multi-línea` });
        lines.patterns = pats;
        // Guardar líneas para usar en pronósticos
        lastHotLines = lines;
    }

    function findClusters(positions, lines) {
        if (positions.length < 3) return;
        let clusters = [],
            visited = new Set();
        positions.forEach(pos => {
            if (visited.has(`${pos.row},${pos.col}`)) return;
            let cluster = [],
                queue = [pos];
            while (queue.length) {
                let curr = queue.shift();
                let key = `${curr.row},${curr.col}`;
                if (visited.has(key)) continue;
                visited.add(key);
                cluster.push(curr);
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        let nr = curr.row + dr,
                            nc = curr.col + dc;
                        if (nr >= 0 && nr < 11 && nc >= 0 && nc < 11) {
                            let nb = positions.find(p => p.row === nr && p.col === nc);
                            if (nb && !visited.has(`${nr},${nc}`)) queue.push(nb);
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
        let positions = [];
        recentNumbers.forEach(n => {
            let pos = findNumberInHotTable(n);
            if (pos) positions.push({ ...pos, number: n });
        });
        let lines = { horizontal: [], vertical: [], diagonal: [], intersections: [], patterns: [], clusters: [] };
        findBasicLines(positions, lines);
        findIntersections(lines);
        findCompletionPatterns(positions, lines);
        findClusters(positions, lines);
        return lines;
    }

    function prioritizeNumbers(numbers, lines) {
        let scores = {};
        numbers.forEach(num => {
            scores[num] = 0;
            // Intersecciones: alta prioridad
            if (lines.intersections.find(i => i.number === num)) scores[num] += 10;
            // Líneas con bajo porcentaje: prioridad media-alta
            lines.patterns.forEach(p => {
                if (p.type === 'low_percentage' && p.line.recommendedNumbers.find(r => r.number === num)) {
                    scores[num] += 9;
                }
                if (p.type === 'almost_complete' && p.line.recommendedNumbers.find(r => r.number === num)) scores[num] += 8;
                if (p.type === 'multi_line' && p.numbers.find(n => n.number === num)) scores[num] += 7;
            });
            [...lines.horizontal, ...lines.vertical, ...lines.diagonal].forEach(line => {
                if (line.recommendedNumbers.find(r => r.number === num)) {
                    // Priorizar líneas con menos porcentaje
                    let bonus = line.completedPercentage <= 40 ? 3 : 0;
                    scores[num] += (line.strength * 5) + bonus;
                }
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
        let allLines = [...lines.horizontal, ...lines.vertical, ...lines.diagonal];
        let hasPatterns = lines.intersections.length > 0 || lines.patterns.length > 0 || (lines.clusters && lines.clusters.length > 0);

        if (allLines.length === 0 && !hasPatterns) {
            elements.hotResultsContainer.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>No se encontraron patrones calientes</p></div>';
            elements.hotStats.style.display = 'none';
            return;
        }

        elements.hotResultsContainer.innerHTML = '';
        elements.hotStats.style.display = 'flex';

        let allRecNumbers = [],
            totalLines = 0;
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
        let uniqueRec = [...new Set(allRecNumbers)];
        elements.hotLinesFound.textContent = totalLines + lines.intersections.length;
        elements.hotNumbersRecommended.textContent = uniqueRec.length;

        currentLinesData = allLines;

        if (selectedLineIndex === -1 && allLines.length > 0) {
            selectedLineIndex = 0;
            highlightSelectedLine(0);
        }

        if (allLines.length) {
            let basic = document.createElement('div');
            basic.className = 'hot-line-group horizontal';
            basic.innerHTML = `<h4><i class="fas fa-layer-group"></i> Líneas Básicas (${totalLines})</h4>
                <p style="color:var(--text-color-secondary);margin-bottom:15px;font-size:0.85rem;">
                    🎯 Haz clic en una línea para verla resaltada en la tabla con su color único
                </p>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                    <span style="font-size:0.7rem;padding:2px 10px;border-radius:12px;background:#10b98122;border:1px solid #10b981;">🟢 Líneas</span>
                    <span style="font-size:0.7rem;padding:2px 10px;border-radius:12px;background:#3b82f622;border:1px solid #3b82f6;">🔵 Líneas</span>
                    <span style="font-size:0.7rem;padding:2px 10px;border-radius:12px;background:#8b5cf622;border:1px solid #8b5cf6;">🟣 Líneas</span>
                    <span style="font-size:0.7rem;padding:2px 10px;border-radius:12px;background:#f59e0b22;border:1px solid #f59e0b;">🟠 Líneas</span>
                    <span style="font-size:0.7rem;padding:2px 10px;border-radius:12px;background:#ec489922;border:1px solid #ec4899;">🩷 Líneas</span>
                </div>`;

            allLines.forEach((line, index) => {
                const colorIndex = index % lineColors.length;
                const color = lineColors[colorIndex];
                const isSelected = (selectedLineIndex === index);

                let lineNumbers = line.positions.map(p => p.number.toString().padStart(2, '0')).join(' · ');
                let recs = [...new Set(line.recommendedNumbers.map(r => r.number))].sort((a, b) => a - b);

                let iconMap = {
                    'horizontal': 'fa-arrows-left-right',
                    'vertical': 'fa-arrows-up-down',
                    'diagonal': 'fa-arrow-right'
                };
                let iconClass = iconMap[line.type] || 'fa-arrow-right';

                let tagClass = line.type === 'horizontal' ? 'horizontal-tag' :
                    (line.type === 'vertical' ? 'vertical-tag' : 'diagonal-tag');

                let lineId = line.id || `Línea ${index+1}`;
                let lineTypeLabel = line.type === 'horizontal' ? 'Horizontal' :
                    (line.type === 'vertical' ? 'Vertical' : 'Diagonal');
                let lineDetail = line.type === 'horizontal' ? `Fila ${line.row+1}` :
                    (line.type === 'vertical' ? `Columna ${line.col+1}` :
                        (line.type === 'main' ? 'Principal' : 'Secundaria'));

                // Porcentaje bajo = prioridad
                let isLow = line.completedPercentage <= 40;
                let priorityBadge = isLow ? '🔺 PRIORITARIA' : '';

                let div = document.createElement('div');
                div.style.marginBottom = '14px';
                div.style.padding = '14px 18px';
                div.style.backgroundColor = isSelected ? color.bg : 'rgba(0,0,0,0.2)';
                div.style.borderRadius = '14px';
                div.style.border = isSelected ? `2px solid ${color.border}` : `1px solid rgba(99,102,241,0.1)`;
                div.style.borderLeft = isSelected ? `6px solid ${color.border}` : `6px solid ${line.type === 'horizontal' ? '#3b82f6' : (line.type === 'vertical' ? '#f59e0b' : '#ec4899')}`;
                div.style.cursor = 'pointer';
                div.style.transition = 'all 0.25s ease';
                div.style.boxShadow = isSelected ? `0 0 20px ${color.border}44` : 'none';
                if (isLow) {
                    div.style.border = `2px solid #f59e0b`;
                    div.style.boxShadow = `0 0 15px rgba(245,158,11,0.15)`;
                }
                div.dataset.index = index;

                div.addEventListener('click', function() {
                    const idx = parseInt(this.dataset.index);
                    if (selectedLineIndex === idx) {
                        selectedLineIndex = -1;
                        clearHotTableHighlights();
                        const recent = registroHistorial.slice(0, 15).map(r => r.number);
                        recent.forEach(n => {
                            let pos = findNumberInHotTable(n);
                            if (pos) {
                                let cell = document.querySelector(`#hotTable tr:nth-child(${pos.row+1}) td:nth-child(${pos.col+1})`);
                                if (cell && !cell.classList.contains('empty')) {
                                    cell.classList.add('recent');
                                }
                            }
                        });
                    } else {
                        selectedLineIndex = idx;
                        highlightSelectedLine(idx);
                    }
                    displayHotResults(lines, recentNumbers);
                });

                div.innerHTML = `
                    <div style="font-weight:700;color:var(--text-color);display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;">
                        <span class="line-tag ${tagClass} ${isSelected ? 'selected-tag' : ''}">
                            ${color.label} ${lineId}
                        </span>
                        <i class="fas ${iconClass}" style="color:${line.type === 'horizontal' ? '#3b82f6' : (line.type === 'vertical' ? '#f59e0b' : '#ec4899')};font-size:0.9rem;"></i>
                        <span style="font-size:0.85rem;color:var(--text-color-secondary);">
                            ${lineTypeLabel} - ${lineDetail} (${line.count} nums · ${line.completedPercentage.toFixed(1)}%)
                        </span>
                        ${priorityBadge ? `<span style="font-size:0.65rem;color:#f59e0b;font-weight:800;background:rgba(245,158,11,0.15);padding:2px 12px;border-radius:12px;">${priorityBadge}</span>` : ''}
                        <span style="font-size:0.65rem;color:var(--text-color-secondary);margin-left:auto;${isSelected ? 'font-weight:800;color:'+color.border : ''}">
                            ${isSelected ? '✅ SELECCIONADA' : '👆 click para ver'}
                        </span>
                    </div>
                    <div style="margin:6px 0;color:var(--text-color-secondary);font-size:0.85rem;">
                        <strong style="color:var(--text-color);">📍 Números en línea:</strong> ${lineNumbers}
                    </div>
                    <div style="margin-top:8px;font-size:0.8rem;color:var(--text-color-secondary);">
                        <strong style="color:var(--text-color);">🎯 Recomendados:</strong>
                    </div>
                    <div class="hot-numbers-grid" style="margin-top:6px;">
                        ${recs.map(n => `<div class="hot-number-item ${line.type}" style="font-size:0.9rem;height:56px;background:${color.border}dd;">${n.toString().padStart(2,'0')}</div>`).join('')}
                    </div>
                `;
                basic.appendChild(div);
            });
            elements.hotResultsContainer.appendChild(basic);
        }

        if (lines.intersections.length) {
            let inter = document.createElement('div');
            inter.className = 'hot-line-group vertical';
            inter.style.borderLeftColor = '#f97316';
            let nums = lines.intersections.map(i => i.number).sort((a, b) => a - b);
            inter.innerHTML = `<h4><i class="fas fa-crosshairs"></i> Intersecciones Clave (${lines.intersections.length})</h4>
                <p style="color:var(--text-color-secondary);margin-bottom:15px;">Alta probabilidad - Números que cruzan 2 líneas</p>
                <div class="hot-numbers-grid">${nums.map(n => `<div class="hot-number-item" style="background: linear-gradient(135deg, #f97316, #ea580c);">${n.toString().padStart(2,'0')}</div>`).join('')}</div>`;
            elements.hotResultsContainer.appendChild(inter);
        }

        if (lines.patterns.length) {
            let patSec = document.createElement('div');
            patSec.className = 'hot-line-group diagonal';
            patSec.style.borderLeftColor = '#06b6d4';
            patSec.innerHTML = '<h4><i class="fas fa-chart-line"></i> Patrones Detectados</h4>';
            lines.patterns.forEach(p => {
                let div = document.createElement('div');
                div.style.marginBottom = '15px';
                div.style.padding = '15px';
                div.style.backgroundColor = 'rgba(0,0,0,0.15)';
                div.style.borderRadius = '12px';
                if (p.type === 'almost_complete') {
                    div.innerHTML = `<div style="font-weight:700;color:var(--text-color);"><i class="fas fa-tachometer-alt" style="color:#06b6d4;"></i> Línea Casi Completa</div>
                        <div style="color:var(--text-color-secondary);">Completado: ${p.completion.toFixed(1)}%</div>
                        <div style="color:var(--text-color-secondary);">Faltan: ${p.missingCount} números</div>`;
                } else if (p.type === 'low_percentage') {
                    div.innerHTML = `<div style="font-weight:700;color:#f59e0b;"><i class="fas fa-arrow-up" style="color:#f59e0b;"></i> Línea con Bajo Porcentaje - ¡Priorizar!</div>
                        <div style="color:var(--text-color-secondary);">Completado: ${p.completion.toFixed(1)}% - ${p.lineType}</div>
                        <div style="color:var(--text-color-secondary);">Tiene ${p.line.count} números, necesita completar</div>`;
                } else if (p.type === 'multi_line') {
                    let nums = p.numbers.map(n => n.number).sort((a, b) => a - b);
                    div.innerHTML = `<div style="font-weight:700;color:var(--text-color);"><i class="fas fa-project-diagram" style="color:#06b6d4;"></i> Números Multi-Línea</div>
                        <div class="hot-numbers-grid">${nums.map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#06b6d4,#0891b2);">${n.toString().padStart(2,'0')}</div>`).join('')}</div>`;
                }
                patSec.appendChild(div);
            });
            elements.hotResultsContainer.appendChild(patSec);
        }

        if (lines.clusters && lines.clusters.length) {
            let clusSec = document.createElement('div');
            clusSec.className = 'hot-line-group';
            clusSec.style.borderLeftColor = '#ec4899';
            clusSec.innerHTML = `<h4><i class="fas fa-object-group"></i> Clusters (${lines.clusters.length})</h4><p style="color:var(--text-color-secondary);margin-bottom:15px;">Zonas calientes</p>`;
            lines.clusters.forEach((cl, idx) => {
                let clusDiv = document.createElement('div');
                clusDiv.style.marginBottom = '20px';
                clusDiv.style.padding = '15px';
                clusDiv.style.backgroundColor = 'rgba(0,0,0,0.15)';
                clusDiv.style.borderRadius = '12px';
                let clusterNums = cl.positions.map(p => p.number.toString().padStart(2, '0')).join(', ');
                let recs = [...new Set(cl.recommendedNumbers.map(r => r.number))].slice(0, 6).sort((a, b) => a - b);
                clusDiv.innerHTML = `<div style="font-weight:700;color:var(--text-color);"><i class="fas fa-dot-circle" style="color:#ec4899;"></i> Cluster ${idx+1} (${cl.size} números)</div>
                    <div style="color:var(--text-color-secondary);">Números: ${clusterNums}</div>
                    <div class="hot-numbers-grid">${recs.map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#ec4899,#db2777);">${n.toString().padStart(2,'0')}</div>`).join('')}</div>`;
                clusSec.appendChild(clusDiv);
            });
            elements.hotResultsContainer.appendChild(clusSec);
        }

        let summary = document.createElement('div');
        summary.className = 'hot-line-group';
        summary.style.borderLeftColor = '#10b981';
        let prioritized = prioritizeNumbers(uniqueRec, lines);
        summary.innerHTML = `<h4><i class="fas fa-star"></i> Resumen Prioritarios</h4>
            <div style="margin-bottom:15px;color:var(--text-color-secondary);">Total únicos: ${uniqueRec.length}</div>
            <div style="margin-bottom:15px;font-weight:600;color:var(--text-color);">Top 15 (priorizando líneas con bajo %):</div>
            <div class="hot-numbers-grid">${prioritized.slice(0,15).map(n => `<div class="hot-number-item" style="background:linear-gradient(135deg,#10b981,#059669);">${n.toString().padStart(2,'0')}</div>`).join('')}</div>
            <div style="margin-top:20px;font-size:0.9em;color:var(--text-color-secondary);"><i class="fas fa-lightbulb" style="color:#f59e0b;"></i> Orden: Intersecciones > Bajo % > Casi completas > Multi-línea > Fuerza</div>`;
        elements.hotResultsContainer.appendChild(summary);
    }

    function analyzeHotNumbers() {
        let recent = registroHistorial.slice(0, 15).map(r => r.number);
        clearHotTableHighlights();
        if (recent.length < 2) {
            elements.hotResultsContainer.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>Necesitas al menos 2 números</p></div>';
            elements.hotStats.style.display = 'none';
            return;
        }
        recent.forEach(n => {
            let pos = findNumberInHotTable(n);
            if (pos) {
                let cell = document.querySelector(`#hotTable tr:nth-child(${pos.row+1}) td:nth-child(${pos.col+1})`);
                if (cell && !cell.classList.contains('empty')) {
                    cell.classList.add('recent');
                }
            }
        });
        let lines = findLinesWithPatterns(recent);
        displayHotResults(lines, recent);
    }

    // ============================================================
    //   SUMAS / RESTAS - MEJORADO (cada 2 números)
    // ============================================================
    function generarPredicciones(ultimos) {
        let nuevas = [];
        // Tomar los últimos 4 números (2 pares)
        const pares = [];
        for (let i = 0; i < ultimos.length - 1; i += 2) {
            if (i + 1 < ultimos.length) {
                pares.push([ultimos[i], ultimos[i + 1]]);
            }
        }
        // Si no hay pares completos, usar los disponibles
        if (pares.length === 0 && ultimos.length >= 2) {
            pares.push([ultimos[0], ultimos[1]]);
        }
        
        for (let par of pares) {
            const num1 = par[0];
            const num2 = par[1];
            // Operaciones entre los dos números del par
            for (let op of operadores) {
                // Suma y resta con cada número del par
                let suma1 = ajustarMod100(num1 + op);
                let resta1 = ajustarMod100(num1 - op);
                let suma2 = ajustarMod100(num2 + op);
                let resta2 = ajustarMod100(num2 - op);
                // Operaciones entre los dos números
                let diff = ajustarMod100(num1 - num2);
                let sum = ajustarMod100(num1 + num2);
                
                nuevas.push({
                    numeroPredicho: suma1,
                    operacionTexto: `${num1} + ${op} = ${suma1.toString().padStart(2,'0')}`,
                    desdeNumero: num1,
                    operador: op,
                    tipo: 'suma',
                    par: [num1, num2]
                });
                nuevas.push({
                    numeroPredicho: resta1,
                    operacionTexto: `${num1} - ${op} = ${resta1.toString().padStart(2,'0')}`,
                    desdeNumero: num1,
                    operador: op,
                    tipo: 'resta',
                    par: [num1, num2]
                });
                nuevas.push({
                    numeroPredicho: suma2,
                    operacionTexto: `${num2} + ${op} = ${suma2.toString().padStart(2,'0')}`,
                    desdeNumero: num2,
                    operador: op,
                    tipo: 'suma',
                    par: [num1, num2]
                });
                nuevas.push({
                    numeroPredicho: resta2,
                    operacionTexto: `${num2} - ${op} = ${resta2.toString().padStart(2,'0')}`,
                    desdeNumero: num2,
                    operador: op,
                    tipo: 'resta',
                    par: [num1, num2]
                });
                // Operaciones entre los dos números
                nuevas.push({
                    numeroPredicho: diff,
                    operacionTexto: `${num1} - ${num2} = ${diff.toString().padStart(2,'0')}`,
                    desdeNumero: num1,
                    operador: 'diff',
                    tipo: 'diferencia',
                    par: [num1, num2]
                });
                nuevas.push({
                    numeroPredicho: sum,
                    operacionTexto: `${num1} + ${num2} = ${sum.toString().padStart(2,'0')}`,
                    desdeNumero: num1,
                    operador: 'sum',
                    tipo: 'suma_par',
                    par: [num1, num2]
                });
            }
        }
        const unique = [];
        const seen = new Set();
        for (let p of nuevas) {
            const key = `${p.desdeNumero}_${p.operador}_${p.tipo}`;
            if (!seen.has(key)) { seen.add(key);
                unique.push(p); }
        }
        return unique;
    }

    function verificarAciertoSumaResta(nuevoNumero) {
        let encontrados = [];
        for (let p of prediccionesRealizadas) {
            if (p.numeroPredicho === nuevoNumero) encontrados.push(p);
        }
        if (encontrados.length) {
            for (let a of encontrados) {
                aciertosSumaResta.unshift({ ...a, numeroAcertado: nuevoNumero, fechaAcierto: new Date().toISOString() });
                if (aciertosSumaResta.length > 30) aciertosSumaResta.pop();
                showToast(`✨ ¡ACERTO POR SUMA/RESTA! ${a.operacionTexto}`, 'success');
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

        let html = `<div class="result-group" style="border-left-color: var(--accent);"><h4><i class="fas fa-chart-line"></i> Últimos 4: ${ultimos.map(n=>n.toString().padStart(2,'0')).join(' → ')}</h4></div>`;
        
        // Mostrar pares de números
        const paresMostrar = [];
        for (let i = 0; i < ultimos.length - 1; i += 2) {
            if (i + 1 < ultimos.length) {
                paresMostrar.push([ultimos[i], ultimos[i + 1]]);
            }
        }
        if (paresMostrar.length === 0 && ultimos.length >= 2) {
            paresMostrar.push([ultimos[0], ultimos[1]]);
        }
        
        for (let par of paresMostrar) {
            const num1 = par[0];
            const num2 = par[1];
            html += `<div style="background:rgba(0,0,0,0.15);border-radius:16px;padding:18px;margin-bottom:20px;border:1px solid rgba(99,102,241,0.1);">
                <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;border-bottom:2px solid rgba(99,102,241,0.15);padding-bottom:10px;">
                    <span style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#fff,#a5b4fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${num1.toString().padStart(2,'0')}</span>
                    <span style="color:var(--text-color-secondary);font-size:0.8rem;">↔</span>
                    <span style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#fff,#a5b4fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${num2.toString().padStart(2,'0')}</span>
                    <span style="color:var(--text-color-secondary);font-size:0.8rem;">Par de números</span>
                </div>
                <table style="width:100%;border-collapse:collapse;">
                    <tbody>
                        ${nuevas.filter(p => p.par && p.par[0] === num1 && p.par[1] === num2).slice(0, 14).map(op => {
                            let hit = aciertosSumaResta.some(a => a.numeroPredicho === op.numeroPredicho && a.desdeNumero === op.desdeNumero);
                            return `<tr>
                                <td style="padding:6px 4px;border-bottom:1px solid rgba(99,102,241,0.05);color:var(--text-color-secondary);">${op.operacionTexto}</td>
                                <td style="padding:6px 4px;border-bottom:1px solid rgba(99,102,241,0.05);font-weight:700;${hit ? 'color:#10b981;' : 'color:var(--text-color);'}">${op.numeroPredicho.toString().padStart(2,'0')}${hit ? ' ✅' : ''}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        }
        elements.operacionesResults.innerHTML = html;
        elements.operacionesStats.style.display = 'block';
        let aHtml = '';
        if (aciertosSumaResta.length === 0) {
            aHtml = '<div style="color:var(--text-color-secondary);">Sin aciertos aún</div>';
        } else {
            aciertosSumaResta.slice(0, 10).forEach(a => {
                aHtml += `<div style="padding:6px 0;border-bottom:1px solid rgba(99,102,241,0.05);color:var(--text-color-secondary);">🎯 ${a.operacionTexto} → ${a.numeroAcertado.toString().padStart(2,'0')} (${new Date(a.fechaAcierto).toLocaleDateString()})</div>`;
            });
        }
        elements.aciertosList.innerHTML = aHtml;
    }

    // ============================================================
    //   DECENAS Y TERMINALES - MEJORADO (con pares)
    // ============================================================
    function analizarDecenasYTerminales() {
        const container = document.getElementById('decenasResults');
        const statsContainer = document.getElementById('decenasStats');
        const content = document.getElementById('decenasContent');

        if (registroHistorial.length < 2) {
            container.innerHTML = '<div class="empty-results"><i class="fas fa-chart-bar"></i><p>Necesitas al menos 2 números registrados para el análisis de decenas y terminales</p></div>';
            statsContainer.style.display = 'none';
            return;
        }

        const ultimoNumero = registroHistorial[0].number;
        const penultimoNumero = registroHistorial[1].number;
        // Si hay más de 2 números, tomar el tercero para pares
        const tercerNumero = registroHistorial.length > 2 ? registroHistorial[2].number : null;

        const decena1 = Math.floor(ultimoNumero / 10);
        const terminal1 = ultimoNumero % 10;
        const decena2 = Math.floor(penultimoNumero / 10);
        const terminal2 = penultimoNumero % 10;

        // Decenas relacionadas para cada número (incluyendo pares)
        const decenasRel1 = decenasMap[decena1.toString()] || [];
        const decenasRel2 = decenasMap[decena2.toString()] || [];
        
        // Terminales relacionadas para cada número
        const terminalesRel1 = terminalesMap[terminal1.toString()] || [];
        const terminalesRel2 = terminalesMap[terminal2.toString()] || [];

        // Generar números por decenas para cada número
        const numerosDecenas1 = [];
        decenasRel1.forEach(d => {
            for (let t = 0; t <= 9; t++) {
                const num = d + t;
                if (num >= 0 && num <= 99) numerosDecenas1.push(num);
            }
        });

        const numerosDecenas2 = [];
        decenasRel2.forEach(d => {
            for (let t = 0; t <= 9; t++) {
                const num = d + t;
                if (num >= 0 && num <= 99) numerosDecenas2.push(num);
            }
        });

        // Generar números por terminales para cada número
        const numerosTerminales1 = [];
        terminalesRel1.forEach(t => {
            for (let d = 0; d <= 9; d++) {
                const num = (d * 10) + t;
                if (num >= 0 && num <= 99) numerosTerminales1.push(num);
            }
        });

        const numerosTerminales2 = [];
        terminalesRel2.forEach(t => {
            for (let d = 0; d <= 9; d++) {
                const num = (d * 10) + t;
                if (num >= 0 && num <= 99) numerosTerminales2.push(num);
            }
        });

        // Unificar y ordenar
        const numerosDecenasUnicos1 = [...new Set(numerosDecenas1)].sort((a, b) => a - b);
        const numerosDecenasUnicos2 = [...new Set(numerosDecenas2)].sort((a, b) => a - b);
        const numerosTerminalesUnicos1 = [...new Set(numerosTerminales1)].sort((a, b) => a - b);
        const numerosTerminalesUnicos2 = [...new Set(numerosTerminales2)].sort((a, b) => a - b);

        // Unificar todas las decenas y terminales
        const decenasRelacionadas = [...new Set([...decenasRel1, ...decenasRel2])].sort((a, b) => a - b);
        const terminalesRelacionadas = [...new Set([...terminalesRel1, ...terminalesRel2])].sort((a, b) => a - b);

        const numerosDecenasUnicos = [...new Set([...numerosDecenasUnicos1, ...numerosDecenasUnicos2])].sort((a, b) => a - b);
        const numerosTerminalesUnicos = [...new Set([...numerosTerminalesUnicos1, ...numerosTerminalesUnicos2])].sort((a, b) => a - b);
        const interseccion = numerosDecenasUnicos.filter(n => numerosTerminalesUnicos.includes(n));

        // Construir HTML
        let html = `
            <div class="result-group" style="border-left-color: var(--accent);">
                <h4><i class="fas fa-arrows-split-up-and-left"></i> Análisis de Decenas y Terminales por Pares</h4>
                <div class="source-info">
                    <i class="fas fa-database"></i>
                    <strong>Últimos números:</strong> 
                    <span style="color:var(--primary);font-weight:800;">${penultimoNumero.toString().padStart(2, '0')}</span> → 
                    <span style="color:var(--accent);font-weight:800;">${ultimoNumero.toString().padStart(2, '0')}</span>
                    ${tercerNumero !== null ? ` ← <span style="color:var(--secondary);font-weight:800;">${tercerNumero.toString().padStart(2, '0')}</span>` : ''}
                </div>
            </div>
        `;

        // SECCIÓN 1: Análisis del penúltimo número (Nº1)
        html += `
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px; margin-top: 12px;">
                <span style="background: var(--primary); color: white; padding: 2px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fas fa-arrow-left"></i> Nº1: ${penultimoNumero.toString().padStart(2, '0')}
                </span>
                <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                    Decena: <strong style="color:var(--primary);">${decena2}</strong> | Terminal: <strong style="color:#f59e0b;">${terminal2}</strong>
                </span>
            </div>
        `;

        // Decenas del Nº1
        html += `
            <div class="decena-card" style="border-left-color: var(--primary);">
                <div class="decena-title">
                    <i class="fas fa-arrow-up" style="color: var(--primary);"></i> 
                    Decenas relacionadas
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;">
                        (${decenasRel2.map(d => d.toString().padStart(2, '0')).join(', ')})
                    </span>
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;margin-left:auto;">
                        <i class="fas fa-hashtag"></i> ${numerosDecenasUnicos2.length} números
                    </span>
                </div>
                <div class="decena-numbers">
                    ${numerosDecenasUnicos2.slice(0, 20).map(n => 
                        `<span class="num-pill">${n.toString().padStart(2, '0')}</span>`
                    ).join('')}
                    ${numerosDecenasUnicos2.length > 20 ? `<span style="color:var(--text-color-secondary);font-size:0.7rem;">+${numerosDecenasUnicos2.length - 20} más</span>` : ''}
                </div>
            </div>
        `;

        // Terminales del Nº1
        html += `
            <div class="decena-card" style="border-left-color: #f59e0b;">
                <div class="decena-title">
                    <i class="fas fa-arrow-down" style="color: #f59e0b;"></i> 
                    Terminales relacionadas
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;">
                        (${terminalesRel2.join(', ')})
                    </span>
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;margin-left:auto;">
                        <i class="fas fa-hashtag"></i> ${numerosTerminalesUnicos2.length} números
                    </span>
                </div>
                <div class="decena-numbers">
                    ${numerosTerminalesUnicos2.slice(0, 20).map(n => 
                        `<span class="num-pill terminal">${n.toString().padStart(2, '0')}</span>`
                    ).join('')}
                    ${numerosTerminalesUnicos2.length > 20 ? `<span style="color:var(--text-color-secondary);font-size:0.7rem;">+${numerosTerminalesUnicos2.length - 20} más</span>` : ''}
                </div>
            </div>
        `;

        // SECCIÓN 2: Análisis del último número (Nº2)
        html += `
            <div style="margin: 20px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                <span style="background: var(--accent); color: white; padding: 2px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fas fa-arrow-right"></i> Nº2: ${ultimoNumero.toString().padStart(2, '0')}
                </span>
                <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                    Decena: <strong style="color:var(--primary);">${decena1}</strong> | Terminal: <strong style="color:#f59e0b;">${terminal1}</strong>
                </span>
            </div>
        `;

        // Decenas del Nº2
        html += `
            <div class="decena-card" style="border-left-color: var(--primary);">
                <div class="decena-title">
                    <i class="fas fa-arrow-up" style="color: var(--primary);"></i> 
                    Decenas relacionadas
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;">
                        (${decenasRel1.map(d => d.toString().padStart(2, '0')).join(', ')})
                    </span>
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;margin-left:auto;">
                        <i class="fas fa-hashtag"></i> ${numerosDecenasUnicos1.length} números
                    </span>
                </div>
                <div class="decena-numbers">
                    ${numerosDecenasUnicos1.slice(0, 20).map(n => 
                        `<span class="num-pill">${n.toString().padStart(2, '0')}</span>`
                    ).join('')}
                    ${numerosDecenasUnicos1.length > 20 ? `<span style="color:var(--text-color-secondary);font-size:0.7rem;">+${numerosDecenasUnicos1.length - 20} más</span>` : ''}
                </div>
            </div>
        `;

        // Terminales del Nº2
        html += `
            <div class="decena-card" style="border-left-color: #f59e0b;">
                <div class="decena-title">
                    <i class="fas fa-arrow-down" style="color: #f59e0b;"></i> 
                    Terminales relacionadas
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;">
                        (${terminalesRel1.join(', ')})
                    </span>
                    <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;margin-left:auto;">
                        <i class="fas fa-hashtag"></i> ${numerosTerminalesUnicos1.length} números
                    </span>
                </div>
                <div class="decena-numbers">
                    ${numerosTerminalesUnicos1.slice(0, 20).map(n => 
                        `<span class="num-pill terminal">${n.toString().padStart(2, '0')}</span>`
                    ).join('')}
                    ${numerosTerminalesUnicos1.length > 20 ? `<span style="color:var(--text-color-secondary);font-size:0.7rem;">+${numerosTerminalesUnicos1.length - 20} más</span>` : ''}
                </div>
            </div>
        `;

        // SECCIÓN 3: Intersección (coincidencias entre ambos números)
        if (interseccion.length > 0) {
            html += `
                <div style="margin: 20px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #10b981; color: white; padding: 2px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-star"></i> Coincidencias
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                        Números que coinciden en ambos análisis
                    </span>
                </div>
                <div class="decena-card" style="border-left-color: #10b981; border: 2px solid rgba(16, 185, 129, 0.3);">
                    <div class="decena-title">
                        <i class="fas fa-star" style="color: #f59e0b;"></i> 
                        Números con doble coincidencia
                        <span style="font-size:0.7rem;color:var(--text-color-secondary);font-weight:400;">
                            (¡Alta probabilidad!)
                        </span>
                        <span style="font-size:0.7rem;color:#10b981;font-weight:700;margin-left:auto;">
                            <i class="fas fa-fire"></i> ${interseccion.length} números
                        </span>
                    </div>
                    <div class="decena-numbers">
                        ${interseccion.slice(0, 30).map(n => 
                            `<span class="num-pill" style="background:linear-gradient(145deg,#065f46,#047857);color:#6ee7b7;border-color:#10b981;font-weight:800;">${n.toString().padStart(2, '0')}</span>`
                        ).join('')}
                        ${interseccion.length > 30 ? `<span style="color:var(--text-color-secondary);font-size:0.7rem;">+${interseccion.length - 30} más</span>` : ''}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="margin: 20px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #f59e0b; color: white; padding: 2px 14px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-info-circle"></i> Sin coincidencias
                    </span>
                </div>
                <div class="decena-card" style="border-left-color: #f59e0b; border: 1px dashed rgba(245, 158, 11, 0.3);">
                    <div class="decena-title">
                        <i class="fas fa-info-circle" style="color: #f59e0b;"></i> 
                        No hay coincidencias entre ambos números
                    </div>
                    <div style="color:var(--text-color-secondary);font-size:0.9rem;padding:8px 0;">
                        Los números de decenas y terminales no se cruzan entre el Nº1 y el Nº2.
                    </div>
                </div>
            `;
        }

        // Resumen final
        html += `
            <div style="margin-top: 20px; background: rgba(0,0,0,0.12); border-radius: 16px; padding: 16px 20px;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-around;">
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-color-secondary);">
                            <i class="fas fa-arrow-left" style="color: var(--primary);"></i> Nº1 (${penultimoNumero.toString().padStart(2, '0')})
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-color);">
                            Dec: ${decenasRel2.map(d => d.toString().padStart(2, '0')).join(', ')}
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-color);">
                            Ter: ${terminalesRel2.join(', ')}
                        </div>
                        <div style="font-size: 0.65rem; color: var(--text-color-secondary);">
                            ${numerosDecenasUnicos2.length + numerosTerminalesUnicos2.length} sugerencias
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-color-secondary);">
                            <i class="fas fa-arrow-right" style="color: var(--accent);"></i> Nº2 (${ultimoNumero.toString().padStart(2, '0')})
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-color);">
                            Dec: ${decenasRel1.map(d => d.toString().padStart(2, '0')).join(', ')}
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-color);">
                            Ter: ${terminalesRel1.join(', ')}
                        </div>
                        <div style="font-size: 0.65rem; color: var(--text-color-secondary);">
                            ${numerosDecenasUnicos1.length + numerosTerminalesUnicos1.length} sugerencias
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-color-secondary);">
                            <i class="fas fa-star" style="color: #10b981;"></i> Coincidencias
                        </div>
                        <div style="font-size: 1.4rem; font-weight: 800; color: #10b981;">
                            ${interseccion.length}
                        </div>
                        <div style="font-size: 0.65rem; color: var(--text-color-secondary);">
                            números con doble probabilidad
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        statsContainer.style.display = 'block';
        content.innerHTML = `
            <div class="stats-row"><span class="stat-label">Nº1 (penúltimo):</span><span class="stat-value">${penultimoNumero.toString().padStart(2, '0')}</span></div>
            <div class="stats-row"><span class="stat-label">Nº2 (último):</span><span class="stat-value">${ultimoNumero.toString().padStart(2, '0')}</span></div>
            <div class="stats-row"><span class="stat-label">Decenas Nº1:</span><span class="stat-value">${decenasRel2.map(d => d.toString().padStart(2, '0')).join(', ')}</span></div>
            <div class="stats-row"><span class="stat-label">Terminales Nº1:</span><span class="stat-value">${terminalesRel2.join(', ')}</span></div>
            <div class="stats-row"><span class="stat-label">Decenas Nº2:</span><span class="stat-value">${decenasRel1.map(d => d.toString().padStart(2, '0')).join(', ')}</span></div>
            <div class="stats-row"><span class="stat-label">Terminales Nº2:</span><span class="stat-value">${terminalesRel1.join(', ')}</span></div>
            <div class="stats-row"><span class="stat-label">Coincidencias (alta probabilidad):</span><span class="stat-value" style="color:#10b981;font-weight:800;">${interseccion.length} números</span></div>
        `;
    }

    // ============================================================
    //   PRONÓSTICOS - VERSIÓN MEJORADA CON TODAS LAS LÓGICAS
    // ============================================================
    function generarPronosticos() {
        const container = document.getElementById('pronosticosResults');
        const statsContainer = document.getElementById('pronosticosStats');

        if (registroHistorial.length < 2) {
            container.innerHTML = '<div class="empty-results"><i class="fas fa-chart-line"></i><p>Necesitas al menos 2 números registrados para generar pronósticos</p></div>';
            statsContainer.style.display = 'none';
            return;
        }

        // ===== RECOLECTAR TODAS LAS FUENTES =====
        const fuentes = {
            tercerasFilas: [],
            numerosCalientes: [],
            sumasRestas: [],
            decenasTerminales: [],
            intersecciones: [],
            lineasBajoPorcentaje: [],
            multiLinea: []
        };

        // 1. TERCERAS FILAS - Último análisis
        if (lastAnalysisResults) {
            const upNums = lastAnalysisResults.thirdRowUpResults.flatMap(r => r.numbers);
            const downNums = lastAnalysisResults.thirdRowDownResults.flatMap(r => r.numbers);
            const allThird = [...new Set([...upNums, ...downNums])];
            fuentes.tercerasFilas = allThird;
        }

        // 2. NÚMEROS CALIENTES - De la tabla 11x11 (incluyendo líneas con bajo %)
        const recentHot = registroHistorial.slice(0, 15).map(r => r.number);
        if (recentHot.length >= 2) {
            const lines = findLinesWithPatterns(recentHot);
            const allHot = [];
            const allIntersections = [];
            const allLowPercentage = [];
            const allMultiLine = [];
            
            // Líneas con bajo porcentaje (prioritarias)
            lines.patterns.forEach(p => {
                if (p.type === 'low_percentage' && p.line.recommendedNumbers) {
                    p.line.recommendedNumbers.forEach(rec => {
                        allLowPercentage.push(rec.number);
                        allHot.push(rec.number);
                    });
                }
                if (p.type === 'multi_line' && p.numbers) {
                    p.numbers.forEach(n => {
                        allMultiLine.push(n.number);
                        allHot.push(n.number);
                    });
                }
            });
            
            // Líneas normales
            [...lines.horizontal, ...lines.vertical, ...lines.diagonal].forEach(line => {
                line.recommendedNumbers.forEach(rec => {
                    allHot.push(rec.number);
                    // Si es una línea con bajo porcentaje, ya está incluida
                });
            });
            
            // Intersecciones
            lines.intersections.forEach(rec => {
                allIntersections.push(rec.number);
                allHot.push(rec.number);
            });
            
            fuentes.numerosCalientes = [...new Set(allHot)];
            fuentes.intersecciones = [...new Set(allIntersections)];
            fuentes.lineasBajoPorcentaje = [...new Set(allLowPercentage)];
            fuentes.multiLinea = [...new Set(allMultiLine)];
        }

        // 3. SUMAS / RESTAS - Por pares
        const ultimosSuma = registroHistorial.slice(0, 4).map(r => r.number);
        if (ultimosSuma.length > 0) {
            const predicciones = generarPredicciones(ultimosSuma);
            fuentes.sumasRestas = [...new Set(predicciones.map(p => p.numeroPredicho))];
        }

        // 4. DECENAS / TERMINALES - Por pares
        if (registroHistorial.length >= 2) {
            const ultimo = registroHistorial[0].number;
            const penultimo = registroHistorial[1].number;
            const decena1 = Math.floor(ultimo / 10);
            const terminal1 = ultimo % 10;
            const decena2 = Math.floor(penultimo / 10);
            const terminal2 = penultimo % 10;
            
            const decenasRel1 = decenasMap[decena1.toString()] || [];
            const decenasRel2 = decenasMap[decena2.toString()] || [];
            const termRel1 = terminalesMap[terminal1.toString()] || [];
            const termRel2 = terminalesMap[terminal2.toString()] || [];
            
            const decenasRel = [...new Set([...decenasRel1, ...decenasRel2])];
            const termRel = [...new Set([...termRel1, ...termRel2])];
            
            const numsDecenas = [];
            decenasRel.forEach(d => {
                for (let t = 0; t <= 9; t++) {
                    const num = d + t;
                    if (num >= 0 && num <= 99) numsDecenas.push(num);
                }
            });
            const numsTerminales = [];
            termRel.forEach(t => {
                for (let d = 0; d <= 9; d++) {
                    const num = (d * 10) + t;
                    if (num >= 0 && num <= 99) numsTerminales.push(num);
                }
            });
            // Intersección de decenas y terminales
            const interseccionDecTerm = numsDecenas.filter(n => numsTerminales.includes(n));
            fuentes.decenasTerminales = [...new Set([...numsDecenas, ...numsTerminales])];
            fuentes.intersecciones = [...new Set([...fuentes.intersecciones, ...interseccionDecTerm])];
        }

        // ===== ANÁLISIS DE COINCIDENCIAS CON PONDERACIÓN =====
        const todasLasFuentes = [
            ...fuentes.tercerasFilas.map(n => ({ num: n, peso: 3, fuente: 'terceras' })),
            ...fuentes.numerosCalientes.map(n => ({ num: n, peso: 4, fuente: 'calientes' })),
            ...fuentes.sumasRestas.map(n => ({ num: n, peso: 2, fuente: 'sumas' })),
            ...fuentes.decenasTerminales.map(n => ({ num: n, peso: 2, fuente: 'decenas' })),
            ...fuentes.intersecciones.map(n => ({ num: n, peso: 10, fuente: 'interseccion' })),
            ...fuentes.lineasBajoPorcentaje.map(n => ({ num: n, peso: 8, fuente: 'bajo_porcentaje' })),
            ...fuentes.multiLinea.map(n => ({ num: n, peso: 7, fuente: 'multi_linea' }))
        ];

        // Contar frecuencia y peso de cada número
        const frecuencia = {};
        const pesoTotal = {};
        const fuentesOrigen = {};
        todasLasFuentes.forEach(item => {
            if (item.num !== undefined && item.num !== null && item.num >= 0 && item.num <= 99) {
                frecuencia[item.num] = (frecuencia[item.num] || 0) + 1;
                pesoTotal[item.num] = (pesoTotal[item.num] || 0) + item.peso;
                if (!fuentesOrigen[item.num]) fuentesOrigen[item.num] = [];
                if (!fuentesOrigen[item.num].includes(item.fuente)) {
                    fuentesOrigen[item.num].push(item.fuente);
                }
            }
        });

        // Ordenar por peso total (prioridad) y luego por frecuencia
        const ordenados = Object.entries(frecuencia)
            .filter(([num, count]) => count >= 1)
            .map(([num, count]) => ({
                num: parseInt(num),
                count: count,
                peso: pesoTotal[num] || 0,
                fuentes: fuentesOrigen[num] || []
            }))
            .sort((a, b) => {
                // Primero por peso, luego por frecuencia
                if (b.peso !== a.peso) return b.peso - a.peso;
                return b.count - a.count;
            });

        if (ordenados.length === 0) {
            container.innerHTML = '<div class="empty-results"><i class="fas fa-chart-line"></i><p>No hay suficientes datos para generar pronósticos</p></div>';
            statsContainer.style.display = 'none';
            return;
        }

        // ===== SEPARAR POR NIVEL DE CONFIABILIDAD =====
        const maxPeso = ordenados[0].peso;
        const muyAlta = ordenados.filter(item => item.peso >= maxPeso * 0.8);
        const alta = ordenados.filter(item => item.peso >= maxPeso * 0.5 && item.peso < maxPeso * 0.8);
        const media = ordenados.filter(item => item.peso < maxPeso * 0.5 && item.peso >= maxPeso * 0.2);

        // ===== GENERAR HTML =====
        let html = '';

        // Cabecera con resumen
        html += `
            <div class="result-group" style="border-left-color: var(--accent);">
                <h4><i class="fas fa-robot" style="color:var(--accent);"></i> Pronósticos Generados (Análisis Combinado)</h4>
                <div class="source-info">
                    <i class="fas fa-database"></i>
                    <strong>Fuentes analizadas:</strong> 
                    <span style="display:inline-block;background:rgba(99,102,241,0.1);padding:2px 12px;border-radius:12px;margin:2px;">
                        Terceras Filas (${fuentes.tercerasFilas.length})
                    </span>
                    <span style="display:inline-block;background:rgba(245,158,11,0.1);padding:2px 12px;border-radius:12px;margin:2px;">
                        Números Calientes (${fuentes.numerosCalientes.length})
                    </span>
                    <span style="display:inline-block;background:rgba(16,185,129,0.1);padding:2px 12px;border-radius:12px;margin:2px;">
                        Sumas/Restas (${fuentes.sumasRestas.length})
                    </span>
                    <span style="display:inline-block;background:rgba(236,72,153,0.1);padding:2px 12px;border-radius:12px;margin:2px;">
                        Decenas/Terminales (${fuentes.decenasTerminales.length})
                    </span>
                    <span style="display:inline-block;background:rgba(239,68,68,0.1);padding:2px 12px;border-radius:12px;margin:2px;">
                        Intersecciones (${fuentes.intersecciones.length})
                    </span>
                    <span style="display:inline-block;background:rgba(245,158,11,0.15);padding:2px 12px;border-radius:12px;margin:2px;border:1px solid #f59e0b;">
                        🔺 Bajo % (${fuentes.lineasBajoPorcentaje.length})
                    </span>
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;font-size:0.8rem;color:var(--text-color-secondary);">
                    <span><i class="fas fa-circle" style="color:#10b981;font-size:0.5rem;"></i> Total números únicos: <strong style="color:var(--text-color);">${ordenados.length}</strong></span>
                    <span><i class="fas fa-circle" style="color:#f59e0b;font-size:0.5rem;"></i> Coincidencias detectadas: <strong style="color:var(--text-color);">${ordenados.filter(item => item.count > 1).length}</strong></span>
                    <span><i class="fas fa-circle" style="color:#ef4444;font-size:0.5rem;"></i> Intersecciones: <strong style="color:var(--text-color);">${fuentes.intersecciones.length}</strong></span>
                </div>
            </div>
        `;

        // ===== SECCIÓN: COINCIDENCIAS FUERTES (Muy Alta) =====
        if (muyAlta.length > 0) {
            html += `
                <div style="margin: 16px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #10b981; color: white; padding: 3px 16px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-star"></i> Coincidencias Fuertes
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                        Máxima prioridad - ${muyAlta.length} números
                    </span>
                </div>
                <div class="decena-card" style="border-left-color: #10b981; border: 2px solid rgba(16, 185, 129, 0.2);">
                    <div class="decena-numbers" style="gap:10px;">
                        ${muyAlta.slice(0, 20).map(item => {
                            const isIntersection = item.fuentes.includes('interseccion');
                            const isLow = item.fuentes.includes('bajo_porcentaje');
                            let bgGrad = 'linear-gradient(145deg,#065f46,#047857)';
                            let textColor = '#6ee7b7';
                            let borderColor = '#10b981';
                            if (isIntersection) {
                                bgGrad = 'linear-gradient(145deg,#7c2d12,#c2410c)';
                                textColor = '#fdba74';
                                borderColor = '#f97316';
                            }
                            if (isLow) {
                                bgGrad = 'linear-gradient(145deg,#5c3a1a,#92400e)';
                                textColor = '#fcd34d';
                                borderColor = '#f59e0b';
                            }
                            if (isIntersection && isLow) {
                                bgGrad = 'linear-gradient(145deg,#7c2d12,#991b1b)';
                                textColor = '#fca5a5';
                                borderColor = '#ef4444';
                            }
                            return `<span class="num-pill" style="background:${bgGrad};color:${textColor};border-color:${borderColor};font-weight:800;font-size:1.1rem;padding:10px 18px;border:2px solid ${borderColor};">
                                ${item.num.toString().padStart(2, '0')}
                                <span style="font-size:0.5rem;opacity:0.8;display:block;font-weight:400;">
                                    ${item.count}x · ${item.peso}pts
                                    ${isIntersection ? ' ⚡' : ''}
                                    ${isLow ? ' 🔺' : ''}
                                </span>
                            </span>`;
                        }).join('')}
                        ${muyAlta.length > 20 ? `<span style="color:var(--text-color-secondary);font-size:0.8rem;padding:10px 18px;">+${muyAlta.length - 20} más</span>` : ''}
                    </div>
                    <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.7rem; color: var(--text-color-secondary);">
                        <span><i class="fas fa-bolt" style="color: #f97316;"></i> ⚡ = Intersección (cruza 2 líneas)</span>
                        <span><i class="fas fa-arrow-up" style="color: #f59e0b;"></i> 🔺 = Línea con bajo porcentaje</span>
                        <span><i class="fas fa-fire" style="color: #10b981;"></i> ★ = Mayor prioridad</span>
                    </div>
                </div>
            `;
        }

        // ===== SECCIÓN: ALTA PROBABILIDAD =====
        if (alta.length > 0) {
            html += `
                <div style="margin: 16px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #f59e0b; color: white; padding: 3px 16px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-fire"></i> Alta Probabilidad
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                        ${alta.length} números
                    </span>
                </div>
                <div class="decena-card" style="border-left-color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.15);">
                    <div class="decena-numbers" style="gap:8px;">
                        ${alta.slice(0, 30).map(item => 
                            `<span class="num-pill" style="background:linear-gradient(145deg,#5c3a1a,#92400e);color:#fcd34d;border-color:#f59e0b;font-weight:700;padding:8px 16px;border:1px solid #f59e0b;">
                                ${item.num.toString().padStart(2, '0')}
                                <span style="font-size:0.45rem;opacity:0.7;display:block;font-weight:400;">${item.count}x · ${item.peso}pts</span>
                            </span>`
                        ).join('')}
                        ${alta.length > 30 ? `<span style="color:var(--text-color-secondary);font-size:0.8rem;padding:8px 16px;">+${alta.length - 30} más</span>` : ''}
                    </div>
                </div>
            `;
        }

        // ===== SECCIÓN: PROBABILIDAD MEDIA =====
        if (media.length > 0) {
            html += `
                <div style="margin: 16px 0 8px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: #6366f1; color: white; padding: 3px 16px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        <i class="fas fa-chart-line"></i> Probabilidad Media
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-color-secondary);">
                        ${media.length} números
                    </span>
                </div>
                <div class="decena-card" style="border-left-color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.1);">
                    <div class="decena-numbers" style="gap:6px;">
                        ${media.slice(0, 30).map(item => 
                            `<span class="num-pill" style="background:rgba(99,102,241,0.15);color:var(--text-color);border-color:rgba(99,102,241,0.2);font-weight:600;padding:6px 14px;font-size:0.85rem;">
                                ${item.num.toString().padStart(2, '0')}
                                <span style="font-size:0.4rem;opacity:0.6;display:block;font-weight:400;">${item.count}x</span>
                            </span>`
                        ).join('')}
                        ${media.length > 30 ? `<span style="color:var(--text-color-secondary);font-size:0.8rem;padding:6px 14px;">+${media.length - 30} más</span>` : ''}
                    </div>
                </div>
            `;
        }

        // ===== TOP 7 RECOMENDADOS =====
        const top7 = ordenados.slice(0, 7);
        html += `
            <div style="margin-top: 20px; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1)); border-radius: 20px; padding: 20px; border: 1px solid rgba(99,102,241,0.1);">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <i class="fas fa-trophy" style="color:var(--accent);font-size:1.4rem;"></i>
                    <span style="font-weight:700;font-size:1.1rem;color:var(--text-color);">🏆 Top 7 Recomendados</span>
                    <span style="font-size:0.65rem;color:var(--text-color-secondary);background:rgba(0,0,0,0.1);padding:2px 14px;border-radius:20px;">
                        Mayor probabilidad
                    </span>
                </div>
                <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
                    ${top7.map((item, idx) => {
                        const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];
                        const isIntersection = item.fuentes.includes('interseccion');
                        const isLow = item.fuentes.includes('bajo_porcentaje');
                        let badge = '';
                        if (isIntersection && isLow) badge = '⚡🔺';
                        else if (isIntersection) badge = '⚡';
                        else if (isLow) badge = '🔺';
                        return `<div style="text-align:center;background:rgba(0,0,0,0.15);border-radius:16px;padding:12px 16px;min-width:70px;border:2px solid ${colors[idx % colors.length]};">
                            <div style="font-size:0.5rem;color:var(--text-color-secondary);font-weight:600;">#${idx + 1} ${badge}</div>
                            <div style="font-size:1.8rem;font-weight:800;color:${colors[idx % colors.length]};">${item.num.toString().padStart(2, '0')}</div>
                            <div style="font-size:0.55rem;color:var(--text-color-secondary);">${item.count} fuentes · ${item.peso}pts</div>
                        </div>`;
                    }).join('')}
                </div>
                <div style="margin-top:12px;text-align:center;font-size:0.75rem;color:var(--text-color-secondary);">
                    <i class="fas fa-lightbulb" style="color:var(--accent);"></i> 
                    ⚡ = Intersección (cruza 2 líneas) · 🔺 = Línea con bajo porcentaje
                </div>
            </div>
        `;

        container.innerHTML = html;
        statsContainer.style.display = 'flex';

        // Estadísticas
        const totalUnicos = ordenados.length;
        const coincidenciasFuertes = muyAlta.length + alta.length;
        const confianza = Math.min(100, Math.round((coincidenciasFuertes / Math.max(totalUnicos, 1)) * 100));
        
        document.getElementById('pronosticoTotal').textContent = totalUnicos;
        document.getElementById('pronosticoCalientes').textContent = coincidenciasFuertes;
        document.getElementById('pronosticoConfianza').textContent = `${confianza}%`;
    }

    // ============================================================
    //   BINGO
    // ============================================================
    function checkForBingo(newPlay) {
        if (!lastAnalysisResults || registroHistorial.length < 2) return;
        let isBingo = false,
            sourceInfo = null;
        lastAnalysisResults.thirdRowUpResults.forEach(res => {
            if (res.numbers.includes(newPlay.number)) { isBingo = true;
                sourceInfo = { sourceNumber: res.sourceNumber, type: 'Tercera Fila ARRIBA' }; }
        });
        if (!isBingo) {
            lastAnalysisResults.thirdRowDownResults.forEach(res => {
                if (res.numbers.includes(newPlay.number)) { isBingo = true;
                    sourceInfo = { sourceNumber: res.sourceNumber, type: 'Tercera Fila ABAJO' }; }
            });
        }
        if (isBingo && sourceInfo) {
            let bingo = { number: newPlay.number, sourceNumber: sourceInfo.sourceNumber, type: sourceInfo.type, date: new Date().toISOString(), week: newPlay.week, day: newPlay.day, time: newPlay.time };
            bingoChains.unshift(bingo);
            if (bingoChains.length > 20) bingoChains = bingoChains.slice(0, 20);
            saveData();
            showToast(`🎉 ¡BINGO! Número ${newPlay.number.toString().padStart(2,'0')} acertado`, 'success');
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
        let thisWeek = bingoChains.filter(b => new Date(b.date) > new Date(Date.now() - 7 * 86400000)).length;
        elements.bingoTotal.textContent = bingoChains.length;
        elements.bingoWeek.textContent = thisWeek;
        bingoChains.forEach((b, idx) => {
            let item = document.createElement('div');
            item.className = 'bingo-chain-item';
            let date = new Date(b.date);
            let dateStr = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            item.innerHTML = `<div style="display:flex;justify-content:space-between;">
                <div style="font-weight:700;color:var(--text-color);"><i class="fas fa-trophy" style="color:#f59e0b;"></i> BINGO #${idx+1}</div>
                <div style="background:rgba(245,158,11,0.15);padding:4px 12px;border-radius:8px;font-size:0.8rem;color:var(--text-color-secondary);">${dateStr}</div>
            </div>
            <div style="text-align:center;margin:12px 0;">
                <div style="font-size:2.2rem;font-weight:800;background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${b.number.toString().padStart(2,'0')}</div>
                <div style="color:var(--text-color-secondary);">¡Acertado!</div>
            </div>
            <div style="background:rgba(0,0,0,0.2);padding:14px;border-radius:12px;color:var(--text-color-secondary);">
                <div><strong style="color:var(--text-color);">Origen:</strong> Nº ${b.sourceNumber.toString().padStart(2,'0')}</div>
                <div><strong style="color:var(--text-color);">Tipo:</strong> ${b.type}</div>
                <div><strong style="color:var(--text-color);">Cuando:</strong> ${daysOfWeek[b.day]} - ${b.time==='morning'?'Mañana':'Noche'}</div>
            </div>`;
            elements.bingoResults.appendChild(item);
        });
    }

    // ============================================================
    //   EJECUTAR TODOS LOS ANÁLISIS
    // ============================================================
    function performAllAnalyses() {
        performThirdRowAnalysis();
        analyzeHotNumbers();
        actualizarPanelOperaciones();
        analizarDecenasYTerminales();
        displayBingoResults();
        generarPronosticos();
    }

    // ============================================================
    //   EVENTOS Y ARRANQUE
    // ============================================================
    function setupEventListeners() {
        elements.saveTiroBtn.addEventListener('click', saveTiro);
        elements.clearBtn.addEventListener('click', clearAllData);
        elements.refreshBtn.addEventListener('click', performAllAnalyses);
        elements.week1Btn.addEventListener('click', () => switchWeek(1));
        elements.week2Btn.addEventListener('click', () => switchWeek(2));
        elements.tiroNumberInput.addEventListener('keypress', e => { if (e.key === 'Enter') saveTiro(); });
    }

    function setupAnalysisTabs() {
        elements.analysisTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                let id = this.getAttribute('data-tab');
                elements.analysisTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                elements.numberAnalysis.classList.remove('active');
                elements.thirdRowAnalysis.classList.remove('active');
                elements.hotNumbersAnalysis.classList.remove('active');
                elements.operacionesAnalysis.classList.remove('active');
                elements.decenasAnalysis.classList.remove('active');
                elements.pronosticosAnalysis.classList.remove('active');
                elements.bingoAnalysis.classList.remove('active');
                if (id === 'number') elements.numberAnalysis.classList.add('active');
                else if (id === 'third-row') elements.thirdRowAnalysis.classList.add('active');
                else if (id === 'hot-numbers') elements.hotNumbersAnalysis.classList.add('active');
                else if (id === 'operaciones') elements.operacionesAnalysis.classList.add('active');
                else if (id === 'decenas') elements.decenasAnalysis.classList.add('active');
                else if (id === 'pronosticos') {
                    elements.pronosticosAnalysis.classList.add('active');
                    generarPronosticos();
                }
                else if (id === 'bingo') elements.bingoAnalysis.classList.add('active');
            });
        });
    }

    function initApp() {
        createBackgroundParticles();
        loadData();
        setupEventListeners();
        generateHotTable();
        updateRecentNumbersDisplay();
        renderWeek(currentWeek);
        setupAnalysisTabs();
        performAllAnalyses();
        initTheme();
        initVisitorCounter();
    }

    initApp();
});
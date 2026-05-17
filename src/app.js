// Smart CGPA Analyser (module)
"use strict";

// Constants
const MAX_GP = 4.0;
const CIRC = 226.2; // SVG ring circumference (2π × r=36)
const MAX_CRED_BAR = 150;   // credits that fill the progress bar

// State
let rowCount = 0;

// Helpers
function gradeLabel(gp) {
    if (gp >= 4.00) return { letter: 'A+', cls: 'bg-emerald-500/20 text-emerald-300' };
    if (gp >= 3.67) return { letter: 'A', cls: 'bg-emerald-500/20 text-emerald-300' };
    if (gp >= 3.33) return { letter: 'A−', cls: 'bg-teal-500/20   text-teal-300' };
    if (gp >= 3.00) return { letter: 'B+', cls: 'bg-cyan-500/20   text-cyan-300' };
    if (gp >= 2.67) return { letter: 'B', cls: 'bg-blue-500/20   text-blue-300' };
    if (gp >= 2.33) return { letter: 'B−', cls: 'bg-blue-500/20   text-blue-300' };
    if (gp >= 2.00) return { letter: 'C+', cls: 'bg-yellow-500/20 text-yellow-300' };
    if (gp >= 1.67) return { letter: 'C', cls: 'bg-yellow-500/20 text-yellow-300' };
    if (gp >= 1.00) return { letter: 'D', cls: 'bg-orange-500/20 text-orange-300' };
    return { letter: 'F', cls: 'bg-red-500/20 text-red-300' };
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function sumRows() {
    let totalCredits = 0, totalQP = 0;
    document.querySelectorAll('.course-row').forEach(row => {
        const id = row.dataset.rowId;
        const cr = parseFloat(document.getElementById(`credits-${id}`)?.value);
        const gp = parseFloat(document.getElementById(`gp-${id}`)?.value);
        if (!isNaN(cr) && !isNaN(gp) && cr > 0) {
            totalCredits += cr;
            totalQP += cr * gp;
        }
    });
    return { totalCredits, totalQP };
}

function showEmptyState() {
    const list = document.getElementById('courseList');
    if (list.querySelector('#emptyState')) return;

    const div = document.createElement('div');
    div.id = 'emptyState';
    div.className = 'flex flex-col items-center justify-center py-14 text-center';
    div.innerHTML = `
    <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3">
      <svg class="w-7 h-7 text-emerald-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13
             C4.168 18.477 5.75 18 7.5 18s3.332.477 4.5 1.253m0-13
             C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13
             C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    </div>
    <p class="text-sm text-emerald-300/30">No courses added yet</p>
    <p class="text-xs text-emerald-300/20 mt-1">Click "Add Course" to get started</p>`;
    list.appendChild(div);
}

function addRow(preset = {}) {
    rowCount++;
    const id = rowCount;

    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.remove();
    document.getElementById('tableFooter').classList.remove('hidden');

    const row = document.createElement('div');
    row.id = `row-${id}`;
    row.dataset.rowId = id;
    row.className = 'course-row grid grid-cols-12 gap-3 items-center px-5 py-3 hover:bg-white/[0.03] transition-colors duration-150';

    row.innerHTML = `
    <div class="col-span-4">
      <span class="col-label">Course / Semester</span>
      <input type="text" placeholder="e.g. Math 101 / Sem 1"
        value="${preset.name ?? ''}"
        class="inp text-sm" oninput="recalc()" />
    </div>

    <div class="col-span-2">
      <span class="col-label">Credit Hours</span>
      <input type="number" id="credits-${id}" placeholder="3"
        min="0.5" max="10" step="0.5"
        value="${preset.cr ?? ''}"
        class="inp text-center text-sm font-medium"
        oninput="onRowInput(${id})" />
    </div>

    <div class="col-span-2">
      <span class="col-label">Grade Point</span>
      <input type="number" id="gp-${id}" placeholder="4.0"
        min="0" max="${MAX_GP}" step="0.01"
        value="${preset.gp ?? ''}"
        class="inp text-center text-sm font-medium"
        oninput="onRowInput(${id})" />
    </div>

    <div class="col-span-2 text-center">
      <span class="col-label">Quality Pts</span>
      <div id="qp-${id}" class="text-sm font-semibold text-emerald-300/40 tabular-nums">—</div>
    </div>

    <div class="col-span-2 text-center">
      <button onclick="removeRow(${id})"
        class="relative px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-200 active:scale-95">
        <svg class="w-3.5 h-3.5 inline -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858 L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        <span class="hidden sm:inline ml-1">Remove</span>
      </button>
    </div>`;

    document.getElementById('courseList').appendChild(row);

    if (preset.cr && preset.gp !== undefined) onRowInput(id);
    if (!preset.cr) setTimeout(() => document.getElementById(`credits-${id}`)?.focus(), 50);

    recalc();
}

function removeRow(id) {
    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    row.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    row.style.opacity = '0';
    row.style.transform = 'translateX(16px) scale(0.97)';

    setTimeout(() => {
        row.remove();
        if (!document.querySelector('.course-row')) {
            document.getElementById('tableFooter').classList.add('hidden');
            showEmptyState();
        }
        recalc();
    }, 230);
}

function onRowInput(id) {
    const credEl = document.getElementById(`credits-${id}`);
    const gpEl = document.getElementById(`gp-${id}`);
    const qpEl = document.getElementById(`qp-${id}`);

    let cr = parseFloat(credEl.value);
    let gp = parseFloat(gpEl.value);

    if (!isNaN(gp)) {
        gp = clamp(gp, 0, MAX_GP);
        if (parseFloat(gpEl.value) !== gp) gpEl.value = gp;
    }
    if (!isNaN(cr) && cr < 0) { credEl.value = 0; cr = 0; }

    if (!isNaN(cr) && !isNaN(gp) && cr > 0) {
        qpEl.textContent = (cr * gp).toFixed(2);
        qpEl.className = 'text-sm font-semibold text-white tabular-nums';
    } else {
        qpEl.textContent = '—';
        qpEl.className = 'text-sm font-semibold text-emerald-300/40 tabular-nums';
    }

    recalc();
}

function recalc() {
    const { totalCredits, totalQP } = sumRows();
    const cgpa = totalCredits > 0 ? totalQP / totalCredits : 0;
    const fmt = n => n % 1 === 0 ? String(n) : n.toFixed(1);

    document.getElementById('statCredits').textContent = fmt(totalCredits);
    document.getElementById('statQP').textContent = totalQP.toFixed(2);
    document.getElementById('statCgpa').textContent = cgpa.toFixed(2);

    document.getElementById('creditsBar').style.width = Math.min(totalCredits / MAX_CRED_BAR * 100, 100) + '%';
    document.getElementById('qpBar').style.width = Math.min(totalQP / (MAX_CRED_BAR * MAX_GP) * 100, 100) + '%';

    const offset = CIRC - (cgpa / MAX_GP) * CIRC;
    document.getElementById('cgpaRing').style.strokeDashoffset = offset;

    const badge = document.getElementById('cgpaBadge');
    if (totalCredits > 0) {
        const g = gradeLabel(cgpa);
        badge.textContent = g.letter;
        badge.className = 'grade-badge inline-block ' + g.cls;
    } else {
        badge.textContent = '—';
        badge.className = 'grade-badge inline-block bg-emerald-500/20 text-emerald-300';
    }

    qs('#footerCredits', el => el.textContent = fmt(totalCredits));
    qs('#footerQP', el => el.textContent = totalQP.toFixed(2));
    qs('#footerCreditsMobile', el => el.textContent = fmt(totalCredits));
    qs('#footerQPMobile', el => el.textContent = totalQP.toFixed(2));

    updateTargetPlanner(totalCredits, totalQP);
    updateSemesterPlanner(totalCredits, totalQP, cgpa);
}

function qs(sel, fn) { const el = document.querySelector(sel); if (el) fn(el); }

function updateTargetPlanner(currentCredits, currentQP) {
    const goal = parseFloat(document.getElementById('goalCgpa')?.value);
    const nextCred = parseFloat(document.getElementById('nextCredits')?.value);

    const resultEl = document.getElementById('requiredGpa');
    const msgEl = document.getElementById('targetMsg');
    const badgeEl = document.getElementById('targetBadge');
    const boxEl = document.getElementById('targetResult');

    const reset = () => {
        resultEl.textContent = '—';
        resultEl.className = 'text-5xl font-bold text-emerald-300/30 tabular-nums';
        msgEl.textContent = 'Enter goal CGPA & next semester credits above';
        msgEl.className = 'text-xs text-emerald-300/40 mt-2';
        badgeEl.classList.add('hidden');
        boxEl.className = 'glass-dark rounded-xl p-4 flex flex-col justify-center items-center text-center';
    };

    if (isNaN(goal) || isNaN(nextCred) || nextCred <= 0) { reset(); return; }

    const neededQP = goal * (currentCredits + nextCred) - currentQP;
    const requiredGpa = neededQP / nextCred;

    resultEl.textContent = requiredGpa > 0 ? requiredGpa.toFixed(2) : '0.00';
    badgeEl.classList.remove('hidden');

    if (requiredGpa > MAX_GP) {
        resultEl.className = 'text-5xl font-bold text-red-400 tabular-nums';
        msgEl.textContent = `Needs ${requiredGpa.toFixed(2)} — exceeds max ${MAX_GP}`;
        msgEl.className = 'text-xs text-red-400/70 mt-2';
        badgeEl.textContent = '✗ Not Achievable';
        badgeEl.className = 'grade-badge mt-3 bg-red-500/20 text-red-300';
        boxEl.className = 'glass-dark rounded-xl p-4 flex flex-col justify-center items-center text-center border border-red-500/20';
    } else if (requiredGpa <= 0) {
        resultEl.textContent = '≤ 0.00';
        resultEl.className = 'text-5xl font-bold text-emerald-400 tabular-nums';
        msgEl.textContent = 'You have already surpassed your goal!';
        msgEl.className = 'text-xs text-emerald-400/70 mt-2';
        badgeEl.textContent = '✓ Already Achieved';
        badgeEl.className = 'grade-badge mt-3 bg-emerald-500/20 text-emerald-300';
        boxEl.className = 'glass-dark rounded-xl p-4 flex flex-col justify-center items-center text-center border border-emerald-500/20';
    } else {
        resultEl.className = 'text-5xl font-bold text-emerald-400 tabular-nums';
        msgEl.textContent = `Need ${requiredGpa.toFixed(2)} GPA in the next ${nextCred} credits`;
        msgEl.className = 'text-xs text-emerald-400/70 mt-2';
        badgeEl.textContent = '✓ Achievable';
        badgeEl.className = 'grade-badge mt-3 bg-emerald-500/20 text-emerald-300';
        boxEl.className = 'glass-dark rounded-xl p-4 flex flex-col justify-center items-center text-center border border-emerald-500/20';
    }
}

function updateSemesterPlanner(totalCredits, totalQP, currentCgpa) {
    const totalSemsEl = document.getElementById('sp_totalSems');
    const compSemsEl = document.getElementById('sp_compSems');
    const credPerSemEl = document.getElementById('sp_credPerSem');
    const assumedGpaEl = document.getElementById('sp_assumedGpa');
    const targetCgpaEl = document.getElementById('sp_targetCgpa');
    const outSection = document.getElementById('sp_output');

    if (!totalSemsEl) return;

    const totalSems = parseInt(totalSemsEl.value);
    const compSems = parseInt(compSemsEl.value);
    const credPerSem = parseFloat(credPerSemEl.value);
    const assumedGpa = parseFloat(assumedGpaEl.value);
    const targetCgpa = parseFloat(targetCgpaEl.value);

    if (isNaN(totalSems) || isNaN(credPerSem) || totalSems < 1 || credPerSem < 1) {
        outSection.classList.add('hidden');
        return;
    }

    const safeCom = isNaN(compSems) ? 0 : clamp(compSems, 0, totalSems);
    const remSems = Math.max(0, totalSems - safeCom);
    const remCredits = remSems * credPerSem;

    qs('#sp_remSems', el => el.textContent = remSems);

    outSection.classList.remove('hidden');

    const projEl = document.getElementById('sp_projCgpa');
    const projMsgEl = document.getElementById('sp_projMsg');

    if (!isNaN(assumedGpa) && remSems > 0) {
        const projQP = totalQP + remSems * credPerSem * assumedGpa;
        const projCred = totalCredits + remCredits;
        const projCgpa = projCred > 0 ? projQP / projCred : 0;
        const g = gradeLabel(projCgpa);
        projEl.textContent = projCgpa.toFixed(2);
        projEl.className = 'text-3xl font-bold tabular-nums ' + (projCgpa >= 3.5 ? 'text-emerald-400' : projCgpa >= 2.5 ? 'text-yellow-400' : 'text-red-400');
        projMsgEl.textContent = `If you maintain ${assumedGpa.toFixed(2)} GPA each remaining semester → Final CGPA: ${projCgpa.toFixed(2)} (${g.letter})`;
        projMsgEl.className = 'text-xs text-emerald-300/50 mt-1';
    } else if (remSems === 0) {
        projEl.textContent = currentCgpa.toFixed(2);
        projEl.className = 'text-3xl font-bold text-emerald-400 tabular-nums';
        projMsgEl.textContent = 'No remaining semesters — this is your final CGPA.';
        projMsgEl.className = 'text-xs text-emerald-300/50 mt-1';
    } else {
        projEl.textContent = '—';
        projEl.className = 'text-3xl font-bold text-emerald-300/30 tabular-nums';
        projMsgEl.textContent = 'Enter an assumed GPA to see projection.';
        projMsgEl.className = 'text-xs text-emerald-300/30 mt-1';
    }

    const reqEl = document.getElementById('sp_reqGpa');
    const reqMsgEl = document.getElementById('sp_reqMsg');
    const reqBadgeEl = document.getElementById('sp_reqBadge');

    if (!isNaN(targetCgpa) && remSems > 0 && remCredits > 0) {
        const neededQP = targetCgpa * (totalCredits + remCredits) - totalQP;
        const reqGpa = neededQP / remCredits;

        reqEl.textContent = reqGpa > 0 ? reqGpa.toFixed(2) : '0.00';
        reqBadgeEl.classList.remove('hidden');

        if (reqGpa > MAX_GP) {
            reqEl.className = 'text-3xl font-bold text-red-400 tabular-nums';
            reqMsgEl.textContent = `Needs ${reqGpa.toFixed(2)}/sem — exceeds max ${MAX_GP} even over ${remSems} semester${remSems > 1 ? 's' : ''}`;
            reqMsgEl.className = 'text-xs text-red-400/60 mt-1';
            reqBadgeEl.textContent = '✗ Not Achievable';
            reqBadgeEl.className = 'grade-badge bg-red-500/20 text-red-300 mt-2';
        } else if (reqGpa <= 0) {
            reqEl.textContent = '≤ 0.00';
            reqEl.className = 'text-3xl font-bold text-emerald-400 tabular-nums';
            reqMsgEl.textContent = 'Your current CGPA already exceeds the target!';
            reqMsgEl.className = 'text-xs text-emerald-400/60 mt-1';
            reqBadgeEl.textContent = '✓ Already Done';
            reqBadgeEl.className = 'grade-badge bg-emerald-500/20 text-emerald-300 mt-2';
        } else {
            reqEl.className = 'text-3xl font-bold text-emerald-400 tabular-nums';
            reqMsgEl.textContent = `Earn ${reqGpa.toFixed(2)} GPA avg over ${remSems} remaining semester${remSems > 1 ? 's' : ''} (${remCredits} credits) to hit ${targetCgpa.toFixed(2)} CGPA`;
            reqMsgEl.className = 'text-xs text-emerald-400/60 mt-1';
            reqBadgeEl.textContent = '✓ Achievable';
            reqBadgeEl.className = 'grade-badge bg-emerald-500/20 text-emerald-300 mt-2';
        }
    } else if (remSems === 0) {
        reqEl.textContent = '—';
        reqEl.className = 'text-3xl font-bold text-emerald-300/30 tabular-nums';
        reqMsgEl.textContent = 'No remaining semesters left.';
        reqMsgEl.className = 'text-xs text-emerald-300/30 mt-1';
        reqBadgeEl.classList.add('hidden');
    } else {
        reqEl.textContent = '—';
        reqEl.className = 'text-3xl font-bold text-emerald-300/30 tabular-nums';
        reqMsgEl.textContent = 'Enter your target CGPA above.';
        reqMsgEl.className = 'text-xs text-emerald-300/30 mt-1';
        reqBadgeEl.classList.add('hidden');
    }
}

function init() {
    const examples = [
        { name: 'Calculus I', cr: 3, gp: 3.70 },
        { name: 'Physics I', cr: 3, gp: 3.30 },
        { name: 'English Comp.', cr: 2, gp: 4.00 },
    ];
    examples.forEach(ex => addRow(ex));
}

document.addEventListener('DOMContentLoaded', init);

// Expose functions to global scope for use with inline handlers
window.addRow = addRow;
window.removeRow = removeRow;
window.onRowInput = onRowInput;
window.recalc = recalc;

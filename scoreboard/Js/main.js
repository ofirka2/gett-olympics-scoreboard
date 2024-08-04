const ADMIN_PASSWORD = "your_password_here";  // Change this to your desired password

document.addEventListener('DOMContentLoaded', () => {
    loadScores();
    checkAdminAccess();
    attachEventListeners();
});

function attachEventListeners() {
    document.querySelectorAll('[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('blur', () => {
            saveScores();
            sortGroups();
            highlightTopTeams();
        });
    });
}

function requestAdminAccess() {
    const enteredPassword = prompt("Enter admin password:");
    if (enteredPassword === ADMIN_PASSWORD) {
        document.cookie = "adminAccess=true; max-age=3600; path=/";
        enableEditing();
    } else {
        alert("Incorrect password. You can only view the scores.");
    }
}

function checkAdminAccess() {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
    }, {});
    if (cookies.adminAccess === "true") {
        enableEditing();
    }
}

function enableEditing() {
    document.querySelectorAll('[contenteditable="false"]').forEach(cell => {
        cell.contentEditable = "true";
    });
}

function saveScores() {
    try {
        const groupAScores = Array.from(document.getElementById('groupA').getElementsByTagName('tbody')[0].rows, row => ({
            team: row.cells[0].innerText,
            score: row.cells[1].innerText
        }));
        const groupBScores = Array.from(document.getElementById('groupB').getElementsByTagName('tbody')[0].rows, row => ({
            team: row.cells[0].innerText,
            score: row.cells[1].innerText
        }));
        localStorage.setItem('groupA', JSON.stringify(groupAScores));
        localStorage.setItem('groupB', JSON.stringify(groupBScores));
    } catch (error) {
        console.error('Error saving scores:', error);
    }
}

function loadScores() {
    const groupAScores = JSON.parse(localStorage.getItem('groupA')) ?? [
        { team: 'Team A1', score: '0' },
        { team: 'Team A2', score: '0' },
        { team: 'Team A3', score: '0' },
        { team: 'Team A4', score: '0' }
    ];
    const groupBScores = JSON.parse(localStorage.getItem('groupB')) ?? [
        { team: 'Team B1', score: '0' },
        { team: 'Team B2', score: '0' },
        { team: 'Team B3', score: '0' },
        { team: 'Team B4', score: '0' }
    ];
    updateTable('groupA', groupAScores);
    updateTable('groupB', groupBScores);
    sortGroups();
    highlightTopTeams();
}

function updateTable(group, scores) {
    const table = document.getElementById(group).getElementsByTagName('tbody')[0];
    table.innerHTML = scores.map(score => `
        <tr>
            <td contenteditable="false">${score.team}</td>
            <td contenteditable="false">${score.score}</td>
        </tr>
    `).join('');
}

function sortGroups() {
    sortTable('groupA');
    sortTable('groupB');
    highlightTopTeams();
}

function sortTable(group) {
    const table = document.getElementById(group).getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);
    rows.sort((a, b) => parseInt(b.cells[1].innerText) - parseInt(a.cells[1].innerText));
    rows.forEach(row => table.appendChild(row));
}

function highlightTopTeams() {
    highlightGroup('groupA');
    highlightGroup('groupB');
}

function highlightGroup(group) {
    const table = document.getElementById(group).getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);
    rows.forEach((row, index) => {
        if (index < 2) {
            row.classList.add('highlight');
        } else {
            row.classList.remove('highlight');
        }
    });
}
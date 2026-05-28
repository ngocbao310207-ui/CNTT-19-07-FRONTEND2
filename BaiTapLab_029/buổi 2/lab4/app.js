document.addEventListener('DOMContentLoaded', () => {
    const scores = [7.5, 5.0, 9.2, 8.5, 4.5, 6.8];

    const tbody = document.getElementById('gradesList');
    const totalScoreEl = document.getElementById('totalScore');
    const avgScoreEl = document.getElementById('avgScore');
    const finalRankEl = document.getElementById('finalRank');

    function renderTable() {
        let html = '';
        scores.forEach((score, index) => {
            const statusClass = score >= 5 ? 'pass' : 'fail';
            const statusText = score >= 5 ? 'Qua môn' : 'Học lại';

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td style="font-weight: 600;">${score.toFixed(1)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function calculateStats() {
        const total = scores.reduce((sum, current) => sum + current, 0);
        const avg = total / scores.length;
        totalScoreEl.textContent = total.toFixed(1);
        avgScoreEl.textContent = avg.toFixed(2);
        classifyRank(avg);
    }

    function classifyRank(avg) {
        let rankText = '';
        let rankColor = '';

        if (avg < 5.0) {
            rankText = 'Yếu';
            rankColor = 'var(--rank-yeu)';
        } else if (avg >= 5.0 && avg < 6.5) {
            rankText = 'Trung bình';
            rankColor = 'var(--rank-tb)';
        } else if (avg >= 6.5 && avg < 8.0) {
            rankText = 'Khá';
            rankColor = 'var(--rank-kha)';
        } else {
            rankText = 'Giỏi';
            rankColor = 'var(--rank-gioi)';
        }

        finalRankEl.textContent = `Học lực: ${rankText}`;
        finalRankEl.style.backgroundColor = rankColor;
    }

    renderTable();
    calculateStats();
});
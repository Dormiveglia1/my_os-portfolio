document.addEventListener('DOMContentLoaded', () => {
    // MODIFIED: Display current date in the terminal boot sequence
    const sessionDateElement = document.getElementById('session-date');
    if (sessionDateElement) {
        const now = new Date();
        sessionDateElement.innerText = now.toString().split(' ').slice(0, 4).join(' ');
    }

    // Taskbar Clock
    function updateClock() {
        const now = new Date();
        // MODIFIED: 24h format for that "SysAdmin" feel
        const timeStr = now.toTimeString().split(' ')[0];
        document.getElementById('clock').innerText = timeStr;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
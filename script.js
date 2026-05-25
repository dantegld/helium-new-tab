    (function(){
        const bar = document.getElementById('day-progress');
        const fill = bar.querySelector('.fill');

        function percentOfDay() {
            const DATE_IN_MS = 86400000;
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(start.getDate() + 1);
            return Math.min(100, Math.max(0, ((now - start) / DATE_IN_MS) * 100));
        }

        function update() {
            const p = percentOfDay();
            fill.style.transform = 'scaleX(' + (p / 100) + ')';
            bar.setAttribute('aria-valuenow', Math.round(p));
        }

        setTimeout(update, 50)

        // Align updates to the next minute, then update every minute
        const now = new Date();
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout(function(){
            update();
            setInterval(update, 60 * 1000);
        }, msToNextMinute);
    })();
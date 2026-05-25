    (function(){
        const bar = document.getElementById('day-progress');
        if (!bar) return;
        const fill = bar.querySelector('.fill');
        if (!fill) return;

        function percentOfDay() {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const end = new Date(start);
            end.setDate(start.getDate() + 1);
            return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        }

        let desiredPercent = null;

        function applyTransform(p, animate) {
            if (!animate) {
                const prev = fill.style.transition;
                fill.style.transition = 'none';
                fill.style.transform = 'scaleX(' + (p / 100) + ')';
                fill.getBoundingClientRect(); // force reflow
                fill.style.transition = prev;
            } else {
                fill.style.transform = 'scaleX(' + (p / 100) + ')';
            }
            bar.setAttribute('aria-valuenow', Math.round(p));
        }

        function update(animateWhenVisible = true) {
            const p = percentOfDay();
            if (document.visibilityState !== 'visible') {
                desiredPercent = p;
                applyTransform(0, false);
                bar.setAttribute('aria-valuenow', Math.round(p));
            } else {
                applyTransform(p, animateWhenVisible);
            }
        }

        function onVisibilityChange() {
            if (document.visibilityState === 'visible' && desiredPercent !== null) {
                requestAnimationFrame(() => {
                    applyTransform(desiredPercent, true);
                    desiredPercent = null;
                });
            }
        }

        function scheduleMinuteUpdates() {
            const now = new Date();
            const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
            setTimeout(function(){
                update();
                setInterval(update, 60 * 1000);
            }, msToNextMinute);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                update(false);
                document.addEventListener('visibilitychange', onVisibilityChange);
                scheduleMinuteUpdates();
            });
        } else {
            update(false);
            document.addEventListener('visibilitychange', onVisibilityChange);
            scheduleMinuteUpdates();
        }
    })();
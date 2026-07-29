document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    var sidebar = document.getElementById('dashSidebar');
    var toggle = document.getElementById('sidebarToggle');
    var close = document.getElementById('sidebarClose');

    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    if (close && sidebar) {
        close.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle) {
            sidebar.classList.remove('open');
        }
    });

    // Section navigation
    var navLinks = document.querySelectorAll('.dash-nav-link[data-section]');
    var sections = document.querySelectorAll('.dash-section');
    var pageTitle = document.getElementById('pageTitle');
    var sectionTitles = {
        'overview': 'Dashboard Overview',
        'members': 'Member Management',
        'programs': 'Program Management',
        'myprograms': 'My Programs',
        'appointments': 'Appointment Management',
        'workouts': 'Workout Plans',
        'workout': 'Workout Plan',
        'nutrition': 'Nutrition Plan',
        'progress': 'Progress Tracking',
        'reviews': 'Reviews Management',
        'messages': 'Messages',
        'notifications': 'Notifications',
        'settings': 'Profile Settings',
        'profile': 'My Profile',
        'calculator': 'BMI & Calorie Calculator',
        'payments': 'Payment History',
        'tips': 'Health Tips'
    };

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('data-section');

            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');

            sections.forEach(function(s) { s.classList.remove('active'); });
            var targetSection = document.getElementById('section-' + target);
            if (targetSection) {
                targetSection.classList.add('active');
                // GSAP animate section entry
                if (typeof gsap !== 'undefined') {
                    gsap.from(targetSection, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' });
                }
            }

            if (pageTitle && sectionTitles[target]) {
                pageTitle.textContent = sectionTitles[target];
            }

            // Close sidebar on mobile
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    // Stat counter animation
    var statValues = Array.from(document.querySelectorAll('.dash-stat-value[data-count]'));
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var text = el.textContent;
                var prefix = text.replace(/[\d,.\s]/g, '');
                var current = 0;
                var increment = Math.max(1, Math.ceil(target / 60));
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = prefix + current.toLocaleString();
                }, 25);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(function(el) { counterObserver.observe(el); });

    // GSAP entrance animation
    if (typeof gsap !== 'undefined') {
        gsap.from('.dash-stat-card', {
            opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out'
        });
        gsap.from('.dash-card', {
            opacity: 0, y: 25, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.3
        });
    }

    // Chart colors
    var accent = '#C41E3A';
    var accentLight = 'rgba(196, 30, 58, 0.15)';
    var green = '#2A9D8F';
    var yellow = '#E9C46A';
    var orange = '#E8572A';
    var gridColor = 'rgba(255,255,255,0.06)';
    var tickColor = 'rgba(255,255,255,0.4)';

    var defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: tickColor, font: { family: 'Inter', size: 12 } } } },
        scales: {
            x: { ticks: { color: tickColor }, grid: { color: gridColor } },
            y: { ticks: { color: tickColor }, grid: { color: gridColor } }
        }
    };

    // Member Growth Chart (Trainer) with filter support
    var memberData = {
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            members: [12, 19, 8, 15, 22, 14, 18],
            sessions: [28, 35, 22, 40, 38, 30, 25]
        },
        month: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            members: [45, 52, 38, 61, 55, 48, 72],
            sessions: [120, 135, 110, 148, 142, 128, 165]
        },
        year: {
            labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
            members: [320, 480, 650, 890, 1200, 1560],
            sessions: [850, 1200, 1650, 2200, 2900, 3800]
        }
    };

    var mgc = document.getElementById('memberGrowthChart');
    var memberChart = null;
    if (mgc) {
        memberChart = new Chart(mgc, {
            type: 'line',
            data: {
                labels: memberData.week.labels,
                datasets: [{
                    label: 'New Members',
                    data: memberData.week.members,
                    borderColor: accent,
                    backgroundColor: accentLight,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: accent,
                    pointRadius: 4
                }, {
                    label: 'Active Sessions',
                    data: memberData.week.sessions,
                    borderColor: green,
                    backgroundColor: 'rgba(42,157,143,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: green,
                    pointRadius: 4
                }]
            },
            options: defaultOptions
        });
    }

    var filterBtns = document.querySelectorAll('.dash-filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            var period = this.textContent.toLowerCase().trim();
            if (memberChart && memberData[period]) {
                memberChart.data.labels = memberData[period].labels;
                memberChart.data.datasets[0].data = memberData[period].members;
                memberChart.data.datasets[1].data = memberData[period].sessions;
                memberChart.update();
            }
        });
    });

    // Program Distribution (Trainer)
    var pdc = document.getElementById('programDistChart');
    if (pdc) {
        new Chart(pdc, {
            type: 'doughnut',
            data: {
                labels: ['Strength', 'HIIT', 'Yoga', 'Nutrition', 'Group'],
                datasets: [{
                    data: [86, 72, 54, 98, 42],
                    backgroundColor: [accent, orange, green, '#264653', yellow],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: tickColor, font: { family: 'Inter', size: 11 }, padding: 12 } }
                }
            }
        });
    }

    // Weight Progress Chart
    var wpc = document.getElementById('weightProgressChart');
    if (wpc) {
        new Chart(wpc, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Weight (lbs)',
                    data: [190, 187, 184, 183, 181, 179, 178],
                    borderColor: accent,
                    backgroundColor: accentLight,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: accent,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: defaultOptions
        });
    }

    // Member Dashboard Charts
    var wac = document.getElementById('weeklyActivityChart');
    if (wac) {
        new Chart(wac, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Minutes',
                    data: [60, 45, 75, 0, 55, 40, 0],
                    backgroundColor: [accent, accent, accent, 'transparent', accent, accent, 'transparent'],
                    borderRadius: 8,
                    barThickness: 28
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: tickColor }, grid: { display: false } },
                    y: { ticks: { color: tickColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    var cc = document.getElementById('caloriesChart');
    if (cc) {
        new Chart(cc, {
            type: 'doughnut',
            data: {
                labels: ['Burned', 'Remaining'],
                datasets: [{
                    data: [2450, 750],
                    backgroundColor: [accent, 'rgba(255,255,255,0.06)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    var dwc = document.getElementById('dashWeightChart');
    if (dwc) {
        new Chart(dwc, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Weight (lbs)',
                    data: [190, 187, 184, 183, 181, 179, 178],
                    borderColor: accent,
                    backgroundColor: accentLight,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: accent,
                    pointRadius: 5
                }]
            },
            options: defaultOptions
        });
    }

    // Macro donut charts
    function drawMacroChart(canvasId, value, color) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [color, 'rgba(255,255,255,0.06)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '72%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }

    drawMacroChart('macroCalories', 92, accent);
    drawMacroChart('macroProtein', 91, green);
    drawMacroChart('macroCarbs', 88, yellow);
    drawMacroChart('dashMacroCalories', 84, accent);
    drawMacroChart('dashMacroProtein', 80, green);
    drawMacroChart('dashMacroCarbs', 75, yellow);

    // Workout item toggle
    var twItems = document.querySelectorAll('.dash-tw-item');
    twItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('completed');
            var check = this.querySelector('.dash-tw-check');
            if (check) {
                check.innerHTML = this.classList.contains('completed') ? '<i class="fas fa-check"></i>' : '';
            }
        });
    });
});

function initDashboardUser() {
    var name = localStorage.getItem('dashUserName') || 'User';
    var email = localStorage.getItem('dashUserEmail') || '';
    var rawRole = localStorage.getItem('dashUserRole') || '';

    function getInitials(n) {
        return n.trim().charAt(0).toUpperCase();
    }

    function setTextAvatar(container, userName) {
        if (!container) return;
        var img = container.querySelector('img');
        if (img) img.remove();
        container.textContent = getInitials(userName);
    }

    // Sidebar avatar + name + role
    var sidebarName = document.querySelector('.dash-user-name');
    if (sidebarName) sidebarName.textContent = name;

    var sidebarRole = document.querySelector('.dash-user-role');
    if (sidebarRole) {
        var roleLabel = rawRole === 'trainer' ? 'Head Trainer' : rawRole === 'member' ? 'Premium Member' : sidebarRole.textContent;
        sidebarRole.textContent = roleLabel;
    }

    // Text avatar in sidebar
    setTextAvatar(document.querySelector('.dash-user-avatar'), name);

    // Text avatar on profile page
    setTextAvatar(document.querySelector('.dash-profile-avatar'), name);

    // Text avatar on settings page
    setTextAvatar(document.querySelector('.dash-settings-avatar'), name);

    // Welcome heading
    var welcomeEl = document.querySelector('.dash-welcome-content h2');
    if (welcomeEl) {
        var firstName = name.split(' ')[0];
        welcomeEl.innerHTML = 'Welcome back, <span class="text-gradient">' + firstName + '</span>!';
    }

    return { name: name, email: email, role: rawRole };
}

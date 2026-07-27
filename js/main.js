/* ===========================
   Stackly - Main JavaScript (Multi-Page)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Navbar Scroll Effect ==========
    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
        if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== Active Nav Link based on current page ==========
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ========== Close Mobile Nav on Link Click ==========
    document.querySelectorAll('.navbar-nav .nav-link, .navbar .btn').forEach((link) => {
        link.addEventListener('click', () => {
            const collapse = document.getElementById('navbarNav');
            if (collapse && collapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ========== Scroll Animations (Intersection Observer) ==========
    const animateElements = document.querySelectorAll('[data-animate]');

    const animateObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, parseInt(delay));
                    animateObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach((el) => animateObserver.observe(el));

    // ========== Counter Animation ==========
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // ========== Hero Particles (Home page only) ==========
    const particleContainer = document.getElementById('heroParticles');

    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(196, 30, 58, ${Math.random() * 0.3 + 0.05});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 8 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 4}s;
            `;
            particleContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px) scale(1.2); opacity: 0.8; }
                50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * -30}px) scale(0.8); opacity: 0.3; }
                75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px) scale(1.1); opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }

    // ========== Testimonial Slider ==========
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dots = document.querySelectorAll('.tn-dot');
    const track = document.getElementById('testimonialTrack');

    if (prevBtn && nextBtn && track) {
        let currentSlide = 0;
        const totalSlides = dots.length;

        function updateSlider(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });

            if (window.innerWidth < 992) {
                const cards = track.querySelectorAll('.col-lg-4, .col-md-6');
                if (cards[currentSlide]) {
                    cards[currentSlide].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center',
                    });
                }
            }
        }

        prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
        nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateSlider(i));
        });
    }

    // ========== Contact Form ==========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check me-2"></i> Message Sent!';
                btn.style.background = '#00c896';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });
    }

    // ========== Pricing Card Animations ==========
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length) {
        const pricingObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = entry.target.classList.contains('popular')
                                ? 'scale(1.05)'
                                : 'translateY(0)';
                        }, index * 150);
                        pricingObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        pricingCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            pricingObserver.observe(card);
        });
    }

    // ========== Parallax on Hero (Home page only) ==========
    const heroSection = document.querySelector('.hero-section');

    if (heroSection && window.innerWidth > 991) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroSection.style.backgroundPositionY = `${scrollY * 0.3}px`;
            }
        }, { passive: true });
    }

    // ========== Tilt Effect on Service Cards ==========
    if (window.innerWidth > 767) {
        document.querySelectorAll('.service-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ========== Dynamic Year in Footer ==========
    document.querySelectorAll('.footer-bottom p').forEach((el) => {
        el.innerHTML = el.innerHTML.replace('2026', new Date().getFullYear());
    });

    // ========== Before/After Slider ==========
    document.querySelectorAll('.ba-slider').forEach((slider) => {
        const afterEl = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(5, Math.min(95, percent));
            afterEl.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.left = `${percent}%`;
        }

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                updateSlider(e.clientX);
            }
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => { isDragging = false; });
    });

    // ========== Smooth Scroll for same-page anchor links ==========
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== FAQ Accordion Icon Toggle ==========
    document.querySelectorAll('.faq-section .accordion-button').forEach((btn) => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('.faq-icon');
            if (icon) {
                const isOpen = this.classList.contains('collapsed');
                icon.className = isOpen ? 'fas fa-plus faq-icon' : 'fas fa-minus faq-icon';
            }
        });
    });

    // ========== BMI Calculator ==========
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');

    if (bmiForm) {
        const metricInputs = document.getElementById('metricInputs');
        const imperialInputs = document.getElementById('imperialInputs');
        const unitBtns = document.querySelectorAll('.bmi-unit-btn');
        let currentUnit = 'metric';

        unitBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                unitBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                currentUnit = btn.dataset.unit;

                if (currentUnit === 'metric') {
                    metricInputs.classList.remove('d-none');
                    imperialInputs.classList.add('d-none');
                } else {
                    metricInputs.classList.add('d-none');
                    imperialInputs.classList.remove('d-none');
                }
            });
        });

        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const gender = document.getElementById('bmiGender')?.value || '';
            const age = parseInt(document.getElementById('bmiAge')?.value) || 0;
            let bmi;

            if (currentUnit === 'metric') {
                const weight = parseFloat(document.getElementById('bmiWeight').value);
                const heightCm = parseFloat(document.getElementById('bmiHeightCm')?.value || document.getElementById('bmiHeight')?.value);

                if (!weight || !heightCm || weight <= 0 || heightCm <= 0) return;

                const heightM = heightCm / 100;
                bmi = weight / (heightM * heightM);
            } else {
                const weightLbs = parseFloat(document.getElementById('bmiWeightLbs').value) || 0;
                const weightSt = parseFloat(document.getElementById('bmiWeightSt').value) || 0;
                const heightFt = parseFloat(document.getElementById('bmiHeightFt').value) || 0;
                const heightIn = parseFloat(document.getElementById('bmiHeightIn').value) || 0;

                const totalWeightLbs = weightLbs + (weightSt * 14);
                const totalHeightIn = (heightFt * 12) + heightIn;

                if (totalWeightLbs <= 0 || totalHeightIn <= 0) return;

                bmi = (totalWeightLbs / (totalHeightIn * totalHeightIn)) * 703;
            }

            if (isNaN(bmi) || bmi <= 0 || bmi > 100) return;

            bmi = Math.round(bmi * 10) / 10;

            let category, message, categoryClass;

            const ageGroup = age >= 50 ? 'senior' : age >= 30 ? 'adult' : 'young';

            if (bmi < 18.5) {
                category = 'Underweight';
                categoryClass = 'underweight';
                if (ageGroup === 'senior') {
                    message = 'Your BMI indicates you may be underweight. At your age, maintaining adequate nutrition is especially important for bone density and muscle preservation. Consult a nutritionist for a tailored plan.';
                } else if (ageGroup === 'adult') {
                    message = 'Your BMI indicates you may be underweight. A balanced approach with strength training and nutrient-dense meals can help you build healthy muscle mass.';
                } else {
                    message = 'Your BMI indicates you may be underweight. Focus on a nutrient-rich diet combined with strength training to build a strong foundation.';
                }
            } else if (bmi < 25) {
                category = 'Normal';
                categoryClass = 'normal';
                if (ageGroup === 'senior') {
                    message = 'Your BMI is within the healthy range. Stay active with low-impact exercises and prioritize flexibility and balance training to maintain mobility.';
                } else if (ageGroup === 'adult') {
                    message = 'Your BMI is within the healthy range. Keep up the great work with consistent training and balanced nutrition to maintain your physique.';
                } else {
                    message = 'Your BMI is within the healthy range. Build healthy habits now â€” they\'ll serve you for life. Mix strength, cardio, and flexibility work.';
                }
            } else if (bmi < 30) {
                category = 'Overweight';
                categoryClass = 'overweight';
                if (ageGroup === 'senior') {
                    message = 'Your BMI suggests you may be slightly overweight. Gentle, consistent exercise combined with portion control can make a significant difference. Start slow and build gradually.';
                } else if (ageGroup === 'adult') {
                    message = 'Your BMI suggests you may be slightly overweight. A structured fitness program with resistance training and a moderate calorie deficit can help you lean out.';
                } else {
                    message = 'Your BMI suggests you may be slightly overweight. Now is a great time to build healthy habits â€” combine regular exercise with mindful eating.';
                }
            } else {
                category = 'Obese';
                categoryClass = 'obese';
                if (ageGroup === 'senior') {
                    message = 'Your BMI indicates obesity. We recommend a guided, low-impact program focused on gradual weight loss, mobility improvement, and overall wellness.';
                } else if (ageGroup === 'adult') {
                    message = 'Your BMI indicates obesity. Our trainers can design a safe, progressive program to help you build healthy habits and lose weight sustainably.';
                } else {
                    message = 'Your BMI indicates obesity. The good news â€” you\'re young and your body responds well to change. A structured program can transform your health.';
                }
            }

            bmiForm.style.display = 'none';
            bmiResult.classList.remove('d-none');

            const resultCircle = document.getElementById('bmiResultCircle');
            const resultNumber = document.getElementById('bmiResultNumber');
            const categoryBadge = document.getElementById('bmiCategoryBadge');
            const resultMessage = document.getElementById('bmiResultMessage');
            const barFill = document.getElementById('bmiBarFill');

            resultCircle.className = 'bmi-result-circle';
            categoryBadge.className = 'bmi-category-badge';

            let displayBmi = 0;
            const animDuration = 1200;
            const animStart = performance.now();

            function animateBmiNumber(now) {
                const elapsed = now - animStart;
                const progress = Math.min(elapsed / animDuration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                displayBmi = (eased * bmi).toFixed(1);
                resultNumber.textContent = displayBmi;

                if (progress < 1) {
                    requestAnimationFrame(animateBmiNumber);
                } else {
                    resultNumber.textContent = bmi.toFixed(1);
                }
            }

            requestAnimationFrame(animateBmiNumber);

            setTimeout(() => {
                resultCircle.classList.add(categoryClass);
                categoryBadge.classList.add(categoryClass);
                categoryBadge.textContent = category;
                resultMessage.textContent = message;

                const barPercent = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
                barFill.style.left = `calc(${barPercent}% - 10px)`;
            }, 200);
        });

        const recalcBtn = document.getElementById('bmiRecalculate');
        if (recalcBtn) {
            recalcBtn.addEventListener('click', () => {
                bmiForm.style.display = 'block';
                bmiResult.classList.add('d-none');
                bmiForm.reset();

                const genderSelect = document.getElementById('bmiGender');
                if (genderSelect) genderSelect.selectedIndex = 0;

                const ageInput = document.getElementById('bmiAge');
                if (ageInput) ageInput.value = '';

                unitBtns.forEach((b) => b.classList.remove('active'));
                unitBtns[0].classList.add('active');
                currentUnit = 'metric';
                if (metricInputs) metricInputs.classList.remove('d-none');
                if (imperialInputs) imperialInputs.classList.add('d-none');
            });
        }
    }

    // ========== Calorie Calculator ==========
    const calorieForm = document.getElementById('calorieForm');
    const calorieResult = document.getElementById('calorieResult');

    if (calorieForm) {
        calorieForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const gender = document.getElementById('calGender').value;
            const age = parseInt(document.getElementById('calAge').value);
            const weight = parseFloat(document.getElementById('calWeight').value);
            const height = parseFloat(document.getElementById('calHeight').value);
            const activity = parseFloat(document.getElementById('calActivity').value);

            if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) return;

            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }

            const tdee = Math.round(bmr * activity);
            const loseCal = Math.round(tdee - 500);
            const gainCal = Math.round(tdee + 300);

            calorieForm.style.display = 'none';
            calorieResult.classList.remove('d-none');

            const calorieNumber = document.getElementById('calorieNumber');
            const calLose = document.getElementById('calLose');
            const calMaintain = document.getElementById('calMaintain');
            const calGain = document.getElementById('calGain');

            let displayCal = 0;
            const animDuration = 1200;
            const animStart = performance.now();

            function animateCalNumber(now) {
                const elapsed = now - animStart;
                const progress = Math.min(elapsed / animDuration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                displayCal = Math.round(eased * tdee);
                calorieNumber.textContent = displayCal.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animateCalNumber);
                } else {
                    calorieNumber.textContent = tdee.toLocaleString();
                }
            }

            requestAnimationFrame(animateCalNumber);

            setTimeout(() => {
                calLose.textContent = loseCal.toLocaleString() + ' kcal';
                calMaintain.textContent = tdee.toLocaleString() + ' kcal';
                calGain.textContent = gainCal.toLocaleString() + ' kcal';
            }, 200);
        });

        const calRecalcBtn = document.getElementById('calorieRecalculate');
        if (calRecalcBtn) {
            calRecalcBtn.addEventListener('click', () => {
                calorieForm.style.display = 'block';
                calorieResult.classList.add('d-none');
                calorieForm.reset();
            });
        }
    }

});

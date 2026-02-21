document.addEventListener('DOMContentLoaded', function () {
    // --- Global Variables ---
    const mapPositions = { // Positions for the global map dots
        sg: { top: '55%', left: '79%' },
        sel: { top: '42%', left: '85%' },
        tky: { top: '43%', left: '89%' },
        ldn: { top: '35%', left: '48%' }
    };
    
    // --- Navigation Menu Logic ---
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        const navButton = navContainer.querySelector('.button');
        const navBackground = navContainer.querySelector('.bg');

        if (navButton) {
            navButton.addEventListener('click', function() {
                navContainer.classList.toggle('is-open');
            });
        }
        if (navBackground) {
            navBackground.addEventListener('click', function() {
                navContainer.classList.remove('is-open');
            });
        }
    }

    // --- Timeline Initialization Logic ---
    let pageKey = null;
    let timelineContainer = null;

    if (document.getElementById('timeline-1')) {
        pageKey = 'page1';
        timelineContainer = document.getElementById('timeline-1');
    } else if (document.getElementById('timeline-2')) {
        pageKey = 'page2';
        timelineContainer = document.getElementById('timeline-2');
    } else if (document.getElementById('timeline-3')) {
        pageKey = 'page3';
        timelineContainer = document.getElementById('timeline-3');
    }

    // --- Main Fetch and Initialization ---
    // Fetch quiz data first, as it's needed on all pages
    fetch('http://localhost:3000/api/quiz')
        .then(response => response.json())
        .then(quizData => {
            initializeQuiz(quizData);
        })
        .catch(error => console.error('Error fetching quiz data:', error));

    // If we are on a timeline page, fetch its specific data
    if (pageKey && timelineContainer) {
        fetch(`http://localhost:3000/api/${pageKey}`)
            .then(response => response.json())
            .then(events => {
                renderTimeline(events);
                
                // Initialize all dynamic content AFTER rendering
                initializeScrollTimeline();
                initializeExpandables(); // For videos
                setupExpandableImage(); // For images
                initializeSlideshows();
                addSmartphoneInteractivity();
                
                // Page-specific initializers
                if (pageKey === 'page2') {
                    initializeDigitalDivideChart(events);
                    initializeSocialMediaSlider(events);
                    initializeInteractiveMap();
                }
                
                if (pageKey === 'page3') {
                    initializeInteractivePopups();
                    initializeMediaCarousel();
                    initialize5gMapAnimation();
                    initializeCyberChart(events);
                }
            })
            .catch(error => {
                console.error(`Error fetching data for ${pageKey}:`, error);
                if(timelineContainer) {
                    timelineContainer.innerHTML = `<p style="color:red; padding:20px; text-align:center;">Could not load timeline data. Please ensure the API server is running.</p>`;
                }
            });
    }
    
    function renderTimeline(events) {
        const templateSource = document.getElementById('event-template').innerHTML;
        const template = Handlebars.compile(templateSource);
        const timelineElement = timelineContainer.querySelector('#timeline');
        timelineElement.innerHTML = template(events, { data: { mapPositions: mapPositions } });
    }

    function initializeScrollTimeline() {
        const entries = document.querySelectorAll('.timeline-entry');
        if (entries.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((observedEntries) => {
            observedEntries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                } else {
                    entry.target.classList.remove('is-active');
                }
            });
        }, observerOptions);

        entries.forEach(entry => observer.observe(entry));
    }

    // --- EXPANDABLE CONTENT FUNCTIONS ---
    function initializeExpandables() { // For Videos
        const expandButtons = document.querySelectorAll('.expand-button');
        expandButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const contentId = button.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                const entry = button.closest('.timeline-entry');

                button.setAttribute('aria-expanded', !isExpanded);
                
                if (content) {
                    content.hidden = isExpanded;
                }
                if (entry) {
                    entry.classList.toggle('is-expanded');
                }
            });
        });
    }

    function setupExpandableImage() { // For Images
        document.querySelectorAll('.view-more-button').forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const targetContainer = document.querySelector(targetId);
                if (targetContainer) {
                    targetContainer.classList.toggle('expanded');
                    if (targetContainer.classList.contains('expanded')) {
                        this.textContent = 'View Less';
                    } else {
                        this.textContent = 'View More';
                    }
                }
            });
        });
    }

    // --- QUIZ FUNCTIONS ---
    function initializeQuiz(quiz) {
        const quizModal = document.getElementById('quiz-modal');
        if (!quizModal || !quiz || !quiz.questions) return;

        const navQuizBtn = document.getElementById('nav-quiz-btn');
        const footerQuizBtn = document.getElementById('footer-quiz-btn');
        const startBtn = document.getElementById('quiz-start-btn');
        const closeBtn = document.getElementById('quiz-close-btn');
        
        const openQuiz = (e) => {
            e.preventDefault();
            quizModal.classList.add('is-visible');
            navContainer.classList.remove('is-open');
        };
        const closeQuiz = () => {
            quizModal.classList.remove('is-visible');
            setTimeout(() => {
                document.getElementById('quiz-content').hidden = true;
                document.getElementById('quiz-start-screen').hidden = false;
            }, 300);
        };

        if (navQuizBtn) navQuizBtn.addEventListener('click', openQuiz);
        if (footerQuizBtn) footerQuizBtn.addEventListener('click', openQuiz);
        if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
        
        quizModal.addEventListener('click', (e) => {
            if (e.target === quizModal) closeQuiz();
        });

        startBtn.addEventListener('click', () => {
            document.getElementById('quiz-start-screen').hidden = true;
            renderQuizQuestions(quiz);
            document.getElementById('quiz-content').hidden = false;
        });
    }

    function renderQuizQuestions(quiz) {
        const contentDiv = document.getElementById('quiz-content');
        contentDiv.innerHTML = '';
        let html = '';

        quiz.questions.forEach((q, index) => {
            html += `<div class="quiz-question">
                        <p>${index + 1}. ${q.question}</p>
                        <ul class="quiz-options">`;
            q.options.forEach((option, i) => {
                html += `<li>
                           <label>
                               <input type="radio" name="question-${index}" value="${i}">
                               <span>${option}</span>
                           </label>
                         </li>`;
            });
            html += `</ul></div>`;
        });
        
        const submitButton = document.createElement('button');
        submitButton.id = 'quiz-submit-btn';
        submitButton.className = 'quiz-button';
        submitButton.textContent = 'Submit Answers';
        
        contentDiv.innerHTML = html;
        contentDiv.appendChild(submitButton);

        submitButton.addEventListener('click', () => checkAnswers(quiz));
    }

    function checkAnswers(quiz) {
        let score = 0;
        
        const submitButton = document.getElementById('quiz-submit-btn');
        if (submitButton) submitButton.style.display = 'none';

        quiz.questions.forEach((q, index) => {
            const correctAnswerIndex = q.answer;
            const options = document.querySelectorAll(`input[name="question-${index}"]`);
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            
            options.forEach((option, i) => {
                const label = option.parentElement;
                option.disabled = true;

                if (i === correctAnswerIndex) {
                    label.classList.add('correct');
                }

                if (selectedOption && option === selectedOption && parseInt(selectedOption.value) !== correctAnswerIndex) {
                    label.classList.add('incorrect');
                }
            });

            if (selectedOption && parseInt(selectedOption.value) === correctAnswerIndex) {
                score++;
            }
        });

        showInPlaceResults(score, quiz.questions.length);
    }

    function showInPlaceResults(score, total) {
        const contentDiv = document.getElementById('quiz-content');
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'quiz-inplace-results';
        resultsDiv.innerHTML = `
            <h2>Quiz Complete!</h2>
            <p class="quiz-score-text">You scored <span>${score}</span> out of ${total}.</p>
            <button id="quiz-retry-inplace-btn" class="quiz-button">Try Again</button>
        `;
        contentDiv.appendChild(resultsDiv);
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });

        document.getElementById('quiz-retry-inplace-btn').addEventListener('click', () => {
            document.getElementById('quiz-content').hidden = true;
            document.getElementById('quiz-start-screen').hidden = false;
        });
    }

    // --- PAGE 2 WIDGETS ---
    function initializeDigitalDivideChart(events) {
        const chartCanvas = document.getElementById('digital-divide-chart');
        if (!chartCanvas) return;
        const chartData = events.find(e => e.digital_divide_chart)?.digital_divide_chart.data;
        if (!chartData) return;
        const ctx = chartCanvas.getContext('2d');
        const digitalDivideChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData['2010'].labels,
                datasets: [{
                    label: '% Internet Usage',
                    data: chartData['2010'].values,
                    backgroundColor: ['#BF7497', '#ffcc00'],
                    borderColor: ['#a55f7f', '#e6b800'],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: '2010 Internet Adoption', color: '#fff' }
                },
                scales: {
                    x: { max: 100, ticks: { color: '#ccc' }, grid: { color: '#555' } },
                    y: { ticks: { color: '#ccc' }, grid: { color: '#444' } }
                }
            }
        });

        const toggleButton = document.getElementById('chart-toggle-btn');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const currentYear = toggleButton.dataset.year;
                const nextYear = currentYear === '2010' ? '2020' : '2010';
                
                digitalDivideChart.data.labels = chartData[nextYear].labels;
                digitalDivideChart.data.datasets[0].data = chartData[nextYear].values;
                digitalDivideChart.options.plugins.title.text = `${nextYear} Internet Adoption`;
                digitalDivideChart.update();
    
                toggleButton.dataset.year = nextYear;
                toggleButton.textContent = `View ${currentYear} Stats`;
            });
        }
    }
    
    function initializeSocialMediaSlider(events) {
        const sliderData = events.find(e => e.social_media_slider)?.social_media_slider;
        if (!sliderData) return;

        const slider = document.querySelector('.slider');
        if (!slider) return;
        
        const id = slider.dataset.id;
        const yearLabel = document.getElementById(`slider-year-${id}`);
        const logosContainer = document.getElementById(`app-logos-${id}`);

        const updateLogos = (year) => {
            const yearData = sliderData.years.find(y => y.year == year);
            if (yearData) {
                logosContainer.innerHTML = yearData.apps.map(app => `<img src="img/${app}" alt="${app.split('.')[0]}">`).join('');
                
                setTimeout(() => {
                    logosContainer.querySelectorAll('img').forEach(img => img.classList.add('visible'));
                }, 50);
            }
        };

        slider.addEventListener('input', (e) => {
            const year = e.target.value;
            yearLabel.textContent = year;
            updateLogos(year);
        });

        updateLogos(slider.value);
    }

    function initializeInteractiveMap() {
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;

        const tooltip = mapContainer.querySelector('#map-tooltip');
        const paths = mapContainer.querySelectorAll('.region-path');

        paths.forEach(path => {
            path.addEventListener('mousemove', e => {
                const rect = mapContainer.getBoundingClientRect();
                
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.clientX - rect.left}px`;
                tooltip.style.top = `${e.clientY - rect.top}px`;
                tooltip.innerHTML = `<strong>${path.dataset.region}</strong>
                                     4G Download: ${path.dataset.speed}<br>
                                     4G Availability: ${path.dataset.availability}`;
            });
            path.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });
        });
    }

    // --- PAGE 3 WIDGETS ---
    function initializeInteractivePopups() {
        const popups = document.querySelectorAll('.pop-up-fact-interactive');
        if (popups.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.5 });

        popups.forEach(popup => observer.observe(popup));
    }

    function initializeMediaCarousel() {
        const carousels = document.querySelectorAll('.media-carousel');
        carousels.forEach(carousel => {
            let currentIndex = 0;
            const inner = carousel.querySelector('.carousel-inner');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            const totalSlides = slides.length;

            if (totalSlides <= 1) return;

            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.dot');

            function showSlide(index) {
                currentIndex = index;
                inner.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalSlides;
                showSlide(currentIndex);
            }

            showSlide(0);
            setInterval(nextSlide, 4000);
        });
    }

    function initialize5gMapAnimation() {
        const map = document.querySelector('.animated-map-container-5g');
        if (!map) return;
        const progressBar = map.querySelector('.map-progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.classList.add('is-animating');
                } else {
                    progressBar.classList.remove('is-animating');
                }
            });
        }, { threshold: 0.5 });
        observer.observe(map);
    }
    
    function initializeCyberChart(events) {
        const chartCanvas = document.getElementById('cyber-chart');
        if (!chartCanvas) return;
        
        const chartData = events.find(e => e.animated_chart_cyber)?.animated_chart_cyber.data;
        if (!chartData) return;

        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Reported Cases',
                    data: chartData.values,
                    backgroundColor: 'rgba(0, 170, 255, 0.6)',
                    borderColor: 'rgba(0, 170, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: { ticks: { color: '#ccc' }, grid: { color: '#444' } },
                    y: { ticks: { color: '#ccc' }, grid: { color: '#555' } }
                }
            }
        });
    }
    
    function initializeSlideshows() {
        const slideshowCards = document.querySelectorAll('.slideshow-card');
        
        slideshowCards.forEach(card => {
            let currentIndex = 0;
            const slidesInner = card.querySelector('.slideshow-inner');
            const slides = card.querySelectorAll('.slide');
            const dotsContainer = card.querySelector('.slide-dots');
            const totalSlides = slides.length;

            if (totalSlides <= 1) {
                const nav = card.querySelector('.slideshow-nav');
                if(nav) nav.style.display = 'none';
                return;
            }

            card.setAttribute('data-slides', totalSlides.toString());

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                    dot.setAttribute('title', `Slide ${i + 1} of ${totalSlides}`);
                    dot.addEventListener('click', () => showSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

            function showSlide(index) {
                currentIndex = (index + totalSlides) % totalSlides;
                
                const offset = -currentIndex * 100;
                slidesInner.style.transform = `translateX(${offset}%)`;
                
                card.setAttribute('data-slide', currentIndex.toString());
                
                if (dots.length > 0) {
                    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
                }

                const currentSlide = slides[currentIndex];
                const caption = currentSlide.querySelector('.slide-caption');
                if (caption) {
                    caption.style.animation = 'none';
                    caption.offsetHeight; 
                    caption.style.animation = 'slideUp 0.8s ease-out forwards';
                }
            }

            const prevButton = card.querySelector('.prev');
            const nextButton = card.querySelector('.next');

            if (prevButton) prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
            if (nextButton) nextButton.addEventListener('click', () => showSlide(currentIndex + 1));

            showSlide(0);
        });
    }

    function addSmartphoneInteractivity() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.slideshow-card .slide img')) {
                const caption = e.target.closest('.slide')?.querySelector('.slide-caption');
                
                e.target.classList.add('clicked');
                setTimeout(() => e.target.classList.remove('clicked'), 150);

                if (caption) {
                    caption.classList.add('highlight');
                    setTimeout(() => caption.classList.remove('highlight'), 1500);
                }
            }
        });
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]:not(#nav-quiz-btn)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
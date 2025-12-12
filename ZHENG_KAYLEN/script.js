document.addEventListener('DOMContentLoaded', () => {
    
    function showModalFromHash() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });

        const hash = window.location.hash;
        
        if (hash) { 
            const modal = document.querySelector(hash);
            if (modal) {
                modal.style.display = 'flex';
                
                const link = document.querySelector(`a[href='${hash}']`);
                const desiredTitle = link?.dataset?.title || link?.title;
                const titleEl = modal.querySelector('.modal-content h3');
                if (titleEl && desiredTitle) {
                    titleEl.textContent = desiredTitle;
                }

                const iframe = modal.querySelector('iframe[data-src]');
                if (iframe && !iframe.src) {
                    iframe.src = iframe.dataset.src;
                }
            }
        }
    }

    function closeModal() {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            
            const iframe = modal.querySelector('iframe[data-src]');
            if (iframe && iframe.src) {
                iframe.src = '';
            }
        });
    }

    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    window.addEventListener('hashchange', showModalFromHash);

    showModalFromHash();

    function setupContinuousScroller(scroller) {
        if (!scroller) return;
        if (scroller.dataset.scrollerInit === 'true') return;
        scroller.dataset.scrollerInit = 'true';

        const inner = scroller.querySelector('.inner');
        if (!inner) return;

        const ensureWideEnough = () => {
            const containerWidth = scroller.clientWidth || window.innerWidth;
            const originals = Array.from(inner.children);
            if (originals.length === 0) return;
            let i = 0;
            while (inner.scrollWidth < containerWidth * 1.5) {
                inner.appendChild(originals[i % originals.length].cloneNode(true));
                i++;
                if (i > 500) break;
            }
        };

        ensureWideEnough();

        const clone = inner.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        scroller.appendChild(clone);

        const computeAndApplyDuration = () => {
            const distance = inner.scrollWidth;
            const speedPxPerSec = 100;
            let duration = Math.max(6, distance / speedPxPerSec);

            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                inner.style.animation = 'none';
                clone.style.animation = 'none';
                return;
            }

            inner.style.animationDuration = duration + 's';
            clone.style.animationDuration = duration + 's';
            const offset = Math.random() * duration;
            inner.style.animationDelay = `-${offset}s`;
            clone.style.animationDelay = `-${offset}s`;
            inner.style.animationPlayState = 'running';
            clone.style.animationPlayState = 'running';
        };

        computeAndApplyDuration();

        scroller.addEventListener('mouseenter', () => {
            inner.style.animationPlayState = 'paused';
            clone.style.animationPlayState = 'paused';
        });
        scroller.addEventListener('mouseleave', () => {
            inner.style.animationPlayState = 'running';
            clone.style.animationPlayState = 'running';
        });

        let rt;
        window.addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(() => {
                if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                computeAndApplyDuration();
            }, 150);
        });
    }

    document.querySelectorAll('.name-scroller').forEach(scroller => {
        setupContinuousScroller(scroller);
    });

    document.querySelectorAll('.name-scroller').forEach(scroller => {
        if (scroller.dataset.scrollerInit === 'true') return;
        setupContinuousScroller.call({querySelector: () => scroller});
    });

    let isBlurred = false;

    window.addEventListener('wheel', (e) => {
        const scrollingUp = e.deltaY < 0;
        const scrollingDown = e.deltaY > 0;

        if (scrollingDown) {
            document.body.classList.add('facts-hidden');
            if (!isBlurred) {
                document.body.classList.add('blurred');
                isBlurred = true;
            }
        } else if (scrollingUp) {
            document.body.classList.remove('facts-hidden');
            if (isBlurred) {
                document.body.classList.remove('blurred');
                isBlurred = false;
            }
        }
    }, { passive: true });

    const facts = [
        "The Orion Nebula is 1,344 light-years away from Earth.",
        "It contains enough material to form over 2,000 stars like our Sun.",
        "The nebula is visible to the naked eye as a fuzzy patch in the night sky.",
        "It's one of the most photographed objects in space.",
        "The nebula is approximately 24 light-years across.",
        "Four massive stars at its center form the 'Trapezium' cluster.",
        "It's a stellar nursery where new stars are constantly being born.",
        "The nebula is part of the larger Orion Molecular Cloud Complex.",
        "It was first discovered in 1610 by Nicolas-Claude Fabri de Peiresc.",
        "The nebula glows due to ultraviolet radiation from young hot stars.",
        "Over 700 stars in various stages of formation have been observed within it.",
        "The nebula's gas is mostly hydrogen with traces of helium and heavier elements."
    ];

    const factText = document.getElementById('fact-text');
    let currentFactIndex = 0;
    let typingInterval = null;
    let factTimeout = null;

    function typeFact(text, onDone) {
        if (!factText) return;

        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        if (factTimeout) {
            clearTimeout(factTimeout);
            factTimeout = null;
        }

        factText.classList.add('typing');
        factText.textContent = '';

        let charIndex = 0;
        typingInterval = setInterval(() => {
            factText.textContent += text.charAt(charIndex);
            charIndex++;

            if (charIndex >= text.length) {
                clearInterval(typingInterval);
                typingInterval = null;
                factText.classList.remove('typing');
                if (typeof onDone === 'function') {
                    factTimeout = setTimeout(onDone, 7000);
                }
            }
        }, 35);
    }

    function showNextFact() {
        if (!factText) return;
        currentFactIndex = (currentFactIndex + 1) % facts.length;
        typeFact(facts[currentFactIndex], showNextFact);
    }

    if (factText) {
        typeFact(facts[0], showNextFact);
    }
});
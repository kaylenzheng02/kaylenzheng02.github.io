window.enterPortfolio = function() {
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        introScreen.classList.add('hidden');
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
        document.body.classList.add('blurred');
    }, 300);
};

function animateReadyText() {
    const element = document.getElementById('ready-text-animated');
    if (!element) return;
    
    const text = 'ready to explore?';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?';
    const charsPerLetter = 10;
    const frameTime = 30;
    
    let currentPos = 0;
    let charIteration = 0;
    
    function frame() {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            if (i < currentPos) {
                result += text[i];
            } else if (i === currentPos) {
                result += chars[Math.floor(Math.random() * chars.length)];
            } else {
                result += ' ';
            }
        }
        
        element.textContent = result;
        
        charIteration++;
        
        if (charIteration >= charsPerLetter) {
            charIteration = 0;
            currentPos++;
            
            if (currentPos > 0 && currentPos <= text.length) {
                let result = '';
                for (let i = 0; i < text.length; i++) {
                    if (i < currentPos) {
                        result += text[i];
                    } else {
                        result += ' ';
                    }
                }
                element.textContent = result;
            }
        }
        
        if (currentPos < text.length) {
            setTimeout(frame, frameTime);
        } else {
            element.textContent = text;
            const enterBtn = document.querySelector('.enter-btn');
            if (enterBtn) {
                enterBtn.style.opacity = '1';
                enterBtn.style.pointerEvents = 'auto';
            }
        }
    }
    
    frame();
}

document.addEventListener('DOMContentLoaded', () => {
    animateReadyText();
    
    const galleryImages = {
        4: ['Images/halo.png', 'Images/sweater.png']
    };
    const galleryIndices = {
        4: 0
    };

    window.changeGalleryImage = function(projectNum, direction) {
        if (!galleryImages[projectNum]) return;
        
        galleryIndices[projectNum] += direction;
        const imageArray = galleryImages[projectNum];
        
        if (galleryIndices[projectNum] < 0) {
            galleryIndices[projectNum] = imageArray.length - 1;
        } else if (galleryIndices[projectNum] >= imageArray.length) {
            galleryIndices[projectNum] = 0;
        }
        
        const imgElement = document.querySelector(`#project${projectNum}-img`);
        if (imgElement) {
            imgElement.classList.add('fade-out');
            
            setTimeout(() => {
                imgElement.src = imageArray[galleryIndices[projectNum]];
                imgElement.classList.remove('fade-out');
            }, 150);
        }
    };
    
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
        const hash = window.location.hash;
        history.pushState("", document.title, window.location.pathname + window.location.search);
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            
            const iframe = modal.querySelector('iframe[data-src]');
            if (iframe && iframe.src) {
                iframe.src = '';
            }
        });

        if (hash) {
            const link = document.querySelector(`a[href='${hash}']`);
            const redbox = link?.querySelector('.redbox');
            
            if (redbox) {
                redbox.style.transition = 'opacity 400ms ease-in-out';
                redbox.style.opacity = '0';
                redbox.style.pointerEvents = 'none';

                setTimeout(() => {
                    redbox.style.opacity = '1';
                    redbox.style.pointerEvents = 'auto';
                }, 10000);
            }
        }
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
        "Webb's Serpens is located approximately 1,300 light-years away in the constellation Serpens.",
        "It is a stellar nursery where new stars are actively forming.",
        "The region contains multiple protostars and young stellar objects.",
        "Webb's infrared observations reveal hidden stars behind cosmic dust.",
        "The nebula is approximately 8 light-years across.",
        "It contains a cluster of massive young stars driving outflows and jets.",
        "This is one of the closest star-forming regions to Earth.",
        "The region is part of the larger Serpens Molecular Cloud.",
        "It was extensively observed by the James Webb Space Telescope.",
        "The nebula's gas and dust glow in infrared wavelengths.",
        "Hundreds of young stellar objects have been identified within it.",
        "The region continues to produce new stars and planetary systems."
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

window.openProjectDescription = function(projectNum) {
    const modal = document.getElementById(`project${projectNum}-desc-modal`);
    if (modal) {
        modal.style.display = 'block';
    }
};
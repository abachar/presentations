window.KeynoteJS = (function() {
    var config = {
            width: 1024,
            height: 768,
            futureClass: 'future',
            presentClass: 'present',
            pastClass: 'past'
        },
        container,
        slides,
        activeSlide = 0;

    function initialize(selector) {
        container = document.querySelector(selector);
        slides = container.querySelectorAll('.slide');

        activeSlide = getSlideNumberFromHash();
        setClasses();
        scale();
        setupEvents();

        setTimeout(function() {
            container.classList.add('transition');
        }, 1);
    }

    function setClasses() {
        [].forEach.call(slides, function(elem, index) {
            if (index < activeSlide) {
                elem.classList.add(config.pastClass);
            } else if (index > activeSlide) {
                elem.classList.add(config.futureClass);
            } else {
                elem.classList.add(config.presentClass);
            }
        });
    }

    function setupEvents() {
        document.addEventListener('keydown', onDocumentKeyDown, false);
        window.addEventListener('hashchange', onWindowHashChange, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onDocumentKeyDown(event) {
        var key = event.which;

        switch (event.keyCode) {
            case 32: case 39:
                nextSlide();
                break;

            case 37:
                prevSlide();
                break;
        }
    }

    function onWindowResize() {
        scale();
    }

    function onWindowHashChange() {
        var index = getSlideNumberFromHash();
        slideToSlide(index);
    }

    function getSlideNumberFromHash() {
        var hash = window.location.hash;
        return (/^#\/\d+$/.test(hash)) ?
            parseInt(hash.replace(/#\//gi, '')) : 0;
    }

    function scale() {
        var scale = Math.min((window.innerWidth * 0.9) / config.width, (window.innerHeight * 0.9) / config.height);
        container.style.transform = 'translate(-50%, -50%) scale('+ scale +')';
    }

    function nextSlide() {
        switchToSlide(activeSlide + 1);
    }

    function prevSlide() {
        switchToSlide(activeSlide - 1);
    }

    function switchToSlide(index) {
        if ((index >= 0) && (index < slides.length) && (index !== activeSlide)) {

            var next   = slides[index],
                active = slides[activeSlide];

            active.classList.remove(config.presentClass);
            active.classList.add(index > activeSlide ? config.pastClass : config.futureClass);

            next.classList.remove(config.pastClass, config.futureClass);
            next.classList.add(config.presentClass);

            activeSlide = index;
            window.location.hash = '/' + ((index > 0) ? index : '');
        }
    }

    function slideToSlide(slideIndex) {
        if (slideIndex < activeSlide) {
            for (var i = activeSlide; i >= slideIndex; i--) {
                slides[i].classList.remove(config.presentClass, config.pastClass);
                slides[i].classList.add((i !== slideIndex) ? config.futureClass : config.presentClass);
            }
        } else if (slideIndex > activeSlide) {
            for (var i = activeSlide; i <= slideIndex; i++) {
                slides[i].classList.remove(config.presentClass, config.futureClass);
                slides[i].classList.add((i !== slideIndex) ? config.pastClass : config.presentClass);
            }
        }

        activeSlide = slideIndex;
        window.location.hash = '/' + ((activeSlide > 0) ? activeSlide : '');
    }

    var KeynoteJS = {
        initialize: initialize,
        nextSlide: nextSlide,
        prevSlide: prevSlide
    };

    return KeynoteJS;
}());
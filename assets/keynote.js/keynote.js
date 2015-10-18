// Constants
var FUTURE_CLASS  = 'future';
var PAST_CLASS    = 'past';
var PRESENT_CLASS = 'present';

var KeynoteJS = function (container) {
    this.container = document.querySelector(container);
    this.slides    = this.container.querySelectorAll('.slide');

    return this
        ._readUrl()
        ._setClasses()
        ._setupEvents();
};

KeynoteJS.prototype = {
    _readUrl: function () {
        var hash = window.location.hash;
        if (/^#\/\d+$/.test(hash)) {
            var index = parseInt(hash.replace(/#|\//gi, ''));
            if ((index >= 0) && (index < this.slides.length)) {
                this.activeSlide = index;
            }
        } else {
            window.location.hash = '#/';
            this.activeSlide = 0;
        }

        return this;
    },

    _setClasses: function () {
        var activeSlide = this.activeSlide;

        [].forEach.call(this.slides, function(elem, index) {
            if (index < activeSlide) {
                elem.classList.add(PAST_CLASS);
            } else if (index > activeSlide) {
                elem.classList.add(FUTURE_CLASS);
            } else {
                elem.classList.add(PRESENT_CLASS);
            }
        });

        return this;
    },

    _setupEvents: function () {
        var self = this;

        document.addEventListener('keydown', function() {
            var key = event.which;

            if (key === 39 || key === 32) {
                event.preventDefault();
                self.nextSlide();
            } else if (key === 37) {
                event.preventDefault();
                self.prevSlide();
            }
        });

        return this;
    },

    nextSlide: function () {
        this.scrollToSlide(this.activeSlide + 1);
    },

    prevSlide: function () {
        this.scrollToSlide(this.activeSlide - 1);
    },

    scrollToSlide: function (index) {
        if ((index >= 0) && (index < this.slides.length) && (index !== this.activeSlide)) {

            var next   = this.slides[index],
                active = this.slides[this.activeSlide];

            active.classList.remove(PRESENT_CLASS);
            active.classList.add(index > this.activeSlide ? PAST_CLASS : FUTURE_CLASS);

            next.classList.remove(PAST_CLASS, FUTURE_CLASS);
            next.classList.add(PRESENT_CLASS);

            this.activeSlide = index;
            window.location.hash = '/' + ((index > 0) ? index : '');
        }
    }
};

window.KeynoteJS = KeynoteJS;
(function ($, window, undefined) {
    // Constants
    var FUTURE_CLASS = 'future';
    var PAST_CLASS = 'past';
    var PRESENT_CLASS = 'present';


    var KeynoteJS = function (container) {
            this.container = container;
            return this.init();
        },
        $window = $(window),
        $document = $(document);

    KeynoteJS.prototype = {
        init: function () {
            this.config = {
                activeClass: 'active',
                inactiveClass: 'inactive',
                margin: 100,
                scrollLength: 600,
                easing: 'swing'
            };

            this.$container = $(this.container);
            this.$slides = this.$container.find('.slide');
            this.$activeSlide = 0;

            return this
                ._setClasses()
                ._setupEvents();
        },

        _setClasses: function () {
            var activeSlide = this.$activeSlide;

            this.$slides.each(function(index, elem) {
                if (index < activeSlide) {
                    $(elem).addClass(PAST_CLASS);
                } else if (index > activeSlide) {
                    $(elem).addClass(FUTURE_CLASS);
                } else {
                    $(elem).addClass(PRESENT_CLASS);
                }
            });

            return this;
        },

        _setupEvents: function () {
            var self = this;

            $document.keydown(function (event) {
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
            this.scrollToSlide(this.$activeSlide + 1);
        },

        prevSlide: function () {
            this.scrollToSlide(this.$activeSlide - 1);
        },

        scrollToSlide: function (index) {
            if ((index >= 0) && (index < this.$slides.length) && (index !== this.$activeSlide)) {

                var elem   = $(this.$slides[index]),
                    active = $(this.$slides[this.$activeSlide]);

                active
                    .removeClass(PRESENT_CLASS)
                    .addClass(index > this.$activeSlide ? PAST_CLASS : FUTURE_CLASS);

                elem
                    .removeClass(PAST_CLASS).removeClass(FUTURE_CLASS)
                    .addClass(PRESENT_CLASS);

                this.$activeSlide = index;
            }
        }
    };

    window.KeynoteJS = KeynoteJS;
})(jQuery, window);
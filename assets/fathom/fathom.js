/*
 * Fathom.js v1.2.5
 * Copyright 2012-15, Mark Dalgleish
 *
 * This content is released under the MIT License
 * markdalgleish.mit-license.org
 */

(function($, window, undefined){
	var Fathom = function(container, options){
			this.container = container;
			this.options = options;
			
			return this.init();
		},
		$window = $(window),
		$document = $(document);
	
	Fathom.prototype = {
		defaults: {
			activeClass: 'active',
			inactiveClass: 'inactive',
			margin: 100,
			onScrollInterval: 300,
			scrollLength: 600,
			easing: 'swing',

			onActivateSlide: undefined,
			onDeactivateSlide: undefined
		},
		
		init: function() {
			this.config = $.extend({}, this.defaults, this.options);
			
			this.$container = $(this.container);
			this.$slides = this.$container.find('.slide');
			this.$firstSlide = this.$slides.filter(':first');
			this.$lastSlide = this.$slides.filter(':last');
			this.$activeSlide = this.activateSlide(this.$firstSlide);
			
			return this
				._setClasses()
				._setMargins()
				._setupEvents()
				._setupScrollHandler();
		},
		
		nextSlide: function() {
			return this.scrollToSlide(this.$activeSlide.next());
		},
		
		prevSlide: function() {
			return this.scrollToSlide(this.$activeSlide.prev());
		},
		
		scrollToSlide: function($elem) {
			var self = this,
				$scrollingElement = $('html,body'),
				$container = $window;
			
			if ($elem.length !== 1) {
				return $elem;
			}
			
			this.isAutoScrolling = true;
			
			$scrollingElement.stop().animate({
				scrollLeft: ($elem.position().left - 
					(($container.width() - $elem.innerWidth()) / 2))
			}, self.config.scrollLength, self.config.easing, function() {
				self.isAutoScrolling = false;
			});
			
			return this.activateSlide($elem);
		},
		
		activateSlide: function($elem) {
			var elem = $elem.get(0),
				activeSlide;
		
			if (this.$activeSlide !== undefined) {
				activeSlide = this.$activeSlide.get(0)
				
				if (activeSlide === elem) {
					return $elem;
				}
			
				this.$activeSlide.removeClass(this.config.activeClass)
					.addClass(this.config.inactiveClass)
					.trigger('deactivateslide.fathom');
				
				if (typeof this.config.onDeactivateSlide === 'function') {
					this.config.onDeactivateSlide.call(activeSlide);
				}
			}
			
			$elem.removeClass(this.config.inactiveClass).addClass(this.config.activeClass);
			
			this.$activeSlide = $elem;
			
			$elem.trigger('activateslide.fathom');
			
			if (typeof this.config.onActivateSlide === 'function') {
				this.config.onActivateSlide.call(elem);
			}
			
			return $elem;
		},

		_setupEvents: function() {
			var self = this;
			
			this.$container.delegate('.' + this.config.inactiveClass, 'click', function(event) {
				event.preventDefault();
				self.scrollToSlide($(this));
			});
			
			$document.keydown(function(event) {
				var key = event.which;
				
				if (key === 39 || key === 32) {
					event.preventDefault();
					self.nextSlide();
				} else if ( key === 37) {
					event.preventDefault();
					self.prevSlide();
				}
			});
			
			$window.resize(function(){
				self._setMargins();
			});
			
			return this;
		},
		
		_setClasses: function() {
			this.$slides.addClass(this.config.inactiveClass);
			
			this.$activeSlide
				.removeClass(this.config.inactiveClass)
				.addClass(this.config.activeClass);
			
			return this;
		},
		
		_setMargins: function() {
			var $container = $window,
				containerWidth = $container.width(),
				verticalSpacing = Math.ceil(($container.height() - this.$firstSlide.innerHeight()) / 2),
				firstSlideSpacing = Math.ceil((containerWidth - this.$firstSlide.innerWidth()) / 2),
				lastSlideSpacing = Math.ceil((containerWidth - this.$lastSlide.innerWidth()) / 2),
				peekabooWidth = Math.ceil(containerWidth / 25);
			
			this.$container.css('margin-top', verticalSpacing);
			this.$slides.css('margin-right', firstSlideSpacing - peekabooWidth);
			
			this.$firstSlide.css('margin-left', firstSlideSpacing);
			this.$lastSlide.css('margin-right', lastSlideSpacing);
			
			return this;
		},

		_setupScrollHandler: function() {
			var self = this,
				slideSelector = '.slide',
				$scrollContainer = $window,
				isIOS = navigator.userAgent.match(/like Mac OS X/i) === null ? false : true,
				$elem;
			
			self.scrolling = false;			
			
			setInterval(function() {
				if (self.scrolling && (self.isAutoScrolling === false || self.isAutoScrolling === undefined)) {
					self.scrolling = false;
					
					if ($scrollContainer.scrollLeft() === 0) {
						self.activateSlide(self.$firstSlide)
					} else {
						var offsetX = 0,
							offsetY = 0,
							midpoint = {
								x: offsetX + ($scrollContainer.width() / 2) + (isIOS ? $window.scrollLeft() : 0),
								y: offsetY + ($scrollContainer.height() / 2) + (isIOS ? $window.scrollTop() : 0)
							};
						
						$elem = $(document.elementFromPoint(midpoint.x, midpoint.y));
						
						if ($elem.is(slideSelector)) {
							self.activateSlide($elem);
						} else {
							$elem = $elem.parents(slideSelector + ':first').each(function(){
								self.activateSlide($(this));
							});
						}
					}
				}
			}, self.config.onScrollInterval);
			
			$scrollContainer.scroll(function() {
				self.scrolling = true;
			});
			
			return this;
		}				
	};
	
	$.fn.fathom = function(options){
		new Fathom(this, options);
		return this;
	};
	
	Fathom.defaults = Fathom.prototype.defaults;
	
	Fathom.setDefaults = function(options) {
		$.extend(Fathom.defaults, options);
	};
	
	window.Fathom = Fathom;
})(jQuery,window);
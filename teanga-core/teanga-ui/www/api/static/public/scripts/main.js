(function($) {
	"use strict"; // Start of use strict
	// Configure tooltips for collapsed side navigation
	$('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
		template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
	})
	// Toggle the side navigation
	$("#sidenavToggler").click(function(e) {
		e.preventDefault();
		$("body").toggleClass("sidenav-toggled");
		$(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
		$(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
	});
	// Force the toggled class to be removed when a collapsible nav link is clicked
	$(".navbar-sidenav .nav-link-collapse").click(function(e) {
		e.preventDefault();
		$("body").removeClass("sidenav-toggled");
	});
	// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
	$('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
		var e0 = e.originalEvent,
			delta = e0.wheelDelta || -e0.detail;
		this.scrollTop += (delta < 0 ? 1 : -1) * 30;
		e.preventDefault();
	});
	// Scroll to top button appear
	$(document).scroll(function() {
		var scrollDistance = $(this).scrollTop();
		if (scrollDistance > 100) {
			$('.scroll-to-top').fadeIn();
		} else {
			$('.scroll-to-top').fadeOut();
		}
	});
	// Configure tooltips globally
	$('[data-toggle="tooltip"]').tooltip();
	// Smooth scrolling using jQuery easing
	$(document).on('click', 'a.scroll-to-top', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: ($($anchor.attr('href')).offset().top)
		}, 1000, 'easeInOutExpo');
		event.preventDefault();
	});







	$('.has-floating-label .form-control').on('focus blur', function(e) {
		$(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
	}).trigger('blur');

	// WOW animation
	if ($('.wowimate').length > 0) {
		var wow = new WOW({
			boxClass: 'wowimate',
			animateClass: 'animated',
			offset: 100,
			mobile: false,
			live: true
		});
		wow.init();
	}

	/********* documentation page ***********/
	// generate automatic table of contents
	var prevH2Item;
	var prevH2List;

	$(".documentation-holder h1, .documentation-holder h2").each(function() {

		var text = $(this).text();
		var urlText = text.replace(/[^a-z]/gi, '');

		$(this).parent().attr('id', urlText);

		var li = "<li><a href='#" + urlText + "'>" + $(this).text() + "</a></li>";

		if( $(this).is("h1") ){
			prevH2List = $("<ul></ul>");
			prevH2Item = $(li);
			prevH2Item.append(prevH2List);
			prevH2Item.appendTo("#documentation-menu");
		} else {
			prevH2List.append(li);
		}
	});

	// smooth scroll
	$("#documentation-menu li a").on('click', function (e) {

		$("#documentation-menu li.active").removeClass("active");
		$(this).parent().addClass("active");

		var hasher = $(this).attr("href");
		console.log(hasher);

		e.preventDefault();

		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 300, function () {
			window.location.hash = hasher;
		});
	});

	// affix the sidebar when user scrolls
	var iScrollPos = 0;
	$(window).scroll(function () {
		var iCurScrollPos = $(this).scrollTop();
		if (iCurScrollPos > 300) {
			$('#documentation-menu').addClass("affix");
		} else {
			$('#documentation-menu').removeClass("affix");
		}
		iScrollPos = iCurScrollPos;
	});



})(jQuery); // End of use strict

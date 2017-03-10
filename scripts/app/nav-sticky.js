jQuery(document).ready(function($) {
    var mainHeader = $('.cd-auto-hide-header'),
        secondaryNavigation = $('.cd-secondary-nav'),
        // this applies only if secondary nav is below intro section
        belowNavHeroContent = $('.sub-nav-hero'),
        headerHeight = mainHeader.height();

    // set scrolling variables
    var scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 0,
        topOffset = 50;

    mainHeader.on('click', '.nav-main-toggle', function(event) {
        // open primary navigation on mobile
        event.preventDefault();
        mainHeader.toggleClass('nav-open');
    });

    $(window).on('scroll', function() {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame) ?
            setTimeout(autoHideHeader, 250): requestAnimationFrame(autoHideHeader);
        }
    });

    $(window).on('resize', function() {
        headerHeight = mainHeader.height();
    });

    $.fn.isVisible = function() {
        // Am I visible?
        // Height and Width are not explicitly necessary in visibility detection, the bottom, right, top and left are the
        // essential checks. If an image is 0x0, it is technically not visible, so it should not be marked as such.
        // That is why either width or height have to be > 0.
        var rect = this[0].getBoundingClientRect();

        return (
            (rect.height > 0 || rect.width > 0) &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    function heroIsVisible() {
        if ($('#hero').isVisible()) {
            mainHeader.addClass('is-transparent');
        } else {
            mainHeader.removeClass('is-transparent');
        }
    }

    heroIsVisible();

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        (belowNavHeroContent.length > 0) ?
        checkStickyNavigation(currentTop) // secondary navigation below intro
            : checkSimpleNavigation(currentTop);

        previousTop = currentTop;
        scrolling = false;

        heroIsVisible();
    }

    function checkSimpleNavigation(currentTop) {
        // there's no secondary nav or secondary nav is below primary nav
        if (previousTop - currentTop > scrollDelta || currentTop < topOffset) {
            // if scrolling up...
            mainHeader.removeClass('is-hidden');
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // if scrolling down...
            mainHeader.addClass('is-hidden');
        }
    }

    function checkStickyNavigation(currentTop) {
        // secondary nav below intro section - sticky secondary nav
        var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();

        if (previousTop >= currentTop) {
            // if scrolling up...
            if (currentTop < secondaryNavOffsetTop) {
                // secondary nav is not fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('fixed slide-up');
                belowNavHeroContent.removeClass('secondary-nav-fixed');
            } else if (previousTop - currentTop > scrollDelta) {
                // secondary nav is fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('slide-up').addClass('fixed');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }
        } else {
            // if scrolling down...
            if (currentTop > secondaryNavOffsetTop + scrollOffset) {
                // hide primary nav
                mainHeader.addClass('is-hidden');
                secondaryNavigation.addClass('fixed slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            } else if (currentTop > secondaryNavOffsetTop) {
                // once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.addClass('fixed').removeClass('slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }
        }
    }
});

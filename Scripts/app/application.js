require(['jquery', 'bootstrap', 'bootstrap-toolkit', 'localscroll', 'sticky-kit', 'hypher-sv', 'lazy-load'], function($, bootstrap) {
    // Hyphenation
    $('.js-hyphenate').hyphenate('sv');

    // Lazy load
    // $(function() {
        $('.lazy, figure').Lazy({
            delay: 1000,
            enableThrottle: true,
            throttle: 250,
            placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
            scrollDirection: 'vertical',
            effect: 'fadeIn',
            visibleOnly: true,
            beforeLoad: function(element) {
                console.log('BEFORE');
            },
            onError: function(element) {
                console.log('error loading ' + element.data('src'));
            }
        });
    // });

    // Local navigation
    // $('a[href^="#"].js-scrollto').click(function(e) {
    //     // Prevent the jump and the #hash from appearing on the address bar
    //     e.preventDefault();
    //     // Scroll the window, stop any previous animation, stop on user manual scroll
    //     // Check https://github.com/flesler/jquery.scrollTo for more customizability
    //     $(window).stop(true).scrollTo(this.hash, {
    //         duration: 500,
    //         //interrupt: true,
    //         offset: {
    //             top: -50,
    //         }
    //     });
    // });

    // Execute according to BS breakpoints
    // https://github.com/leafo/sticky-kit/issues/85#issuecomment-247878339
    // Wrap IIFE around your code
    (function(viewport) {
        // Executes only in XS breakpoint
        if (viewport.is('xs')) {}

        // Executes in MD and LG breakpoints
        if (viewport.is('>=md')) {
            makeSticky();
            console.log('load sticky');
        }

        // Executes in XS and SM breakpoints
        if (viewport.is('<md')) {}

        // Execute each time window size changes
        $(window).resize(
            viewport.changed(function() {
                if (viewport.is('>=md')) {
                    makeSticky();
                    $(document.body).trigger("sticky_kit:recalc");
                    console.log('resize sticky');
                }

                if (viewport.is('<md')) {
                    $('.js-sticky').trigger('sticky_kit:detach');
                    console.log('detach sticky');
                }
            })
        );
    })(ResponsiveBootstrapToolkit);

    // Sticky general
    // https://github.com/leafo/sticky-kit
    function makeSticky() {
        $('.js-sticky').stick_in_parent({
            //container: $('body'),
            //offset_top: 50
        });
        // Fix: https://github.com/leafo/sticky-kit/issues/31#issuecomment-51740033
        $('.js-sticky')
            .on('sticky_kit:bottom', function(e) {
                $(this).parent().css('position', 'static');
            })
            .on('sticky_kit:unbottom', function(e) {
                $(this).parent().css('position', 'relative');
            });
    }

    // Get first child image of element and place it as background-image
    $.fn.setBgImage = function () {
        var articleImage = this.find('img');
        var articleImageSrc = articleImage.attr('src');

        articleImage.css('display', 'none');
        this.css('background-image', 'url(' + articleImageSrc + ')');
    };

    // Items to set and remove background image on
    (function($) {
        $('.bg-img-cover').each(function() {
            $(this).setBgImage();
        });
    })(jQuery);

    // Collapse without ID:s
    (function($) {
        $.fn.collapseNext = function() {
            return this.each(function() {
                var trigger = $(this);
                var target = trigger.next('.collapse-body');
                var isOpen = trigger.hasClass('active');

                trigger
                    .toggleClass('active')
                    .attr('aria-expanded', !isOpen);

                target
                    .toggleClass('active');
            });
        };
    })(jQuery);

    $('[data-toggle=collapse-next]').click(function() {
        $(this).collapseNext('hide');
    });

    // Toggle breakpoint label
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.shiftKey && e.code === 'KeyB') {
            $('body').toggleClass('show-breakpoint');
        }
    });
});

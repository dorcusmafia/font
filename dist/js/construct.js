require.config({
    waitSeconds: 200,
    baseUrl: 'scripts/',
    paths: {
        'bootstrap': 'lib/bootstrap',
        'bootstrap-toolkit': 'lib/bootstrap-toolkit',
        'jquery': 'lib/jquery',
        'knockout': 'lib/knockout-latest',
        'ko.mapping': 'lib/knockout.mapping',
        'moment': 'lib/moment-with-locales',
        'scrollto': 'lib/jquery.scrollTo',
        'select2': 'lib/select2',
        'sticky-kit': 'lib/sticky-kit',
        'tether': 'lib/tether',
        'text': 'lib/text',
    },

    shim: {
        'bootstrap': {
            deps: ['jquery', 'tether']
        },
        'bootstrap-toolkit': {
            deps: ['jquery']
        },
        'ko.mapping': {
            deps: ['knockout']
        },
        'scrollto': {
            deps: ['jquery']
        },
        'sticky-kit': {
            deps: ['jquery']
        },
    }
});
;require(['jquery', 'knockout', 'bootstrap', 'bootstrap-toolkit', 'scrollto', 'sticky-kit'], function($, ko, bootstrap) {
    // Local navigation
    $('a[href^="#"].js-scrollto').click(function(e) {
        // Prevent the jump and the #hash from appearing on the address bar
        e.preventDefault();
        // Scroll the window, stop any previous animation, stop on user manual scroll
        // Check https://github.com/flesler/jquery.scrollTo for more customizability
        $(window).stop(true).scrollTo(this.hash, {
            duration: 500,
            //interrupt: true,
            offset: {
                top: -50,
            }
        });
    });

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
            // container: $('header'),
            // offset_top: 100
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
});

require.config({
    waitSeconds: 200,
    baseUrl: 'scripts/',
    paths: {
        'bootstrap': 'lib/bootstrap',
        'bootstrap-toolkit': 'lib/bootstrap-toolkit',
        'hypher': 'lib/jquery.hypher',
        'hypher-sv': 'lib/sv',
        'jquery': 'lib/jquery',
        'knockout': 'lib/knockout-latest',
        'ko.mapping': 'lib/knockout.mapping',
        'lazy-load': 'lib/jquery.lazy',
        'moment': 'lib/moment-with-locales',
        'scrollto': 'lib/jquery.scrollTo',
        'localscroll': 'lib/jquery.localScroll',
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
        'hypher-sv': {
            deps: ['jquery', 'hypher']
        },
        'ko.mapping': {
            deps: ['knockout']
        },
        'lazy-load': {
            deps: ['jquery']
        },
        'scrollto': {
            deps: ['jquery']
        },
        'localscroll': {
            deps: ['jquery', 'scrollto']
        },
        'sticky-kit': {
            deps: ['jquery']
        },
    }
});

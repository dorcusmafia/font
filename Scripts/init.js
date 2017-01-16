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

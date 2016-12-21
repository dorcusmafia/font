require.config({
    waitSeconds: 200,
    baseUrl: 'Scripts/',
    paths: {
        'jquery': 'lib/jquery',
        'text': 'lib/text',
        'bootstrap': 'lib/bootstrap',
        'bootstrap.select': 'lib/bootstrap-select',
        'moment': 'lib/moment-with-locales',
        'select2': 'lib/select2',
        'bootstrap-toolkit': 'lib/bootstrap-toolkit',
        'scrollto': 'lib/jquery.scrollTo',
        'sticky-kit': 'lib/sticky-kit',
        'tablesorter': 'lib/jquery.tablesorter',
        'knockout': 'lib/knockout-latest',
        'ko.mapping': 'lib/knockout.mapping',
        'jquery-ui/widget': 'lib/jquery.ui.widget',
        'iframetransport': 'lib/jquery.iframe-transport',
        'fileupload': 'lib/jquery.fileupload',
        'underscore': 'lib/underscore',
        'ko.extentions': 'app/knockout-extensions',
        'utils': 'app/utils'
    },

    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'jqurey.widget': {
            deps: ['jquery']
        },
        'bootstrap-toolkit': {
            deps: ['jquery']
        },
        'scrollto': {
            deps: ['jquery']
        },
        'sticky-kit': {
            deps: ['jquery']
        },
        'ko.extentions': {
            deps: ['knockout','jquery']
        },
        'ko.mapping': {
            deps: ['knockout']
        },
        'sbufConfig': {
            deps: ['ko.extentions']
        },
        'viewmodels/users/usersViewModel': {
            deps: ['bootstrap', 'select2', 'bootstrap.select', 'tablesorter', 'ko.extentions']
        },
        'viewmodels/theses/thesesSearchViewModel': {
            deps: ['bootstrap', 'select2', 'bootstrap.select', 'tablesorter', 'ko.extentions']
        },
        'viewmodels/projectarea/dashboardViewModel': {
            deps: ['bootstrap', 'select2', 'bootstrap.select', 'tablesorter', 'ko.extentions']
        },
        'viewmodels/projectarea/projectViewModel': {
            deps: ['bootstrap', 'select2', 'bootstrap.select', 'tablesorter', 'ko.extentions']
        }
    }
});

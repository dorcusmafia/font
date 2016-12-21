define(['global-settings'], function (globalSettings) {

    var config = (function () {

        var lang = {
                userPropertyAddress1: 'Adress',
                userPropertyCompany: 'Företag',
                userPropertyEmail: 'E-post',
                userPropertyIsAdministrator: 'Administratör',
                userPropertyName: 'Namn',
                userPropertyPreferredCommunicationChannel: 'Önskad kommunikationsväg',
                userPropertyPhone: 'Telefon',
                userPropertyUrl: 'Webbsida',
                userPropertyDescription: 'Beskrivning',
                userPropertyCategories: 'Ämnen',
                userPropertyRoles: 'Roller',
                userPropertyTags: 'Etiketter',
                userPropertyUsername: 'Användarnamn'
            },
            settings = globalSettings.settings(),
            httpVerbs = {
                POST: 'POST',
                GET: 'GET',
                DELETE: 'DELETE'
            },
            contentTypes = {
                JSON: 'application/json; charset=utf-8',
                DEFAULT: 'application/x-www-form-urlencoded; charset=UTF-8'
            };

        return {
            lang: lang,
            settings: settings,
            httpVerbs: httpVerbs
        };

    })();

    return config;
});
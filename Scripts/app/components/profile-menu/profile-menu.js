define(['jquery', 'knockout', 'sbufConfig', 'text!/Scripts/app/components/profile-menu/profile-menu.html'], function ($, ko, sbufConfig, htmlTemplate) {

    var profileMenuViewModel = function (params) {
        var self = this;
        self.Username = ko.observable("[Användarnamn saknas]");
        self.Name = ko.observable("[Namn saknas]");

        var _init = function() {
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Users/LoggedInUser/',
                type: sbufConfig.httpVerbs.GET,
                success: function (data) {
                    self.Username(data.Username || "[Användarnamn saknas]");
                    self.Name(data.Name || "[Namn saknas]");

                },
                error: function () {
                    console.error('Error in query', query);
                }
            });
        };

        _init();

        return {
            Username: self.Username,
            Name: self.Name
        };

    };

    return {
        viewModel: profileMenuViewModel,
        template: htmlTemplate
    };

});

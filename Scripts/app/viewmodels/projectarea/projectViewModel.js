define(['jquery', 'knockout', 'underscore', 'sbufConfig', 'sbufHelpers', 'ko.mapping'], function ($, ko, _, sbufConfig, sbufHelpers) {
    function projectViewModel() {
        var self = this;

        self.case = ko.observable({});
        
        self.loadCase = function (caseId) {
            if (!caseId)
                return;
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Cases/' + caseId,
                type: sbufConfig.httpVerbs.GET,
                success: function (data) {
                    console.log('Got searchUsers', data);
                    self.case(data);

                },
                error: function () {
                    console.error('Error in query', query);
                }
            });
        };

        self.init = function (caseId) {
            self.loadCase(caseId);
        };
    }

    return new projectViewModel();
});
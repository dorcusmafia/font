define(['jquery', 'knockout', 'underscore', 'sbufConfig', 'sbufHelpers', 'ko.mapping'], function ($, ko, _, sbufConfig, sbufHelpers) {
    function dashboardViewModel() {
        var self = this;

        self.cases = ko.observableArray([]);
        
        self.loadCases = function () {
            console.log('loading cases');
            sbufHelpers.loadObservable('/UserCases/UserCasesForLoggedInUser', self.cases);
            //$.ajax({
            //    url: sbufConfig.settings.apiHost + '/UserCases/UserCasesForLoggedInUser/',
            //    type: 'GET',
            //    success: function (data) {
            //        self.cases(data || []);
            //        console.log('Got searchUsers', data);
            //    },
            //    error: function () {
            //        console.error('Error in query');
            //    }
            //});
        };

        self.rejectedCases = ko.pureComputed(function () {
            return ko.utils.arrayFilter(self.cases(), function (c) {
                return c.Status === 4;
            });
        }, self);

        self.ongoingCases = ko.pureComputed(function () {
            return ko.utils.arrayFilter(self.cases(), function (c) {
                return c.Status === 3;
            });
        }, self);

        self.closedCases = ko.pureComputed(function () {
            return ko.utils.arrayFilter(self.cases(), function (c) {
                return c.Status === 5;
            });
        }, self);

        self.getApplicants = function (data) {
            return _.where(data.Users, { RoleName: "Sökande" });
        };
        self.getProjectManagers = function (data) {
            return _.where(data.Users, { RoleName: "Projektledare" });
        };

        self.navigateToProject = function (project) {
            window.location = "/ProjectArea/Project/#" + project.CaseId;
        };

        self.init = function() {
            self.loadCases();
        };
    }

    return new dashboardViewModel();
});
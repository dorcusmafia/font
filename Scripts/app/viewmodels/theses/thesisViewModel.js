define(['jquery', 'knockout', 'underscore', 'sbufConfig', 'sbufHelpers', 'ko.mapping'], function ($, ko, _, sbufConfig, sbufHelpers) {

        var thesisViewModel = function(data) {
            self.Case = ko.observable(data.Case || null);
            self.CaseId = ko.observable(data.CaseId || 0);
            self.Institution = ko.observable(data.Institution || null);
            self.InstitutionId = ko.observable(data.InstitutionId || 0);
            self.IsDeleted = ko.observable(data.IsDeleted || false);
            self.OldId = ko.observable(data.OldId || 0);
            self.StakeholderId = ko.observable(data.StakeholderId || 0);
            self.ThesisDate = ko.observable(data.ThesisDate || null);
            self.ThesisId = ko.observable(data.ThesisId || 0);
            self.ThesisStakeholder = ko.observable(data.ThesisStakeholder || null);
            self.ThesisType = ko.observable(data.ThesisType || null);
            self.ThesisTypeId = ko.observable(data.ThesisTypeId || 0);
            self.ThesisVersions = ko.observableArray(data.ThesisVersions || []);
            self.Url = ko.observable(data.Url || '');
            self.User = ko.observable(data.User || null);
            self.UserId = ko.observable(data.UserId || 0);
            self.zThesisAuthorId = ko.observable(data.zThesisAuthorId || 0);

            self.EnglishTitle = ko.observable();
            self.EnglishSummary = ko.observable();
            self.EnglishKeywords = ko.observable();
            self.SwedishTitle = ko.observable();
            self.SwedishSummary = ko.observable();
            self.SwedishKeywords = ko.observable();

            if (self.ThesisVersions().length === 2) {
                self.EnglishTitle(self.ThesisVersions()[1].Title);
                self.EnglishSummary(self.ThesisVersions()[1].Description);
                self.EnglishKeywords(self.ThesisVersions()[1].Keywords);
                self.SwedishTitle(self.ThesisVersions()[0].Title);
                self.SwedishSummary(self.ThesisVersions()[0].Description);
                self.SwedishKeywords(self.ThesisVersions()[0].Keywords);

            }

            return {
                EnglishTitle: self.EnglishTitle(),
                EnglishSummary: self.EnglishSummary(),
                EnglishKeywords: self.EnglishKeywords(),
                SwedishTitle: self.SwedishTitle(),
                SwedishSummary: self.SwedishSummary(),
                SwedishKeywords: self.SwedishKeywords(),
                InstitutionId: self.InstitutionId(),
                StakeholderId: self.StakeholderId(),
                ThesisTypeId: self.ThesisTypeId(),
                ThesisDate: self.ThesisDate(),
                Url: self.Url(),
                UserId: self.UserId()
            };
        };

        return thesisViewModel;
    });
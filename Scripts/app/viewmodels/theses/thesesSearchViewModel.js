define(['jquery', 'knockout', 'underscore', 'sbufConfig', 'sbufHelpers', 'viewmodels/theses/thesisViewModel', 'ko.mapping'], function ($, ko, _, sbufConfig, sbufHelpers, thesisViewModel) {
    var thesesSearchViewModel = function() {
        var self = this;
        self.Thesis = ko.observableArray([]);
        self.Query = ko.observable({
            FreeText: ko.observable('')
        });

        self.SelectedThesis = ko.observable();

        self.ThesisAuthors = ko.observableArray([]);
        self.ThesisTypes = ko.observableArray([]);
        self.Institutions = ko.observableArray([]);
        self.Stakeholders = ko.observableArray([]);


        self.NewThesis = ko.observable({
            EnglishTitle: ko.observable(''),
            EnglishSummary: ko.observable(''),
            EnglishKeywords: ko.observable(''),
            SwedishTitle: ko.observable(''),
            SwedishSummary: ko.observable(''),
            SwedishKeywords: ko.observable(''),
            InstitutionId: ko.observable(0),
            StakeholderId: ko.observable(0),
            ThesisTypeId: ko.observable(0),
            ThesisDate: ko.observable(''),
            Url: ko.observable(''),
            UserId: ko.observable(0),
            zThesisAuthorId: ko.observable(0)
        });

        self.GetYear = function(date) {
            return new Date(date()).getFullYear();
        };

        self.GetSubstring = function(text, start, length) {
            return text.substring(start, length);
        };

        self.loadThesisAuthor = function() {
            return sbufHelpers.loadObservable('/Theses/ThesisAuthor', self.ThesisAuthors);
        };

        self.loadThesisTypes = function() {
            return sbufHelpers.loadObservable('/Theses/ThesisTypes', self.ThesisTypes);
        };

        self.loadInstitutions = function() {
            return sbufHelpers.loadObservable('/Institutions', self.Institutions);
        };

        self.loadStakeholders = function() {
            return sbufHelpers.loadObservable('/Theses/ThesisStackeholder', self.Stakeholders);
        };

        self.selectThesis = function(event, data) {

            $.ajax({
                url: sbufConfig.settings.apiHost + '/Theses/' + data.ThesisId(),
                type: sbufConfig.httpVerbs.GET,
                success: function(data) {
                    console.log('Got searchUsers', data);
                    self.SelectedThesis(new thesisViewModel(data));

                },
                error: function() {
                    console.error('Error in query', query);
                }
            });


        };

        self.SaveThesis = function() {
            alert(self.NewThesis().EnglishTitle() +
                "\n" +
                self.NewThesis().EnglishSummary() +
                "\n" +
                self.NewThesis().EnglishKeywords() +
                "\n" +
                self.NewThesis().SwedishTitle() +
                "\n" +
                self.NewThesis().SwedishSummary() +
                "\n" +
                self.NewThesis().SwedishKeywords() +
                "\n" +
                "InstitutionId" +
                self.NewThesis().InstitutionId() +
                "\n" +
                "StakeholderId" +
                self.NewThesis().StakeholderId() +
                "\n" +
                "ThesisTypeId" +
                self.NewThesis().ThesisTypeId() +
                "\n" +
                "ThesisDate" +
                self.NewThesis().ThesisDate() +
                "\n" +
                "Url" +
                self.NewThesis().Url() +
                "\n" +
                "UserId" +
                self.NewThesis().UserId() +
                "\n");
        };

        self.searchThesis = function() {
            var button = $(event.target);
            button.addClass('animated');
            var query = ko.mapping.toJS(self.Query);
            console.log('Querying users', query);
            self.Thesis([]);
            self.Thesis.isLoaded(false);
            self.Thesis.isLoading(true);
            $.ajax({
                url: sbufConfig.settings.apiHost + '/Theses/Search',
                type: 'POST',
                data: ko.mapping.toJS(self.Query),
                success: function(data) {
                    console.log('Got searchUsers', data);
                    self.Thesis(ko.mapping.fromJS(data)());
                    self.Thesis.isLoading(false);
                    self.Thesis.isLoaded(true);
                    button.removeClass('animated');
                    $(document).trigger('ko.viewModel.updated', self.Thesis);
                },
                error: function() {
                    button.removeClass('animated');
                    console.error('Error in query', query);
                }
            });
        };


        self.init = function() {
            self.loadThesisAuthor();
            self.loadThesisTypes();
            self.loadInstitutions();
            self.loadStakeholders();
        };

    };

    return new thesesSearchViewModel();
});
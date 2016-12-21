function InfoSheetsViewModel() {
    var self = this;
    self.InfoSheets = ko.observableArray([]);
    self.Page = 0;
    self.PageSize = 30;
    self.Query = ko.observable({
        FreeText: ko.observable(''),
        IsPublished: ko.observable(''),
        Skip: ko.observable(0),
        Take: ko.observable(self.PageSize)
    });

    self.Paging = ko.observableArray([]);

    self.TotalItems = ko.observable(0);

    self.SetOnlyPublished = function (published) {
        self.Query().IsPublished(published);
    };

    self.selectInfoSheet = function (data, event) {
    };

    self.QueryText = ko.computed(self.Query().FreeText)
        .extend({ throttle: 400 });

    self.QueryText.subscribe(function (newValue) {
        self.Query().FreeText(newValue);
        self.searchInfoSheets();
    });

    self.NewInfoSheet = ko.observable({
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

    self.searchInfoSheets = function (event) {
        if (event) {
            var button = $(event.target);
            button.addClass('animated');
        }
        var query = ko.mapping.toJS(self.Query);
        console.log('Querying users', query);
        self.InfoSheets([]);
        self.InfoSheets.isLoaded(false);
        self.InfoSheets.isLoading(true);
        $.ajax({
            url: $.fn.sbuf.settings.apiHost + '/InfoSheets/Search',
            type: 'POST',
            data: ko.mapping.toJS(self.Query),
            success: function (data) {
                console.log('Got searchUsers', data);
                self.TotalItems(data.TotalResult);
                self.InfoSheets(ko.mapping.fromJS(data.Items)());
                self.calcPaging();
                self.InfoSheets.isLoading(false);
                self.InfoSheets.isLoaded(true);
                if (button)
                    button.removeClass('animated');
                $(document).trigger('ko.viewModel.updated', self.InfoSheets);
            },
            error: function () {
                if (button)
                    button.removeClass('animated');
                console.error('Error in query', query);
            }
        });
    };

    self.calcPaging = function() {
        var totalNrPages = Math.floor(self.TotalItems() / self.PageSize);

        var currentPage = self.Page;
        var startpage = currentPage;
        if (currentPage > 3) {
            startpage = currentPage - 3;
        }
        var nrPages = startpage + 5;
        if (nrPages > totalNrPages)
            nrPages = totalNrPages;

        self.Paging([]);
        for (var i = 0; i < nrPages; i++) {
            self.Paging()
                .push({
                    value: startpage
                });
            startpage += 1;
        }
    };
}

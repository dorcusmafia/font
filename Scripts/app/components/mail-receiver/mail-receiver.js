define(['jquery', 'knockout','sbufConfig', 'text!/Scripts/app/components/mail-receiver/mail-receiver.html'], function ($, ko,sbufConfig, htmlTemplate) {

    var mailReceiverViewModel = function (params) {
        var self = this;
        self.NumberOfCopies = ko.observable();
        self.MailReceiverId = ko.observable();
        self.UserId = ko.observable(params.UserId);

        var _init = function() {
            $.get(sbufConfig.settings.apiHost + "/MailReceiver/" + self.UserId(), function (data) {
                self.NumberOfCopies(data.NumberOfCopies.toString());
                self.MailReceiverId(data.MailReceiverId);

            }).always(function() {
                self.NumberOfCopies.subscribeChanged(function(newValue, oldValue) {
                    if (!_IfCanPost(newValue, oldValue))
                        return;
                    if (self.MailReceiverId() === undefined || self.MailReceiverId() === null) {
                        _addMailReceiver(newValue);
                    } else {
                        _updateMailReceiver(newValue);
                    }
                });
            });
        };

        var _IfCanPost = function (newValue, oldValue) {
            if (self.NumberOfCopies() === undefined || self.NumberOfCopies() === null)
                return false;
            if (self.UserId() === undefined || self.UserId() === null)
                return false;
            if (newValue === oldValue)
                return false;
            return true;
        };

        var _updateMailReceiver = function (newValue) {
            $.post(sbufConfig.settings.apiHost + "/MailReceiver/" + self.MailReceiverId() + "/" + self.UserId() + "/" + newValue)
            .then(function() {
                $.growl({
                    title: 'Uppdaterad utskick',
                    text: 'Lagt till ' + newValue + ' till nästa utskick',
                    type: 'success',
                    delay: 6000,
                    'class': 'growl-item'
                });
                });
        };

        var _addMailReceiver = function (newValue) {
            $.post(sbufConfig.settings.apiHost + "/MailReceiver/" + self.UserId() + "/" + newValue)
                .then(function() {
                    $.growl({
                        title: 'Lagt till ny utskick',
                        text: 'Lagt till ' + newValue +' till nästa utskick',
                        type: 'success',
                        delay: 6000,
                        'class': 'growl-item'
                    });
                });
        };

        _init();

        return {
            NumberOfCopies: self.NumberOfCopies
        };

    };

    return {
        viewModel: mailReceiverViewModel,
        template: htmlTemplate
    };

});

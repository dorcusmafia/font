define(['jquery', 'knockout', 'text!/Scripts/app/components/user-import/user-import.html','sbufConfig', 'fileupload'], function ($, ko, htmlTemplate,sbufConfig) {
    var userImportViewModel = function (params) {

        var $fileInput = $('#import-file'),
            viewModel = params.viewModel;

        var _init = function () {
            $fileInput.fileupload({
                url: sbufConfig.settings.apiHost + '/Users/Import',
                maximumNumberOfFiles: 1,
                singleFileUploads: true,
                dataType: 'json',
                error: _error,
                add: _add,
                fail: _fail,
                done: _done
            });
        };
        var _error = function() {
            $.growl({
                title: 'Fel vid import',
                text: 'Något utanför min kontroll gick fel.',
                type: 'error',
                delay: 6000,
                'class': 'growl-item'
            });
            return;
        };
        var _add = function(e, data) {
            var uploadFile = data.files[0];
            if (!(/\.(csv|txt)$/i).test(uploadFile.name)) {
                $.growl({
                    title: 'Fel vid import',
                    text: 'Filen måste vara av typen .csv eller .txt.',
                    type: 'error',
                    delay: 6000,
                    'class': 'growl-item'
                });
                return;
            }
            data.submit();
        };
        var _fail = function(e, data) {
            var msg = data.response().jqXHR.responseJSON.ExceptionMessage;
            $.growl({
                title: 'Fel vid import',
                text: msg,
                type: 'error',
                delay: 6000,
                'class': 'growl-item'
            });
        };
        var _done = function(e, data) {
            console.log('Imported', data.result);
            viewModel.Users(ko.mapping.fromJS(data.result)());
            viewModel.Users.isLoading(false);
            viewModel.Users.isLoaded(true);
            $(document).trigger('ko.viewModel.updated', viewModel.Users);

            var totalImported = data.result.length;
            $.growl({
                title: totalImported,
                text: 'användare importerad(e)',
                type: 'success',
                delay: 6000,
                'class': 'growl-item'
            });
        };
        var fileImportHandler = function () {
            $fileInput.trigger('click');
        };

        _init();

        return {
            fileImportHandler: fileImportHandler
        };
    };

    return {
        viewModel: userImportViewModel,
        template: htmlTemplate
    };
});
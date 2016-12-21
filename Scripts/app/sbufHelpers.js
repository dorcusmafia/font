define(['jquery', 'sbufConfig', 'knockout', 'ko.extentions'], function ($, sbufConfig, ko) {

    var helpers = (function () {

        var loadObservable = function (path, target, options) {
            var defaults = {
                mapChildren: false,
                hardFail: true,
                infiniteScroll: false,
                select: function (item) { return item; } // returns data unchanged
            };
            var settings = $.extend(defaults, options);

            target.isLoading(true);
            target.isLoaded(false);
            target.isFailed(false);

            var url = sbufConfig.settings.apiHost + path;
            target.sourceUrl(url);

            $(document).trigger('ko.viewModel.updating', target);
            return $.ajax({
                url: url,
                success: function (data) {
                    //console.log('Got ' + path, data);
                    target.isLoading(false);
                    target.isLoaded(true);
                    $(document).trigger('ko.viewModel.updated', target);
                    target(settings.mapChildren ? ko.mapping.fromJS(settings.select.call(undefined, data)) : settings.select.call(undefined, data));
                    $('.js-collapse-next').on('click', function () {
                        var $target = $(this).next('.js-collapse-target');
                        $target.collapse('toggle');
                    });
                },
                error: function (xhr) {
                    console.log('error: ' + path, xhr);
                    target.isLoading(false);
                    if (xhr.status == 404) {
                        console.log('Not found ' + path);
                        target.isLoaded(true);
                        target(null);
                    } else if (xhr.status == 401) {
                        // Unauthorized
                        document.location = '/Account/SignIn';
                    } else {
                        target.isFailed(true);
                    }
                }
            });
        };

        return {
            loadObservable: loadObservable
        };
    })();

    return helpers;
});
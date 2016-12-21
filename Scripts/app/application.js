require(['jquery', 'knockout', 'moment', 'sbufConfig', 'tablesorter', 'bootstrap', 'bootstrap.select'], function ($, ko, moment, sbufConfig, tablesorter, bootstrap) {
    // Setup
    moment.locale('sv');

    // Ensure authorization for api
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (settings.url.indexOf(sbufConfig.settings.apiHost) !== 0 ||
                settings.url === sbufConfig.settings.apiHost + '/oauth/token')
                return;

            xhr.withCredentials = true;
            var auth = readCookie('token');
            if (auth !== null) {
                xhr.setRequestHeader("Authorization", "Bearer " + auth);
            }
        },
        crossDomain: true
    });

    // Hide nav and show sidebar.
    var showSidebar = function () {
        $('body').removeClass('active-nav').toggleClass('active-sidebar');
        // Hide any open navbar dropdowns when interacting with sidebar.
        $('.navbar-nav .dropdown').removeClass('open');
    };

    // Hide sidebar & show nav.
    var showMenu = function () {
        $('body').removeClass('active-sidebar').toggleClass('active-nav');
    };

    // Add/remove classes every time the window resize event fires.
    $(window).resize(function () {
        var off_canvas_nav_display = $('.off-canvas-navigation').css('display');
        var menu_button_display = $('.menu-button').css('display');
        if (off_canvas_nav_display === 'block') {
            $('body').removeClass('three-column').addClass('small-screen');
        }
        if (off_canvas_nav_display === 'none') {
            $('body').removeClass('active-sidebar active-nav small-screen').addClass('three-column');
        }
    });

    $(document).on('click', function (e) {
        if ($('#add-tag').is(':hidden')) {
            // do nothing
        } else {
            $('#add-tag').toggleClass('hide');
        }
    });

    //jQuery(document).ready(function ($) {
    //    // TinyGrowl
    //    // http://codepen.io/ajkochanowicz/pen/bLBfr
    //    (function ($) {
    //        $("body")
    //            .append('<div id="growlContainer" style="position:fixed;width:250px;top:20px;right:20px;overflow:auto;pointer-events:none;z-index:2000;"></div>');
    //        $.extend({
    //            growl: function (options) {
    //                var defaults = {
    //                    delay: 0,
    //                    type: "warning",
    //                    container: "#growlContainer",
    //                    text: "",
    //                    "class": ""
    //                };
    //                var _ = $.extend(defaults, options);
    //                _.fTitle = _.title ? "<strong>" + _.title + "</strong>" : "";
    //                this.id = Math.floor(Math.random() * 1e3);
    //                this.html = document.createElement("div");
    //                this.html.className = "growl" + this.id + " alert alert-" + _.type + " " + _.class;
    //                var xHtml =
    //                    '<a style="pointer-events: auto;" class="close" data-dismiss="alert" href="#">&times;</a>';
    //                $(this.html).html((_.delay === 0 ? xHtml : "") + _.fTitle + " " + _.text);
    //                $(_.container).prepend(this.html);
    //                if (_.delay > 0) {
    //                    var fn =
    //                        function (delay, id) {
    //                            setTimeout(function () { $(".growl" + id).fadeOut(); }, delay);
    //                        }(_.delay, this.id);
    //                }
    //            }
    //        });
    //    })(jQuery);
    //});

    //// Tooltips on all elements with correct data attribute.
    //// Custom data attr allows tooltip on dropdowns.
    //$(function () {
    //    $('body')
    //        .tooltip({
    //            selector: '[data-toggle-tooltip="tooltip"]',
    //            // placement: 'auto top',
    //            container: 'body'
    //        });
    //});

    //// Popovers on all elements with correct data attribute.
    //$(function () {
    //    $('body')
    //        .popover({
    //            selector: '[data-toggle="popover"]',
    //            placement: 'auto top'
    //        });
    //});

    //// Selectpicker
    //$(function () {
    //    $('.selectpicker').selectpicker();
    //});

    //// Table sorter
    //$(function () {
    //    $('.table-sortable').tablesorter();
    //});

    function updateTableSorter() {
        console.log('update');
        $(this).closest('table').trigger('update');
    }

    //// Context menu
    //$(function () {
    //    var $contextMenuFilterPanels = $('.nav-context-filter-panels');
    //    $('body')
    //        .on('contextmenu',
    //            '#modal-user-card .panel-heading',
    //            function (e) {
    //                var offset = $(this).offset();

    //                $contextMenuFilterPanels.css({
    //                    display: 'block',
    //                    left: e.pageX,
    //                    top: e.pageY
    //                });
    //                return false;
    //            });

    //    $(document)
    //        .click(function () {
    //            $contextMenuFilterPanels.hide();
    //        });

    //    $('.nav-context-filter-panels .open-all')
    //        .on('click',
    //            function (e) {
    //                e.preventDefault();
    //                $('#modal-user-card .panel-heading .accordion-toggle').removeClass('collapsed');
    //                $('#modal-user-card .panel-collapse').collapse('show');
    //            });

    //    $('.nav-context-filter-panels .close-all')
    //        .on('click',
    //            function (e) {
    //                e.preventDefault();
    //                $('#modal-user-card .panel-heading .accordion-toggle').addClass('collapsed');
    //                $('#modal-user-card .panel-collapse').collapse('hide');
    //            });
    //});

    //// Print function.
    //$(function () {
    //    $('.js-print-page')
    //        .on('click',
    //            function (e) {
    //                e.preventDefault();
    //                window.print();
    //            });
    //});

    //// Hide panel nav category.
    //$(function () {
    //    $('.js-btn-nav-main')
    //        .on('click',
    //            function (e) {
    //                e.preventDefault();
    //                $(this).toggleClass('collapsed');
    //                $('.wrapper-nav-main').fadeToggle(100);
    //                $('.section-content').toggleClass('section-content-full');
    //            });
    //});

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function createCookie(name, value, days) {
        console.log('cookie', name, value, days);
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function deleteCookie(name) {
        createCookie(name, '', -1);
    }

    function jsonToCsv(objArray, addHeaders, addQuotes, colSeparator) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var csv = '\uFEFF'; // Add Byte-Order-Mark (BOM) first to show Excel it is UTF-8
        var line = '';

        if (addHeaders) {
            var property;
            if (addQuotes) {
                for (property in array[0]) {
                    line += '"' + property.replace(/\"/g, '""') + '"' + colSeparator;
                }
            } else {
                for (property in array[0]) {
                    line += property + colSeparator;
                }
            }

            line = line.slice(0, -1);
            csv += line + '\r\n';
        }

        for (var i = 0; i < array.length; i++) {
            line = '';
            var index;
            var value;
            if (addQuotes) {
                for (index in array[i]) {
                    value = '';
                    if (typeof array[i][index] == 'object') {
                        value = array[i][index] ? array[i][index] : '';
                    } else {
                        value = array[i][index] ? array[i][index] : '';
                    }

                    if (moment(value, 'YYYY-MM-DD', true).isValid()) {
                        // It's a date
                        value = moment(value).format('L LT');
                    }
                    // #7680 Bo3: Export till csv fungerar ej
                    // Can not use replace() in an empty array of objects
                    //line += '"' + value.replace(/\"/g, '""') + '"' + colSeparator;
                    line += '"' + value + '"' + colSeparator;
                }
            } else {
                for (index in array[i]) {
                    value = array[i][index] ? array[i][index] : '';
                    if (moment(value).isValid()) {
                        // It's a date
                        value = moment(value).format('L LT');
                    }
                    line += value + colSeparator;
                }
            }

            line = line.slice(0, -1);
            csv += line + '\r\n';
        }
        return csv;
    }

    $.QueryString = (function (keys) {
        var values = {};

        if (keys.length === 0 || (keys.length > 0 && keys[0] === ''))
            return values;

        for (var i = 0; i < keys.length; ++i) {
            var pair = keys[i].split('=', 2);
            values[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
        return values;
    })(window.location.search.substr(1).split('&'));
});
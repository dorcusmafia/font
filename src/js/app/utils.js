define(['jquery'], function($) {

        var utils = (function() {

            var initTooltips = function() {
                // Tooltips on all elements with correct data attribute.
                // Custom data attr allows tooltip on dropdowns.
                $(function() {
                    $('body')
                        .tooltip({
                            selector: '[data-toggle-tooltip="tooltip"]',
                            // placement: 'auto top',
                            container: 'body'
                        });
                });
            };

            var initPopover = function() {
                // Popovers on all elements with correct data attribute.
                $(function () {
                    $('body')
                        .popover({
                            selector: '[data-toggle="popover"]',
                            placement: 'auto top'
                        });
                });
            };

            var initSelectpicker = function () {
                // Selectpicker
                $(function () {
                    $('.selectpicker').selectpicker();
                });
            };

            var initTablesorter = function () {
                // Table sorter
                $(function () {
                    $('.table-sortable').tablesorter();
                });
            };

            var initContextMenu = function () {
                // Context menu
                $(function () {
                    var $contextMenuFilterPanels = $('.nav-context-filter-panels');
                    $('body')
                        .on('contextmenu',
                            '#modal-user-card .panel-heading',
                            function (e) {
                                var offset = $(this).offset();

                                $contextMenuFilterPanels.css({
                                    display: 'block',
                                    left: e.pageX,
                                    top: e.pageY
                                });
                                return false;
                            });

                    $(document)
                        .click(function () {
                            $contextMenuFilterPanels.hide();
                        });

                    $('.nav-context-filter-panels .open-all')
                        .on('click',
                            function (e) {
                                e.preventDefault();
                                $('#modal-user-card .panel-heading .accordion-toggle').removeClass('collapsed');
                                $('#modal-user-card .panel-collapse').collapse('show');
                            });

                    $('.nav-context-filter-panels .close-all')
                        .on('click',
                            function (e) {
                                e.preventDefault();
                                $('#modal-user-card .panel-heading .accordion-toggle').addClass('collapsed');
                                $('#modal-user-card .panel-collapse').collapse('hide');
                            });
                });
            };

            var initPrint = function () {
                // Print function.
                $(function () {
                    $('.js-print-page')
                        .on('click',
                            function (e) {
                                e.preventDefault();
                                window.print();
                            });
                });
            };

            var initHidePaneNavCategory = function () {
                // Hide panel nav category.
                $(function () {
                    $('.js-btn-nav-main')
                        .on('click',
                            function (e) {
                                e.preventDefault();
                                $(this).toggleClass('collapsed');
                                $('.wrapper-nav-main').fadeToggle(100);
                                $('.section-content').toggleClass('section-content-full');
                            });
                });
            };

            var initTinyGrowl = function () {
                $(document).ready(function ($) {
                    // TinyGrowl
                    // http://codepen.io/ajkochanowicz/pen/bLBfr
                    (function ($) {
                        $("body")
                            .append('<div id="growlContainer" style="position:fixed;width:250px;top:20px;right:20px;overflow:auto;pointer-events:none;z-index:2000;"></div>');
                        $.extend({
                            growl: function (options) {
                                var defaults = {
                                    delay: 0,
                                    type: "warning",
                                    container: "#growlContainer",
                                    text: "",
                                    "class": ""
                                };
                                var _ = $.extend(defaults, options);
                                _.fTitle = _.title ? "<strong>" + _.title + "</strong>" : "";
                                this.id = Math.floor(Math.random() * 1e3);
                                this.html = document.createElement("div");
                                this.html.className = "growl" + this.id + " alert alert-" + _.type + " " + _.class;
                                var xHtml =
                                    '<a style="pointer-events: auto;" class="close" data-dismiss="alert" href="#">&times;</a>';
                                $(this.html).html((_.delay === 0 ? xHtml : "") + _.fTitle + " " + _.text);
                                $(_.container).prepend(this.html);
                                if (_.delay > 0) {
                                    var fn =
                                        function (delay, id) {
                                            setTimeout(function () { $(".growl" + id).fadeOut(); }, delay);
                                        }(_.delay, this.id);
                                }
                            }
                        });
                    })($);
                });
            };

            return {
                initTooltips: initTooltips,
                initPopover: initPopover,
                initSelectpicker: initSelectpicker,
                initTablesorter: initTablesorter,
                initContextMenu: initContextMenu,
                initPrint: initPrint,
                initHidePaneNavCategory: initHidePaneNavCategory,
                initTinyGrowl: initTinyGrowl,
            };

        })();

        return utils;
    });
require(['jquery', 'knockout','sbufConfig'],
    function ($, ko,sbufConfig) {
        // Extend observables
        ko.observable.fn.isLoading = function (value) {
            if ($.type(this._isLoading) === 'undefined') {
                this._isLoading = ko.observable();
            }

            if (value === true) {
                this._isLoading(true);
            } else if (value === false) {
                this._isLoading(false);
            }

            return this._isLoading() || false;
        };
        ko.observable.fn.isLoaded = function (value) {
            if ($.type(this._isLoaded) === 'undefined') {
                this._isLoaded = ko.observable();
            }
            if (value === true) {
                this._isLoaded(true);
            } else if (value === false) {
                this._isLoaded(false);
            }

            return this._isLoaded() || false;
        };
        ko.observable.fn.isFailed = function (value) {
            if ($.type(this._isFailed) === 'undefined') {
                this._isFailed = ko.observable();
            }
            if (value === true) {
                this._isFailed(true);
            } else if (value === false) {
                this._isFailed(false);
            }

            return this._isFailed() || false;
        };
        ko.observable.fn.sourceUrl = function (value) {
            if ($.type(this._sourceUrl) === 'undefined') {
                this._sourceUrl = ko.observable();
            }
            if (value) {
                this._sourceUrl(value);
            }
            return this._sourceUrl();
        };
        //http://stackoverflow.com/questions/12822954/get-previous-value-of-an-observable-in-subscribe-of-same-observable
        ko.subscribable.fn.subscribeChanged = function (callback) {
            var oldValue;
            this.subscribe(function (_oldValue) {
                oldValue = _oldValue;
            }, this, 'beforeChange');

            this.subscribe(function (newValue) {
                callback(newValue, oldValue);
            });
        };
        /*
            Option          Type    Default     Description   
            mapChildren     bool    false       If all child items should be observables as well
            hardFail        bool    true        Shows a modal with error message if call fails, otherwise it's up to caller to display error on target.isFailed == true
        */

        // Special attribute shortcuts
        ko.bindingHandlers.id = {
            update: function (element, valueAccessor) {
                ko.bindingHandlers.attr.update(element,
                    function () {
                        return { id: valueAccessor() };
                    });
            }
        };

        ko.bindingHandlers.href = {
            update: function (element, valueAccessor) {
                ko.bindingHandlers.attr.update(element,
                    function () {
                        return { href: valueAccessor() };
                    });
            }
        };

        ko.bindingHandlers.src = {
            update: function (element, valueAccessor) {
                ko.bindingHandlers.attr.update(element,
                    function () {
                        return { src: valueAccessor() };
                    });
            }
        };

        // Negation of visible
        ko.bindingHandlers.hidden = {
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                ko.bindingHandlers.visible.update(element, function () { return !value; });
            }
        };

        // Event for enter key
        ko.bindingHandlers.onenterkeypress = {
            init: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                $(element)
                    .keypress(function (e) {
                        $(element).change(); // Force update to viewModel before triggering event
                        if (e.which === 13) {
                            value(ko.dataFor(element));
                        }
                    });
            }
        };


        // Numeric helpers
        ko.bindingHandlers.numericText = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var options = ko.utils.unwrapObservable(allBindingsAccessor().numericOptions) ||
                    { precision: 0, suffix: '', largeNumbers: false };

                if (options.largeNumbers) {
                    value = value < 1000 ? value : value < 1000000 ? (value / 1000).toFixed(1) + 'k' : (value / 1000000).toFixed(1) + 'm';
                } else {
                    value = value.toFixed(options.precision);
                }
                var formattedValue = value + (options.suffix || '');

                ko.bindingHandlers.text.update(element, function () { return formattedValue; });
            }
        };

        ko.bindingHandlers.fileSize = {
            update: function (element, valueAccessor) {
                var kb = 1024;
                var mb = 1024 * kb;
                var gb = 1024 * mb;
                var tb = 1024 * gb;

                var value = ko.utils.unwrapObservable(valueAccessor());

                var formatted;
                if (value < kb)
                    formatted = value.toFixed(0) + ' B';
                else if (value < mb)
                    formatted = (value / kb).toFixed(0) + ' kB';
                else if (value < gb)
                    formatted = (value / mb).toFixed(2) + ' MB';
                else if (value < tb)
                    formatted = (value / mb).toFixed(2) + ' GB';
                else 
                    formatted = (value / tb) + ' TB';

                return ko.bindingHandlers.text.update(element, function () { return formatted; });
            }
        };

        // Datetime helpers
        ko.bindingHandlers.dateText = {
            update: function (element, valueAccessor, allBindingsAccessor) {
                var val = ko.utils.unwrapObservable(valueAccessor());
                var format = ko.utils.unwrapObservable(allBindingsAccessor().dateFormat) || 'L';

                return ko.bindingHandlers.text.update(element, function () { return moment(val).format(format); });
            }
        };

        ko.bindingHandlers.timeAgo = {
            update: function (element, valueAccessor) {
                var val = ko.utils.unwrapObservable(valueAccessor()),
                    timeAgo = moment(val).fromNow();
                return ko.bindingHandlers.html.update(element,
                    function () {
                        return '<time datetime="' + encodeURIComponent(val) + '">' + timeAgo + '</time>';
                    });
            }
        };

        function toRelativeTime(dt) {
            var secs = (((new Date()).getTime() - dt.getTime()) / 1000),
                days = Math.abs(Math.floor(secs / 86400));

            return days < 7 ? moment(dt).utc().fromNow() : moment(dt).format('LL');
        }

        ko.bindingHandlers.relativeTime = {
            update: function (element, valueAccessor) {
                var val = ko.utils.unwrapObservable(valueAccessor()),
                    date = new Date(val), // WARNING: this is not compatibile with IE8
                    timeAgo = toRelativeTime(date);
                return ko.bindingHandlers.html.update(element,
                    function () {
                        return '<time datetime="' + encodeURIComponent(val) + '">' + timeAgo + '</time>';
                    });
            }
        };

        // Object mapping
        ko.bindingHandlers.objectMapper = {
            init: function (element, valueAccessor) {
                var options = ko.utils.unwrapObservable(valueAccessor());
                var $target = $(options.target);
                var $element = $(element);

                if (options.attr) {
                    $element.attr(options.attr, $target.attr(options.attr));
                }
            }
        };

        ko.bindingHandlers.objectUpdater = {
            init: function (element, valueAccessor) {
                var options = ko.utils.unwrapObservable(valueAccessor());
                var $target = $(options.target);
                var $element = $(element);

                if (options.prop) {
                    $element.val($target.prop(options.prop));
                    $element.change(function () {
                        $target.prop(options.prop, $element.val());
                    });
                }
                if (options.html) {
                    $element.val($target.html());
                    $element.change(function () {
                        $target.html($element.val());
                    });
                }
                if (options.attr) {
                    if (options.checkedValue) {
                        $element.attr('checked', $target.attr(options.attr) == options.checkedValue);
                        $element.click(function () {
                            $target.attr(options
                                .attr,
                                $element.prop('checked') ? options.checkedValue : options.uncheckedValue);
                        });
                    } else {
                        $element.val($target.attr(options.attr));
                        $element.change(function () {
                            $target.attr(options.attr, $element.val());
                        });
                    }
                }
                if (options.css) {
                    if (options.checkedValue) {
                        $element.prop('checked', $target.css(options.css) == options.checkedValue);
                        $element.click(function () {
                            $target.css(options.css,
                                $element.prop('checked') ? options.checkedValue : options.uncheckedValue);
                        });
                    } else {
                        $element.val($target.attr(options.css));
                        $element.change(function () {
                            $target.attr(options.css, $element.val());
                        });
                    }
                }
            }
        };


        // CSS helpers
        ko.bindingHandlers.cssUpdater = {
            init: function (element, valueAccessor) {
                var options = ko.utils.unwrapObservable(valueAccessor());
                $(element).val(options.target.css(options.read || options.write));
                $(element)
                    .change(function () {
                        options = ko.utils.unwrapObservable(valueAccessor());
                        console.log('cssUpdater writing',
                            options.target,
                            options.write || options.read,
                            $(element).val());
                        options.target.css(options.write || options.read, $(element).val());
                    });
            }
        };
        ko.bindingHandlers.cssReader = {
            init: function (element, valueAccessor) {
                var options = ko.utils.unwrapObservable(valueAccessor());
                console.log('cssUpdater', options);
                $(element).text(options.target.css(options.read));
            }
        };


        // Widgets
        ko.bindingHandlers.intlTelInput = {
            init: function (element) {
                $(element)
                    .intlTelInput({
                        validationScript: '/Plugins/intl-tel-input/js/isValidNumber.min.js',
                        //defaultCountry: 'se',
                        preferredCountries: ['se', 'us']
                        //,responsiveDropdown: true
                    })
                    .blur(function () {
                        var $this = $(this);
                        if ($.trim($this.val())) {
                            if ($this.intlTelInput("isValidNumber")) {
                                $this.closest('.form-group').removeClass("has-error");
                            } else {
                                console.log('blur', 'notisvalid');
                                $this.closest('.form-group').addClass("has-error");
                            }
                        }
                    })
                    .keydown(function () {
                        $(this).closest('.form-group').removeClass("has-error");
                    });
            }
        };

        ko.bindingHandlers.tablesorter = {
            init: function (element, valueAccessor) {
                console.log('Init tablesorter');
                $(element).closest('table').tablesorter(ko.utils.unwrapObservable(valueAccessor()));
            },
            update: function (element) {
                console.log('Update tablesorter');
                $(element).closest('table').trigger("update");
            }
        };

        ko.bindingHandlers.datepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var $el = $(element);

                //initialize datepicker with some optional options
                var options = allBindingsAccessor().datepickerOptions || {};
                var val = ko.utils.unwrapObservable(valueAccessor());
                $el.datepicker(options);
                var date = moment(val);
                if (date.isValid()) {
                    $el.datepicker('setValue', date.format('L'));
                }

                //handle the field changing
                ko.utils.registerEventHandler(element,
                    "changeDate",
                    function (evt) {
                        $el.val(moment(evt.date).format('L')).change();
                    });

                $el.change(function () {
                    console.log('Datepicker el change', moment($el.val()).format());
                    var value = valueAccessor();
                    if (ko.isObservable(value)) {
                        // If the current value is a date make sure not to change the time
                        var curDate = moment(value());
                        var newDate = moment($el.val());
                        if (newDate.isValid()) {
                            newDate.hours(curDate.hours());
                            newDate.minutes(curDate.minutes());
                            newDate.seconds(curDate.seconds());
                            newDate.milliseconds(curDate.milliseconds());
                            value(newDate.toDate());
                        }
                    }
                });
            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var date = moment(value);
                if (date.isValid()) {
                    var $element = $(element);
                    $element.datepicker('setValue', date.format('L'));
                    $element.val(date.format('L'));
                }
            }
        };

        ko.bindingHandlers.timepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                // Get the value of the value binding
                var $el = $(element);
                var options = allBindingsAccessor().timepickerOptions || { showSeconds: false, showMeridian: false };
                var val = ko.utils.unwrapObservable(valueAccessor());
                $el.timepicker(options);
                if (val) {
                    var time = moment(val).format('LT');
                    $el.timepicker('setTime', time);
                }

                //handle the field changing
                ko.utils.registerEventHandler(element,
                    "changeTime.timepicker",
                    function (evt) {
                        var value = valueAccessor();
                        if (ko.isObservable(value)) {
                            // If there is a current date make sure not to change the date
                            var date = moment(value());
                            if (date.isValid()) {
                                date.hours(evt.time.hours);
                                date.minutes(evt.time.minutes);
                                date.seconds(evt.time.seconds);
                                value(date.toDate());
                                //console.log('tp date value updated to ', value());
                            } else {
                                value(evt.time);
                                //console.log('tp new time value is ', value());
                            }
                        }
                    });

            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                var date = moment(value);
                if (date.isValid()) {
                    $(element).timepicker('setTime', date.format('LT'));
                } else {
                    $(element).timepicker('setTime', value);
                }
            }
        };

        ko.bindingHandlers.colorPicker = {
            init: function (element) {
                var $element = $(element);
                var addon = $element.parent().find('.input-group-addon');
                addon.css('background-color', $element.val());

                var colorPicker = $("<div class='farbtastic-container'>").appendTo('body');
                colorPicker.hide();
                $element
                    .on('click',
                        function () {
                            colorPicker.fadeIn('fast');
                            colorPicker.position({
                                my: "left bottom",
                                at: "left top",
                                of: $element,
                                collision: "fit"
                            });
                        });

                colorPicker.farbtastic(function (color) {
                    addon.css('background-color', color);

                    $element
                        .val(color)
                        .change();
                });
                $(document)
                    .mouseup(function (e) {
                        if (colorPicker.has(e.target).length === 0)
                            colorPicker.fadeOut('fast');
                    });
            }
        };

        ko.bindingHandlers.slider = {
            init: function (element, valueAccessor) {
                var input = $(element);

                var options = ko.utils.unwrapObservable(valueAccessor());
                $.extend(options,
                {
                    value: input.val().replace('px', ''), // Fix to something generic
                    slide: function (evt, ui) {
                        input.val(ui.value + 'px');
                        input.change();
                    }
                });
                $("<div>")
                    .insertAfter(input)
                    .slider(options);
            }
        };

        ko.bindingHandlers.selectPicker = {
            init: function (element) {
                $(element).selectpicker();
            }
        };

        ko.bindingHandlers.iconPicker = {
            init: function (element, valueAccessor) {
                var $element = $(element);

                var defaults = {
                    iconset: 'urls'
                };
                var options = ko.utils.unwrapObservable(valueAccessor());
                $.extend(defaults, options);
                $element.iconpicker(defaults);
            }
        };

        // Select 2
        ko.bindingHandlers.select2 = {
            init: function (el, valueAccessor, allBindingsAccessor) {
                ko.utils.domNodeDisposal.addDisposeCallback(el,
                    function () {
                        $(el).select2('destroy');
                    });

                var allBindings = allBindingsAccessor(),
                    select2 = ko.utils.unwrapObservable(allBindings.select2);

                var $el = $(el);

                $el.select2(select2);

                // Add handler to throw event for new items
                if (select2.createChoice) {
                    var input = $(el).prev('.select2-container').find('.select2-input');
                    input.on('keyup',
                        function (evt) {
                            if (evt.keyCode == 13 && input.val()) {
                                select2.createChoice(input.val());
                                input.val('');
                                $el.select2('close');
                            }
                        });
                }
            },
            update: function (el, valueAccessor, allBindingsAccessor) {
                var allBindings = allBindingsAccessor();

                var textAccessor = function (value) { return value; };
                if ("optionsText" in allBindings) {
                    textAccessor = function (value) {
                        var valueAccessor = function (item) { return item; };
                        if ("optionsValue" in allBindings) {
                            valueAccessor = function (item) { return item[allBindings.optionsValue]; };
                        }
                        var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) === value; });
                        if (items.length === 0 || items.length > 1) {
                            return "UNKNOWN";
                        }
                        return items[0][allBindings.optionsText];
                    };
                }

                if ("value" in allBindings) {
                    if (allBindings.value() !== undefined) {

                        var item = {
                            id: allBindings.value(),
                            text: textAccessor(allBindings.value())
                        };
                        $(el).select2("data", item);
                    }
                } else if ("selectedOptions" in allBindings) {
                    var converted = [];

                    if (allBindings.selectedOptions() !== undefined) {
                        $.each(allBindings.selectedOptions(),
                            function (key, value) {
                                converted.push({ id: value, text: textAccessor(value) });
                            });
                        $(el).select2("data", converted);
                    }
                }
            }
        };

        function rgbToHex(rgb) {
            if (rgb === null) {
                return null;
            }

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgb) {
                return "#" +
                    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
            } else {
                return "";
            }
        }

        ko.bindingHandlers.toJSON = {
            update: function (element, valueAccessor) {
                return ko.bindingHandlers.text.update(element,
                    function () {
                        return ko.toJSON(valueAccessor(), null, 2);
                    });
            }
        };

        ko.bindingHandlers.textFromUrl = {
            update: function (element, valueAccessor) {
                var url = ko.utils.unwrapObservable(valueAccessor());
                var $element = $(element);

                $.ajax({
                    url: url,
                    async: true,
                    success: function (data) {
                        $element.text(data);
                    }
                });
            }
        };


        ko.extenders.propertyUpdateCallback = function (target, callback) {
            target.subscribe(function (newValue) {
                if (newValue) {
                    var keys = [];
                    for (var key in target()) {
                        keys.push(key);
                    }
                    $(keys)
                        .each(function (i, key) {
                            if (target().hasOwnProperty(key) && ko.isObservable(target()[key])) {
                                //console.log('subscribing to ', key);
                                var property = key;
                                target()[key].subscribe(function (newVal) {
                                    callback(target, property, newVal);
                                });
                            }
                        });
                }
            });
            return target;
        };
    });
/*
 Author : Divya Mamgai
 Form.js
 Version : 1.0
 2016
 */
(function ($, w, d, undefined) {
    const MessageState = Object.freeze({
        Error: 1,
        Required: 2
    });
    $.fn.GetLabel = function () {
        var $This = this;
        if ($This.length === 1) {
            return $('label[for=' + $This.attr('id') + ']', d);
        } else {
            var Array = [],
                Count = $This.length,
                ElementIndex = 0;
            while (ElementIndex < Count) {
                Array.push($('label[for=' + $This[ElementIndex++].id + ']', d));
            }
            return $(Array);
        }
    };
    $.fn.GetMessage = function () {
        var $This = this;
        if ($This.length === 1) {
            return $('span[data-for=' + $This.attr('id') + ']', d);
        } else {
            var Array = [],
                Count = $This.length,
                ElementIndex = 0;
            while (ElementIndex < Count) {
                Array.push($('span[data-for=' + $This[ElementIndex++].id + ']', d));
            }
            return $(Array);
        }
    };
    var Form = function ($formElement, onSubmit) {
        if ($formElement.length !== 0) {
            if ($formElement.length > 1)
                $formElement = $($formElement[0]);
            var $InputFields = $formElement.find('input').filter(function () {
                    var $This = $(this),
                        Type = ($This.attr('type') || 'text').toLowerCase();
                    if (($This.attr('data-form-ignore') === undefined) && ($This.closest('.FormRow').attr('data-form-ignore') === undefined)) {
                        switch (Type) {
                            case 'submit':
                            case 'button':
                            case 'file':
                            case 'checkbox':
                            case 'radio':
                                return false;
                            default:
                                return true;
                        }
                    }
                    return false;
                }),
                $TextAreaFields = $formElement.find('textarea').filter(function () {
                    var $This = $(this);
                    return ($This.attr('data-form-ignore') === undefined) && ($This.closest('.FormRow').attr('data-form-ignore') === undefined);
                }),
                $SelectFields = $formElement.find('select').filter(function () {
                    var $This = $(this);
                    return ($This.attr('data-form-ignore') === undefined) && ($This.closest('.FormRow').attr('data-form-ignore') === undefined);
                }),
                OnSubmitFunction = onSubmit,
                $MessageCache = $('<span class="Message">Message</span>'),
                Prototype = {
                    ValidationFunction: {
                        /**
                         * @return {boolean}
                         */
                        Name: function ($element, eventData) {
                            var Value = $element.val();
                            return (eventData.Required === true) ? ((Value.length > 0) &&
                            (/(^[A-Za-z]+?\.\s?[A-Za-z]+[A-Za-z\s]+$)|(^[A-Za-z\s]+$)/g.test(Value))) :
                                ((Value.length > 0) ?
                                    (/(^[A-Za-z]+?\.\s?[A-Za-z]+[A-Za-z\s]+$)|(^[A-Za-z\s]+$)/g.test(Value)) : true);
                        },
                        /**
                         * @return {boolean}
                         */
                        Number: function ($element) {
                            return $element.prop('validity').valid;
                        },
                        /**
                         * @return {boolean}
                         */
                        Email: function ($element, eventData) {
                            var Value = $element.val();
                            return (eventData.Required === true) ? ((Value.length > 0) &&
                            (/^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(Value))) :
                                ((Value.length > 0) ?
                                    (/^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(Value)) :
                                    true);
                        },
                        /**
                         * @return {boolean}
                         */
                        Mobile: function ($element, eventData) {
                            return (eventData.Required === true) ? $element.intlTelInput('isValidNumber') :
                                (($element.val().length > 0) ? $element.intlTelInput('isValidNumber') : true);
                        },
                        /**
                         * @return {boolean}
                         */
                        Pattern: function ($element, eventData) {
                            var Value = $element.val(),
                                Regex = eventData.Regex;
                            Regex.lastIndex = 0;
                            return (eventData.Required === true) ? ((Value.length > 0) && (Regex.test(Value)))
                                : ((Value.length > 0) ? (Regex.test(Value)) : true);
                        },
                        /**
                         * @return {boolean}
                         */
                        LengthCheck: function ($element, eventData) {
                            return (eventData.Required === true) ? ($element.val().length > 0) : true;
                        }
                    },
                    MessageFunction: {
                        /**
                         * @return {string}
                         */
                        Name: function ($element, state) {
                            switch (state) {
                                case MessageState.Error:
                                    return $element.attr('data-error-message') ||
                                        'Valid Name is required, Eg. Mr. John Doe';
                                    break;
                                case MessageState.Required:
                                    return $element.attr('data-required-message') || 'Please enter a Name';
                                    break;
                            }
                        },
                        /**
                         * @return {string}
                         */
                        ValidationMessage: function ($element) {
                            return $element.prop('validationMessage');
                        },
                        /**
                         * @return {string}
                         */
                        Number: function ($element, state) {
                            switch (state) {
                                case MessageState.Error:
                                    // Dirty non-empty Number input fix for value turning to '' when 'ee' is inputted
                                    // in the Number in input.
                                    var ContainsNumber = $element.prop('validationMessage').includes('number');
                                    return (ContainsNumber === true) ? 'Please enter a valid Number' :
                                        $element.prop('validationMessage');
                                    break;
                                case MessageState.Required:
                                    return $element.attr('data-required-message') || 'Please enter a Number';
                                    break;
                            }
                        },
                        /**
                         * @return {string}
                         */
                        Email: function ($element, state) {
                            switch (state) {
                                case MessageState.Error:
                                    return $element.attr('data-error-message') ||
                                        'Valid Email ID is required, Eg. abc@example.com';
                                    break;
                                case MessageState.Required:
                                    return $element.attr('data-required-message') || 'Please enter an Email ID';
                                    break;
                            }
                        },
                        /**
                         * @return {string}
                         */
                        Mobile: function ($element, state) {
                            switch (state) {
                                case MessageState.Error:
                                    return $element.attr('data-error-message') ||
                                        'Valid Mobile number is required, Eg. ' + $element.attr('placeholder');
                                    break;
                                case MessageState.Required:
                                    return $element.attr('data-required-message') || 'Please enter a Mobile number';
                                    break;
                            }
                        },
                        /**
                         * @return {string}
                         */
                        TextAreaWord: function (min, max, count) {
                            return (count < min) ? 'At least ' + (min - count) + ' word(s) more are required' :
                            'Word limit is ' + max + ', you have entered ' + count + ' word(s)';
                        },
                        /**
                         * @return {string}
                         */
                        TextAreaCharacter: function (min, max, count) {
                            return (count < min) ? 'At least ' + (min - count) + ' character(s) more are required' :
                            'Word limit is ' + max + ', you have entered ' + count + ' character(s)';
                        },
                        /**
                         * @return {string}
                         */
                        Pattern: function ($element, state) {
                            switch (state) {
                                case MessageState.Error:
                                    return $element.attr('data-error-message') || 'Please match the requested format.';
                                    break;
                                case MessageState.Required:
                                    return $element.attr('data-required-message') || 'Please fill out this field.';
                                    break;
                            }
                        }
                    },
                    EmptyFunction: {
                        /**
                         * @return {boolean}
                         */
                        LengthCheck: function ($element) {
                            return $element.val().length === 0;
                        },
                        /**
                         * @return {boolean}
                         */
                        Number: function ($element) {
                            // Dirty non-empty Number input fix for value turning to '' when 'ee' is inputted
                            // in the Number in input.
                            var ContainsNumber = $element.prop('validationMessage').includes('number');
                            return (ContainsNumber === true ? false : ($element.val().length === 0));
                        }
                    },
                    TextAreaWordCount: function (value) {
                        return value.replace(/\s+/gi, ' ').replace(/(^\s)|(\s$)/, '').split(' ').length;
                    },
                    TextAreaCharacterCount: function (value) {
                        return value.length;
                    },
                    HideRequiredMessage: function ($message) {
                        $message.removeClass('Show');
                    },
                    InputOnFocus: function () {
                        var $This = $(this),
                            $Label = $This.GetLabel();
                        $Label.addClass('Animated');
                    },
                    InputOnBlur: function () {
                        var $This = $(this),
                            $Label = $This.GetLabel(),
                            IsEmpty = true;
                        switch (($This.attr('data-validation') || 'default').toLowerCase()) {
                            case 'number':
                                IsEmpty = Prototype.EmptyFunction.Number($This);
                                break;
                            default:
                                IsEmpty = Prototype.EmptyFunction.LengthCheck($This);
                                break;
                        }
                        if (IsEmpty === true) {
                            $Label.removeClass('Animated');
                        }
                    },
                    CheckAlreadyFilled: function ($element) {
                        var $Label = $element.GetLabel(),
                            IsEmpty = true;
                        // In case details are already saved, we need to animate the labels accordingly and check for
                        // any errors, because they are not going to do it on their own, also we make it async to
                        // detect the input value.
                        setTimeout(function () {
                            switch (($element.attr('data-validation') || '').toLowerCase()) {
                                case 'number':
                                    IsEmpty = Prototype.EmptyFunction.Number($element);
                                    break;
                                default:
                                    IsEmpty = Prototype.EmptyFunction.LengthCheck($element);
                                    break;
                            }
                            if (IsEmpty === false) {
                                $Label.addClass('Animated');
                                $element.trigger('input');
                            }
                        }, 0);
                    },
                    CheckAlreadyFilledAll: function () {
                        $InputFields
                            .each(function () {
                                var $This = $(this);
                                switch (($This.attr('type') || 'text').toLowerCase()) {
                                    case 'tel':
                                        break;
                                    default:
                                        Prototype.CheckAlreadyFilled($This);
                                        break;
                                }
                            });
                        $TextAreaFields
                            .each(function () {
                                Prototype.CheckAlreadyFilled($(this));
                            });
                    },
                    InputFieldBindingFunction: function (event) {
                        if (event.data.IsNone === false) {
                            var EventData = event.data,
                                $This = EventData.$This,
                                $Message = EventData.$Message,
                                ValidationFunction = EventData.ValidationFunction,
                                MessageFunction = EventData.MessageFunction,
                                EmptyFunction = EventData.EmptyFunction,
                                Required = EventData.Required;
                            clearInterval($This.attr('data-required-interval'));
                            if ((Required === true) && (EmptyFunction($This) === true)) {
                                $This
                                    .removeClass('Error')
                                    .addClass('Required');
                                $Message
                                    .removeClass('Error')
                                    .html(MessageFunction($This, MessageState.Required))
                                    .addClass('Required Show');
                                $This.attr('data-required-interval', setTimeout(function () {
                                    Prototype.HideRequiredMessage($Message);
                                }, 5000));
                            } else if (ValidationFunction($This, EventData) === true) {
                                $This.removeClass('Required Error');
                                $Message.removeClass('Error Required Show');
                            } else {
                                $This
                                    .removeClass('Required')
                                    .addClass('Error');
                                $Message
                                    .removeClass('Required')
                                    .html(MessageFunction($This, MessageState.Error))
                                    .addClass('Error Show');
                            }
                        }
                    },
                    TextFieldBindingFunction: function (event) {
                        if (event.data.IsNone === false) {
                            var EventData = event.data,
                                $This = EventData.$This,
                                $Message = EventData.$Message,
                                Min = EventData.Min,
                                Max = EventData.Max,
                                Value = $This.val(),
                                Count = EventData.CountFunction(Value),
                                MessageFunction = EventData.MessageFunction,
                                Required = EventData.Required;
                            clearInterval($This.attr('data-required-interval'));
                            if ((Required === true) && (Value.length === 0)) {
                                $This
                                    .removeClass('Error')
                                    .addClass('Required');
                                $Message
                                    .removeClass('Error')
                                    .html(EventData.RequiredMessage)
                                    .addClass('Required Show');
                                $This.attr('data-required-interval', setTimeout(function () {
                                    Prototype.HideRequiredMessage($Message);
                                }, 5000));
                            } else if ((Count >= Min) && (Count <= Max)) {
                                $This.removeClass('Required Error');
                                $Message.removeClass('Error Required Show');
                            } else {
                                $This
                                    .removeClass('Required')
                                    .addClass('Error');
                                $Message
                                    .removeClass('Required')
                                    .html(MessageFunction(Min, Max, Count))
                                    .addClass('Error Show');
                            }
                        }
                    },
                    BindValidation: function () {
                        $InputFields.each(function () {
                            var $This = $(this),
                                $Message = $This.GetMessage(),
                                EventData = {
                                    $This: $This,
                                    $Message: $Message,
                                    IsNone: false,
                                    Required: $This.attr('required') === 'required'
                                };
                            switch (($This.attr('data-validation') || 'default').toLowerCase()) {
                                case 'none':
                                    EventData.IsNone = true;
                                    break;
                                case 'name':
                                    EventData.ValidationFunction = Prototype.ValidationFunction.Name;
                                    EventData.MessageFunction = Prototype.MessageFunction.Name;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.LengthCheck;
                                    break;
                                case 'number':
                                    EventData.ValidationFunction = Prototype.ValidationFunction.Number;
                                    EventData.MessageFunction = Prototype.MessageFunction.Number;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.Number;
                                    break;
                                case 'email':
                                    EventData.ValidationFunction = Prototype.ValidationFunction.Email;
                                    EventData.MessageFunction = Prototype.MessageFunction.Email;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.LengthCheck;
                                    break;
                                case 'tel':
                                    // $This
                                    //     .intlTelInput({
                                    //         allowDropdown: true,
                                    //         separateDialCode: true
                                    //     });
                                    $This
                                        .GetLabel()
                                        .addClass('Animated');
                                    EventData.ValidationFunction = Prototype.ValidationFunction.Mobile;
                                    EventData.MessageFunction = Prototype.MessageFunction.Mobile;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.LengthCheck;
                                    // When user changes selected country we need to perform validations again.
                                    $This.on('countrychange', EventData, Prototype.InputFieldBindingFunction);
                                    break;
                                case 'pattern':
                                    EventData.ValidationFunction = Prototype.ValidationFunction.Pattern;
                                    EventData.MessageFunction = Prototype.MessageFunction.Pattern;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.LengthCheck;
                                    EventData.Regex = new RegExp($This.attr('pattern') || '.*', 'g');
                                    break;
                                default:
                                    EventData.ValidationFunction = Prototype.ValidationFunction.LengthCheck;
                                    EventData.MessageFunction = Prototype.MessageFunction.ValidationMessage;
                                    EventData.EmptyFunction = Prototype.EmptyFunction.LengthCheck;
                                    break;
                            }
                            $This.on('input', EventData, Prototype.InputFieldBindingFunction);
                        });
                        $TextAreaFields.each(function () {
                            var $This = $(this),
                                Min = Number($This.attr('data-min')),
                                Max = Number($This.attr('data-max')),
                                RequiredMessage = $This.attr('data-required-message') || '',
                                EventData = {
                                    $This: $This,
                                    $Message: $This.GetMessage(),
                                    IsNone: false,
                                    Min: isNaN(Min) ? 0 : Min,
                                    Max: isNaN(Max) ? Infinity : Max,
                                    Required: $This.attr('required') === 'required',
                                    RequiredMessage: RequiredMessage.length > 0 ? RequiredMessage :
                                        'Please fill out this field'
                                };
                            switch (($This.attr('data-validation') || 'default').toLowerCase()) {
                                case 'none':
                                    EventData.IsNone = true;
                                    break;
                                case 'word':
                                    EventData.CountFunction = Prototype.TextAreaWordCount;
                                    EventData.MessageFunction = Prototype.MessageFunction.TextAreaWord;
                                    break;
                                case 'character':
                                    EventData.CountFunction = Prototype.TextAreaCharacterCount;
                                    EventData.MessageFunction = Prototype.MessageFunction.TextAreaCharacter;
                                    break;
                            }
                            $This.on('input', EventData, Prototype.TextFieldBindingFunction);
                        });
                    },
                    CreateMessage: function ($element) {
                        $MessageCache.clone().attr('data-for', $element.attr('id')).insertAfter($element);
                    },
                    Initialize: function () {
                        $InputFields
                            .each(function () {
                                var $This = $(this);
                                switch (($This.attr('type') || 'text').toLowerCase()) {
                                    case 'tel':
                                        Prototype.CreateMessage($This);
                                        break;
                                    default:
                                        Prototype.CreateMessage($This);
                                        $This
                                            .on('focus', Prototype.InputOnFocus)
                                            .on('blur', Prototype.InputOnBlur);
                                        Prototype.CheckAlreadyFilled($This);
                                        break;
                                }
                            });
                        $TextAreaFields
                            .on('focus', Prototype.InputOnFocus)
                            .on('blur', Prototype.InputOnBlur)
                            .each(function () {
                                var $This = $(this);
                                Prototype.CreateMessage($This);
                                Prototype.CheckAlreadyFilled($This);
                            });
                        var $SelectFieldsLabel = $SelectFields.GetLabel();
                        if ($SelectFieldsLabel.length > 1) {
                            $SelectFieldsLabel.each(function () {
                                $(this).addClass('Animated');
                            });
                        } else if ($SelectFieldsLabel.length === 1) {
                            $SelectFieldsLabel.addClass('Animated');
                        }
                        Prototype.BindValidation();
                        $formElement.on('submit', OnSubmitFunction);
                    },
                    ResetInput: function () {
                        var $This = $(this).val('').removeClass('Required Error').trigger('blur');
                        clearInterval(parseInt($This.attr('data-required-interval')));
                        $This.GetMessage().removeClass('Error Required Show');
                    }
                };
            Prototype.Initialize();
            return Prototype;
        }
    };
    $.fn.Form = function (onSubmit) {
        var $This = this,
            ElementCount = $This.length,
            FunctionToUse;
        if (ElementCount === 1) {
            if ($.isFunction(onSubmit)) {
                FunctionToUse = onSubmit;
            } else {
                FunctionToUse = $.noop;
                console.warn('$.fn.Form :: onSubmit is not a valid function, using $.noop.');
            }
            return new Form($This, FunctionToUse);
        } else if (ElementCount > 1) {
            var Index = 0,
                Array = [];
            if (onSubmit.constructor === w.Array) {
                // Different function for different form element.
                for (; Index < ElementCount; Index++) {
                    FunctionToUse = w[onSubmit[Index]];
                    if ($.isFunction(FunctionToUse) === false) {
                        FunctionToUse = $.noop;
                        console.warn('$.fn.Form :: onSubmit for form #' + Index + ' is not a valid function, using $.noop.');
                    }
                    Array.push(new Form($($This[Index]), FunctionToUse));
                }
            } else {
                // We use the same function for every Form element.
                FunctionToUse = $.noop;
                if ($.isFunction(onSubmit)) {
                    FunctionToUse = onSubmit;
                } else if (typeof onSubmit === 'string') {
                    if ($.isFunction(w[onSubmit])) {
                        // If string we need to get the associated function with that name.
                        FunctionToUse = w[onSubmit];
                    } else {
                        console.warn('$.fn.Form :: onSubmit does not contain a valid function name, using $.noop.');
                    }
                } else {
                    console.warn('$.fn.Form :: onSubmit has invalid type (' + (typeof onSubmit) +
                        '), using default empty onSubmit function.');
                }
                for (; Index < ElementCount; Index++) {
                    Array.push(new Form($($This[Index]), FunctionToUse));
                }
            }
            return Array;
        }
    };
})(jQuery, window, document);
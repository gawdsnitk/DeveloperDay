/*
 Author : Divya Mamgai
 */
(function ($, d, t) {
    var LoadingObject,
        Globals = {
            CurrentField: 0,
            LastField: 0,
            BackgroundColors: [
                '#1a2a37',
                '#112237',
                '#0a2317',
                '#102311',
                '#212121'
            ],
            RequestXHR: undefined
        },
        $Object = {},
        Functions = {
            ShowSuccessMessage: function () {
                t.to($Object.RegistrationForm, 0.3, {
                    y: '10rem',
                    marginTop: 0,
                    marginBottom: 0,
                    onComplete: function () {
                        $Object.RegistrationForm.css('visibility', 'hidden');
                    }
                });
                t.to($Object.FormContainer, 0.3, {
                    opacity: 0,
                    onComplete: function () {
                        $Object.FormContainer.css('visibility', 'hidden');
                    }
                });
                t.to($Object.FormRow[Globals.CurrentField], 0.3, {
                    height: 0,
                    onComplete: function () {
                        $(this.target).css({
                            display: 'none',
                            zIndex: 0
                        });
                    }
                });
                t.staggerTo($Object.FormRow.children(), 0.3, {
                    height: 0
                }, 0);
                t.fromTo($Object.SuccessMessage, 0.3, {
                    opacity: 0,
                    y: '-10rem',
                    display: 'block'
                }, {
                    opacity: 1,
                    y: '0'
                });
            },
            RegistrationFormOnSubmit: function (event) {
                event.stopPropagation();
                event.preventDefault();
                LoadingObject.Start();
                if (typeof Globals.RequestXHR !== 'undefined') {
                    Globals.RequestXHR.abort();
                }
                Globals.RequestXHR = $.ajax({
                    url: 'https://script.google.com/macros/s/AKfycbw39QuuDDrJ71HJC7bMTXGWCxAvcO2yYBfbi8q7q4xe0Th9S14/exec',
                    type: 'POST',
                    data: $Object.RegistrationForm.serialize()
                });
                Globals.RequestXHR.done(function (response, textStatus, jqXHR) {
                    if (typeof response !== 'undefined' && response.result === 'success') {
                        Functions.ShowSuccessMessage();
                    }
                });
                Globals.RequestXHR.fail(function (jqXHR, textStatus, errorThrown) {
                    Functions.ShowSuccessMessage();
                });
                Globals.RequestXHR.always(function () {
                    LoadingObject.Stop();
                });
            },
            ShowField: function (fieldIndex) {
                var Field = $Object.FormRow[fieldIndex];
                if (Field != undefined) {
                    t.fromTo(Field, 0.3, {
                        opacity: 0,
                        x: '-50rem',
                        zIndex: 1,
                        display: 'block'
                    }, {
                        opacity: 1,
                        x: '0rem',
                        onComplete: function () {
                            $(Field).find('input:not(.SubmitButton), textarea, select').focus();
                        }
                    });
                    t.staggerFromTo($Object.FormRowAnimatingChildren[fieldIndex], 0.3, {
                        opacity: 0,
                        x: '-50rem'
                    }, {
                        opacity: 1,
                        x: '0rem',
                        clearProps: 'all'
                    }, 0.1);
                }
            },
            HideField: function (fieldIndex) {
                var Field = $Object.FormRow[fieldIndex];
                if (Field != undefined) {
                    t.fromTo(Field, 0.3, {
                        opacity: 1,
                        x: '0rem',
                        zIndex: 0
                    }, {
                        opacity: 0,
                        x: '50rem',
                        onComplete: function () {
                            $(Field).css('display', 'none');
                        }
                    });
                }
            },
            Next: function () {
                if (Globals.CurrentField < Globals.LastField) {
                    var $Field = $($Object.FormRow[Globals.CurrentField]).find('input, textarea, select').first();
                    $Field.trigger('input');
                    if (!$Field.hasClass('Required') && !$Field.hasClass('Error')) {
                        $Object.Previous.addClass('Show');
                        Functions.HideField(Globals.CurrentField++);
                        Functions.ShowField(Globals.CurrentField);
                        $Object.StepCounter.text(Globals.CurrentField + 1);
                        if (Globals.CurrentField === Globals.LastField) {
                            $Object.Next.removeClass('Show');
                        }
                    }
                } else {
                    $Object.Next.removeClass('Show');
                }
            },
            Previous: function () {
                if (Globals.CurrentField > 0) {
                    $Object.Next.addClass('Show');
                    Functions.HideField(Globals.CurrentField--);
                    Functions.ShowField(Globals.CurrentField);
                    $Object.StepCounter.text(Globals.CurrentField + 1);
                    if (Globals.CurrentField === 0) {
                        $Object.Previous.removeClass('Show');
                    }
                } else {
                    $Object.Previous.removeClass('Show');
                }
            },
            InputOnKeyDown: function (event) {
                if (event.keyCode === 13) {
                    var $This = $(this);
                    if ($This.prop('tagName') !== 'TEXTAREA') {
                        if (!(($This.prop('tagName') === 'INPUT') && ($This.attr('type') == 'submit'))) {
                            event.stopPropagation();
                            event.preventDefault();
                            Functions.Next();
                        }
                    }
                }
            },
            BackgroundAnimation: function () {
                t.to($Object.Body, 2, {
                    // Bit Hack for Rounding
                    backgroundColor: Globals.BackgroundColors[(Math.random() * Globals.BackgroundColors.length) | 0],
                    onComplete: Functions.BackgroundAnimation,
                    delay: 5
                });
            },
            ShowRegistrationForm: function () {
                $Object.RegisterButton.css('display', 'none');
                $Object.FormContainer.css('display', 'block');
                t.fromTo($Object.FormContainer, 0.3, {
                    opacity: 0,
                    y: '-10rem',
                    display: 'block'
                }, {
                    opacity: 1,
                    y: '0rem'
                });
                Functions.ShowField(Globals.CurrentField);
            }
        };

    $(function () {
        LoadingObject = new LoadingPopUp();
        $Object.Body = $('body', d);
        $Object.MainFrame = $('#MainFrame', $Object.Body);
        $Object.InfoContainer = $('#InfoContainer', $Object.MainFrame);
        $Object.RegisterButton = $('#RegisterButton', $Object.MainFrame).on('click', Functions.ShowRegistrationForm);
        $Object.FormContainer = $('#FormContainer', $Object.MainFrame);
        $Object.StepCounter = $('#StepCounter', $Object.MainFrame);
        $Object.RegistrationForm = $('#RegistrationForm', $Object.MainFrame);
        if ($Object.RegistrationForm.length > 0) {
            Globals.RegistrationForm = $Object.RegistrationForm.Form(Functions.RegistrationFormOnSubmit);
            $Object.FormRow = $('.FormRow', $Object.RegistrationForm).css('display', 'none');
            $Object.FormRowAnimatingChildren = [];
            $Object.FormRow.each(function () {
                $Object.FormRowAnimatingChildren.push($(this).find('.col-sm-12').children().filter(':not(.SubmitButton, label)'));
            });
            Globals.LastField = ($Object.FormRow.length - 1);
            $Object.Next = $('#Next', $Object.RegistrationForm).on('click', Functions.Next);
            $Object.Previous = $('#Previous', $Object.RegistrationForm).on('click', Functions.Previous);
            $Object.Mobile = $('#Mobile', $Object.RegistrationForm);
            $Object.Mobile
                .intlTelInput({
                    allowDropdown: false,
                    separateDialCode: true,
                    onlyCountries: ['in']
                });
            $Object.InterestsAndSkills = $('#InterestsAndSkills', $Object.RegistrationForm)
                .TextAreaResize()
                .css('height', '53px');
            $Object.InputElements = $('input, textarea, select', $Object.RegistrationForm)
                .on('keydown', Functions.InputOnKeyDown);
            t.staggerFromTo($Object.MainFrame.children(), 0.5, {
                y: '10rem',
                opacity: 0
            }, {
                y: '0rem',
                opacity: 1
            }, 0.3, function () {
                Functions.BackgroundAnimation();
            });
        }
        $Object.SuccessMessage = $('#SuccessMessage', $Object.MainFrame).css('display', 'none');
    });
})(jQuery, document, TweenMax);
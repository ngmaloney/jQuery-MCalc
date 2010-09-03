/*
  jQuery mcalc - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.

 * */

(function($){
// i18n
function _(str, args) { return $.i18n('mcalc', str, args); }

$.extend($.strConversion, {
    C: function(input, args){ 
        var i = parseFloat(input, 10).toFixed(2); 
        i = (i == "NaN") ? "0.00" : i; 
        return i.replace(/(\d+)(\d{3})\.?(\d+)?/, '$1,$2.$3');
    }
});

$.widget('ui.mcalc', {
    data: {},
    refresh: function() {
        this._trigger('refresh');
    },
    _ui: {},
    _create: function() {
        var ui = this;
        
        this._log('mcalc:initialing: %o (options: %o, ui: %o)', this.element, this.options, this);

        for (var x in $.ui.mcalc.components) {
            if ($.ui.mcalc.components[x]) {
                var component = $.ui.mcalc.components[x];
                if (component.defaults) {
                    ui.options = $.extend(component.defaults, ui.options);
                }
                if ((component.lazy && ui.options[component.name]) || !component.lazy) {
                    ui._createComponent(component);
                }
            }
        }
        $(ui.element).width(ui.options.width).addClass('ui-mcalc ui-widget');
        ui._trigger('ready');
        ui._trigger('refresh');
    },

    _help: function() {
        if (this.options.showFieldHelp) {
            this._component('formpane').find('.ui-help').remove();
            if (arguments[0] !== false) {
                $.tpl('mcalc.help', {message: arguments[0]})
                    .appendTo(this._component('formpane')).fadeIn();
            }
        }
    },

    _recalc: function() {
        // fix highlight effect end color
        var bgcolor = this._component('tabs').css('backgroundColor');
        this._component('subtotal').css('backgroundColor', bgcolor);
        this._component('total').css('backgroundColor', bgcolor);

        var p = parseFloat(this._component('principal').val(), 10);
        var i = parseFloat(this._component('interest').val(), 10);
        var y = parseInt(this._component('term').val(), 10);
        var t = parseFloat(this._component('ptaxes').val(), 10);
        var s = parseFloat(this._component('insurance').val(), 10);
        this.data = {
            principal:          p,
            cashdown:           this._component('cashdown').val(),
            term:               this._component('term').val(),
            pmi:                this._component('pmi').val(),
            interest:           this._component('interest').val(),
            amortschedule:      this._component('amortschedule').val(),
            yearlyInterest:     i/100,
            monthlyInterest:    i/100/12,
            yearlyPeriods:      y,
            monthlyPeriods:     y*12,
            propretyTax:        t,
            yearlyPropretyTax:  t/100,
            monthlyPropertyTax: t/100,
            yearlyInsurance:    p * s / 100,
            monthlyInsurance:   p * s / 100 / 12
        };
        this._log('mcalc.recalc: %o', this.data);
        this.options.calc.apply(this);
    },

    _log: function() {
        if ((typeof(console) == 'undefined' || typeof(console.log) == 'undefined') && this.options.debug) {
            console.log.apply(document, arguments);
        }
    },

    _trigger: function(e, component) {
        this._log('mcalc.event: %s', e);
        if (e == 'refresh' && !component) { 
            this.element.trigger('refresh'); 
        }
        for (var x in this._components) {
            var c = this._components[x];
            if ((!component 
                 || (component 
                     && (component == c.name 
                     || $.inArray(component, c.name) > -1))) 
                && c.events) {
                    // Component will receive the event only if they either are 
                    // not "lazy" OR are "lazy" AND enabled in the options 
                    // (this.options.componentname is true)
                    if ((c.lazy && this.options[c.name]) || !c.lazy) {
                        for (var y in c.events) {
                            var ev = c.events[y];
                            if (ev.type == e) {
                                var el = ev.selector && this._component(c.name).find(ev.selector) || this._component(c.name);
                                this._log(' - %s: %o', e, c);
                                ev.callback.apply(el, [$.Event(e), this]);
                            }
                        }
                    }
            }
        }
    },

    _components: [],
    _createComponent: function(c, args) {
        var $elf = this;
        var ns = arguments[0].name + '.component';
        var callback = function(event) {
            e.callback.apply(this, [event, $elf]);
        };
        this._components[ns] = arguments[0];
        $.tpl(ns, arguments[0].tpl);
        this._ui[ns] = $.tpl(ns);
        if (c.init) { c.init.apply(this._ui[ns], [this]); }
        if (c.val)  { this._ui[ns].val = c.val; }
        if (c.help) { this._ui[ns].data('help', c.help); }
        if (c.events) {
            for (var k in c.events) {
                var e = c.events[k];
                var b = c.live && 'live' || 'bind';
                if (e.selector) {
                    this._component(arguments[0].name).find(e.selector)[b](e.type +'.component', callback);
                }
                else {
                    this._component(arguments[0].name)[b](e.type +'.component', callback);
                }
            }
        }
        if (c.help) {
            var fields = this._component(arguments[0].name).find('input, select, textarea');

            if (fields.length === 0) {
                this._component(arguments[0].name)
                    .bind('mouseover',  function(){ $elf._help(c.help); })
                    .bind('mouseleave', function(){ $elf._help(false);  });
            }
            else {
                fields.bind('focus', function(){ $elf._help(c.help); })
                      .bind('blur',  function(){ $elf._help(false);  });
            }

        }
        return this._ui[ns];
    },
    _component: function() {
        var ns = arguments[0] + '.component';
        return this._ui[ns] || jQuery();
    },
    _updateTotals: function(total, subtotal) {
        var effectArgs = [this.options.fieldUpdatedEffect, this.options.fieldUpdatedEffectOptions, this.options.fieldUpdatedEffectDuration, 
            function(){
                $(this).css('backgroundColor', 'transparent');
                $(this).css('backgroundColor', 'transparent');
            }
        ];

        $.fn.effect.apply(this._component('subtotal'), effectArgs) 
            .find('b').text($.format(this.options.currencyFormat, subtotal));
        
        $.fn.effect.apply(this._component('total'), effectArgs)
            .find('b').text($.format(this.options.currencyFormat, total));
    },
    _smartResize: function(pr, size, axis, callback){
        if (size instanceof jQuery) {
            var el   = size;
            size = [size.width(), size.height()];
        }

        if (axis == 'width') {
            var pw = pr.width();
            var cw = size[0];
            var ns = size;

            if (pw < cw) {
                var sides = ['left', 'right'];
                var dif = 0;
                for (var x in sides) {
                    //dif = dif + parseInt(pr.css('margin-'+  sides[x]).slice(0, -2));
                    //dif = dif + parseInt(pr.css('padding-'+ sides[x]).slice(0, -2));
                }
                ns[0] = cw - (dif + (cw - pw));
                ns[1] = Math.round(ns[0]/cw * size[1]);

                if (callback) {
                    callback.apply(this, ns);
                }
                else if (el) {
                    $(el).width(size[0]);
                    $(el).height(size[1]);
                }
                else {
                    return ns;
                }

            }
        }
    }
});

// Calculate monthly payments
$.ui.mcalc.calc = function() { 
    var d = this.data;
    var p = d.principal - (d.principal * d.cashdown/100);

    d.yearlySubtotal  = parseFloat((p * Math.pow(1 + d.yearlyInterest, d.yearlyPeriods) * d.yearlyInterest) / (Math.pow(1 + d.yearlyInterest, d.yearlyPeriods) -1), 10);
    d.yearlyTotal     = parseFloat(d.yearlySubtotal + (d.yearlyPropretyTax * p) + d.yearlyInsurance + (d.pmi * 12), 10);

    d.monthlySubtotal = parseFloat((p * Math.pow(1 + d.monthlyInterest, d.monthlyPeriods) * d.monthlyInterest) / (Math.pow(1 + d.monthlyInterest, d.monthlyPeriods) -1), 10);
    d.monthlyTotal    = parseFloat(d.monthlySubtotal + ((d.monthlyPropertyTax * p)/12) + d.monthlyInsurance + d.pmi, 10);

    var totals = (d.amortschedule == 'yearly')
        ? [d.yearlyTotal,  d.yearlySubtotal]
        : [d.monthlyTotal, d.monthlySubtotal];

    this._updateTotals.apply(this, totals);

};

$.ui.mcalc.prototype.options = {
    debug:       false,
    form:        ['principal', 'cashdown', 'interest', 'term', 'amortschedule', 'subtotal', 'insurance', 'ptaxes', 'pmi', 'total'],
    principal:   300000, // $
    cashdown:    '10.00', // %
    interest:    '5.50', // %
    term:        30,     // years
    termValues:  [5, 10, 15, 20, 25, 30],
    ptaxes:      '1.50',    // %
    insurance:   '0.50',    // %
    pmi:         '80.00',     // $
    pmiThershold: 20,    // %
    calc:        $.ui.mcalc.calc,
    currencyFormat: _('${0:C}'),
    showFieldHelp: true,
    fieldUpdatedEffect: 'highlight',
    fieldUpdatedEffectOptions: {},
    fieldUpdatedEffectDuration: 1000,
    width: 600,
    tabs:  true // mandatory
};

$.ui.mcalc.getVal = function(){
    if (arguments.length > 0){
        return $(this).find('input').val.apply(this, arguments);
    }
    return $(this).find('input').val();
};

$.ui.mcalc.inputReadyRefreshObserver = function(e, ui){
    $(this).find('input').delayedObserver(function(e) {
        ui._trigger('refresh');
    }, 1.0);
};

$.ui.mcalc.components = {};
$.ui.mcalc.component  = function(c) { $.ui.mcalc.components[c.name] = c; };

$.ui.mcalc.component({
    name: 'tabs',
    tpl: [
    '<div id="mcal-tabs">',
        '<ul>',
            $.format('<li><a href="#tab-calculator">{0:s}</a></li>', _('Calculator')),
        '</ul>',
        '<div id="tab-calculator" class="ui-helper-clearfix"></div>',
    '</div>'],
    init: function(ui) {
        var $elf = ui;
        ui._getActiveTab = function() {
            return ui._component('tabs').find('.ui-state-active a').attr('href').replace('#tab-', '');
        };
        ui._getActiveTabId = function() {
            return ui._component('tabs').tabs('option', 'selected');
        };
        ui._getTabId = function(slug){
            return ui._component('tabs').find('li a').index(ui._component('tabs').find('li a[href=#tab-]'+ slug));
        };
    },
    events: [
        {type: 'ready', callback: function(e, ui){
            var $elf = ui;
            $(this).appendTo(ui.element)
                .find('#tab-calculator')
                    .append(ui._component('form'))
                    .append(ui._component('formpane'))
                .end() 
                .tabs()
                .bind('tabsshow', function(e, ui){
                    $elf._trigger('refresh');
                });
        }}
    ]
});

$.ui.mcalc.prototype.options.principalKeynav = {
    type: 'integer',
    max_length: 7,
    max: 9999999
};

$.ui.mcalc.component({
    name: 'principal',
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:s}</label><input id="ui-mcalc-principal" type="text" maxlength="9" /> $</li>', _('Principal')),
    help: _('The amount lent, or the value of the assets lent, is called the principal. This principal value is held by the borrower on credit.'),
    val:  function(){ 
        var $elf = $(this);
        if (arguments.length > 0){
            $elf.find('input').val(arguments[0]);
            return $elf;
        }
        return parseFloat($elf.find('input').val(), 10);
    },
    init: function(ui) {
        $(this).find('input').val(ui.options.principal).keynav(ui.options.principalKeynav);
    },
    events: [
        {type: 'ready', callback: $.ui.mcalc.inputReadyRefreshObserver}
    ]
});


$.ui.mcalc.prototype.options.cashdownKeynav = {
    type: 'fixed',
    max_length: 5,
    max_digits: 2,
    max: 99
};

$.ui.mcalc.component({
    name: 'cashdown',
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:s}</label><input id="ui-mcalc-cashdown" type="text" maxlength="4" /> % <small></small></li>', _('Down payment')),
    val:  function(){ 
        var $elf = $(this);
        if (arguments.length > 0){
            $elf.find('input').val(arguments[0]);
            return $elf;
        }
        return parseFloat($elf.find('input').val(), 10);
    },
    init: function(ui) {
        $(this).find('input')
               .width(35)
               .val(ui.options.cashdown)
               .keynav($.ui.mcalc.prototype.options.cashdownKeynav);
    },
    events: [
        {type: 'ready',   callback: $.ui.mcalc.inputReadyRefreshObserver},
        {type: 'refresh', callback: function(e, ui) {
            var cd = $.format(ui.options.currencyFormat, ui._component('principal').val() * ui._component('cashdown').val()/100);
            $(this).find('small').text(' ('+ cd +')');
        }}
    ]
});

$.ui.mcalc.prototype.options.interestKeynav = $.ui.mcalc.prototype.options.cashdownKeynav;

$.ui.mcalc.component({
    name: 'interest',
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:s}</label><input id="ui-mcalc-interest" type="text" />&nbsp;%</li>', _('Interest')),
    help: _('The interest is a compensation to the lender for forgoing other useful investments that could have been made with the loaned asset.'),
    val:  function(){
        if (arguments.length > 0){
            return $(this).find('input').val(arguments[0]);
        }
        return $(this).find('input').val();
    },
    init: function(ui){
        $(this).find('input')
               .width(35)
               .val(ui.options.interest)
               .keynav($.ui.mcalc.prototype.options.interestKeynav);
    },
    events: [
        {type: 'ready', callback: $.ui.mcalc.inputReadyRefreshObserver}
    ]
});

$.ui.mcalc.component({
    name: 'term',
    tpl:  [
        '<li class="ui-helper-clearfix">',
            $.format('<label>{0:s}</label>', _('Term')),
            '<select id="ui-mcalc-term"></select>&nbsp;',
            $.format('<small>({0:s})</small>', _('years')),
        '</li>'
    ],
    val:  function(){
        var $elf = $(this);
        if (arguments.length > 0){
            $elf.find('select').val(parseInt(arguments[0], 10));
            return $elf;
        }
        return parseInt($elf.find('select').val(), 10);
    },
    init: function(ui) {
        var tpl = [];
        for (var x in $.ui.mcalc.prototype.options.termValues) {
            tpl.push($.format('<option value="{0:s}">{0:s}</option>', $.ui.mcalc.prototype.options.termValues[x]));
        }
        $(this).find('select')
            .append(tpl.join('')).val(ui.options.term);
    },
    events: [
        {type: 'change', selector: '> select', callback: function(e, ui){
            ui._trigger('refresh');
        }}
    ]
});

$.ui.mcalc.prototype.options.ptaxesKeynav = $.ui.mcalc.prototype.options.cashdownKeynav;

$.ui.mcalc.component({
    name: 'ptaxes',
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:s}</label><input id="ui-mcalc-ptaxes" type="text" /> % <small></small></li>', _('Property taxes')),
    help: _('The Shift and Alt keys act as a modifiers when changing a value with the arrows or the mousewheel.'),
    val:  function(){
        if (arguments.length > 0){
            return $(this).find('input').val.apply(this, arguments);
        }
        return $(this).find('input').val();
    },
    init:  function(ui){
        $(this).find('input')
               .width(35)
               .val(ui.options.ptaxes)
               .keynav($.ui.mcalc.prototype.options.ptaxesKeynav);
    },
    events: [
        {type: 'ready', callback: $.ui.mcalc.inputReadyRefreshObserver},
        {type: 'refresh', callback: function(e, ui) {
            var cd = $.format(ui.options.currencyFormat, ui._component('principal').val() * ui._component('ptaxes').val()/100);
            $(this).find('small').text(' ('+ cd +')');
        }}
    ]
});

$.ui.mcalc.prototype.options.insuranceKeynav = $.ui.mcalc.prototype.options.cashdownKeynav;

$.ui.mcalc.component({
    name: 'insurance',
    help: _('You can use the up/down arrows or the mousewheel to change the values of the fields.'),
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:}</label><input id="ui-mcalc-insurance" type="text" /> % <small></small></li>', _('Insurance')),
    val:  function(){
        if (arguments.length > 0){
            return $(this).find('input').val.apply(this, arguments);
        }
        return $(this).find('input').val();
    },
    init:  function(ui){
        $(this).find('input')
               .width(35)
               .val(ui.options.insurance)
               .keynav($.ui.mcalc.prototype.options.insuranceKeynav);
    },
    events: [
        {type: 'ready', callback: $.ui.mcalc.inputReadyRefreshObserver},
        {type: 'refresh', callback: function(e, ui) {
            var cd = $.format(ui.options.currencyFormat, ui._component('principal').val() * ui._component('insurance').val()/100);
            $(this).find('small').text(' ('+ cd +')');
        }}
    ]
});

$.ui.mcalc.prototype.options.pmiKeynav = $.ui.mcalc.prototype.options.cashdownKeynav;

$.ui.mcalc.component({
    name: 'pmi',
    tpl:  $.format('<li class="ui-helper-clearfix"><label>{0:}</label><input id="ui-mcalc-pmi" type="text" /> $</li>', _('PMI')),
    help: 'If the down payment is less than 20% of the principal mortgage amount, it\'s likely that PMI will be required. PMI is an additional monthly insurance cost added directly to the mortgage payment.<br><br>Adding fields for these two values is key to projecting monthly mortgage costs.',
    val:  function(){
        if (arguments.length > 0){
            return $(this).find('input').val.apply(this, arguments);
        }
        return parseFloat($(this).find('input').val(), 10);
    },
    init:  function(ui){
        $(this).find('input')
               .width(35)
               .val(ui.options.pmi)
               .keynav($.ui.mcalc.prototype.options.pmiKeynav);
    },
    events: [
        {type: 'ready', callback: $.ui.mcalc.inputReadyRefreshObserver},
        {type: 'refresh', callback: function(e, ui) {
            if (ui._component('cashdown').val() < ui.options.pmiThershold) {
                ui._component('pmi').slideDown().val(ui.options.pmi);
                ui.data.pmi = ui.options.pmi;
            }
            else {
                ui._component('pmi').slideUp().val(0);
                ui.data.pmi = 0;
            }
        }}
    ]
});

$.ui.mcalc.component({
    name: 'amortschedule',
    tpl:  [
        '<li class="ui-helper-clearfix">',
            $.format('<label>{0:s}</label> ', _('Schedule')),
            $.format('<label style="display:inline;float:none;"><input type="radio" name="ui-amortschedule" value="monthly" checked> {0:s}</label>', _('Monthly')),
            $.format('<label style="display:inline;float:none;"><input type="radio" name="ui-amortschedule" value="yearly"> {0:s}</label>', _('Yearly')),
        '</li>'
    ],
    val:  function(){
        if (arguments.length > 0){
            return $(this).find('input').val.apply(this, arguments);
        }
        return $(this).find('input:checked').val();
    },
    events: [
        {type: 'change', selector: 'input', callback: function(e, ui){
            ui._trigger('refresh');
        }}
    ]
});

$.ui.mcalc.component({
    name: 'subtotal',
    tpl:  $.format('<li class="ui-mcalc-subtotal ui-helper-clearfix"><label>{0:s}</label><b>0.00</b></li>', _('Sub total')),
    val: function() {
        if (arguments.length === 0) {
            return parseFloat($(this).find('b').text().replace('$', ''), 10);
        }
    }
});

$.ui.mcalc.component({
    name: 'total',
    tpl:  $.format('<li class="ui-mcalc-total ui-helper-clearfix"><label>{0:s}</label><b>0.00</b></li>', _('Total')),
    val: function() {
        if (arguments.length === 0) {
            return parseFloat($(this).find('b').text().replace('$', ''), 10);
        }
    }
});

$.tpl('mcalc.help', '<div class="ui-help ui-state-highlight ui-corner-all ui-helper-hidden"><span class="ui-icon ui-icon-info"/><p>{message:s}</p></div>');
$.ui.mcalc.component({ name: 'formpane', tpl: '<div class="ui-formpane"></div>' });

$.ui.mcalc.component({
    name: 'form',
    tpl:  '<ul class="ui-form ui-mcalc-form"></ul>',
    events: [
        {type: 'ready', callback: function(e, ui){
            for (var x in ui.options.form) {
                $(this).append(ui._component(ui.options.form[x]));
            }
        }},
        {type: 'refresh', callback: function(e, ui) {
            ui._recalc();
        }}
    ]
});

})(jQuery);

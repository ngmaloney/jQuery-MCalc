/*
  jQuery mcalc.about - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

(function($){
// i18n
function _(str, args) { return $.i18n('mcalc', str, args); }

$.tpl('amortization.row', '<tr><th>{period:s}</th><td>{interest:C}</td><td>{principal:C}</td><td>{balance:C}</td></tr>');

$.ui.mcalc.amortableCalc = function() { 
    var p = this.data.principal;
    var b = p; // Balance
    var i = this.data.yearlyInterest;
    var y = this.data.yearlyPeriods;

    if (this.data.amortschedule == 'monthly') {
        i = this.data.monthlyInterest;
        y = this.data.monthlyPeriods;

        var periodEnd   = parseInt(this._component('amortoolbar').find('span').text(), 10) * 12;
        var periodStart = periodEnd - 11;
    }

    var payment = (i * b * Math.pow(1 + i, y)) / (Math.pow(1 + i, y) - 1);
    var table = [];

    for (var x=1; x <= y; x++) {
        var interestPaid = (b * i);
        var principalPaid = (payment - interestPaid);
        var row = {
            period:    x,
            balance:   b.toFixed(2),
            principal: principalPaid.toFixed(2),
            payment:   payment.toFixed(2),
            interest:  interestPaid.toFixed(2)
        };
        table.push(row);
        b = (b - principalPaid);
        if (!periodStart || (x >= periodStart && x <= periodEnd) || this._amortableShowAll) {
            $.tpl('amortization.row', row)
                .appendTo(this._component('amortable').find('tbody'));
        }
    }
    this._amortabledata = table;
    this._component('amortable')
        .data('amortable', table)
        .find('tbody tr:odd').addClass('odd');
};


$.ui.mcalc.component({
    name: 'amortable',
    lazy: true,
    defaults: {
        amortable: true,
        amortableCalc: $.ui.mcalc.amortableCalc
    },
    tpl: [
    '<div id="tab-amortization" class="ui-helper-clearfix">',
        $.format('<table class="ui-amortable" cellpadding="0" cellspacing="0" summary="">', _('Amortization table')),
            '<thead><tr>',
                $.format('<th class="ui-state-default" style="width:50px;">{0:s}</th>', _('Period')),
                $.format('<th class="ui-state-default" style="width:100px;">{0:s}</th>', _('Interest')),
                $.format('<th class="ui-state-default" style="width:100px;">{0:s}</th>', _('Principal')),
                $.format('<th class="ui-state-default">{0:s}</th>', _('Balance')),
            '</tr></thead>',
            '<tbody class="ui-widget-content"></tbody>',
        '</table>',
    '</div>'
    ],
    init: function(ui) {
        ui._amortable = function() {
            ui._component('amortable').find('tbody').empty();
            ui.options.amortableCalc.apply(this);
        };
    },
    events: [
        {type: 'ready', callback: function(e, ui) {
            ui._component('tabs')
                .append(this).tabs('add', '#tab-amortization', _('Amortization'));
        }},
        {type: 'recalc', callback: function(e, ui) {
            if (ui.data.amortschedule == 'yearly') {
                ui._component('amortoolbar').hide();
            }
            else {
                ui._component('amortoolbar').show();
            }
        }},
        {type: 'refresh', callback: function(e, ui) {
            if (ui._getActiveTab() == 'amortization') { // redraw only if visible
                ui._amortable();
            }
        }}
    ]
});

$.ui.mcalc.component({
    name: 'amortoolbar',
    tpl: [
        '<div class="ui-amortoolbar ui-helper-clearfix">',
            '<div class="ui-mcalc-slider"></div> ',
            $.format('<label>{0:s}:</label> <span>1</span> ', _('Year')),
            $.format('<label><input type="checkbox" class="ui-mcalc-amortable-all" /> {0:s}</label>', _('All')),
        '</div>'
    ],
    init: function(ui) {
        ui._amortableShowAll = false;
        ui._component('amortable').prepend(this);
        $(this).find('input').bind('change', function(e){
            ui._amortableShowAll = $(this).is(':checked');
            $('.ui-slider').slider('option', 'disabled', ui._amortableShowAll);
            ui._trigger('refresh');
        });
    },
    events: [
        {type: 'refresh', callback: function(e, ui) {
            ui._component('amortoolbar')[ui.data.amortschedule == 'monthly' && 'show' || 'hide']();
        }},
        {type: 'ready', callback: function(e, ui) {
            var $elf = ui; 
            $(this).find('.ui-mcalc-slider').slider({
                step:  3,
                slide: function(e, ui) {
                    $elf._component('amortoolbar').find('span').text(Math.round($elf._component('term').val()/100 * ui.value)||1);
                },
                change: function(e, ui) {
                    $elf._trigger('refresh');
                }
            });
        }}
    ]
});

})(jQuery);

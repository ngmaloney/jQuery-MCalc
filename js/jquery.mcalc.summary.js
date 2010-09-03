/*
  jQuery mcalc.about - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

(function($){
// i18n
function _(str, args) { return $.i18n('mcalc', str, args); }

$.ui.mcalc.prototype.options.summaryPrint = true;

$.tpl('summary.informations', [
    $.format('<h1>{0:s}</h1>', _('Mortgage summary')),
    '<dl class="ui-widget-content ui-summary">',
        $.format('<dt>{0:s}</dt>', _('Interest rate')),
                 '<dd>{interest:s}%</dd>',
        $.format('<dt>{0:s}</dt>', _('Term')),
                 '<dd>{term:s}</dd>',
        $.format('<dt>{0:s}</dt>', _('Principal')),
                 '<dd>{principal:s}</dd>',
        $.format('<dt class="no-border">{0:s}</dt>', _('Property taxes')),
                 '<dd class="no-border">{propretyTax:s}%</dd>',
    '</dl>'
]);
$.tpl('summary.monthlyPayments', [
    $.format('<h2>{0:s}</h2>', _('Monthly schedule')),
    '<dl class="ui-widget-content ui-summary">',
        $.format('<dt>{0:s}</dt>', _('Mortgage')),
        '<dd><small>{monthlyPeriods:s} x </small>{monthlyPayment:s} = {monthlyTotal:s}</dd>',
        $.format('<dt>{0:s}</dt>', _('Taxes')),
        '<dd><small>{monthlyPeriods:s} x </small>{monthlyPaymentTax:s} = {monthlyTotalTax:s}</dd>',
        $.format('<dt>{0:s}</dt>', _('Insurance')),
        '<dd><small>{monthlyPeriods:s} x </small>{insurance:s} = {monthlyTotalInsurance:s}</dd>',
        $.format('<dt class="no-border">{0:s}</dt>', _('Total')),
        '<dd class="no-border"><small>{monthlyPeriods:s} x </small>{monthlyTotalPayment:s} = {monthlyGrandTotal:s}</dd>',
    '</dl>'
]);
$.tpl('summary.yearlyPayments', [
    $.format('<h2>{0:s}</h2>', _('Yearly schedule')),
    '<dl class="ui-widget-content ui-summary">',
        $.format('<dt>{0:s}</dt>', _('Mortgage')),
        '<dd><small>{yearlyPeriods:s} x </small>{yearlyPayment:s} = {yearlyTotal:s}</dd>',
        $.format('<dt>{0:s}</dt>', _('Taxes')),
        '<dd><small>{yearlyPeriods:s} x </small>{yearlyPaymentTax:s} = {yearlyTotalTax:s}</dd>',
        $.format('<dt>{0:s}</dt>', _('Insurance')),
        '<dd><small>{yearlyPeriods:s} x </small>{insurance:s} = {yearlyTotalInsurance:s}</dd>',
        $.format('<dt class="no-border">{0:s}</dt>', _('Total')),
        '<dd class="no-border"><small>{yearlyPeriods:s} x </small>{yearlyTotalPayment:s} = {yearlyGrandTotal:s}</dd>',
    '</dl>'
]);
$.tpl('mcalc.print', [
'<a href="#" id="mcalc-print-summary" class="ui-button ui-state-default ui-corner-all">',
    $.format('<span class="ui-icon ui-icon-print"/> {0:s}', _('Print')),
'</a>'
]);
$.ui.mcalc.component({
    name: 'summary',
    lazy: true,
    defaults: { 
        summary: true,
        summaryPrint: true
    },
    tpl: '<div id="tab-summary" class="ui-summary ui-corner-all" />',
    events: [
        {type: 'ready', callback: function(e, ui){
            ui._component('tabs')
                .append(this).tabs('add', '#tab-summary', _('Summary'));

        }},
        {type: 'refresh', callback: function(e, ui){
            // infos
            var subtotal = ui._component('subtotal').val();
            $(this).empty();
            if (ui.options.summaryPrint) {
                ui._component('tabs').find('#tab-summary').prepend($.tpl('mcalc.print')
                    .bind('click', function(){
                        $(this).hide();
                        ui._component('summary').jqprint();
                        $(this).show();
                    }));
            }

            var term = $.format('{0:d} months', ui.data.term * 12);
            if (ui.data.amortschedule == 'yearly') {
                term = $.format('{0:d} years', ui.data.term);
            }
            
            $.tpl('summary.informations', {
                principal:   $.format(ui.options.currencyFormat, ui.data.principal),
                term:        term,
                interest:    ui.data.interest,
                subtotal:    subtotal,
                propretyTax: ui.data.propretyTax
              }).appendTo(this);

            
            $.tpl('summary.yearlyPayments', {
                yearlyPeriods: ui.data.yearlyPeriods,
                yearlyPayment: $.format(ui.options.currencyFormat, ui.data.yearlySubtotal),
                yearlyTotal: $.format(ui.options.currencyFormat, ui.data.yearlySubtotal * ui.data.yearlyPeriods),
                yearlyPaymentTax: $.format(ui.options.currencyFormat, ui.data.yearlyTotal - ui.data.yearlySubtotal - ui.data.yearlyInsurance),
                yearlyTotalTax: $.format(ui.options.currencyFormat, (ui.data.yearlyTotal - ui.data.yearlySubtotal - ui.data.yearlyInsurance) * ui.data.yearlyPeriods),
                insurance:  $.format(ui.options.currencyFormat, ui.data.yearlyInsurance),
                yearlyTotalInsurance: $.format(ui.options.currencyFormat, ui.data.yearlyInsurance * ui.data.yearlyPeriods),
                yearlyTotalPayment: $.format(ui.options.currencyFormat, ui.data.yearlyTotal),
                yearlyGrandTotal: $.format(ui.options.currencyFormat, (ui.data.yearlyTotal * ui.data.yearlyPeriods) + (ui.data.yearlyInsurance * ui.data.yearlyPeriods))
            }).appendTo(this);

           $.tpl('summary.monthlyPayments', {
                monthlyPeriods: ui.data.monthlyPeriods,
                monthlyPayment: $.format(ui.options.currencyFormat, ui.data.monthlySubtotal),
                monthlyTotal: $.format(ui.options.currencyFormat, ui.data.monthlySubtotal * ui.data.monthlyPeriods),
                monthlyPaymentTax: $.format(ui.options.currencyFormat, ui.data.monthlyTotal - ui.data.monthlySubtotal - ui.data.monthlyInsurance),
                monthlyTotalTax: $.format(ui.options.currencyFormat, (ui.data.monthlyTotal - ui.data.monthlySubtotal - ui.data.monthlyInsurance) * ui.data.monthlyPeriods),
                insurance:  $.format(ui.options.currencyFormat, ui.data.monthlyInsurance),
                monthlyTotalInsurance: $.format(ui.options.currencyFormat, ui.data.monthlyInsurance * ui.data.monthlyPeriods),
                monthlyTotalPayment: $.format(ui.options.currencyFormat, ui.data.monthlyTotal),
                monthlyGrandTotal: $.format(ui.options.currencyFormat, (ui.data.monthlyTotal * ui.data.monthlyPeriods) + (ui.data.monthlyInsurance * ui.data.monthlyPeriods))
           }).appendTo(this);
           
        }}
    ]
});

})(jQuery);

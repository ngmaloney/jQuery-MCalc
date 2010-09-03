/*
  jQuery mcalc.about - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

(function($){
// i18n
function _(str, args) { return $.i18n('mcalc', str, args); }

$.extend($.ui.mcalc.prototype.options, {
    permalinkInput: true,
    permalinkAnchor: true
});

$.ui.mcalc.component({
    name: 'permalink',
    lazy: true,
    defaults: { permalink: true },
    help: _('You can use this link to share your results with others or bookmark for later.'),
    tpl:  $.format('<div class="ui-mcalc-permalink"><label>{0:s}</label><input type="text" value="" /></div>', _('Permalink')),
    init: function(ui) {

        var el = $(this).find('input');

        el.focus(function(e){
            $(this).selectRange(0, $(this).val().length);
        });

        // on refresh
        ui._setPermalink = function() {
            var as   = ui._component('amortschedule').val();
            var hash = '#mcalc;{p:s},{i:s},{tm:s},{as:s},{hi:s},{pt:s},{ct:s},{tb:s}';
            var url  = '{protocol:s}//{host:s}{path:s}';
            var link = $.format(url, { protocol: window.location.protocol, host: window.location.host, path: window.location.pathname });
            var data = $.format(hash, {
                p: ui.data.principal, 
                i: parseFloat((ui.data.monthlyInterest*100*12).toFixed(2), 10),
                tm: ui._component('term').val(),
                as: as,
                hi: as == 'yearly' && ui.data.yearlyInsurance   || ui.data.monthlyInsurance,
                pt: as == 'yearly' && ui.data.yearlyPropretyTax || ui.data.monthlyPropertyTax,
                ct: ui._interestChartType,
                tb: ui._getActiveTabId()
            });
            if (ui.options.permalinkAnchor) {
                window.location.hash = data;
            }
            if (ui.options.permalinkInput) {
                el.val([link, data].join(''));
            }
        };
    },
    events: [
        {type: 'ready', callback: function(e, ui){
            if (ui.options.permalinkInput) {
                $(this).appendTo(ui._component('formpane'));
            }
            if (window.location.hash.slice(0, 7) == '#mcalc;') {
                var h = window.location.hash.slice(7).split(',');
                ui._component('principal').val(h[0]);
                ui._component('interest').val(h[1]);
                ui._component('term').val(h[2]);
                ui._component('amortschedule').val(h[3]);
                ui._component('insurance').val(h[4]);
                ui._component('ptaxes').val(h[5]);
                ui._interestChartType = h[6];
                ui._component('tabs').tabs('option', 'selected', parseInt(h[7], 10));
            }
        }},
        {type: 'refresh', callback: function(e, ui){
            var pr = ui._component('permalink').parent().parent();
            ui._smartResize(pr, ui._component('permalink'), 'width');
            ui._setPermalink();
        }}
    ]
});

})(jQuery);

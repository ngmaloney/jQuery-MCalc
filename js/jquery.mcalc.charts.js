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
    interestChartType: ['p3', 'p'],
    interestChart: {
        chs:  '290x160',
        cht:  'p3',
        chco: 'F7AF3A,CC3300,1C94C4',
        chma: '10,0,0,20|80,20',
        chdl: $.format('{0:s}|{1:s}|{2:s}', _('Principal'), _('Interest'), _('Others')),
        chf:  'bg,s,eeeeee',
        chdlp: 'b'
    },
    amortChart: {
        chs:  '270x160',
        cht:  'lc',
        chco: 'F7AF3A,CC3300',
        chma: '10,0,0,20|80,20',
        chdl: $.format('{0:s}|{1:s}', _('Principal'), _('Interest')),
        chxt: 'x,y',
        chg:  '20,50,1,5',
        chf:  'bg,s,eeeeee',
        chm:  'D,F7AF3A,0,0,2|D,CC3300,1,0,2',
        chdlp: 'b'
    },
    balanceChart: {
        cht:  'lc',
        chls: '2.0,0.0,0.0',
        chxt: 'x,y',
        chdl: _('Balance'),
        chs:  '288x160',
        chg:  '20,50,1,5',
        chf:  'bg,s,eeeeee',
        chma: '10,0,0,20|80,20',
        chdlp: 'b'
    }
});


$.googleChart = function(chart) {
    this.url = 'http://chart.apis.google.com/chart';
    var o = [];
    for (var x in chart) {
        if (x == 'chdl') {
            o.push([x, escape(chart[x])].join('='));
        }
        else {
            o.push([x, chart[x]].join('='));
        }
    }
    return $.format('url({0:s}?{1:s})', this.url, o.join('&'));
};

$.ui.mcalc.simpleEncode = function(valueArray, maxValue){
    this.map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var chartData = ['s:'];
    for (var i = 0; i < valueArray.length; i++) {
        var currentValue = valueArray[i];
        if (!isNaN(currentValue) && currentValue >= 0) {
            chartData.push(this.map.charAt(Math.round((this.map.length-1) * currentValue / maxValue)));
        }
        else {
            chartData.push('_');
        }
    }
    return chartData.join('');
};

$.ui.mcalc.extendedEncode = function(val) {
    this.map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.';
    var numericVal = parseInt(val, 10);
    if(isNaN(numericVal)) {
        alert("Non-numeric value submitted");
        return "";
    } else if (numericVal < 0 || numericVal > this.map.length * this.map.length - 1) {
        alert("Value outside permitted range");
        return "";
    }
    var quotient = Math.floor(numericVal / this.map.length);
    var remainder = numericVal - this.map.length * quotient;
    return this.map.charAt(quotient) + this.map.charAt(remainder);
};


$.ui.mcalc.component({
    name: 'interestchart',
    help: _('Click on the char to switch view mode.'),
    lazy: true,
    defaults: { 
        interestchart: true,
        interestchartSmartResize: true,
        interestchartType: ['p3', 'p']
    },
    tpl: '<div class="ui-chart ui-corner-all"></div>',
    init: function(ui) {
        ui._interestChartType = $.isArray(ui.options.interestChartType) 
            && ui.options.interestChartType[0] || ui.options.interestChartType;
    },
    events: [
        {type: 'ready', callback: function(e, ui){
            $(this).prependTo(ui._component('formpane'));
            if ($.isArray(ui.options.interestChartType)) {
                $(this).css('cursor', 'pointer').bind('click', function(){
                    var index = $.inArray(ui._interestChartType, ui.options.interestChartType);
                    index = (index == -1 || index == ui.options.interestChartType.length - 1)? 0: index+1;
                    ui._interestChartType = ui.options.interestChartType[index];
                    ui._trigger('refresh', 'interestchart');
                    ui._trigger('refresh', 'permalink');
                });
            }
        }},
        {type: 'refresh', callback: function(e, ui){
            var subtotal = ui.data.yearlySubtotal;
            var total = ui.data.yearlyTotal;

            if (ui.data.amortschedule == 'monthly') {
                subtotal = ui.data.monthlySubtotal;
                total = ui.data.monthlyTotal;
            }

            var principal = Math.abs(Math.round((ui.data.principal / total) * 100));
            var interest  = Math.abs(Math.round(((subtotal - principal) / total) * 100));
            var other     = Math.abs(Math.round(((total - subtotal) / total) * 100));
            var size      = ui.options.interestChart.chs.split('x');
            
            // Sensible size adjustment (used mainly for widget vertion)
            if (ui._getActiveTab() == 'calculator') {
                var pr = ui._component('interestchart').parent().parent();
                size = $.map(ui.options.interestChart.chs.split('x'), 
                           function(i){ return parseInt(i, 10); });

                if (ui.options.interestchartSmartResize) {
                    ui._smartResize(pr, size, 'width', function(){
                        ui.options.interestChart.chs = $.makeArray(arguments).join('x');
                    });
                }
            }
            
            var chart = $.googleChart($.extend(ui.options.interestChart, {
                chd: $.format('t:{0:s},{1:s},{2:s}', principal, interest, other),
                cht: ui._interestChartType
            }));

            ui._component('interestchart').css({
                backgroundImage: chart, 
                width:  parseInt(size[0], 10), 
                height: parseInt(size[1], 10)
            });
        }}
    ]
});


$.ui.mcalc.component({
    name: 'amortchart',
    lazy: true,
    defaults: { amortchart: true },
    tpl: [
    '<div class="ui-amortcharts">',
        '<div class="ui-amortcharts-amort ui-chart"></div>',
        '<div class="ui-amortcharts-balance ui-chart"></div>',
        '<div style="clear:both;"></div>',
    '</div>'
    ],
    init: function(ui) {

        ui._refreshAmortizationChart = function() {
            var o = {i:[], p:[]};
            var s = ui.options.amortChart.chs.split('x');
            var p = ui.data.principal;
            var term = ui.data.term;

            for (var x = 0; x < ui._amortabledata.length;x++) {
                var r = ui._amortabledata[x];
                if (ui.data.amortschedule == 'monthly') {
                    o.p.push(Math.round((r.principal * 12 / p) * 100 * 10));
                    o.i.push(Math.round((r.interest  * 12 / p) * 100 * 10));
                    x = x + 12;
                }
                else {
                    o.p.push(Math.round((r.principal / p) * 100 * 10));
                    o.i.push(Math.round((r.interest  / p) * 100 * 10));
                }
            }

            var xRange = $.map($.range(0, term, term/5), function(i){ return (new Date()).getFullYear() + i; }).join('|');
            var yRange = $.range(0, (Math.round(p/100000)*100000)+1, 100000).join('|');
            var chart  = $.googleChart($.extend(ui.options.amortChart, {
                chd:  $.format('t:{0:s}|{1:s}', o.p.join(','), o.i.join(',')),
                chxl: $.format('0:|{0:s}|1:|{1:s}', xRange, yRange)
            }));
            ui._component('amortchart')
                .find('.ui-amortcharts-amort').css({
                    backgroundImage: chart, 
                    width:  parseInt(s[0], 10), 
                    height: parseInt(s[1], 10)
                });
        };

        ui._refreshBalanceChart = function() {
            var o = [];
            var ui = this;
            var p = ui.data.principal;
            var term = ui.data.term;
            var xRange = $.map($.range(0, term, term/5), function(i){ return (new Date()).getFullYear() + i; }).join('|');
            var yRange = $.range(0, (Math.round(p/100000)*100000)+1, 100000).join('|');
            for (var x in ui._amortabledata) {
                var r = ui._amortabledata[x];
                o.push(Math.round((r.balance   / p) * 100));
            }
            var ch = $.googleChart($.extend(ui.options.balanceChart, {
                chd:  't:' + o.join(','),
                chxl: $.format('0:|{0:s}|1:|{1:s}', xRange, yRange)
            }));

            var s = ui.options.balanceChart.chs.split('x');
            ui._component('amortchart')
                .find('.ui-amortcharts-balance').css({
                    backgroundImage: ch, 
                    width:  parseInt(s[0], 10), 
                    height: parseInt(s[1], 10)});
        };
    },
    events: [
        {type: 'ready', callback: function(e, ui){
            $(this)
                //.css({width:100, height:100, background: '#c30'})
                .prependTo(ui._component('tabs').find('#tab-amortization'));
        }},
        {type: 'refresh', callback: function(e, ui){
            if (ui._getActiveTab() == 'amortization') {
                ui._refreshAmortizationChart();
                ui._refreshBalanceChart();
            }
        }}
    ]
});
})(jQuery);

/*
  jQuery mcalc.about - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

$.ui.mcalc.component({
    name: 'charteditor',
    lazy: true,
    defaults: { charteditor: true },
    tpl: [
        '<h3>Chart editor</h3>',
        '<div class="ui-charteditor ui-corner-all">',
        '<div id="accordion" class="ui-mcalc-chart-editor">',
            '<h3><a href="#">Colors</a></h3>',
            '<div style="padding:0em 2.2em; 1em 2.2em">',
                '<div id="ui-mcalc-chart-colorwheel1"></div>',
                '<ul class="ui-form ui-chart-colors">',
                    '<li><label>Background</label><input type="text" id="ui-mcalc-chart-bg" class="color-hex" value="#F4F4F4"></li>',
                    '<li><label>Color 1</label><input type="text" id="ui-mcalc-chart-c1" class="color-hex" value="#F7AF3A"></li>',
                    '<li><label>Color 2</label><input type="text" id="ui-mcalc-chart-c2" class="color-hex" value="#CC3300"></li>',
                    '<li><label>Color 3</label><input type="text" id="ui-mcalc-chart-c3" class="color-hex" value="#1C94C4"></li>',
                    '<li><label>Labels</label>',
                        '<select id="ui-mcalc-chart-labels">',
                            '<option value="b" selected>Horizontal - bottom</option>',
                            '<option value="t">Horizontal - top</option>',
                            '<option value="bv">Vertical - bottom</option>',
                            '<option value="tv">Vertical - top</option>',
                            '<option value="r">Vertical - right</option>',
                            '<option value="l">Vertical - left</option>',
                        '</select>',
                    '</li>',
                '</ul>',
            '</div>',
            '<h3><a href="#">More options</a></h3>',
            '<div style="padding:0em 2.2em;">',
                '<p>Virtually every part of the charts are customizable and can be specified as option when creating the mortgage calculator.</p>',
                '<p>Full API documentation is available <a href="http://code.google.com/apis/chart/">here</a>.</p>',
            '</div>',
        '</div>'
        ],
    init: function(ui) {
    },
    events: [
        {type: 'ready', callback: function(e, ui){
            var selected;
            var cw = $(this).find('#ui-mcalc-chart-colorwheel1');
            var f1 = $.farbtastic(cw);
            var p1 = cw.css('opacity', 0.25).bind('mouseup', function(){
                if (selected) {
                    var bg = $('#ui-mcalc-chart-bg').val().replace('#', '');

                    ui.options.interestChart.chf = ui.options.amortChart.chf = ui.options.balanceChart.chf = 'bg,s,'+ bg;
                    ui.options.interestChart.chco = ui.options.amortChart.chco = ui.options.balanceChart.chco = [
                        $('#ui-mcalc-chart-c1').val().replace('#', ''),
                        $('#ui-mcalc-chart-c2').val().replace('#', ''),
                        $('#ui-mcalc-chart-c3').val().replace('#', '')].join(',');
                    ui._trigger('refresh', 'interestchart');
                    ui._trigger('refresh', 'amortchart');
                }
            });
            $(this).insertAfter(ui.element)
                .width(ui.options.width)
                .find('#accordion').accordion().end()
                .find('.ui-chart-colors input').focus(function() {
                    var el = $(this);
                    if (selected) {
                        $(selected).css('opacity', 0.75).removeClass('colorwell-selected');
                    }
                    f1.linkTo(function(color){
                        el.css({backgroundColor: color}).val(color);
                    }).setColor(el.val());
                    p1.css('opacity', 1);
                    $(selected = this).css({opacity: 1, backgroundColor: $(this).val()}).addClass('colorwell-selected');
                });

        }},
        {type: 'refresh', callback: function(e, ui){

        }},
        {type: 'keyup', selector: '#ui-mcalc-chart-bg', callback: function(e, ui){
            if ($(this).val().length == 6) {
                ui.options.interestChart.chf = 'bg,s,'+ $(this).val().replace('#', '');
                ui._trigger('refresh', 'interestchart');
                ui._trigger('refresh', 'amortchart');
            }
        }},
        {type: 'change', selector: '#ui-mcalc-chart-labels', callback: function(e, ui){
            ui.options.interestChart.chdlp = ui.options.amortChart.chdlp = ui.options.balanceChart.chdlp = $('#ui-mcalc-chart-labels').val();
            ui._trigger('refresh', 'interestchart');
            ui._trigger('refresh', 'amortchart');
        }}
    ]
});


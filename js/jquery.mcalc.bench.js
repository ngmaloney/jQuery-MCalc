$(function(){
    var opt = {};
    var plugins = ['amortable', 'summary', 'about', 'charts', 'permalink', 'charteditor', 'summary-print'];
    
    if ($('#opt-minimal').is(':checked')) {
        opt.width = 285;
        $('#opt-width').val(285).attr('disabled', true);
        $('#opt-amortable, #opt-summary, #opt-about, #opt-summary-print')
            .attr('checked',  false)
            .attr('disabled', true)
            .parent().addClass('disabled');
    }

    $('#opt-minimal').click(function(){
        var checked = $(this).is(':checked');
        var plugin = false;
        $('#opt-width').val(checked && opt.width || 600).attr('disabled', checked);
        for (var x in plugins) {
            if (plugins[x]) {
                plugin = plugins[x];
                if ($.inArray(plugin, ['charts', 'permalink', 'charteditor']) < 0) { // allow only those plugins in minimal mode
                    $('#opt-'+ plugin)
                        .attr('checked',  !checked)
                        .attr('disabled', checked)
                        .parent()[(checked && 'add' || 'remove') + 'Class']('disabled');
                    }
            }
        }
    });

    $('#opt-reload').click(function(){
        window.location.reload();
    });

    $('input[type=checkbox]:not(:checked)').parent().next('ul.opt-select').hide();

    $('#opt-debug').bind('click', function() {
         if ($(this).not(':checked') 
             && (typeof(console) == 'undefined' 
                 || typeof(console.log) == 'undefined' )) {
            alert('Firebug is required!');
            return false;
        }
    });

    $('#mcalc').mcalc($.extend({
        amortchart: $('#opt-amortchart').is(':checked'),
        debug: $('#opt-debug').is(':checked'),
        interestchart: $('#opt-interestchart').is(':checked'),
        amortable: $('#opt-amortable').is(':checked'),
        permalink: $('#opt-permalink').is(':checked'),
        permalinkSmartResize: $('#opt-permalinkSmartResize').is(':checked'),
        about: $('#opt-about').is(':checked'),
        summary: $('#opt-summary').is(':checked'),
        summaryPrint: $('#opt-summary-print').is(':checked'),
        charteditor: $('#opt-charteditor').is(':checked'),
        showFieldHelp: $('#opt-showFieldHelp').is(':checked'),
        fieldUpdatedEffect: $('#opt-fieldUpdatedEffect').val(),
        currencyFormat: $('#opt-currencyFormat').val(),
        width: parseInt($('#opt-width').val(), 10),
        permalinkInput: $('#opt-permalink-input').is(':checked'),
        permalinkAnchor: $('#opt-permalink-anchor').is(':checked'),
        logoExample: $('#opt-logoExample').is(':checked'),
        interestchartSmartResize: $('#opt-interestchartSmartResize').is(':checked')
    }, opt));

    $('#theme input[type=checkbox]').change(function(){
        if ($(this).is(':checked')) {
            $(this).parent().parent().find('ul').show()
                .find('input[type=checkbox]').attr('checked', true);
        }
        else {
            $(this).parent().parent().find('ul').hide()
                .find('input[type=checkbox]').attr('checked', false);
        }
    });

    if($.browser.mozilla) {
        $('<a class="ui-state-default ui-corner-all ui-button" id="editor" href="#"><span class="ui-icon ui-icon-newwin"></span> Theme editor</a>')
            .appendTo('#theme')
            .click(function(e){
                if (!/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
                    alert('Sorry, due to security restrictions, this tool only works in Firefox'); 
                    return false; 
                } 
                if(window.jquitr){ jquitr.addThemeRoller(); } 
                else{ 
                    jquitr = {}; 
                    jquitr.s = document.createElement('script'); 
                    jquitr.s.src = 'http://jqueryui.com/themeroller/developertool/developertool.js.php'; 
                    document.getElementsByTagName('head')[0].appendChild(jquitr.s);
                }
            });
    }
    else {
        $('<div class="ui-help ui-state-error ui-corner-all" style="margin-bottom:10px;display:block;float:none;"><span class="ui-icon ui-icon-alert"/><p>For a better experience, use <em>Bench</em> with Mozilla Firefox. I am sorry, but I did not have the time to make it work properly on other browsers. The <em>Theme Editor</em> provided by jQuery Themeroller is also restricted to Mozilla Firefox.</p></div>')
                .width($('#mcalc').width() - 17)
                .insertBefore('#mcalc');
    }
});

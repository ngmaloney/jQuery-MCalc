/*
  jQuery mcalc.about - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

$.ui.mcalc.component({
    name: 'about',
    lazy: true,
    defaults: { about: true },
    tpl: [
    '<div id="tab-about" class="ui-tabs-panel ui-widget-content ui-corner-bottom">',
        '<h1>mcalc</h1>',
        '<p>Mcalc is a mortgage calculator developped by <a href="http://haineault.com">Maxime Haineault</a>, a web developper from <a href="http://maps.google.com/maps?f=q&source=s_q&hl=en&q=Saint-Timoth%C3%A9e,+Beauharnois-Salaberry+Regional+County+Municipality,+Quebec,+Canada&sll=37.0625,-95.677068&sspn=51.708931,134.736328&ie=UTF8&cd=1&geocode=Fe4PswIdwDqW-w&split=0&t=h&z=12&iwloc=A">Quebec</a> (Canada), for a programmation contest held by <a href="http://www.mortgageloanplace.com/">mortgageloanplace.com</a>.</p>',
        '<h2>Technologies</h2>',
        '<p>This plugin was developped as a jQuery UI widget and use many great Free Open Source projects;</p>',
        '<ul>',
            '<li><a href="http://jquery.com/">jQuery</a></li>',
            '<li><a href="http://jqueryui.com/">jQuery UI</a></li>',
            '<li><a href="http://code.google.com/p/jquery-utils/">jQuery Utils</a></li>',
            '<li><a href="http://jqueryui.com/themeroller/">jQuery Themeroller</a></li>',
            '<li><a href="http://www.recoding.it/?p=138">jQuery jqprint</a></li>',
            '<li><a href="http://acko.net/dev/farbtastic">farbtastic</a> (color picker)</li>',
        '</ul>',
        '<p>As now the this widget use a chart plugin which uses <a href="http://code.google.com/apis/chart/">Google Chart API</a> as backend, however it would be quite easy to make a plugin which use another chart system.</p>',
        '<h2>Special thanks</h2>',
        '<p>Thanks Johnathan Marcil for the nice inputs and critics. Also Vincent and Felix for saying they would review my code but never did so, thanks guy.</p>',
    '</div>'],
    events: [
        {type: 'ready', callback: function(e, ui){
            ui._component('tabs')
                .append(this).tabs('add', '#tab-about', 'About');
        }}
    ]
});


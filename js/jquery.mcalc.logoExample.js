/*
  jQuery mcalc.logoExample - @VERSION

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  License: Not available yet.
*/

$.ui.mcalc.component({
    name: 'logoExample',
    lazy: true,
    help: 'Get FHA Loan information including FHA Refinance information and find the FHA lenders that can offer the lowest rates.',
    defaults: { 
        logoExample:      true,
        logoExampleUrl:   'http://www.mortgageloanplace.com/',
        logoExampleSrc:   'img/mlp-logo.png',
        logoExampleTitle: '',
        logoExampleAlt:   'Mortgage Loan Place'
    },
    tpl: '<img />',
    events: [
        {type: 'ready', callback: function(e, ui){
            var logo = $(this).attr({
                alt: ui.options.logoExampleAlt,
                src: ui.options.logoExampleSrc
            });
            if (ui.options.logoExampleUrl) {
                logo.attr({
                    longdesc: ui.options.logoExampleTitle,
                    border: 0
                });
                logo = $('<a style="display:block;" />').append(logo).attr({
                    title: ui.options.logoExampleTitle,
                    href:  ui.options.logoExampleUrl
                });
            }
            logo.css({margin: '10px 20px 0 20px'});
            ui._component('formpane').prepend(logo);
        }}
    ]
});

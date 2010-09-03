/*
  jQuery utils - 0.8.0
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
     $.extend($.expr[':'], {
        // case insensitive version of :contains
        icontains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").toLowerCase().indexOf(m[3].toLowerCase())>=0;}
    });

    $.iterators = {
        getText:  function() { return $(this).text(); },
        parseInt: function(v){ return parseInt(v, 10); }
    };

	$.extend({ 

        // Returns a range object
        // Author: Matthias Miller
        // Site:   http://blog.outofhanwell.com/2006/03/29/javascript-range-function/
        range:  function() {
            if (!arguments.length) { return []; }
            var min, max, step;
            if (arguments.length == 1) {
                min  = 0;
                max  = arguments[0]-1;
                step = 1;
            }
            else {
                // default step to 1 if it's zero or undefined
                min  = arguments[0];
                max  = arguments[1]-1;
                step = arguments[2] || 1;
            }
            // convert negative steps to positive and reverse min/max
            if (step < 0 && min >= max) {
                step *= -1;
                var tmp = min;
                min = max;
                max = tmp;
                min += ((max-min) % step);
            }
            var a = [];
            for (var i = min; i <= max; i += step) { a.push(i); }
            return a;
        },

        // Taken from ui.core.js. 
        // Why are you keeping this gem for yourself guys ? :|
        keyCode: {
            BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, CONTROL: 17, DELETE: 46, DOWN: 40,
            END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT:  45, LEFT: 37,
            NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, 
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, 
            PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
        },
        
        // Takes a keyboard event and return true if the keycode match the specified keycode
        keyIs: function(k, e) {
            return parseInt($.keyCode[k.toUpperCase()], 10) == parseInt((typeof(e) == 'number' )? e: e.keyCode, 10);
        },
        
        // Returns the key of an array
        keys: function(arr) {
            var o = [];
            for (k in arr) { o.push(k); }
            return o;
        },

        // Redirect to a specified url
        redirect: function(url) {
            window.location.href = url;
            return url;
        },

        // Stop event shorthand
        stop: function(e, preventDefault, stopPropagation) {
            if (preventDefault)  { e.preventDefault(); }
            if (stopPropagation) { e.stopPropagation(); }
            return preventDefault && false || true;
        },

        // Returns the basename of a path
        basename: function(path) {
            var t = path.split('/');
            return t[t.length] === '' && s || t.slice(0, t.length).join('/');
        },

        // Returns the filename of a path
        filename: function(path) {
            return path.split('/').pop();
        }, 

        // Returns a formated file size
        filesizeformat: function(bytes, suffixes){
            var b = parseInt(bytes, 10);
            var s = suffixes || ['byte', 'bytes', 'KB', 'MB', 'GB'];
            if (isNaN(b) || b === 0) { return '0 ' + s[0]; }
            if (b == 1)              { return '1 ' + s[0]; }
            if (b < 1024)            { return  b.toFixed(2) + ' ' + s[1]; }
            if (b < 1048576)         { return (b / 1024).toFixed(2) + ' ' + s[2]; }
            if (b < 1073741824)      { return (b / 1048576).toFixed(2) + ' '+ s[3]; }
            else                     { return (b / 1073741824).toFixed(2) + ' '+ s[4]; }
        },

        fileExtension: function(s) {
            var tokens = s.split('.');
            return tokens[tokens.length-1] || false;
        },
        
        // Returns true if an object is a String
        isString: function(o) {
            return typeof(o) == 'string' && true || false;
        },
        
        // Returns true if an object is a RegExp
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
        
        // Returns true if an object is an array
        // Mark Miller - http://blog.360.yahoo.com/blog-TBPekxc1dLNy5DOloPfzVvFIVOWMB0li?p=916
		isArray: function(o) {
            return Object.prototype.toString.apply(o || false) === '[object Array]';
		},

        isObject: function(o) {
            return (typeof(o) == 'object');
        },
        
        // Convert input to currency (two decimal fixed number)
		toCurrency: function(i) {
			i = parseFloat(i, 10).toFixed(2);
			return (i=='NaN') ? '0.00' : i;
		},

        /*-------------------------------------------------------------------- 
         * javascript method: "pxToEm"
         * by:
           Scott Jehl (scott@filamentgroup.com) 
           Maggie Wachs (maggie@filamentgroup.com)
           http://www.filamentgroup.com
         *
         * Copyright (c) 2008 Filament Group
         * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
         *
         * Description: pxToEm converts a pixel value to ems depending on inherited font size.  
         * Article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/
         * Demo: http://www.filamentgroup.com/examples/pxToEm/	 	
         *							
         * Options:  	 								
                scope: string or jQuery selector for font-size scoping
                reverse: Boolean, true reverses the conversion to em-px
         * Dependencies: jQuery library						  
         * Usage Example: myPixelValue.pxToEm(); or myPixelValue.pxToEm({'scope':'#navigation', reverse: true});
         *
         * Version: 2.1, 18.12.2008
         * Changelog:
         *		08.02.2007 initial Version 1.0
         *		08.01.2008 - fixed font-size calculation for IE
         *		18.12.2008 - removed native object prototyping to stay in jQuery's spirit, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        pxToEm: function(i, settings){
            //set defaults
            settings = jQuery.extend({
                scope: 'body',
                reverse: false
            }, settings);
            
            var pxVal = (i === '') ? 0 : parseFloat(i);
            var scopeVal;
            var getWindowWidth = function(){
                var de = document.documentElement;
                return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
            };	
            
            /* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
                For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size. 	
                When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
                to get an accurate em value. */
                        
            if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
                var calcFontSize = function(){		
                    return (parseFloat($('body').css('font-size'))/getWindowWidth()).toFixed(3) * 16;
                };
                scopeVal = calcFontSize();
            }
            else { scopeVal = parseFloat(jQuery(settings.scope).css("font-size")); }
                    
            var result = (settings.reverse === true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
            return result;
        }
	});

	$.extend($.fn, { 
        type: function() {
            try { return $(this).get(0).nodeName.toLowerCase(); }
            catch(e) { return false; }
        },
        // Select a text range in a textarea
        selectRange: function(start, end){
            // use only the first one since only one input can be focused
            if ($(this).get(0).createTextRange) {
                var range = $(this).get(0).createTextRange();
                range.collapse(true);
                range.moveEnd('character',   end);
                range.moveStart('character', start);
                range.select();
            }
            else if ($(this).get(0).setSelectionRange) {
                $(this).bind('focus', function(e){
                    e.preventDefault();
                }).get(0).setSelectionRange(start, end);
            }
            return $(this);
        },

        /*-------------------------------------------------------------------- 
         * JQuery Plugin: "EqualHeights"
         * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
         *
         * Copyright (c) 2008 Filament Group
         * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
         *
         * Description: Compares the heights or widths of the top-level children of a provided element 
                and sets their min-height to the tallest height (or width to widest width). Sets in em units 
                by default if pxToEm() method is available.
         * Dependencies: jQuery library, pxToEm method	(article: 
                http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)							  
         * Usage Example: $(element).equalHeights();
                Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
         * Version: 2.1, 18.12.2008
         *
         * Note: Changed pxToEm call to call $.pxToEm instead, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        equalHeights: function(px){
            $(this).each(function(){
                var currentTallest = 0;
                $(this).children().each(function(i){
                    if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
                });
                if (!px || !$.pxToEm) { currentTallest = $.pxToEm(currentTallest); } //use ems unless px is specified
                // for ie6, set height since min-height isn't supported
                if ($.browser.msie && $.browser.version == 6.0) { $(this).children().css({'height': currentTallest}); }
                $(this).children().css({'min-height': currentTallest}); 
            });
            return this;
        },

        // Copyright (c) 2009 James Padolsey
        // http://james.padolsey.com/javascript/jquery-delay-plugin/
        delay: function(time, callback){
            jQuery.fx.step.delay = function(){};
            return this.animate({delay:1}, time, callback);
        }        
	});
})(jQuery);
/*
  jQuery strings - 0.3
  http://code.google.com/p/jquery-utils/
  
  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Implementation of Python3K advanced string formatting
  http://www.python.org/dev/peps/pep-3101/

  Documentation: http://code.google.com/p/jquery-utils/wiki/StringFormat
  
*/
(function($){
    var strings = {
        strConversion: {
            // tries to translate any objects type into string gracefully
            __repr: function(i){
                switch(this.__getType(i)) {
                    case 'array':case 'date':case 'number':
                        return i.toString();
                    case 'object': 
                        var o = [];
                        for (x=0; x<i.length; i++) { o.push(i+': '+ this.__repr(i[x])); }
                        return o.join(', ');
                    case 'string': 
                        return i;
                    default: 
                        return i;
                }
            },
            // like typeof but less vague
            __getType: function(i) {
                if (!i || !i.constructor) { return typeof(i); }
                var match = i.constructor.toString().match(/Array|Number|String|Object|Date/);
                return match && match[0].toLowerCase() || typeof(i);
            },
            //+ Jonas Raoni Soares Silva
            //@ http://jsfromhell.com/string/pad [v1.0]
            __pad: function(str, l, s, t){
                var p = s || ' ';
                var o = str;
                if (l - str.length > 0) {
                    o = new Array(Math.ceil(l / p.length)).join(p).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + str + p.substr(0, l - t);
                }
                return o;
            },
            __getInput: function(arg, args) {
                 var key = arg.getKey();
                switch(this.__getType(args)){
                    case 'object': // Thanks to Jonathan Works for the patch
                        var keys = key.split('.');
                        var obj = args;
                        for(var subkey = 0; subkey < keys.length; subkey++){
                            obj = obj[keys[subkey]];
                        }
                        if (typeof(obj) != 'undefined') {
                            if (strings.strConversion.__getType(obj) == 'array') {
                                return arg.getFormat().match(/\.\*/) && obj[1] || obj;
                            }
                            return obj;
                        }
                        else {
                            // TODO: try by numerical index                    
                        }
                    break;
                    case 'array': 
                        key = parseInt(key, 10);
                        if (arg.getFormat().match(/\.\*/) && typeof args[key+1] != 'undefined') { return args[key+1]; }
                        else if (typeof args[key] != 'undefined') { return args[key]; }
                        else { return key; }
                    break;
                }
                return '{'+key+'}';
            },
            __formatToken: function(token, args) {
                var arg   = new Argument(token, args);
                return strings.strConversion[arg.getFormat().slice(-1)](this.__getInput(arg, args), arg);
            },

            // Signed integer decimal.
            d: function(input, arg){
                var o = parseInt(input, 10); // enforce base 10
                var p = arg.getPaddingLength();
                if (p) { return this.__pad(o.toString(), p, arg.getPaddingString(), 0); }
                else   { return o; }
            },
            // Signed integer decimal.
            i: function(input, args){ 
                return this.d(input, args);
            },
            // Unsigned octal
            o: function(input, arg){ 
                var o = input.toString(8);
                if (arg.isAlternate()) { o = this.__pad(o, o.length+1, '0', 0); }
                return this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(), 0);
            },
            // Unsigned decimal
            u: function(input, args) {
                return Math.abs(this.d(input, args));
            },
            // Unsigned hexadecimal (lowercase)
            x: function(input, arg){
                var o = parseInt(input, 10).toString(16);
                o = this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(),0);
                return arg.isAlternate() ? '0x'+o : o;
            },
            // Unsigned hexadecimal (uppercase)
            X: function(input, arg){
                return this.x(input, arg).toUpperCase();
            },
            // Floating point exponential format (lowercase)
            e: function(input, arg){
                return parseFloat(input, 10).toExponential(arg.getPrecision());
            },
            // Floating point exponential format (uppercase)
            E: function(input, arg){
                return this.e(input, arg).toUpperCase();
            },
            // Floating point decimal format
            f: function(input, arg){
                return this.__pad(parseFloat(input, 10).toFixed(arg.getPrecision()), arg.getPaddingLength(), arg.getPaddingString(),0);
            },
            // Floating point decimal format (alias)
            F: function(input, args){
                return this.f(input, args);
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            g: function(input, arg){
                var o = parseFloat(input, 10);
                return (o.toString().length > 6) ? Math.round(o.toExponential(arg.getPrecision())): o;
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            G: function(input, args){
                return this.g(input, args);
            },
            // Single character (accepts integer or single character string). 	
            c: function(input, args) {
                var match = input.match(/\w|\d/);
                return match && match[0] || '';
            },
            // String (converts any JavaScript object to anotated format)
            r: function(input, args) {
                return this.__repr(input);
            },
            // String (converts any JavaScript object using object.toString())
            s: function(input, args) {
                return input.toString && input.toString() || ''+input;
            }
        },

        format: function(str, args) {
            var end    = 0;
            var start  = 0;
            var match  = false;
            var buffer = [];
            var token  = '';
            var tmp    = (str||'').split('');
            for(start=0; start < tmp.length; start++) {
                if (tmp[start] == '{' && tmp[start+1] !='{') {
                    end   = str.indexOf('}', start);
                    token = tmp.slice(start+1, end).join('');
                    if (tmp[start-1] != '{' && tmp[end+1] != '}') {
                        var tokenArgs = (typeof arguments[1] != 'object')? arguments2Array(arguments, 2): args || [];
                        buffer.push(strings.strConversion.__formatToken(token, tokenArgs));
                    }
                    else {
                        buffer.push(token);
                    }
                }
                else if (start > end || buffer.length < 1) { buffer.push(tmp[start]); }
            }
            return (buffer.length > 1)? buffer.join(''): buffer[0];
        },

        calc: function(str, args) {
            return eval(format(str, args));
        },

        repeat: function(s, n) { 
            return new Array(n+1).join(s); 
        },

        UTF8encode: function(s) { 
            return unescape(encodeURIComponent(s)); 
        },

        UTF8decode: function(s) { 
            return decodeURIComponent(escape(s)); 
        },

        tpl: function() {
            var out = '';
            var render = true;
            // Set
            // $.tpl('ui.test', ['<span>', helloWorld ,'</span>']);
            if (arguments.length == 2 && $.isArray(arguments[1])) {
                this[arguments[0]] = arguments[1].join('');
                return $(this[arguments[0]]);
            }
            // $.tpl('ui.test', '<span>hello world</span>');
            if (arguments.length == 2 && $.isString(arguments[1])) {
                this[arguments[0]] = arguments[1];
                return $(this[arguments[0]]);
            }
            // Call
            // $.tpl('ui.test');
            if (arguments.length == 1) {
                return $(this[arguments[0]]);
            }
            // $.tpl('ui.test', false);
            if (arguments.length == 2 && arguments[1] == false) {
                return this[arguments[0]];
            }
            // $.tpl('ui.test', {value:blah});
            if (arguments.length == 2 && $.isObject(arguments[1])) {
                return $($.format(this[arguments[0]], arguments[1]));
            }
            // $.tpl('ui.test', {value:blah}, false);
            if (arguments.length == 3 && $.isObject(arguments[1])) {
                return (arguments[2] == true) 
                    ? $.format(this[arguments[0]], arguments[1])
                    : $($.format(this[arguments[0]], arguments[1]));
            }
        }
    };

    var Argument = function(arg, args) {
        this.__arg  = arg;
        this.__args = args;
        this.__max_precision = parseFloat('1.'+ (new Array(32)).join('1'), 10).toString().length-3;
        this.__def_precision = 6;
        this.getString = function(){
            return this.__arg;
        };
        this.getKey = function(){
            return this.__arg.split(':')[0];
        };
        this.getFormat = function(){
            var match = this.getString().split(':');
            return (match && match[1])? match[1]: 's';
        };
        this.getPrecision = function(){
            var match = this.getFormat().match(/\.(\d+|\*)/g);
            if (!match) { return this.__def_precision; }
            else {
                match = match[0].slice(1);
                if (match != '*') { return parseInt(match, 10); }
                else if(strings.strConversion.__getType(this.__args) == 'array') {
                    return this.__args[1] && this.__args[0] || this.__def_precision;
                }
                else if(strings.strConversion.__getType(this.__args) == 'object') {
                    return this.__args[this.getKey()] && this.__args[this.getKey()][0] || this.__def_precision;
                }
                else { return this.__def_precision; }
            }
        };
        this.getPaddingLength = function(){
            var match = false;
            if (this.isAlternate()) {
                match = this.getString().match(/0?#0?(\d+)/);
                if (match && match[1]) { return parseInt(match[1], 10); }
            }
            match = this.getString().match(/(0|\.)(\d+|\*)/g);
            return match && parseInt(match[0].slice(1), 10) || 0;
        };
        this.getPaddingString = function(){
            var o = '';
            if (this.isAlternate()) { o = ' '; }
            // 0 take precedence on alternate format
            if (this.getFormat().match(/#0|0#|^0|\.\d+/)) { o = '0'; }
            return o;
        };
        this.getFlags = function(){
            var match = this.getString().matc(/^(0|\#|\-|\+|\s)+/);
            return match && match[0].split('') || [];
        };
        this.isAlternate = function() {
            return !!this.getFormat().match(/^0?#/);
        };
    };

    var arguments2Array = function(args, shift) {
        var o = [];
        for (l=args.length, x=(shift || 0)-1; x<l;x++) { o.push(args[x]); }
        return o;
    };
    $.extend(strings);
})(jQuery);
/*
 jQuery delayed observer - 0.8
 http://code.google.com/p/jquery-utils/

 (c) Maxime Haineault <haineault@gmail.com>
 http://haineault.com
 
 MIT License (http://www.opensource.org/licenses/mit-license.php)
 
*/

(function($){
    $.extend($.fn, {
        delayedObserver: function(callback, delay, options){
            return this.each(function(){
                var el = $(this);
                var op = options || {};
                el.data('oldval', el.val())
                    .data('delay', delay || 0.5)
                    .data('condition', op.condition || function() { return ($(this).data('oldval') == $(this).val()); })
                    .data('callback', callback)
                    [(op.event||'keyup')](function(){
                        if (el.data('condition').apply(el)) { return; }
                        else {
                            if (el.data('timer')) { clearTimeout(el.data('timer')); }
                            el.data('timer', setTimeout(function(){
                                el.data('callback').apply(el);
                            }, el.data('delay') * 1000));
                            el.data('oldval', el.val());
                        }
                    });
            });
        }
    });
})(jQuery);
(function($){
    $._i18n = { trans: {}, 'default':  'en', language: 'en' };
    $.i18n = function() {
        var getTrans = function(ns, str) {
            var trans = false;
            // check if string exists in translation
            if ($._i18n.trans[$._i18n.language] 
                && $._i18n.trans[$._i18n.language][ns]
                && $._i18n.trans[$._i18n.language][ns][str]) {
                trans = $._i18n.trans[$._i18n.language][ns][str];
            }
            // or exists in default
            else if ($._i18n.trans[$._i18n['default']] 
                     && $._i18n.trans[$._i18n['default']][ns]
                     && $._i18n.trans[$._i18n['default']][ns][str]) {
                trans = $._i18n.trans[$._i18n['default']][ns][str];
            }
            // return trans or original string
            return trans || str;
        };
        // Set language
        if (arguments.length < 2 && arguments[0].length == 2) {
            $._i18n.language = arguments[0]; 
            return $._i18n.language;
        }
        else {
            // get translation
            if (typeof(arguments[1]) == 'string') {
                var trans = getTrans(arguments[0], arguments[1]);
                // has variables for string formating
                if (arguments[2] && typeof(arguments[2]) == 'object') {
                    return $.format(trans, arguments[2]);
                }
                else {
                    return trans;
                }
            }
            // set translation
            else {
                var tmp  = arguments[0].split('.');
                var lang = tmp[0];
                var ns   = tmp[1] || 'jQuery';
                if (!$._i18n.trans[lang]) {
                    $._i18n.trans[lang] = {};
                    $._i18n.trans[lang][ns] = arguments[1];
                }
                else {
                    $.extend($._i18n.trans[lang][ns], arguments[1]);
                }
            }
        }
    };
})(jQuery);
/*
 * Copyright (c) 2007-2008 Josh Bush (digitalbush.com)
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE. 
 */
 
/*
 * Version: 1.1.3
 * Release: 2008-04-16
 */ 
(function($) {

	//Helper Function for Caret positioning
	$.fn.caret=function(begin,end){	
		if(this.length==0) return;
		if (typeof begin == 'number') {
            end = (typeof end == 'number')?end:begin;  
			return this.each(function(){
				if(this.setSelectionRange){
					this.focus();
					this.setSelectionRange(begin,end);
				}else if (this.createTextRange){
					var range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
        } else {
            if (this[0].setSelectionRange){
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			}else if (document.selection && document.selection.createRange){
				var range = document.selection.createRange();			
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return {begin:begin,end:end};
        }       
	};

	//Predefined character definitions
	var charMap={
		'9':"[0-9]",
		'a':"[A-Za-z]",
		'*':"[A-Za-z0-9]"
	};
	
	//Helper method to inject character definitions
	$.mask={
		addPlaceholder : function(c,r){
			charMap[c]=r;
		}
	};
	
	$.fn.unmask=function(){
		return this.trigger("unmask");
	};
	
	//Main Method
	$.fn.mask = function(mask,settings) {	
		settings = $.extend({
			placeholder: "_",			
			completed: null
		}, settings);		
		
		//Build Regex for format validation
		var re = new RegExp("^"+	
		$.map( mask.split(""), function(c,i){		  		  
		  return charMap[c]||((/[A-Za-z0-9]/.test(c)?"":"\\")+c);
		}).join('')+				
		"$");		

		return this.each(function(){		
			var input=$(this);
			var buffer=new Array(mask.length);
			var locked=new Array(mask.length);
			var valid=false;   
			var ignore=false;  			//Variable for ignoring control keys
			var firstNonMaskPos=null; 
			
			//Build buffer layout from mask & determine the first non masked character			
			$.each( mask.split(""), function(i,c){				
				locked[i]=(charMap[c]==null);				
				buffer[i]=locked[i]?c:settings.placeholder;									
				if(!locked[i] && firstNonMaskPos==null)
					firstNonMaskPos=i;
			});		
			
			function focusEvent(){					
				checkVal();
				writeBuffer();
				setTimeout(function(){
					$(input[0]).caret(valid?mask.length:firstNonMaskPos);					
				},0);
			};
			
			function keydownEvent(e){				
				var pos=$(this).caret();
				var k = e.keyCode;
				ignore=(k < 16 || (k > 16 && k < 32 ) || (k > 32 && k < 41));
				
				//delete selection before proceeding
				if((pos.begin-pos.end)!=0 && (!ignore || k==8 || k==46)){
					clearBuffer(pos.begin,pos.end);
				}	
				//backspace and delete get special treatment
				if(k==8){//backspace					
					while(pos.begin-->=0){
						if(!locked[pos.begin]){								
							buffer[pos.begin]=settings.placeholder;
							if($.browser.opera){
								//Opera won't let you cancel the backspace, so we'll let it backspace over a dummy character.								
								s=writeBuffer();
								input.val(s.substring(0,pos.begin)+" "+s.substring(pos.begin));
								$(this).caret(pos.begin+1);								
							}else{
								writeBuffer();
								$(this).caret(Math.max(firstNonMaskPos,pos.begin));								
							}									
							return false;								
						}
					}						
				}else if(k==46){//delete
					clearBuffer(pos.begin,pos.begin+1);
					writeBuffer();
					$(this).caret(Math.max(firstNonMaskPos,pos.begin));					
					return false;
				}else if (k==27){//escape
					clearBuffer(0,mask.length);
					writeBuffer();
					$(this).caret(firstNonMaskPos);					
					return false;
				}									
			};
			
			function keypressEvent(e){					
				if(ignore){
					ignore=false;
					//Fixes Mac FF bug on backspace
					return (e.keyCode == 8)? false: null;
				}
				e=e||window.event;
				var k=e.charCode||e.keyCode||e.which;						
				var pos=$(this).caret();
								
				if(e.ctrlKey || e.altKey){//Ignore
					return true;
				}else if ((k>=41 && k<=122) ||k==32 || k>186){//typeable characters
					var p=seekNext(pos.begin-1);					
					if(p<mask.length){
						if(new RegExp(charMap[mask.charAt(p)]).test(String.fromCharCode(k))){
							buffer[p]=String.fromCharCode(k);									
							writeBuffer();
							var next=seekNext(p);
							$(this).caret(next);
							if(settings.completed && next == mask.length)
								settings.completed.call(input);
						}				
					}
				}				
				return false;				
			};
			
			function clearBuffer(start,end){
				for(var i=start;i<end&&i<mask.length;i++){
					if(!locked[i])
						buffer[i]=settings.placeholder;
				}				
			};
			
			function writeBuffer(){				
				return input.val(buffer.join('')).val();				
			};
			
			function checkVal(){	
				//try to place charcters where they belong
				var test=input.val();
				var pos=0;
				for(var i=0;i<mask.length;i++){					
					if(!locked[i]){
						buffer[i]=settings.placeholder;
						while(pos++<test.length){
							//Regex Test each char here.
							var reChar=new RegExp(charMap[mask.charAt(i)]);
							if(test.charAt(pos-1).match(reChar)){
								buffer[i]=test.charAt(pos-1);								
								break;
							}									
						}
					}
				}
				var s=writeBuffer();
				if(!s.match(re)){							
					input.val("");	
					clearBuffer(0,mask.length);
					valid=false;
				}else
					valid=true;
			};
			
			function seekNext(pos){				
				while(++pos<mask.length){					
					if(!locked[pos])
						return pos;
				}
				return mask.length;
			};
			
			input.one("unmask",function(){
				input.unbind("focus",focusEvent);
				input.unbind("blur",checkVal);
				input.unbind("keydown",keydownEvent);
				input.unbind("keypress",keypressEvent);
				if ($.browser.msie) 
					this.onpaste= null;                     
				else if ($.browser.mozilla)
					this.removeEventListener('input',checkVal,false);
			});
			input.bind("focus",focusEvent);
			input.bind("blur",checkVal);
			input.bind("keydown",keydownEvent);
			input.bind("keypress",keypressEvent);
			//Paste events for IE and Mozilla thanks to Kristinn Sigmundsson
			if ($.browser.msie) 
				this.onpaste= function(){setTimeout(checkVal,0);};                     
			else if ($.browser.mozilla)
				this.addEventListener('input',checkVal,false);
				
			checkVal();//Perform initial check for existing values
		});
	};
})(jQuery);
/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * $LastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) $
 * $Rev: 4265 $
 *
 * Version: 3.0
 * 
 * Requires: $ 1.2.2+
 */

(function($) {

$.event.special.mousewheel = {
	setup: function() {
		var handler = $.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( $.browser.mozilla )
			$(this).bind('mousemove.mousewheel', function(event) {
				$.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = $.event.special.mousewheel.handler;
		
		$(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		$.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = $.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		$.extend( event, $.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
		if ( $.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return $.event.handle.apply(this, args);
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);/*
  jQuery utils - 0.8.0
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
     $.extend($.expr[':'], {
        // case insensitive version of :contains
        icontains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").toLowerCase().indexOf(m[3].toLowerCase())>=0;}
    });

    $.iterators = {
        getText:  function() { return $(this).text(); },
        parseInt: function(v){ return parseInt(v, 10); }
    };

	$.extend({ 

        // Returns a range object
        // Author: Matthias Miller
        // Site:   http://blog.outofhanwell.com/2006/03/29/javascript-range-function/
        range:  function() {
            if (!arguments.length) { return []; }
            var min, max, step;
            if (arguments.length == 1) {
                min  = 0;
                max  = arguments[0]-1;
                step = 1;
            }
            else {
                // default step to 1 if it's zero or undefined
                min  = arguments[0];
                max  = arguments[1]-1;
                step = arguments[2] || 1;
            }
            // convert negative steps to positive and reverse min/max
            if (step < 0 && min >= max) {
                step *= -1;
                var tmp = min;
                min = max;
                max = tmp;
                min += ((max-min) % step);
            }
            var a = [];
            for (var i = min; i <= max; i += step) { a.push(i); }
            return a;
        },

        // Taken from ui.core.js. 
        // Why are you keeping this gem for yourself guys ? :|
        keyCode: {
            BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, CONTROL: 17, DELETE: 46, DOWN: 40,
            END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT:  45, LEFT: 37,
            NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, 
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, 
            PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
        },
        
        // Takes a keyboard event and return true if the keycode match the specified keycode
        keyIs: function(k, e) {
            return parseInt($.keyCode[k.toUpperCase()], 10) == parseInt((typeof(e) == 'number' )? e: e.keyCode, 10);
        },
        
        // Returns the key of an array
        keys: function(arr) {
            var o = [];
            for (k in arr) { o.push(k); }
            return o;
        },

        // Redirect to a specified url
        redirect: function(url) {
            window.location.href = url;
            return url;
        },

        // Returns the basename of a path
        basename: function(path) {
            var t = path.split('/');
            return t[t.length] === '' && s || t.slice(0, t.length).join('/');
        },

        // Returns the filename of a path
        filename: function(path) {
            return path.split('/').pop();
        }, 

        // Returns true if an object is a String
        isString: function(o) {
            return typeof(o) == 'string' && true || false;
        },
        
        // Returns true if an object is a RegExp
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
        
        // Returns true if an object is an array
        // Mark Miller - http://blog.360.yahoo.com/blog-TBPekxc1dLNy5DOloPfzVvFIVOWMB0li?p=916
		isArray: function(o) {
            return Object.prototype.toString.apply(o || false) === '[object Array]';
		},

        isObject: function(o) {
            return (typeof(o) == 'object');
        },
        
        // Convert input to currency (two decimal fixed number)
		toCurrency: function(i) {
			i = parseFloat(i, 10).toFixed(2);
			return (i=='NaN') ? '0.00' : i;
		},

        // Copyright (c) 2009 James Padolsey
        // http://james.padolsey.com/javascript/jquery-delay-plugin/
        delay: function(time, callback){
            jQuery.fx.step.delay = function(){};
            return this.animate({delay:1}, time, callback);
        }        
	});
})(jQuery);

/*
  jQuery ui.keynav - 0.4
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies 
  ¯¯¯¯¯¯¯¯¯¯¯¯
  - jquery.ui.js
  - jquery.utils.js
  - jquery.strings.js
  - jquery.mousewheel.js
*/

$.widget('ui.keynav', {
    _create: function(){
        var $elf = this;
        var type = $.ui.keynav.types[this.options.type];
        if (type) {
            if (type._create) {
                type._create.apply(this.element, [this]);
            }
            if (type.constraints) {
                this._applyConstraints(type);
            }
        }
    },
    _bindArrows: function(el, type, ev) {
        var $elf = this;
        $(el).bind(ev || 'keyup.keynavArrows', function(e){
            if ($.keyIs('up', e))  {
                $.ui.keynav.types[type].increment.apply(this, [e, $elf]);
            }
            if ($.keyIs('down', e))  {
                $.ui.keynav.types[type].decrement.apply(this, [e, $elf]);
            }
        });
    },
    _bindMouseWheel: function(el, type) {
        var $elf = this;
        $(el).mousewheel(function(e, delta){
            var action = delta < 0 && 'decrement' || 'increment';
            $.ui.keynav.types[type][action].apply(this, [e, $elf]);
            $(this).trigger('keyup');
            return false;
        });
    },
    _applyConstraints: function(type) {
        for (var x in type.constraints) {
            if ($.ui.keynav.constraints[x]) {
                var constraint = this.options[x] || type.constraints[x];
                if ($.isFunction($.ui.keynav.constraints[x])) {
                    $.ui.keynav.constraints[x].apply(this, [constraint]);
                }
            }
        }
    }
});

$.ui.keynav.types = {
    integer: {
        constraints: {
            max: 100,
            max_length: 5,
            allow_keyCodes: [
                0, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 
                37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 
                53, 54, 55, 56, 57, 8, 9, 96, 97, 98, 99, 100, 
                101, 102, 103, 104, 105]
        },
        _create: function(ui) {
            if (ui.options.mousewheel) { ui._bindMouseWheel(this, 'integer'); }
            if (ui.options.arrows)     { ui._bindArrows(this,     'integer'); }
        },
        increment: function(e, ui){
            var val = parseInt($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            $(this).val(parseInt(val + inc, 10));
        },
        decrement: function(e, ui){
            var val = parseInt($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            $(this).val(parseInt(val - inc, 10));
        }
    },
    fixed: {
        constraints: {
            max: 100,
            max_length: 5, // max length apply to the digit *before* the dot 
            max_digits: 2, // max length apply to the digit *after* the dot
            allow_keyCodes: [
                0, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 
                37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 
                53, 54, 55, 56, 57, 8, 9, 96, 97, 98, 99, 100, 
                101, 102, 103, 104, 105, 110, 190]
        },
        _create: function(ui) {
            if (ui.options.mousewheel) { ui._bindMouseWheel(this, 'fixed'); }
            if (ui.options.arrows)     { ui._bindArrows(this,     'fixed'); }
        },
        increment: function(e, ui){
            var val = parseFloat($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            if (!e.altKey) { inc = inc/100; }
            $(this).val($.format(ui.options.fixedFormat, val + inc));
        },
        decrement: function(e, ui){
            var val = parseFloat($(this).val(), 10);
            var inc = (ui.options.shiftModifier && e.shiftKey)
                        ? ui.options.shiftModifierVal: 1;
            if (!e.altKey) { inc = inc/100; }
            $(this).val($.format(ui.options.fixedFormat, val - inc));
        }
    }
};

$.ui.keynav.constraints = {
    max: function(max) {
        var el  = this.element;
        max = this.options.max || max;
        $(el).bind('keyup.max', function(){
                var val = parseFloat($(this).val(), 10);
                if (val > max) {
                    try { /* IE FIX */
                        $(this).val(max);
                    } catch(e) {}
                }
        });
    },
    max_digits: function(maxLength) {
        var el = this.element;
        $(el).bind('keyup.max_digits', function(){
            var val = $(el).val();
            var pfx = '';
            var sfx = '';
            if (val.indexOf('.') > 0) {
                pfx = val.split('.')[0] + '.';
                sfx = val.split('.')[1];

                if (sfx.length > maxLength) {
                    try { /* IE FIX */
                        $(this).val(pfx + sfx.slice(0, maxLength));
                    } catch(e) {}
                }
            }
        });
    },
    max_length: function(maxlength) {
        $(this.element).attr('maxlength', maxlength);
    },
    allow_keyCodes: function(keyCodes) {
        var el = this.element;
        $(el).bind('keydown.allow_keyCodes', function(e){
            if ($.inArray(e.keyCode, keyCodes) < 0) {
                return false;
            }
        });
    }
};

$.ui.keynav.prototype.options = {
    type: 'integer',
    mousewheel: true,
    arrows: true,
    shiftModifier: true,
    shiftModifierVal: 10,
    fixedFormat: '{0:02.f}'
};

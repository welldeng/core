/* eslint-env browser */

/**
 * This is a registry of `HTMLImageIcon` objects.
 *
 * Hypergrid comes with a few images (see below).
 *
 * Application developer is free to register additional image objects here (see {@link module:images.add|add}).
 * @module images
 */

'use strict';

var _ = require('object-iterators');
var svgThemer = require('svg-themer');

var images = require('./images'); // this is the file generated by gulpfile.js (and ignored by git)

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/calendar.png">
 * @name calendar
 * @memberOf module:images
 */

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/checked.png">
 * @name checked
 * @memberOf module:images
 */

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/unchecked.png">
 * @name unchecked
 * @memberOf module:images
 */

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/filter-off.png">
 * @name filter-off
 * @memberOf module:images
 */

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/filter-on.png">
 * @name filter-on
 * @memberOf module:images
 */

/**
 * <img src="https://raw.githubusercontent.com/fin-hypergrid/core/master/images/up-down.png">
 * @name up-down
 * @memberOf module:images
 */

_(images).each(function(image, key) {
    var element = new Image();
    element.src = 'data:' + image.type + ';base64,' + image.data;
    images[key] = element;
});

/**
 * Synonym of {@link module:images.checked|checked} (unaffected if `checked` overridden).
 * @name checkbox-on
 * @memberOf module:images
 */
images['checkbox-on'] = images.checked;

/**
 * Synonym of {@link module:images.unchecked|unchecked} (unaffected if `unchecked` overridden).
 * @name checkbox-off
 * @memberOf module:images
 */
images['checkbox-off'] = images.unchecked;

/**
 * @method
 * @param {string} name
 * @param {HTMLImageElement} img
 * @param {boolean} [themeable] - If truthy, the image will be themed by {@link module:images.setTheme images.setTheme}, called by {@link Hypergrid.applyTheme}.
 * If falsy, the image won't be themed until `images[name].themeable` is set to `true`.
 * In any case the remaining parameters are processed.
 * @param {function} [setSvgProps=svgThemer.setSvgProps] - Optional custom theming code for this image and the rules implied by `styles`. _If omitted, `styles` is promoted 2nd parameter position._
 * @param {boolean|string[]} [styles] - Optional list style names with which to create CSS rules.
 * * If falsy (or omitted), no rules are created.
 * * Else if truthy but not an array, create a single rule:
 * ```css
 * `.hypergrid-background-image-name { background-image: url(...) }`
 * where _name_ is the value of the `name` parameter.
 * * Else if an array, create a CSS rule for each style named therein.
 *
 * For each rule thus created:
 * * Inserted into `style#injected-stylesheet-grid`.
 * * Selector is `.hypergrid-style-name` (where `style` is element value and `name` is image name).
 * (If a rule with that selector already exists, it is replaced.)
 * * Contains the named style with a value of `url(...)` where `...` is the image data.
 * Possible styles must be one of those listed in {*link https://github.com/joneit/svg-themer/blob/master/README.md#cssimagepropertynames svgThemer.cssImagePropertyNames} (which you can extend if needed).
 * * Will be automatically themed when the grid is themed (which is the whole point).
 *
 * @see {@link https://github.com/joneit/svg-themer}
 * @memberOf module:images
 */
function add(name, img, themeable, setSvgProps, styles) {
    if (/^data:image\/svg\+xml|\.svg/.test(img.src)) {
        img.themeable = !!themeable;
        if (typeof setSvgProps === 'object') {
            styles = setSvgProps;
            setSvgProps = undefined;
        }
        if (setSvgProps) {
            img.setSvgProps = setSvgProps;
        }
        if (styles) {
            img.themeableRules = createThemeableRules(name, img, setSvgProps, styles);
        }
    }
    return images[name] = img;
}

function createThemeableRules(key, img, setSvgProps, styles) {
    // find or create stylesheet as needed
    var styleEl = document.querySelector('style#injected-stylesheet-themeables');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'injected-stylesheet-themeables';
        document.head.appendChild(styleEl);
    }
    var sheet = styleEl.sheet;

    return (styles.length ? styles : ['background-image']).reduce(function(rules, styleName) {
        var selectorText = '.hypergrid-' + styleName + '-' + key;

        // find and delete existing rule, if any
        var ruleIndex = Array.prototype.findIndex.call(sheet.cssRules, function(rule) {
            return rule.selectorText === selectorText;
        });
        if (ruleIndex !== -1) {
            sheet.deleteRule(ruleIndex);
        }

        // create and insert new rule consisting of selector + style "collection"
        var ruleStyles = {};

        // add image data style
        ruleStyles[styleName] = 'url(' + img.src + ')';

        // add dimensions if known
        if (img.width) { ruleStyles.width = img.width + 'px'; }
        if (img.height) { ruleStyles.height = img.height + 'px'; }

        // combine the above styles into a semi-colon-separated "collection"
        var styleCollection = Object.keys(ruleStyles).map(function(key) {
            return key + ':' + ruleStyles[key];
        }).join(';');

        var ruleText = '{' + styleCollection + '}';
        sheet.insertRule(selectorText + ruleText);

        var themeableRule = {
            rule: sheet.cssRules[0]
        };
        if (setSvgProps) {
            themeableRule.setSvgProps = setSvgProps;
        }
        rules.push(themeableRule);
        return rules;
    }, []);
}

/**
 * @param {object} theme
 * @memberOf module:images
 */
function setTheme(theme) {
    Object.keys(images).forEach(function(name) {
        var img = images[name];
        if (img.themeable) {
            svgThemer.setImgSvgProps.call(img, theme, img.setSvgProps);
        }
        if (img.themeableRules) {
            img.themeableRules.forEach(function(themeable) {
                var selectorText = themeable.rule.selectorText;
                // extract style name using list of possible names
                var regex = new RegExp('^\.hypergrid-(' + svgThemer.cssImagePropertyNames.join('|') + ')-.*$');
                var styleName = selectorText.replace(regex, '$1');
                svgThemer.setRuleSvgProps.call(themeable.rule, theme, img.setSvgProps, styleName);
            });
        }
    });
}

/**
 * Convenience function.
 * @param {boolean} state
 * @returns {HTMLImageElement} {@link module:images.checked|checked} when `state` is truthy or {@link module:images.unchecked|unchecked} otherwise.
 * @memberOf module:images
 */
function checkbox(state) {
    return images[state ? 'checked' : 'unchecked'];
}

/**
 * Convenience function.
 * @param {boolean} state
 * @returns {HTMLImageElement} {@link module:images.filter-off|filter-off} when `state` is truthy or {@link module:images.filter-on|filter-on} otherwise.
 * @memberOf module:images
 */
function filter(state) {
    return images[state ? 'filter-on' : 'filter-off'];
}

// add methods as non-enumerable members so member images can be enumerated
Object.defineProperties(images, {
    add: { value: add },
    setTheme: { value: setTheme },
    checkbox: { value: checkbox },
    filter: { value: filter }
});


module.exports = images;

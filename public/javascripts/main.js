/*
 * ==================================================
 *  _____             _
 * |     |___ ___    |_|___
 * |  |  |  _| -_|_  | |_ -|
 * |_____|_| |___|_|_| |___|
 *                 |___|
 *
 * By Walker Crouse (windy) and contributors
 * (C) SpongePowered 2016-2017 MIT License
 * https://github.com/SpongePowered/Ore
 *
 * Main application file
 *
 * ==================================================
 */

var KEY_ENTER = 13;
var KEY_PLUS = 61;
var KEY_MINUS = 173;

/*
 * ==================================================
 * =               External constants               =
 * ==================================================
 */

var CATEGORY_STRING = CATEGORY_STRING || null;
var SORT_STRING = SORT_STRING || null;
var csrf = null;

/*
 * ==================================================
 * =                  Key bindings                  =
 * ==================================================
 */

var KEY_S = 83;                             // Search
var KEY_H = 72;                             // Home
var KEY_C = 67;                             // Create project
var KEY_ESC = 27;                           // De-focus

/*
 * ==================================================
 * =                Helper functions                =
 * ==================================================
 */

function shouldExecuteHotkey(event) {
    return !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey;
}

function sanitize(html) {
    return $('<textarea>').html(html).text();
}

function decodeHtml(html) {
    // lol
    return $('<textarea>').html(html).val();
}

function go(str) {
    window.location = decodeHtml(str);
}

function clearUnread(e) {
    e.find('.unread').remove();
    if (!$('.user-dropdown .unread').length) $('.unread').remove();
}

function initTooltips() {
    $('[data-toggle="tooltip"]').tooltip({
        container: "body",
        delay: { "show": 500 }
    });
}

function slugify(name) {
    return name.trim().replace(/ +/g, ' ').replace(/ /g, '-');
}

/*
 * ==================================================
 * =               Google Analytics                 =
 * ==================================================
 */
(function(S,p,o,n,g,i,e){S['GoogleAnalyticsObject']=g;S[g]=S[g]||function(){
        (S[g].q=S[g].q||[]).push(arguments)},S[g].l=1*new Date();i=p.createElement(o),
    e=p.getElementsByTagName(o)[0];i.async=1;i.src=n;e.parentNode.insertBefore(i,e)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-59476017-3', 'auto');
ga('send', 'pageview');

/*
 * ==================================================
 * =                   Doc ready                    =
 * ==================================================
 */

// Initialize highlighting
hljs.initHighlightingOnLoad();

$(function() {
    $('.alert-fade').fadeIn('slow');

    initTooltips();

    $('.btn-spinner').click(function() {
        var iconClass = $(this).data('icon');
        $(this).find('.' + iconClass).removeClass(iconClass).addClass('fa-spinner fa-spin');
    });

    var searchBar = $('.project-search');
    searchBar.find('input').on('keypress', function(event) {
        if (event.keyCode === KEY_ENTER) {
            event.preventDefault();
            $(this).next().find('.btn').click();
        }
    });

    searchBar.find('.btn').click(function() {
        var query = $(this).closest('.input-group').find('input').val();
        var url = '/?q=' + query;
        if (CATEGORY_STRING) url += '&categories=' + CATEGORY_STRING;
        if (SORT_STRING) url += '&sort=' + SORT_STRING;
        go(url);
    });

    var body = $('body');
    body.keydown(function(event) {
        var target = $(event.target);
        var searchIcon = $('.search-icon');
        if (shouldExecuteHotkey(event)) {
            if (target.is('body')) {
                switch (event.keyCode) {
                    case KEY_S:
                        event.preventDefault();
                        searchIcon.click();
                        break;
                    case KEY_H:
                        event.preventDefault();
                        window.location = '/';
                        break;
                    case KEY_C:
                        event.preventDefault();
                        window.location = '/new';
                        break;
                    case KEY_PLUS:
                        break;
                    case KEY_MINUS:
                        break;
                    default:
                        break;
                }
            } else if (target.is('.project-search input')) {
                switch (event.keyCode) {
                    case KEY_ESC:
                        event.preventDefault();
                        searchIcon.click();
                        break;
                    default:
                        break;
                }
            }
        }
    });

    $(".unsafe-link-back").click(function () {
        window.history.back();
    });

    $(".unsafe-link-continue").click(function () {
        var remote = $(".unsafe-link-continue").data("remote");

        location.replace(location.href);
        location.replace(remote);
    });
});

/*
 * ==================================================
 * =                  Anchor Fix                    =
 * ==================================================
 */

var scrollToAnchor = function (anchor) {
    if (anchor) {
        var target = $("a" + anchor);

        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top - ($("#topbar").height() + 10)
            }, 1);

            return false;
        }
    }

    return true;
};

if(window.location.hash) {
    $(window).load(function () {
        return scrollToAnchor(window.location.hash);
    });
}

$("a[href^='#']").click(function () {
    window.location.replace(window.location.toString().split("#")[0] + $(this).attr("href"));

    return scrollToAnchor(this.hash);
});

/*
 * ==================================================
 * =                    Navbar                      =
 * ==================================================
 */

$(function() {
    window.mobile = window.innerWidth <= 768;

    window.addEventListener("resize", function () {
        var mobile = window.innerWidth <= 768;

        if(mobile !== window.mobile) {
            if(mobile === false) {
                spongeNavigation.hide();
                subNavigation.show();

                bindHoverEvents();
            } else {
                subNavigation.hide();

                spongeNavigationToggler.unbind("mouseenter.nav");
                spongeNavigation.unbind("mouseleave.nav");
                spongeNavigationToggler.unbind("mouseleave.nav");
            }
        }

        window.mobile = mobile;
    });

    //==> Elements

    const spongeNavigationToggler = $(".navbar-toggler.sponge-menu");
    const spongeNavigation = $("#sponge-menu").find(".navbar-nav");
    const subNavigationToggler = $(".navbar-toggler.sub-menu");
    const subNavigation = $("#sub-menu").find(".navbar-nav");

    //==> Utility Methods

    var hideSpongeNavigation = function () {
        spongeNavigation.hide();
        spongeNavigationToggler.removeClass("focus");
    };
    var showSpongeNavigation = function () {
        if(subNavigation.is(":visible")) {
            hideSubNavigation();
        }
        spongeNavigation.show();
        spongeNavigationToggler.addClass("focus");
    };
    var hideSubNavigation = function () {
        if(window.mobile) {
            subNavigation.hide();
            subNavigationToggler.removeClass("focus");
        }
    };
    var showSubNavigation = function () {
        if(spongeNavigation.is(":visible")) {
            hideSpongeNavigation();
        }
        subNavigation.show();
        subNavigationToggler.addClass("focus");
    };
    var bindHoverEvents = function () {
        spongeNavigationToggler.bind("mouseenter.nav", showSpongeNavigation);
        spongeNavigation.bind("mouseleave.nav", hideSpongeNavigation);
        spongeNavigationToggler.bind("mouseleave.nav", function (event) {
            if (!event.relatedTarget || (event.relatedTarget && !event.relatedTarget.classList.contains("navbar-nav") && !event.relatedTarget.classList.contains("nav-link"))) {
                hideSpongeNavigation();
            }
        });
    };

    //==> Events

    spongeNavigationToggler.click(function () {
        if(spongeNavigation.is(":visible")) {
            hideSpongeNavigation();
        } else {
            showSpongeNavigation();
        }
    });

    subNavigationToggler.click(function () {
        if(subNavigation.is(":visible")) {
            hideSubNavigation();
        } else {
            showSubNavigation();
        }
    });

    if(!window.mobile) bindHoverEvents();
});

/*
 * ==================================================
 * =                 Service Worker                 =
 * ==================================================
 *
 * The service worker has been removed in commit 9ab90b5f4a5728587fc08176e316edbe88dfce9e.
 * This code ensures that the service worker is removed from the browser.
 *
 */

if (window.navigator && navigator.serviceWorker) {
    if ('getRegistrations' in navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            registrations.forEach(function (registration) {
                registration.unregister();
            })
        })
    } else if ('getRegistration' in navigator.serviceWorker) {
        navigator.serviceWorker.getRegistration().then(function (registration) {
            registration.unregister();
        })
    }
}

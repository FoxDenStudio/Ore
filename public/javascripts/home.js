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
 * Home page specific script
 *
 * ==================================================
 */

/*
 * ==================================================
 * =               External constants               =
 * ==================================================
 */

var CATEGORY_STRING = null;
var SORT_STRING = null;
var QUERY_STRING = null;

/*
 * ==================================================
 * =                   Doc ready                    =
 * ==================================================
 */

$(function() {
    // Initialize sorting selection
    $('select#sortSelect').on('change', function() {
        var newSort = $(this).find('option:selected').val();

        go(jsRoutes.controllers.Application.showHome(CATEGORY_STRING, QUERY_STRING, newSort, null).absoluteURL())
    });

    var submitSearch = function() {
        var newQuery = $('#project-search input').val();

        if(newQuery !== QUERY_STRING && newQuery.trim() !== "") {
            go(jsRoutes.controllers.Application.showHome(CATEGORY_STRING, newQuery, SORT_STRING, null).absoluteURL())
        }
    };

    $('#project-search .btn').on('click', submitSearch);
    $('#project-search input').on('submit', submitSearch);
});

var express = require('express');
var Promise = require('bluebird');
var _ = require('lodash');

// necessary for sending HTTP requests
var querystring = require('querystring');
var http = require('http');
var xml2js = require('xml2js');


/**
 * Searches Wikipedia and returns the search results
 *
 * @see https://www.mediawiki.org/wiki/API:Opensearch
 * @param {object} options
 *     {number} limit max results to return (default: 10)
 *     {string} query title text for which to search (required)
 * @return {Promise} resolves to the XML response from Wikipedia's API
 */
function searchWikipedia(options) {
    var opts = _.defaults(options || {}, {
        limit: 10
    });

    if (!options.query) {
        throw new TypeError('no query specified');
    }

    var qs = querystring.stringify({
        action: 'opensearch',
        format: 'xml',
        redirects: 'resolve',
        limit: opts.limit,
        search: opts.query
    });

    var reqOptions = {
        hostname: 'en.wikipedia.org',
        port: 80,
        path: '/w/api.php?' + qs,
        method: 'GET'
    };

    return new Promise(function (resolve, reject) {
        http.request(reqOptions, function (res) {
            // response data comes in chunks; we need to concatenate them here
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('error', reject);

            res.on('end', function () {
                resolve(data);
            });
        }).end();
    });
}


/**
 * Parses an XML string into a JS object via xml2js
 *
 * @param  {string}  xml
 * @return {Promise}     resolves to JS object
 */
function parseXml(xml) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}





var app = express();

app.get('/wikipedia', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    var options = {
        query: req.query.q,
        limit: req.query.limit
    };

    // promises cured 'callback hell' here
    searchWikipedia(options)
        .then(parseXml)
        .then(function (data) {
            // extract items from results
            return data.SearchSuggestion.Section[0].Item;
        })
        .map(function (item) {
            // normalize search results into something a little easier for clients to parse
            return {
                title: item.Text[0]._,
                url: item.Url[0]._
            };
        })
        .then(function (results) {
            // send results to client
            res.end(JSON.stringify(results));
        });
});


app.listen(9999);

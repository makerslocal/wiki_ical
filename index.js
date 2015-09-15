var _ = require('lodash');
var MediaWiki = require("mediawiki");
var bot = new MediaWiki.Bot();
bot.settings.endpoint = "https://256.makerslocal.org/wiki/api.php";

 var search_params = {
          action: 'query',
          list: 'search',
          srsearch: 'Calendar',
          srwhat: 'text',
          srprop: 'timestamp',
          srlimit: '50',
          sroffset: '0'
  };


function print(response){
   _.forEach(response.query.search, function(n, key) {
       //console.log(n, key);
       console.log(n.title);
  });
}


function search(){
  bot.get(search_params).complete(function (response) {
    print(response);
    var sroffset = _.get(response, 'query-continue.search.sroffset', 0);
    if (sroffset > 0){
      search_params.sroffset = sroffset;
      search();
    }
 });
}


//search();

function parsePage(wikitext){
  console.log("parsing");
  var rePattern = new RegExp(/==? *Calendar *==?/);
  var match = rePattern.exec(wikitext);
if (match) {
    console.log("match found at " + match.index);
}
}



function getPage(name){
  var params = {
    action: 'parse',
    page: name,
    prop: 'wikitext'
  };
  bot.get(params).complete(function (response) { 
    parsePage(response.parse.wikitext['*']);
  });
}


getPage('Retro Gaming & Computing Night');

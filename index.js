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
  var reCal = new RegExp(/==? *Calendar *==?/);
  var reItem = new RegExp(/^\*[^\*]/m);
  var reSection = new RegExp(/^==?[^=]/m);

  // Check if page contains Calendar section
  if (!reCal.test(wikitext)) {
    return;
  }

  var calFlag = false;
  var lines = wikitext.split('\n');
  for(var i = 0; i <= lines.length; i++){
    if( !calFlag && reCal.test(lines[i]) ){
      calFlag = true;
      //TODO: parse event data
      //      get short link
    }
    else if( calFlag && reItem.test(lines[i]) ){
      console.log(lines[i]);
    }
    else if ( calFlag && reSection.test(lines[i]) ){
      calFlag = false;
    }
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

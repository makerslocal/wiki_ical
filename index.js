var _ = require('lodash');
var moment = require('moment');
moment().format();
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

//TODO: parse event data
function parseEvent(wikievent){
  console.log(wikievent);

  var re = /^\* (.*) *: +(.*?)( at (.*))?$/;
  var res = re.exec(wikievent);
  var eventTime = res[1];
  var eventName = res[2];

  console.log("eventTime: " + eventTime);
  console.log("eventName: " + eventName);
}

function parsePage(wikitext){
  var reCal = /==? *Calendar *==?/;
  var reItem = /^\*[^\*]/m;
  var reSection = /^==?[^=]/m;

  // Check if page contains Calendar section
  if (!reCal.test(wikitext)) {
    return;
  }

  var calFlag = false;
  var lines = wikitext.split('\n');
  for(var i = 0; i <= lines.length; i++){
    // Found Calendar section
    if( !calFlag && reCal.test(lines[i]) ){
      calFlag = true;
      //TODO: get short link
    }
    // Find event
    else if( calFlag && reItem.test(lines[i]) ){
      parseEvent(lines[i]);
    }
    // reset
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

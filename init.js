'use strict';

let fs = require( 'fs' );
let http = require( 'http' );
const port = process.env.PORT || 8888;

http.createServer( function ( req, res ) {

if (req.url.startsWith('/public/')) {

let filePath = req.url.substr(1);

fs.readFile( filePath, ( err, data ) => {
  if ( err ) {
    res.statusCode = 404;
    res.end( "Sorry, page not found" );
  } else {
    let match;

    if ( match = filePath.match(/\.(js|css)$/)) {
      res.setHeader('Content-Type', 'text/' + match[1]);
    } else if ( match = filePath.match(/\.(jpg|png|img)$/)) {
      res.setHeader('Content-Type', 'image/' + match[1]);
    }

    res.end(data);
  }
  return;
})
} else {
  getPage( req.url, res );
}
}).listen(port, function() {
  console.log("App is running on port " + port)
});

; function getPage( name, res, statusCode = 200 ) {
if ( name == '/' ) {
  name = 'default';
}

fs.readFile('./' + name + '.html', 'utf8', ( err, content ) => {

if(!err) {
  fs.readFile( './layouts/default.html', 'utf8', ( err, layout ) => {
    if ( err ) throw err;

let title = content.match(/\{\{set title "(.*?)"\}\}/);

if (title) {
  layout = layout.replace(/\{\{get title\}\}/g, title[1] );
  layout = layout.replace(/\{\{set title "(.*?)"\}\}/, '' );
}

      res.setHeader( 'content-type', 'text/html' );
      res.statusCode = statusCode;
      res.write( layout );
      res.end();

});

} else {
  if ( statusCode != 404) {
    getPage( '404', res, 404 );
  } else throw err;
}
});
}

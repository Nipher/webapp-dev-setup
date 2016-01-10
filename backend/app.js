'use strict';

var express = require( 'express' );
var session = require( 'express-session' );
var bodyParser = require( 'body-parser' );
var app = express();
var path = require( 'path' );
var config = require( './config' );
var db = require( path.join( config.root, 'backend/db' ) );

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.set( 'port', ( process.env.PORT || 9000 ) );

// Connect to database
db.connect( config.mongo.uri, config.mongo.options );

switch ( process.env.NODE_ENV ) {
  case 'development':
    app.set( 'appPath', path.join( config.root, '/frontend' ) );
    break;
  case 'production':
    app.set( 'appPath', path.join( config.root, '/frontend' ) );
    break;
  default:
    app.set( 'appPath', path.join( config.root, '/frontend' ) );
    break;
}

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(
  session({
    secret: 'safe-secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use( db.errorMiddleware );

app.use( express.static( app.get( 'appPath' ) ) );

require( './routes' )( app );

app.listen( app.get( 'port' ), function () {
	console.log( 'Server running: http://' + config.host + ':' + app.get( 'port' ) + '/' );
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');

const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(config('SLACK_VERIFICATION_TOKEN'));

const WebClient = require('@slack/client').WebClient;

var web = new WebClient(config('SLACK_API_TOKEN'));

var index = require('./routes/index');
var bot = require('./routes/bot');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Mount the event handler on a route
app.use('/slack/events', slackEvents.expressMiddleware());

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event)=> {
  if (event.text === 'hey') {
    web.chat.postMessage(event.channel, 'Hello there', function(err, res) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Message sent: ', res);
      }
    });
  }
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

app.use('/', [index, bot]);  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

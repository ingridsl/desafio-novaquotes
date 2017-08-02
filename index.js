



var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3001));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  //response.render('pages/index');
  response.send("\n Heroku's app to the Novabot challenge connected to slack");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//database
var pg = require('pg');

/*app.get('/novaquotes', (req, res) => {
	var query = "insert into quotes (1, " + quote + ", weekday, date)"
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db-quote', {results: result.rows} ); }
    });
  });
}*/

app.get('/main.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/main', {results: result.rows} ); }
    });
  });
});

app.get('/Mon.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Mon' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Mon', {results: result.rows} ); }
    });
  });
});

app.get('/Tue.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Tue' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Tue', {results: result.rows} ); }
    });
  });
});

app.get('/Wed.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Wed' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Wed', {results: result.rows} ); }
    });
  });
});

app.get('/Thu.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Thu' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Thu', {results: result.rows} ); }
    });
  });
});

app.get('/Fri.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Fri' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Fri', {results: result.rows} ); }
    });
  });
});

app.get('/Sat.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Sat' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Sat', {results: result.rows} ); }
    });
  });
});

app.get('/Sun.htm', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM quotes WHERE weekday LIKE $1', ['%' + 'Sun' + '%'], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/Sun', {results: result.rows} ); }
    });
  });
});

app.get('/menu.htm', function (request, response) {
	response.render('pages/menu');

});

app.get('/db-quote', function (request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	    client.query('SELECT * FROM quotes', function(err, result) {
	      done();
	      if (err)
	       { console.error(err); response.send("Error " + err); }
	      else
	       { response.render('pages/db-quote', {results: result.rows} ); }
	    });
	  });
});



const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')


/*

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}*/



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.post('/novaquotes', (req, res) => {

  var quote = req.body.text
      var body = {
        response_type: "in_channel",
        "attachments": [
          {
            "text": "Quote: " + quote + "\n"
                  + "Sent to: " + "http://novaquotes-desafio.herokuapp.com/" + "\n",
          }
        ]
      };
      res.send(body);

    var d = new Date();
	var weekday = new Array(7);
	weekday[0] =  'Sun';
	weekday[1] = 'Mon';
	weekday[2] = 'Tue';
	weekday[3] = 'Wed';
	weekday[4] = 'Thu';
	weekday[5] = 'Fri';
	weekday[6] = 'Sat';

	var n = weekday[d.getDay()];


	pg.connect(process.env.DATABASE_URL, function(err, client, done)  {
		var date = new Date();
		var current_hour = date.getHours();
		var id = 1;
	    client.query(
	        	'insert into quotes (id, quote, date, weekday) VALUES ($1, $2, $3, $4)',
	        	[id,quote, date, n],
	         function(err, result) {
		      done();
		      if (err)
		       { console.error(err); response.send("Error " + err); }
		      else
		       { response.render('pages/db-quote', {results: result.rows} ); }
		    });
	});
	client.end();
})


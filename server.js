const express 		= require('express'),
	  app 			= express(),
	  bodyParser 	= require('body-parser'),
	  mysql 		= require('mysql'),
	  connection 	= require('express-myconnection');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use(connection(mysql, {
	host: '35.189.84.109',
	//socketPath: '/cloudsql/cloudlab1-216014:europe-west2:mydatabase',
	user: 'root',
	password: '123456',
	database: 'questbook'
}));

app.get('/guestbooks', function (req, res) {
	req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('SELECT * FROM entries', function(err, data) {
			res.render('guestbooks', {title: 'Список книг', data: data});
		});
	});
});


app.get('/add', function (req, res, next) {
	res.render( __dirname + "/views/" + "addbook.ejs");
});

app.post('/submit',function(req,res){

  let data = {
			guestName: req.body.name,
			content: req.body.content,
		};


  req.getConnection(function(err, connection) {
  if (err) throw err;
connection.query('INSERT INTO entries SET ? ', [data], function(err, data) {
			if (err) throw err;
			res.redirect('/guestbooks');
		});

 });
});


app.listen(80);
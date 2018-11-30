'use strict';

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
	//host: '35.189.84.109',
	socketPath: '/cloudsql/cloudlab1-216014:europe-west2:mydatabase',
	user: 'root',
	password: '123456',
	database: 'dtbd'
}));

app.get('/names', (req, res) => {
	req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('SELECT * FROM datal2', function(err, data) {
			console.log(data);
			res.render('names', {title: 'імена і статуси', data: data});
		});
	});
});

app.get('/add', function (req, res, next) {
	res.render( __dirname + "/views/" + "addname.ejs");
});

app.post('/submit',function(req,res){

  let data = {
			name: req.body.name,
			status: req.body.status,
		};


  req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('INSERT INTO datal2 SET ? ', [data], function(err, data) {
			if (err) throw err;
			res.redirect('/names');
		});
 	});
});

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;

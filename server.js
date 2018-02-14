var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost/MongooseDashboard');
mongoose.Promise = global.Promise;

var AnimalSchema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 2 },
	age: { type: Number, required: true, min: 1, max: 150 },
	color: { type: String, required: true, minlength: 3 }
	}, {timestamps: true}
);

mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal')



app.get('/', function(req, res) {
	Animal.find({}, null, {sort: {createdAt: -1}}, function(err, results) {
		if(err) {
			console.log('something went wrong with the find method')
		} else {
			console.log(results);
			console.log('loaded index')
			res.render('index', {data: results});
		}
	})
})

app.get('/mongooses/new', function(req, res) {
	res.render('new', data = null);
})

app.get('/mongooses/:id', function(req, res) {
	Animal.find({_id: req.params.id}, function(err, results) {
		if (err) {
			console.log('something went wrong with the find method')
		} else {
			res.render('animal', {data: results});
		}
	})
})

app.get('/mongooses/edit/:id', function(req, res) {
	Animal.find({_id: req.params.id}, function(err, results) {
		if(err){
			console.log('something went wrong with the find method')
		} else {
			res.render('edit', {data: results});
		}
	})
})

app.post('/mongooses/:id', function(req, res) {
	Animal.update({_id: req.params.id}, {$set: {name: req.body.name, age: req.body.age, color: req.body.color}}, {multi: false}, function(err, results) {
		if(err) {
			console.log('something went wrong with the update method')
			res.render('new', {errors: animal.errors})
		} else {
			res.redirect('/')
		}
	})
})

app.post('/mongooses', function (req, res) {
	console.log("POST Data", req.body);

	var animal = new Animal({name: req.body.name, age: req.body.age, color: req.body.color});
	animal.save(function(err) {
		if(err) {
			res.render('new', {errors: animal.errors})
		} else {
			console.log('added an animal!')
			res.redirect('/');
		}
	})
})

app.post('/mongooses/destroy/:id', function (req, res) {
	Animal.remove({_id: req.params.id}, function(err, results) {
		if(err){
			console.log('something went wrong with the delete method')
		} else {
			res.redirect('/')
		}
	});
})

app.listen(8000, function() {
	console.log("Mongoose Dashboard App listening on port 8000");
})
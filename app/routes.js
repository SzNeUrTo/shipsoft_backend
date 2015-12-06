var User = require('./models/user');
var infoConfig = require('./models/config');
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.send('Welcome to Shipsoft Server');
	});

	app.post('/login', function(req, res) {
		var userAuth = req.body;
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id}, function(err, user) {
			if (err) {
				console.log('err');
				throw err;
			}
			if (!user) {
				console.log('go_regis');
				res.send('go_regis');
			}
			else {
				console.log('go_home');
				res.send('go_home');
			}
		});
		console.log(req.body);
	});

	app.post('/profile', function(req, res) {
		var userAuth = req.body;
		console.log('====== debug ======');
		console.log(userAuth);
		console.log('====== debug ======');
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id}, function(err, user) {
			if (err) {
				console.log('err');
				res.send('go_error');
				throw err;
			}
			if (!user) {
				res.send('go_regis');
			}
			else {
				res.json(user);
			}
		});
	});

	app.post('/regis', function(req, res) {
		var userData = req.body;
		console.log('======= regis ========');
		console.log(req.body);
		console.log('======================');
		var nameUser = userData.name.split(' ');
		var newUser = new User();
		newUser.id = 0;
		newUser.firstname = nameUser[0];
		newUser.lastname = nameUser[1];
		newUser.gender = userData.gender;
		newUser.email = userData.email;
		newUser.tel = userData.tel;
		var id = userData.authen.id;
		var site = userData.authen.site;
		var facebookUrlProfile = 'https://graph.facebook.com/' + id + '/picture?width=500'
		newUser.pic_profile = (site == 'facebook') ? facebookUrlProfile : '';
		newUser.isTutor = userData.isTutor;
		newUser.teach_subjects = userData.teach_subjects;
		newUser.authen = userData.authen;
		newUser.lesson = [];
		newUser.position = [];
		newUser.save(function(err) {
			if (err) {
				res.send('go_error')
				throw err;
			}
			console.log('regis_success');
			res.send('sucess|go_profile');
		});
	});

	app.post('/createlesson', function(req, res) {
		var userAuth = req.body.authen;
		var newLesson = req.body.newLesson;
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id}, function(err, user) {
			if (err) {
				res.send('go_error');
				console.log('err');
				throw err;
			}
			if (!user) {
				res.send('go_regis');
			}
			else {
				user.lesson.push(newLesson);
				user.save(function(err) {
					if (err) {
						res.send('go_error');
						throw err;
					}
					res.send('success');
				});
			}
		});
	});

	app.post('/addposition', function(req, res) {
		var userAuth = req.body.authen;
		var position = req.body.position;
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id, 'isTutor': true}, function(err, user) {
			if (err) {
				res.send('go_error');
				console.log('err');
				throw err;
			}
			if (!user) {
				res.send('go_regis');
			}
			else {
				user.position.push(position);
				user.save(function(err) {
					if (err) {
						res.send('go_error');
						throw err;
					}
					res.send('success');
				});
			}
		});
	});

	app.get('/getsubjectdata', function(req, res) {
		res.json(infoConfig)
	});


	app.post('/getlessondata', function(req, res) {
		var userAuth = req.body;
		User.findOne({'authen.site': userAuth.site, 'authen.id': userAuth.id}, 'lesson', function(err, user) {
			if (err) {
				console.log('err');
				res.send('go_error');
				throw err;
			}
			if (!user) {
				res.send('go_regis');
			}
			else {
				res.json(user.lesson);
			}
		});
	});

	app.post('/searchbymap', function(req, res) {
		User.find({'isTutor': true}, '_id firstname lastname pic_profile teach_subjects position', function(err, teachers) {
			res.json(teachers);
		});
	});

	app.post('/searchbyteacher', function(req, res) {
		var search = req.body.search;
		var pattern = new RegExp(search, 'i');
		User.find({'isTutor': true}, '_id firstname lastname pic_profile teach_subjects', function(err, teachers) {
			if (err) {
				console.log('err');
				res.send('go_error');
				throw err;
			}
			res.json(teachers.filter(function(t) {
				return pattern.test(t.firstname + ' ' + t.lastname);
			}));
		});
	});


}

function searchByMap() {
}

function searchByLesson() {
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


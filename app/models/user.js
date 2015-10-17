var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	user_id: Number,
	messages: [{time: String, message: String}]
});

var positionSchema = new Schema({
	latitude: Number,
	longtitude: Number
});

var timeSchema = new Schema({
	day: String,
	//times_ranges: [{time_start: String, time_end: String}]
	time_start: String,
	time_end: String
});

var lessonSchema = new Schema({
	subject: String,
	level: String,
	schedule: [timeSchema],
	// -- add --
	// places: [positionSchema],
	description: String
	// -- add --
});

var userSchema = new Schema({
	id: Number,
	firstname: String,
	lastname: String,
	gender: String,
	age: Number,
	email: String,
	tel: String,
	pic_profile: String,
	isTutor: Boolean,
			//teach_subjects --> level 123 456 all***
	//teach_subjects: [{'level': String, 'subject': String, 'description': String}], // case tutor list of subjects that want to teach 
	teach_subjects: [{'level': String, 'subject': String}], // case tutor list of subjects that want to teach 
	authen: {site: String, id: Number}, // schema
	lesson: [lessonSchema], // schema // lesson for teacher is freetime to teach but lesson for student is schedule that regis
	position: [positionSchema], // schema
	comments: [commentSchema]
	// for teacher comments : [commentSchema]
});

var User = mongoose.model('User', userSchema);
module.exports = User;

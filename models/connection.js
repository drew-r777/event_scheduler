const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema ({
    topic: {type: String, required: [true, 'topic is required']},
    title: {type: String, required: [true, 'title is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, 'details are required'], minLength: [10, 'the details should have at least 10 characters']},    
    where: {type: String, required: [true, 'location is required']},
    when: {type: String, required: [true, 'date is required']},
    start: {type: String, required: [true, 'start time is required']},
    end: {type: String, required: [true, 'end time is required']},
    image: {type: String, required: [true, 'image url is required']}
});

module.exports = mongoose.model('Connection', connectionSchema);


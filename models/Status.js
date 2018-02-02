var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
    
var StatusSchema = new Schema({    
    status: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,        
        lowercase: true
    },
    country: {
        type: String,
        required: false
    },
    contact: {
        type: String,
        required: false
    },    
    active: {
        type: Boolean,
        required: true
    }
},
{
    timestamps:true
}
);


StatusSchema.plugin(mongooseLogs, {
    schemaName: "Status",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Statuss = mongoose.model('nd_Status', StatusSchema);

module.exports = Statuss;
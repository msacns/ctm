var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
    
var CustomerSchema = new Schema({    
    supplier: {
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
    state: {
        type: String,
        required: false
    },
    city: {
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


CustomerSchema.plugin(mongooseLogs, {
    schemaName: "Customers",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Customer = mongoose.model('nd_Customer', CustomerSchema);

module.exports = Customer;
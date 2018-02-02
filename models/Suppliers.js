var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
var AutoIncrement = require('mongoose-sequence')(mongoose);

var SupplierSchema = new Schema({    
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

SupplierSchema.plugin(AutoIncrement, {inc_field: 'id'});

SupplierSchema.plugin(mongooseLogs, {
    schemaName: "Suppliers",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Supplier = mongoose.model('nd_Supplier', SupplierSchema);

module.exports = Supplier;
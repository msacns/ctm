var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')
    
var OperationsSchema = new Schema({    
    operation: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,        
        lowercase: true
    },
    invoice: {
        type: String,
        required: false
    },
    dtinvoice: {
        type: String,
        required: false
    }, 
    dtdeparture: {
        type: String,
        required: false
    }, 
    dtarrival: {
        type: String,
        required: false
    }, 
    dtdemurrage: {
        type: String,
        required: false
    }, 
    dtsalesorder: {
        type: String,
        required: false
    }, 
    supplier:  { type: Schema.Types.ObjectId, ref: 'nd_Supplier', required: true },
    customer:  { type: Schema.Types.ObjectId, ref: 'nd_Customer', required: true },
    status:  { type: Schema.Types.ObjectId, ref: 'nd_Status', required: true },
    importdeclation:{
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


OperationsSchema.plugin(mongooseLogs, {
    schemaName: "Operations",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var Statuss = mongoose.model('nd_Operation', OperationsSchema);

module.exports = Statuss;
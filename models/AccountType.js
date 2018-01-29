var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var mongooseLogs = require('mongoose-activitylogs')
    
var AccountTypeSchema = new Schema({
    accountType: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    accountTypeDescription: {
        type: String,
        required: true
    },    
    createdBy: {
        type: String
    },
    modifiedBy: {
        type: String
    }
},
{
    timestamps:true
}
);


AccountTypeSchema.plugin(mongooseLogs, {
    schemaName: "Account Type",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});

var accounttype = mongoose.model('nd_AccountType', AccountTypeSchema);

module.exports = accounttype;
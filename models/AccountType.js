var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var mongooseLogs = require('mongoose-activitylogs')
var assert = require('assert');

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

var accounttype = mongoose.model('nd_accounttypes', AccountTypeSchema);

var acctype = [
    {accountType: 'A', accountTypeDescription: 'Manutenção Total'}, 
    {accountType: 'B', accountTypeDescription: 'Visualização de Operações'}
];
// habilitar somente quando instalar
// accounttype.collection.insertMany(acctype, function(err, r){
//     assert.equal(null, err);
//     assert.equal(2, r.insertedCount);
// });



module.exports = accounttype;

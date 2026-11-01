import mongoose, { Schema, model } from 'mongoose'

const disclosureSchema=new Schema({
  title:{type:String,required:true,maxlength:200},
  description:{type:String,default:'',maxlength:5000},
  status:{type:String,enum:['Pending','Valid','Active','Expired'],default:'Pending'},
  fileUrl:{type:String,required:true,maxlength:1024},
  expiryDate:{type:Date,default:null},
  isPublished:{type:Boolean,default:false},
  version:{type:Number,default:0,validate:value=>Number.isSafeInteger(value)&&value>=0},
  updatedBy:{type:Schema.Types.ObjectId,ref:'Auth',required:true},
},{timestamps:true,strict:'throw',versionKey:false,autoCreate:false,autoIndex:false})
disclosureSchema.index({isPublished:1,_id:-1},{name:'disclosure_public_cursor'})
export default mongoose.models.Disclosure||model('Disclosure',disclosureSchema)

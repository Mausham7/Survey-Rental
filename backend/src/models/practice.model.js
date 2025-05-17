import mongoose from "mongoose";
const practiceSchema=new mongoose.Schema({
    name:String,
    number:String
});
const PracticeModel=mongoose.model("Practice",practiceSchema)
export default PracticeModel
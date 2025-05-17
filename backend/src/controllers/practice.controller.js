import PracticeModel from "../models/practice.model.js"

export const addInformation=async(req, res)=>{
    

    try {
      const name=req.body.name
    const number=req.body.number  
    console.log(name, number)

    const storeData= new PracticeModel({name,number});
    await storeData.save()

    return res.status(200).json({message:"Data Stored", data:storeData})
    } catch (error) {
     
    return res.status(500).json({message:"Internal Servar Error"})   
    }
}
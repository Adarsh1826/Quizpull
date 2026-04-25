import { supabase } from "./client"
export const fetchAllProblemOfSinglePdf = async(fileId:any)=>{

    const {data,error} = await supabase.from("pdfs").select("questions").eq("id",fileId)

    console.log("Question fetched sucessfuly", data );
    return data;
    

}
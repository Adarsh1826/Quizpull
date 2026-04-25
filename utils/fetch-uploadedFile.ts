import { supabase } from "./client";
// This function fetches all uploaded file of the user
export async function fetchUploadFile(user_id:string){
   try {
    const {data,error} = await supabase.from("pdfs").select("*").eq("user_id",user_id)
    //console.log("Fetched Successfully",data);
    
    return data;

   } catch (error) {
    console.log(error);
    
   }
}

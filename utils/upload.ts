import { supabase } from "./client";
// This function is to upload pdf file to supabase bucket
export default async function uplaodFileToBucket(file:any){

    try {
        const fileName = `${Date.now()}-${file.name}`
    
        const {data,error} = await supabase.storage.from("content").upload(fileName,file)
        console.log("File uploaded successfully");
        const {data:urlData} = supabase.storage.from("content").getPublicUrl(data?.path!)

    } catch (error) {
        console.log(error);
        
    }
}

// This function is to store the file in the supabase table
export  function addInTable(file_name:string ,file_url:string,question:any ){

}

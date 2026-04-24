import { supabase } from "./client";
// This function is to upload pdf file to supabase bucket


export default async function uploadFileToBucket(file: any) {
  try {
   
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    // if (userError || !userData.user) {
    //   console.log("User not found");
    //   return;
    // }

    // const user = userData.user;

    // 2. create file name
    const fileName = `${Date.now()}-${file.name}`;

    // 3. upload to storage
    const { data, error } = await supabase.storage
      .from("content")
      .upload(fileName, file);

    if (error) {
      console.log(error.message);
      return;
    }

    console.log("File uploaded successfully");

    
    const { data: urlData } = supabase.storage
      .from("content")
      .getPublicUrl(data.path);

    const fileUrl = urlData.publicUrl;

    // 5. save in table
    await addInTable(fileName, fileUrl);

  } catch (error) {
    console.log(error);
  }
}

// This function is to store the file in the supabase table
export  async function addInTable(file_name:string ,file_url:string,user_id? :string,question?:any){
    const {data,error} = await supabase.from("pdfs").insert({
        user_id,
        question,
        file_name,
        file_url
    })
    return data;
}

// This function fetches all uploaded file of the user

export async function fetchUploadFile(user_id:string){
   try {
    const {data,error} = await supabase.from("pdfs").select("*").eq("user_id",user_id)
    console.log("Fetched Successfully");
    
    return data;

   } catch (error) {
    console.log(error);
    
   }
}
const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error.message);
      return null;
    }

    return data.user;
};
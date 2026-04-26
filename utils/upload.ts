// import { supabase } from "./client";
// import { getUser } from "./auth";
// // This function for uploading to storage
// export default async function uploadFileToBucket(file: any) {
//   try {
//     const user = await getUser();
//     const id = user ? user.id : null;
   
//     const folder = id ? id : 'guest';
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = `${folder}/${fileName}`;  

//     const { data, error } = await supabase.storage
//       .from("content")
//       .upload(filePath, file);  

//     if (error) {
//       console.log(error.message);
//       return;
//     }

//     console.log("File uploaded successfully");

//     const { data: urlData } = supabase.storage
//       .from("content")
//       .getPublicUrl(data.path);

//     const fileUrl = urlData.publicUrl;

//     await addInTable(fileName, fileUrl, id);

//   } catch (error) {
//     console.log(error);
//   }
// }
// // This function is for adding into table

// export async function addInTable(file_name: string, file_url: string, user_id?: string | null, question?: any) {
//   const { data, error } = await supabase.from("pdfs").insert({
//     user_id,
//     question,
//     file_name,
//     file_url
//   });
//   return data;
// }

import { supabase } from "./client";
import { getUser } from "./auth";

// Upload file to Supabase Storage and insert a row into the pdfs table.
// Returns the newly created DB record so the UI can add it instantly.
export default async function uploadFileToBucket(file: any) {
  try {
    const user = await getUser();
    const id = user ? user.id : null;

    const folder = id ? id : "guest";
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("content")
      .upload(filePath, file);

    if (error) {
      console.log("Storage upload error:", error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("content")
      .getPublicUrl(data.path);

    const fileUrl = urlData.publicUrl;

    // Insert into DB and return the new row
    const newRecord = await addInTable(fileName, fileUrl, id);
    return newRecord;
  } catch (error) {
    console.log("uploadFileToBucket error:", error);
    return null;
  }
}

// Insert into pdfs table and return the inserted row
export async function addInTable(
  file_name: string,
  file_url: string,
  user_id?: string | null,
  question?: any
) {
  const { data, error } = await supabase
    .from("pdfs")
    .insert({ user_id, question, file_name, file_url })
    .select()   // returns the inserted row
    .single();

  if (error) {
    console.error("addInTable error:", error.message);
    return null;
  }
  return data;
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/client";

export default function AllFilePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // 1. get user
  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error.message);
      return null;
    }

    return data.user;
  };

  // 2. fetch files
  const fetchFiles = async (userId: string) => {
    const { data, error } = await supabase
      .from("pdfs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log(error.message);
      return [];
    }

    return data;
  };

  // 3. load everything
  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);

      if (!userData) return;

      const filesData = await fetchFiles(userData.id);
      setFiles(filesData);
    };

    loadData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold mb-4">Your Files</h1>

      {files.length === 0 ? (
        <p>No files uploaded</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="p-3 border border-white/10 rounded-lg mb-2"
          >
            {file.file_name}
          </div>
        ))
      )}
    </div>
  );
}
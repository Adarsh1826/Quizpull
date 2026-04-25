"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { fetchUploadFile } from "@/utils/fetch";
export default function AllFilePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [user, setUser] = useState("");
  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      if (!userData?.id) return;
      setUser(userData.id);

      if (!userData) return;

      const filesData = await fetchUploadFile(userData.id);
      setFiles(filesData ??[]);
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
          <a
            href={file.file_url}
            key={file.id}
            className="p-3 border border-white/10 rounded-lg mb-2"
          >
            {file.file_url}
          </a>
        ))
      )}
    </div>
  );
}
import { openDB } from "idb";

// open db
export const getDB = async () =>
  openDB("guest_db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pdfs")) {
        db.createObjectStore("pdfs", { keyPath: "id", autoIncrement: true });
      }
    },
  });

// save a guest pdf 
export const saveGuestPdf = async (file: File) => {
  const db = await getDB();
  const id = await db.add("pdfs", {
    file,
    created_at: Date.now(),
  });
  return id; 
};

// get all guest pdfs 
export const getAllGuestPdfs = async () => {
  const db = await getDB();
  return db.getAll("pdfs");
};

//  get one by id
export const getGuestPdfById = async (id: number) => {
  const db = await getDB();
  return db.get("pdfs", id);
};

//delete one 
export const deleteGuestPdf = async (id: number) => {
  const db = await getDB();
  return db.delete("pdfs", id);
};

// Clear all
export const clearGuestPdfs = async () => {
  const db = await getDB();
  return db.clear("pdfs");
};

export const updateGuestPdf = async (id: number, data: object) => {
  const db = await getDB();
  const existing = await db.get("pdfs", id);
  if (!existing) throw new Error("Guest PDF not found");
  return db.put("pdfs", { ...existing, ...data });
};
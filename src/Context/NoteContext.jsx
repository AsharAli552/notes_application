import { createContext, useState } from "react";

export const NoteContext = createContext();

export default function NoteContextProvider({ children }) {
  const [notes, setNotes] = useState(null);
  return (
    <NoteContext.Provider value={{ notes, setNotes }}>
      {children}
    </NoteContext.Provider>
  );
}

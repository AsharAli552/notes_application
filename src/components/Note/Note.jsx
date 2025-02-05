import { useContext } from "react";
import style from "./Note.module.css";
import { UserContext } from "../../Context/UserContext.jsx";
import { NoteContext } from "../../Context/NoteContext.jsx";
import { showDeleteModal, showUpdatemodal, viewModal } from "../../utils/Note.js";

export default function Note({ noteobj }) {
  const { token } = useContext(UserContext);
  const { setNotes } = useContext(NoteContext);

  const handleNoteClick = () => {
    console.log(noteobj); // Log the noteobj to ensure the description and title are available
    viewModal(noteobj);
  };

  return (
    <div className={`${style.note} note shadow`}>
      <div className="note-body" onClick={handleNoteClick}>
        <h2 className="h6 fw-semibold m-0 font-Montserrat">
          {noteobj.title}
        </h2>
        <p className="mb-0 mt-2">{noteobj.description}</p>
      </div>

      <div className="note-footer">
        <i
          className="fa-solid fa-pen-to-square pointer me-2"
          onClick={() =>
            showUpdatemodal({
              preDescription: noteobj.description,
              prevTitle: noteobj.title,
              noteID: noteobj.id,
              token,
              updater: setNotes,
            })
          }
        ></i>

        <i
          className="bi bi-archive-fill pointer"
          onClick={() =>
            showDeleteModal({ noteID: noteobj.id, token, updater: setNotes })
          }
        ></i>
      </div>
    </div>
  );
}

import axios from "axios";
import Swal from "sweetalert2";

//const API_URL = process.env.REACT_APP_API_URL;

// *=========> ADD NOTE
// ^[1] show modal [title, content]
export function showAddModal({ token, updater }) {
  Swal.fire({
    title: "Add Note 💜",
    html: `
    <input type="text" placeholder="Enter a Title" id="title" name="title" class="form-control"/>
    <textarea type="text" placeholder="Enter a Description" id="description" name="description" class="form-control mt-3"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "Add",
    showLoaderOnConfirm: true,

    preConfirm: () => {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      return { title, description };
    },

    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result); // {title: "route", content: "academy"}
    sendDataToAddNote({
      title: result.value.title,
      description: result.value.description, // Update here
      token,
      updater,
   });
  });
}

// ^[2] send data from inputs to API
async function sendDataToAddNote({ title, description, token, updater }) {
  try {
    const { data } = await axios.post(
      `https://notes-application-spring.onrender.com/api/tasks/create`,
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correct header format
          "Content-Type": "application/json",
        },
      }
    );

    if (data.id) {
      getAllNotes({ token, updater });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your Note has been added",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    console.error("Error adding note:", error.response ? error.response.data : error.message);
    Swal.fire({
      icon: "error",
      title: "Failed to add note",
      text: error.response ? error.response.data.message : "An error occurred",
    });
  }
}


// ^[3] show Notes after addition [GET NOTES]
export async function getAllNotes({ token, updater }) {
  try {
    const { data } = await axios.get(
      `https://notes-application-spring.onrender.com/api/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correct header format
          "Content-Type": "application/json",
        },
      }
    );

    // Directly pass the fetched data if it's an array or fallback to empty array
    updater(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching notes:", error);
    updater([]);  // In case of error, ensure notes is an empty array
  }
}


// !==================> Delete NOTE
// ^[1] show Modal
export function showDeleteModal({ noteID, token, updater }) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      sendDataToDelete({ noteID, token, updater });
    }
  });
}
// ^[2] send Data To Delete
async function sendDataToDelete({ noteID, token, updater }) {
  const { data } = await axios.delete(
    `https://notes-application-spring.onrender.com/api/tasks/${noteID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Correct header format
        "Content-Type": "application/json",
      },
    }
  );

  getAllNotes({ token, updater });
  Swal.fire("Deleted!", "Your Note has been deleted.", "success");
  // ^[3] get Notes after delete
}

// ?==================> Update NOTE
// *[1] show update modal [get data from inputs]
export function showUpdatemodal({
  prevTitle,
  preDescription, // Corrected parameter name
  noteID,
  token,
  updater,
}) {
  console.log("this is desc: " + preDescription);  // Check if description is passed correctly

  if (!preDescription) {
    console.error("Description is undefined or null.");
    preDescription = "";  // Assign an empty string to avoid the undefined error
  }

  Swal.fire({
    title: "Update Note 😁",
    html: `
      <input type="text" placeholder="Enter a Title" id="title" name="title" class="form-control" value="${prevTitle}"/>
      <textarea type="text" placeholder="Enter a Description" id="description" name="description" class="form-control mt-3">${preDescription}</textarea>
    `,
    showCancelButton: false,
    confirmButtonText: "Update",
    showLoaderOnConfirm: true,
    allowOutsideClick: true, // This allows closing the modal when clicking outside

    preConfirm: () => {
      const title = document.getElementById("title").value;
      const description  = document.getElementById("description").value;
      
      // Return valid data (even if fields are empty)
      return { title: title || "", description: preDescription || "" };
    },

    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.value) {
      // Ensure result.value is defined before accessing its properties
      console.log(result.value); // {title: "route", description: "academy"}
      sendUpdateData({
        noteID,
        token,
        updater,
        title: result.value.title,
        description: result.value.description,
      });
    } else {
      // Handle case where the modal was canceled or the data wasn't returned correctly
      console.error("No result returned from the modal.");
    }
  });
}





// *[2] send new title and content
async function sendUpdateData({ noteID, token, updater, title, description }) {
  try {
    const { data } = await axios.put(
      `https://notes-application-spring.onrender.com/api/tasks/update/${noteID}`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    getAllNotes({ token, updater });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your Note has been updated",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    Swal.fire({
      icon: "error",
      title: "Failed to update note",
      text: error.response ? error.response.data.message : "An error occurred",
    });
  }
}
// view the notes

export function viewModal(noteobj) {
  console.log(noteobj); // Log to check if noteobj contains description and title

  if (!noteobj) {
    console.error("viewModal: noteobj is undefined");
    return;
  }

  Swal.fire({
    title: noteobj.title || "Untitled",
    html: `<p style="text-align: left;">${noteobj.description || "No Content"}</p>`, // Check description value
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "custom-note-modal",
    },
  });
}





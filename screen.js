// ACTIVE MENU

let btns = document.querySelectorAll(".btn");
btns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        let active = document.querySelector(".active");
        if (active) {
            active.classList.remove("active");
        }

        btn.classList.add("active");
    });
});

// THEME

let themebtn = document.getElementById("themeBtn");

themebtn.addEventListener("click", function() {
    document.body.classList.toggle("clr");
});

// POPUP

let popup = document.getElementById("popup");
let add = document.getElementById("openPopup");
let close = document.getElementById("closePopup");
let cancel = document.getElementById("cancelBtn");

add.addEventListener("click", function() {
    popup.style.display = "flex";
});

close.addEventListener("click", function() {
    popup.style.display = "none";
});

cancel.addEventListener("click", function(e) {
    e.preventDefault();
    popup.style.display = "none";
});

// LOCAL STORAGE

let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editIndex = null;

// ELEMENTS

let form = document.getElementById("form");
let msg = document.querySelectorAll(".msg");

let allNotes = document.getElementById("allNotes");
let educationNotes = document.getElementById("educationNotes");
let personalNotes = document.getElementById("personalNotes");
let workNotes = document.getElementById("workNotes");
let otherNotes = document.getElementById("otherNotes");

// SAVE NOTE

form.addEventListener("submit", function(e) {

    e.preventDefault();

    msg[0].textContent = "";
    msg[1].textContent = "";

    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("description").value.trim();
    let category = document.getElementById("category").value;

    if (title === "") {
        msg[0].textContent = "Title is required";
        return;
    }

    if (description === "") {
        msg[1].textContent = "Description is required";
        return;
    }

    let note = {
        Title: title,
        description: description,
        category: category
    };

    if (editIndex !== null) {

        notes[editIndex] = note;
        editIndex = null;

    } else {

        notes.push(note);

    }

    saveNotes();

    popup.style.display = "none";

    form.reset();

    render();

    updateCount();
});

// RENDER NOTES

function render(data = notes) {

    allNotes.innerHTML = "";
    educationNotes.innerHTML = "";
    personalNotes.innerHTML = "";
    workNotes.innerHTML = "";
    otherNotes.innerHTML = "";

    data.forEach((note, index) => {

        let card = document.createElement("div");

        card.classList.add("note");

        card.innerHTML = `
            <h3>${note.Title}</h3>
            <small>${note.category}</small>
            <p class="description">${note.description}</p>

            <div class="card-btn">
                <button class="edit" data-index="${index}">
                    Edit
                </button>

                <button class="delete" data-index="${index}">
                    Delete
                </button>
            </div>
        `;

        allNotes.appendChild(card);

        let clone = card.cloneNode(true);

        if (note.category === "Education") {

            educationNotes.appendChild(clone);

        } else if (note.category === "Personal") {

            personalNotes.appendChild(clone);

        } else if (note.category === "Work") {

            workNotes.appendChild(clone);

        } else {

            otherNotes.appendChild(clone);

        }

    });
}

// DELETE & EDIT
document.addEventListener("click", function(e) {
    // DELETE
    if (e.target.classList.contains("delete")) {
        let index = e.target.dataset.index;
        notes.splice(index, 1);
        saveNotes();
        render();
        updateCount();
    }

    // EDIT

    if (e.target.classList.contains("edit")) {
        let index = e.target.dataset.index;
        document.getElementById("title").value =
            notes[index].Title;
        document.getElementById("description").value =
            notes[index].description;
        document.getElementById("category").value =
            notes[index].category;
        editIndex = index;
        popup.style.display = "flex";
    }
});

// SEARCH

let searchInput = document.getElementById("search");

searchInput.addEventListener("input", function() {

    let value = searchInput.value.toLowerCase();

    let filtered = notes.filter(note =>

        note.Title.toLowerCase().includes(value) ||

        note.description.toLowerCase().includes(value) ||

        note.category.toLowerCase().includes(value)

    );

    render(filtered);
});

// CATEGORY SWITCHING

function showSection(sectionId) {

    document.getElementById("allSection").style.display = "none";
    document.getElementById("educationSection").style.display = "none";
    document.getElementById("personalSection").style.display = "none";
    document.getElementById("workSection").style.display = "none";
    document.getElementById("othersSection").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}

// BUTTON EVENTS

document.getElementById("allBtn")
.addEventListener("click", function() {
    showSection("allSection");
});

document.getElementById("educationBtn")
.addEventListener("click", function() {
    showSection("educationSection");
});

document.getElementById("personalBtn")
.addEventListener("click", function() {
    showSection("personalSection");
});

document.getElementById("workBtn")
.addEventListener("click", function() {
    showSection("workSection");
});

document.getElementById("othersBtn")
.addEventListener("click", function() {
    showSection("othersSection");
});

// COUNT

function updateCount() {

    document.getElementById("noteCount").textContent =
        notes.length;
}

// SAVE TO LOCAL STORAGE

function saveNotes() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}

// INITIAL LOAD

render();
updateCount();
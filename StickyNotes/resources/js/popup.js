var Notes = JSON.parse(localStorage.getItem('Notes')),
    $Notes = $('#Notes'),
    $AddButton = $('#AddButton'),
    $NoteText = $('#NoteText');

function UpdateNotes() {
    localStorage.setItem('Notes', JSON.stringify(Notes));
}

function CreateNote(data) {
    $Notes.append('<div class="Note"><div class="Date">' + data.date + '<span class="RemoveButton">Remove</span></div><div class="Text">' + data.text + '</div></div>');
}

if (Notes === null) {
    Notes = {
        Data: []
    };
    UpdateNotes();
} else {
    $.each(Notes.Data, function () {
        CreateNote(this);
    });
}

$AddButton.on('click', function () {
    var Today = new Date(),
        Note = {
            date: Today.toDateString() + ' ' + Today.toLocaleTimeString(),
            text: $NoteText.val()
        };
    Notes.Data.push(Note);
    UpdateNotes();
    CreateNote(Note);
    $NoteText.val('');
});

$(document).on('click', '.RemoveButton', function () {
    var $Parent = $(this).parent().parent();
    if ($Parent.index() >= 0) {
        Notes.Data.splice($Parent.index(), 1);
        UpdateNotes();
        $Parent.remove();
    }
});
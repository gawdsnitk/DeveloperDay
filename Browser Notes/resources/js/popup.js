(function (d,w,dO,wO,$) {
    var DOM = {
        toDeleteNote: null
    },
    Functions = {
        PopulateEventViewer: function(){
            DOM.PreviousNotes.html('');
            $.each(Data.notes.notes,function(e){
                DOM.PreviousNotes.append(
                    "<div class='note'>" +
                    "<div class='date-time'>"+Data.notes.notes[e].date+" "+Data.notes.notes[e].time+"<span class='close-button'>X</span></div>" +
                    "<div class='note-content'>"+Data.notes.notes[e].content+"</div>" +
                    "</div>"
                );
            });
            $('span.close-button').bind('click',function(){
                DOM.toDeleteNote = $(this).parent().parent();
                Functions.DeleteNote();
            });
        },
        CheckLocalStorage: function(){
            if(Data.notes === null){
                localStorage.setItem('StickyNotes',JSON.stringify(Data.notesObject));
                Data.notes = JSON.parse(localStorage.getItem('StickyNotes'));
            }
        },
        /**
         * @return {string}
         */
        ParseTime: function(datetime){
            var ar = datetime.split(':'),
                hh = ar[0],
                min = ar[1],
                ampm = datetime.search('AM') ? 'AM' : 'PM';
            return ""+hh+":"+min+" "+ampm+"";
        },
        DeleteNote: function(){
            var index = DOM.toDeleteNote.index();
            console.log(index);
            Data.notes.notes.splice(index,1);
            console.log(Data.notes);
            localStorage.setItem('StickyNotes',JSON.stringify(Data.notes));
            Functions.PopulateEventViewer();
        }
    },
    Data = {
        'notesObject' : {"notes" : []}
    };
    dO.ready( function () {
        DOM.AddButton = $('#add-button');
        DOM.PreviousNotes = $('#previous-notes');
        DOM.NewNoteTextArea = $('textarea#new-note')
            .bind('focus',function(){
                DOM.AddButton.html('Add New');
            });

        Data.notes = JSON.parse(localStorage.getItem('StickyNotes'));

        Functions.CheckLocalStorage();
        Functions.PopulateEventViewer();
        DOM.AddButton.on('click',function(){
            var d = new Date();
            var CurrentObject = {
                "date": d.toDateString(),
                "time": Functions.ParseTime(d.toLocaleTimeString()),
                "content": DOM.NewNoteTextArea.val()
            };
            Data.notes.notes.push(CurrentObject);
            localStorage.setItem('StickyNotes',JSON.stringify(Data.notes));
            DOM.NewNoteTextArea.val('');
            DOM.AddButton.html('Added Successfully');
            Functions.PopulateEventViewer();
        });
        $('span.close-button').bind('click',function(){
            DOM.toDeleteNote = $(this).parent().parent();
            Functions.DeleteNote();
        });
    });
})(document,window,jQuery(document),jQuery(window),jQuery);
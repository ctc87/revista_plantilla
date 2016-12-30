$(function()
{
    var numMails = 1;  // número inicial de emails
    var maxMails = 2;  // número maximo de emails
    var minMails = 1;  // número minimo de emails
    $(document).on('click', '.btn-add-mail', function(e)
    {
        
        e.preventDefault();
        if(numMails < maxMails) {
            numMails++;
            var controlForm = $('.controls .grow:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);
        }

        newEntry.find('input').val('');
        if(numMails < (maxMails + 1)) {
            if(numMails < maxMails) {
                controlForm.find('.entry:not(:last) .btn-add-mail')
                    .removeClass('btn-add-mail').addClass('btn-remove-mail')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');
            } else {
                newEntry.find('.btn-add-mail')
                    .removeClass('btn-add-mail').addClass('btn-remove-mail')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');
                controlForm.find('.entry:not(:last) .btn-add-mail')
                    .removeClass('btn-add-mail').addClass('btn-remove-mail')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');
            }
        }
    }).on('click', '.btn-remove-mail', function(e)
    {
		$(this).parents('.entry:first').remove();
        numMails--;
        if(numMails == minMails) {            
          $('.controls .btn-remove-mail')
                    .removeClass('btn-remove-mail').addClass('btn-add-mail')
                    .removeClass('btn-danger').addClass('btn-success')
                    .html('<span class="glyphicon glyphicon-plus"></span>');   
        }
		e.preventDefault();
		return false;
	});
});

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

/* bloque de codigo para el jade */

// .col-sm-8
//                   label.control-label(for='fields') Mails(Max:2)
//                     #fields.control-group
//                       .controls
//                         .grow
//                           .entry.input-group
//                             input.exampleInputEmail1.form-control(value="g@g" name='mails[]', type='email', placeholder='Mail', aria-describedby="emailHelp")
//                             span.input-group-btn
//                               button.btn.btn-success.btn-add-mail.btn-lg(type='button')
//                                 span.glyphicon.glyphicon-plus


/** sql **/

// -- create table telefonos (
// --     telefono varchar(20),
// --     id_cliente MEDIUMINT NOT NULL,
// --     PRIMARY KEY (telefono),
// --     FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
// -- );

// -- create table emails(
// --     mail VARCHAR(200),
// --     id_cliente MEDIUMINT NOT NULL,
// --     PRIMARY KEY (mail),
// --     FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
// -- );

/** nodejs */

  
  
  //   var crearArrayMails = function(_id_cliente, completed, callback) {
  //   var arrayMails = [];
  //   var queryMails = 'Select mail from emails where id_cliente = ' + _id_cliente;
  //   interfaceDB.connection.query(queryMails, function(err, mails, fields) {
  //     if (!err) {
  //       for(var j = 0; j < mails.length; j++) {
  //         arrayMails.push(mails[j].mail)
  //       }
  //       if(completed) {
  //         callback();
  //       }
  //     } else {
  //       console.log('Error en la obtención de los emails.');
  //     }
  //   });
  //   return arrayMails;
  // }
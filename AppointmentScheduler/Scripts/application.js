$(document).ready(function () {
    initializeScheduler();
    initializeEvents();
    
    function initializeEvents() {
        $("#addpatient").click(openAddPatientModal);
        $("#addstaff").click(openAddStaffModal);
        $("#addspecialty").click(openAddSpecialtyModal);
    }

    function openAddPatientModal() {
        $("#patientdob").datepicker();
        //clear user form
        $('#patientfirstname').val('');
        $('#patientlastname').val('');
        $('#patientdob').val('');

        $("#adduser-form").dialog({
            autoOpen: true,
            height: 'auto',
            width: 350,
            modal: true,
            buttons: {
                "Add": userExists,
                Cancel: function () {
                    $("#adduser-form").dialog("close");
                }
            }
        });
    }

    function userExists() {
        if (validateUser()) {
            clearUserErrors();
            var firstname = $('#patientfirstname').val();
            var lastname = $('#patientlastname').val();
            $.ajax({
                method: "POST",
                url: "/Home/UserExists",
                data: { firstname: firstname, lastname: lastname }
            }).done(function (exists) {
                if (exists == "True") {
                    $('.patientExistsError').removeClass('hide');
                }
                else {
                    addUser();
                }
            });
        }
    }

    function validateUser() {
        var isValid = true;            
        clearUserErrors();
        var firstname = $('#patientfirstname').val();
        var lastname = $('#patientlastname').val();
        var dob = $('#patientdob').val();
        if (firstname == '') {
            $('.patientFirstNameError').removeClass('hide');
            isValid = false;
        }

        if (lastname == '') {
            $('.patientLastNameError').removeClass('hide');
            isValid = false;
        }

        if (dob == '') {
            $('.patientDOBError').removeClass('hide');
            isValid = false;
        }
        return isValid;
    }

    function clearUserErrors() {
        $('.patientFirstNameError').addClass('hide');
        $('.patientLastNameError').addClass('hide');
        $('.patientDOBError').addClass('hide');
        $('.patientExistsError').addClass('hide');
    }

    function openAddStaffModal() {
        fetchSpecialty();
        addStaffClearErrors();
        // clear form
        $('#staffFirstname').val('');
        $('#staffLastname').val('');
        $('#staffSpecialty').val('');

        $("#addstaff-form").dialog({
            autoOpen: true,
            height: 'auto',
            width: 350,
            modal: true,
            buttons: {
                "Add": checkStaff,
                Cancel: function () {
                    $("#addstaff-form").dialog("close");
                }
            }
        });
    }

    function checkStaff() {
        if (validateStaff()) {
            var existsElement = $('.staffexists');
            existsElement.addClass('hide');
            var firstname = $('#staffFirstname').val();
            var lastname = $('#staffLastname').val();
            $.ajax({
                method: "POST",
                url: "/Home/StaffExists",
                data: { firstname: firstname, lastname: lastname }
            }).done(function (exists) {
                if (exists == "True") {
                    existsElement.removeClass('hide');
                }
                else {
                    addStaff();
                }
            });
        }
    }

    function validateStaff() {
        var isValid = true;
        addStaffClearErrors();
        var firstnameErrorElement = $('.staffFirstNameError');
        var lastnameErrorElement = $('.staffLastNameError');
        var specialtyErrorElement = $('.staffSpecialtyError');
        var firstname = $('#staffFirstname').val();
        var lastname = $('#staffLastname').val();
        var specialty = $('#staffSpecialty').val();

        if (firstname == '') {
            firstnameErrorElement.removeClass('hide');
            isValid = false;
        }

        if (lastname == '') {
            lastnameErrorElement.removeClass('hide');
            isValid = false;
        }

        if (specialty == '') {
            specialtyErrorElement.removeClass('hide');
            isValid = false;
        }
        return isValid;
    }

    function addStaffClearErrors() {
        var firstnameErrorElement = $('.staffFirstNameError');
        var lastnameErrorElement = $('.staffLastNameError');
        var specialtyErrorElement = $('.staffSpecialtyError');
        firstnameErrorElement.addClass('hide');
        lastnameErrorElement.addClass('hide');
        specialtyErrorElement.addClass('hide');
        $('.staffexists').addClass('hide');
    }

    function openAddSpecialtyModal() {
        var addSubspecialtyElement = $('#addSubspecialty');
        addSubspecialtyElement.unbind();
        addSubspecialtyElement.click(addSubSpecialtyClick);

        // reset form
        $('#specialtyName').val('');        
        $('#subspecialtyName').val('');
        $('#newsubspecialities').find('option').remove();
        $('.addSpecialtyError').addClass('hide');
        $('.addSpecialtyExists').addClass('hide');
        $('.addSubspecialtyerror').addClass('hide');

        $("#addspecialty-form").dialog({
            autoOpen: true,
            height: 'auto',
            width: 350,
            modal: true,
            buttons: {
                "Add": checkSpecialty,
                Cancel: function () {
                    $("#addspecialty-form").dialog("close");
                }
            }
        });
    }

    function addSubSpecialtyClick() {
        var errorElement = $('.addSubspecialtyerror');
        var subspecialtyname = $('#subspecialtyName').val();
        errorElement.addClass('hide');        
        if (subspecialtyname != '') {
            $('#newsubspecialities')
                .append($("<option></option>")
                    .text(subspecialtyname));
            $('#subspecialtyName').val('');
        }
        else {
            errorElement.removeClass("hide");
        }
    }

    function fetchSpecialty() {
        $.ajax({
            method: "POST",
            url: "/Home/GetSpecialties"
        }).done(function (specialties) {
            var specialtyElement = $('#staffSpecialty');
            specialtyElement.find('option').remove();
            for (i = 0; i < specialties.length; i++) {
                specialtyElement.append($("<option></option>")
                    .attr("value", specialties[i].Id)
                    .text(specialties[i].Name));
            }
        });
    }

    function addUser() {
        var firstname = $('#patientfirstname').val();
        var lastname = $('#patientlastname').val();
        var dob = $('#patientdob').val();
        $.ajax({
            method: "POST",
            url: "/Home/AddPatient",
            data: { FirstName: firstname, LastName: lastname, DateOfBirth: dob }
        }).done(function () {
            $("#adduser-form").dialog("close");
        });
    }

    function addSpecialty() {        
        var name = $('#specialtyName').val();
        var subSpecialties = new Array();
        $('#newsubspecialities > option').each(function () {
            subSpecialties.push($(this).text());
        });
        $.ajax({
            method: "POST",
            url: "/Home/AddSpecialty",
            data: { Name: name, subspec: subSpecialties }
        }).done(function () {
            $("#addspecialty-form").dialog("close");
        });
    }

    function checkSpecialty() {
        if (isValidSpecialty()) {
            var name = $('#specialtyName').val();
            $('.addSpecialtyExists').addClass('hide');
            $.ajax({
                method: "POST",
                url: "/Home/SpecialtyExists",
                data: { Name: name }
            }).done(function (exists) {
                if (exists == "True") {
                    $('.addSpecialtyExists').removeClass('hide');
                }
                else {
                    addSpecialty();
                }
            });
        }
    }

    function isValidSpecialty() {
        var isValid = true;
        var subSpecialtyErrorElement = $('.addSubspecialtyerror');
        var specialtyErrorElement = $('.addSpecialtyError');        
        var specialtyname = $('#specialtyName').val();
        var hasSubSpecialty = $('#newsubspecialities').has('option').length != 0
        subSpecialtyErrorElement.addClass('hide');
        specialtyErrorElement.addClass('hide');

        if (specialtyname == '') {
            specialtyErrorElement.removeClass('hide');
            isValid = false;
        }
        if (!hasSubSpecialty) {
            subSpecialtyErrorElement.removeClass('hide');
            isValid = false;
        }
        return isValid;
    }

    function addStaff() {
        var firstname = $('#staffFirstname').val();
        var lastname = $('#staffLastname').val();
        var specialtyId = $('#staffSpecialty').val();
        $.ajax({
            method: "POST",
            url: "/Home/AddStaff",
            data: { FirstName: firstname, LastName: lastname, SpecialtyId: specialtyId }
        }).done(function () {
            $("#addstaff-form").dialog("close");
        });
    }

    function getSchedulerAdapter() {
        var source =
            {
                dataType: 'json',
                dataFields: [
                    { name: 'id', type: 'string' },
                    { name: 'subject', type: 'string' },
                    { name: 'start', type: 'date' },
                    { name: 'end', type: 'date' },
                    { name: 'dob', type: 'date' },
                    { name: 'patientFirstName', type: 'string' },
                    { name: 'patientLastName', type: 'string' },
                    { name: 'patientId', type: 'int' },
                    { name: 'staffFirstName', type: 'string' },
                    { name: 'staffLastName', type: 'string' },
                    { name: 'staffId', type: 'int' },
                    { name: 'serviceProvided', type: 'string' },
                    { name: 'specialtyId', type: 'int' },
                    { name: 'specialty', type: 'string' },
                    { name: 'serviceProvidedId', type: 'int' }
                ],
                id: 'id',
                url: '/Home/GetAppointments'
            };
        return new $.jqx.dataAdapter(source);
    }

    function refreshScheduler() {
        var adapter = getSchedulerAdapter();
        $("#scheduler").jqxScheduler({
            source: adapter
        });
    }

    function initializeScheduler() {
        var adapter = getSchedulerAdapter();
        var scheduler = $("#scheduler");
        scheduler.jqxScheduler({
            date: new $.jqx.date(new Date()),
            width: 950,
            height: 600,
            source: adapter,
            editDialog: false,
            appointmentDataFields:
            {
                from: "start",
                to: "end",
                id: "id",
                subject: "subject",
                patientFirstName: "patientFirstName",
                patientLastName: "patientLastName",
                patientId: "patientId",
                staffFirstName: "staffFirstName",
                staffLastName: "staffLastName",
                staffId: "staffId",
                serviceProvided: "serviceProvided",
                specialty: "specialty",
                specialtyId: "specialtyId",
                serviceProvidedId: "serviceProvidedId",
                dob: "dob"
            },
            view: 'weekView',
            appointmentsMinHeight: 20,
            views:
            [
                { type: 'dayView', timeRuler: { formatString: 'hh tt' } },
                { type: 'weekView', timeRuler: { formatString: 'hh tt' } }
            ]
        });

        scheduler.on('cellDoubleClick', function (event) {
            openCreateAppointmentDialog(event.args.date);
        });

        scheduler.on('appointmentDoubleClick', function (event) {
            openEditAppointmentDialog(event.args.appointment);
        });
    }

    function openCreateAppointmentDialog(date) {
        clearAppointmentDialog();
        var appointmentModal = $("#appointment-form");
        var fromdatePicker = $("#fromDatetime");
        var todatePicker = $("#toDatetime");

        appointmentModal.attr("title", "Create Appointment");
        fromdatePicker.val(date.toDate());
        todatePicker.val(date.addMinutes(30).toDate());
        fromdatePicker.jqxDateTimeInput({ formatString: 'dd/MM/yyyy hh:mm tt' });
        todatePicker.jqxDateTimeInput({ formatString: 'dd/MM/yyyy hh:mm tt' });        
        initializePatientAutoComplete(appointmentModal);
        initializeStaffAutoComplete(appointmentModal);

        appointmentModal.dialog({
            autoOpen: true,
            height: 'auto',
            width: 350,
            modal: true,
            buttons: {
                "Create": checkAppointment,
                Cancel: function () {
                    appointmentModal.dialog("close");
                }
            }
        });
    }
    
    function populateSubSpecialtyOnStaffChange(staffId, serviceProvidedId) {
        $.ajax({
            method: "POST",
            url: "/Home/GetSubSpecialties",
            data: { staffId: staffId }
        }).done(function (subSpecialties) {
            var serviceProvidedElement = $('#serviceProvided');
            serviceProvidedElement.find('option').remove();
            for (i = 0; i < subSpecialties.length; i++) {
                serviceProvidedElement.append($("<option></option>")
                    .attr("value", subSpecialties[i].Id)
                    .text(subSpecialties[i].Name));
            }

            if (serviceProvidedId) {
                $('#serviceProvided').val(serviceProvidedId);
            }
        });
    }

    function initializePatientAutoComplete(parentElement) {
        $('#patientName').autocomplete({
            source: function (request, response) {                
                $.ajax({
                    method: "POST",
                    url: "/Home/SearchPatient",
                    data: { searchKey: request.term },
                    success: response
                });
            },
            appendTo: parentElement,
            select: function (event, ui) {
                $('#patientName').val(ui.item.FirstName + ", " + ui.item.LastName);
                $('#patientId').val(ui.item.Id);
            }
        })
        .autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div>" + item.FirstName + ", " + item.LastName + "</div>")
                .appendTo(ul);
        };
    }

    function initializeStaffAutoComplete(parentElement) {
        $('#staffName').autocomplete({
            source: function (request, response) {
                $.ajax({
                    method: "POST",
                    url: "/Home/SearchStaff",
                    data: { searchKey: request.term },
                    success: response
                });
            },
            appendTo: parentElement,
            select: function (event, ui) {
                $('#staffName').val(ui.item.FirstName + ", " + ui.item.LastName);
                $('#staffId').val(ui.item.Id);
                populateSubSpecialtyOnStaffChange(ui.item.Id);
            }
        })
        .autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div>" + item.FirstName + ", " + item.LastName + "</div>")
                .appendTo(ul);
        };
    }

    function openEditAppointmentDialog(appointment) {
        clearAppointmentDialog();
        var appointmentModal = $("#appointment-form");
        appointmentModal.attr("title", "Edit Appointment");
        populateAppointmentData(appointment);
        $("#fromDatetime").jqxDateTimeInput({ formatString: 'dd/MM/yyyy HH:mm' });
        $("#toDatetime").jqxDateTimeInput({ formatString: 'dd/MM/yyyy HH:mm' });
        initializePatientAutoComplete(appointmentModal);
        initializeStaffAutoComplete(appointmentModal);
        appointmentModal.dialog({
            autoOpen: true,
            height: 'auto',
            width: 350,
            modal: true,
            buttons: {
                "Update": checkAppointment,
                "Delete": deleteAppointment,
                Cancel: function () {
                    appointmentModal.dialog("close");
                }
            }
        });
    }

    function deleteAppointment() {
        var id = $('#appointmentId').val();
        $.ajax({
            method: "POST",
            url: "/Home/DeleteAppointment",
            data: { appointmentId: id }
        }).done(function () {
            refreshScheduler();
            $("#appointment-form").dialog("close");
        });
    }

    function validateAppointment() {
        var isValid = true;
        clearappointmentErrors();
        var appointmentSummary = $('#appointmentSummary').val();
        var patientId = $('#patientId').val();
        var staffId = $('#staffId').val();
        var serviceProvided = $('#serviceProvided').val();
        var fromDate = $('#fromDatetime').val();
        var toDate = $('#toDatetime').val();

        if (appointmentSummary == '') {
            $('.appointmentSummaryerror').removeClass('hide');
            isValid = false;
        }

        if (patientId == '') {
            $('.appointmentPatientNameError').removeClass('hide');
            isValid = false;
        }

        if (staffId == '') {
            $('.appointmentStaffNameError').removeClass('hide');
            isValid = false;
        }

        if (serviceProvided == '' || serviceProvided == null) {
            $('.appointmentServiceProvidedError').removeClass('hide');
            isValid = false;
        }

        if (fromDate == '') {
            $('.appointmentFromDateError').removeClass('hide');
            isValid = false;
        }

        if (toDate == '') {
            $('.appointmentToDateError').removeClass('hide');
            isValid = false;
        }
        return isValid;
    }

    function populateAppointmentData(appointment) {
        populateSubSpecialtyOnStaffChange(appointment.staffId, appointment.serviceProvidedId);
        $('#appointmentId').val(appointment.id);
        $('#patientId').val(appointment.patientId);
        $('#staffId').val(appointment.staffId);        
        $('#appointmentSummary').val(appointment.subject);
        $('#patientName').val(appointment.patientFirstName + " " + appointment.patientLastName);
        $('#staffName').val(appointment.staffFirstName + " " + appointment.staffLastName);
        $('#serviceProvided').val(appointment.serviceProvidedId);
        $('#fromDatetime').val(appointment.from.toDate());
        $('#toDatetime').val(appointment.to.toDate());
    }

    function clearAppointmentDialog() {
        clearappointmentErrors();
        $('#appointmentId').val('');
        $('#patientId').val('');
        $('#staffId').val('');
        $('#appointmentSummary').val('');
        $('#patientName').val('');
        $('#staffName').val('');
        $('#serviceProvided').val('');
        $('#fromDatetime').val('');
        $('#toDatetime').val('');
    }

    function clearappointmentErrors() {
        $('.appointmentSummaryerror').addClass('hide');
        $('.appointmentPatientNameError').addClass('hide');
        $('.appointmentStaffNameError').addClass('hide');
        $('.appointmentServiceProvidedError').addClass('hide');
        $('.appointmentFromDateError').addClass('hide');
        $('.appointmentToDateError').addClass('hide');
        $('.appointmenterror').addClass('hide');
    }

    function checkAppointment() {
        if (validateAppointment()) {
            var appointmentId = $('#appointmentId').val();
            var appointmentSummary = $('#appointmentSummary').val();
            var patientId = $('#patientId').val();
            var staffId = $('#staffId').val();
            var serviceProvided = $('#serviceProvided').val();
            var fromDate = $('#fromDatetime').val();
            var toDate = $('#toDatetime').val();

            $.ajax({
                method: "POST",
                url: "/Home/ValidateAppointment",
                data: { Id: appointmentId, Subject: appointmentSummary, From: fromDate, To: toDate, StaffId: staffId, PatientId: patientId, ServiceProvidedId: serviceProvided }
            }).done(function (isValid) {
                if (isValid == "True") {
                    createUpdateAppointment();
                }
                else {
                    $('.appointmenterror').removeClass('hide');
                }
            });
        }
    }

    function createUpdateAppointment() {
        var appointmentId = $('#appointmentId').val();
        var appointmentSummary = $('#appointmentSummary').val();
        var patientId = $('#patientId').val();
        var staffId = $('#staffId').val();
        var serviceProvided = $('#serviceProvided').val();
        var fromDate = $('#fromDatetime').val();
        var toDate = $('#toDatetime').val();

        $.ajax({
            method: "POST",
            url: "/Home/SaveAppointment",
            data: { Id: appointmentId, Subject: appointmentSummary, From: fromDate, To: toDate, StaffId: staffId, PatientId: patientId, ServiceProvidedId: serviceProvided }
        }).done(function (appointment) {
            refreshScheduler();
            $("#appointment-form").dialog("close");
        });
    }

    function createAppointmentObject(app) {
        var appointment = {
            id: app.id,
            subject: app.subject,
            start: new Date(app.start),
            end: new Date(app.end),
            patientFirstName: app.patientFirstName,
            patientLastName: app.patientLastName,
            patientId: app.patientId,
            dob: new Date(app.dob),
            staffFirstName: app.staffFirstName,
            staffLastName: app.staffLastName,
            staffId: app.staffId,
            specialty: app.specialty,
            specialtyId: app.specialtyId,
            serviceProvided: app.serviceProvided,
            serviceProvidedId: app.serviceProvidedId
        }
        return appointment;
    }
});
using AppointmentScheduler.Data;
using System;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace AppointmentScheduler.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public int AddPatient(Patient patient)
        {
            return DataStore.InsertPatient(patient);
        }

        [HttpPost]
        public int AddStaff(Staff staff)
        {
            return DataStore.InsertStaff(staff);
        }

        [HttpPost]
        public int AddSpecialty(Specialty specialty)
        {
            return DataStore.InsertSpecialty(specialty);
        }

        [HttpPost]
        public ActionResult GetSpecialties()
        {
            return Json(DataStore.Specialties);
        }

        public bool SpecialtyExists(string name)
        {
            return DataStore.Specialties.Find(s => s.Name.ToLower() == name.ToLower()) != null;
        }

        public bool StaffExists(string firstname, string lastname)
        {
            return DataStore.Staffs
                .Find(s => s.FirstName.ToLower() == firstname.ToLower() && s.LastName.ToLower() == lastname.ToLower()) != null;
        }

        public bool UserExists(string firstname, string lastname)
        {
            return DataStore.Patients
                .Find(s => s.FirstName.ToLower() == firstname.ToLower() && s.LastName.ToLower() == lastname.ToLower()) != null;
        }

        [HttpPost]
        public ActionResult GetSubSpecialties(int staffId)
        {
            int specialtyId = DataStore.GetSpecialtyId(staffId);
            return Json(DataStore.Specialties.Find(s => s.Id == specialtyId).SubSpecialties);
        }

        [HttpPost]
        public void DeleteAppointment(int appointmentId)
        {
            DataStore.Appointments.Remove(DataStore.Appointments.Find(a => a.Id == appointmentId));
        }

        [HttpPost]
        public int SaveAppointment(Appointment appointment)
        {
            int appointmentId = DataStore.InsertAppointment(appointment);            
            return appointmentId;
        }

        public bool ValidateAppointment(Appointment appointment)
        {
            bool isValid = true;
            string specialtyName = DataStore.GetSpecialtyName(appointment.StaffId);
            DateTime zeroTime = new DateTime(1, 1, 1);
            DateTime datetime = DataStore.GetPatientDOB(appointment.PatientId);
            TimeSpan span = DateTime.Now - datetime;
            int years = (zeroTime + span).Year - 1;

            if (years >= 70 && specialtyName.ToLower() != "geriatrics")
            {
                isValid = false;
            }
            return isValid;
        }

        [HttpPost]
        public ActionResult SearchPatient(string searchKey)
        {
            return Json(DataStore.SearchPatient(searchKey));
        }

        [HttpPost]
        public ActionResult SearchStaff(string searchKey)
        {
            return Json(DataStore.SearchStaff(searchKey));
        }

        public ActionResult GetAppointments()
        {
            var appointments = DataStore.Appointments.Select(a => new
            {
                id = a.Id,
                subject = a.Subject,
                start = a.From.ToString("MM/dd/yyyy HH:mm", CultureInfo.InvariantCulture),
                end = a.To.ToString("MM/dd/yyyy HH:mm", CultureInfo.InvariantCulture),
                patientFirstName = DataStore.GetPatientFirstName(a.PatientId),
                patientLastName = DataStore.GetPatientLastName(a.PatientId),
                patientId = a.PatientId,
                dob = DataStore.GetPatientDOB(a.PatientId).ToString("MM/dd/yyyy HH:mm", CultureInfo.InvariantCulture),
                staffFirstName = DataStore.GetStaffFirstName(a.StaffId),
                staffLastName = DataStore.GetStaffLastName(a.StaffId),
                staffId = a.StaffId,
                specialty = DataStore.GetSpecialtyName(a.StaffId),
                specialtyId = DataStore.GetSpecialtyId(a.StaffId),
                serviceProvided = DataStore.GetSubSpecialtyName(DataStore.GetSpecialtyId(a.StaffId), a.ServiceProvidedId),
                serviceProvidedId = a.ServiceProvidedId
            });

            return Json(appointments, JsonRequestBehavior.AllowGet);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;

namespace AppointmentScheduler.Data
{
    public static class DataStore
    {
        static DataStore()
        {
            PopulateDataStore();
        }

        public static List<Patient> Patients { get; set; }
        public static List<Staff> Staffs { get; set; }
        public static List<Appointment> Appointments { get; set; }
        public static List<Specialty> Specialties { get; set; }

        public static bool PatientExists(string firstname, string lastname)
        {
            return Patients
                .Where(p => p.FirstName == firstname && p.LastName == lastname)
                .Count() > 1;
        }

        public static bool StaffExists(string firstname, string lastname)
        {
            return Staffs
                .Where(s => s.FirstName == firstname && s.LastName == lastname)
                .Count() > 0;
        }

        public static bool ValidateAppointment(Appointment appointment)
        {
            return true;
        }

        public static int InsertPatient(Patient patient)
        {
            if (patient.Id == 0)
            {
                patient.Id = GetNewPatientId();
                Patients.Add(patient);
            }
            return patient.Id;
        }

        public static int InsertStaff(Staff staff)
        {
            if (staff.Id == 0)
            {
                staff.Id = GetNewStaffId();
                Staffs.Add(staff);
            }
            return staff.Id;
        }

        public static int InsertSpecialty(Specialty specialty)
        {
            if (specialty.Id == 0)
            {
                specialty.Id = GetNewSpecialtyId();
                int subSpecialtyId = 1;
                foreach(var subspecialtyname in specialty.subspec)
                {
                    specialty.SubSpecialties.Add(new SubSpecialty
                    {
                        Id = subSpecialtyId,
                        Name = subspecialtyname
                    });
                    subSpecialtyId += 1;
                }
                Specialties.Add(specialty);
            }
            return specialty.Id;
        }

        public static int InsertSubSpecialty(int specialtyId, SubSpecialty subSpecialty)
        {
            if (specialtyId != 0 && subSpecialty.Id == 0)
            {
                Specialty specialty = Specialties.Find(s => s.Id == specialtyId);
                subSpecialty.Id = GetNewSubSpecialtyId(specialtyId);
                specialty.SubSpecialties.Add(subSpecialty);
            }
            return subSpecialty.Id;
        }

        public static int InsertAppointment(Appointment appointment)
        {
            if (appointment.Id == 0)
            {
                appointment.Id = GetNewAppointmentId();
                Appointments.Add(appointment);
            }
            else
            {
                var app = Appointments.Find(a => a.Id == appointment.Id);
                app.Subject = appointment.Subject;
                app.PatientId = appointment.PatientId;
                app.StaffId = appointment.StaffId;
                app.ServiceProvidedId = appointment.ServiceProvidedId;
                app.From = appointment.From;
                app.To = appointment.To;
            }
            return appointment.Id;
        }

        private static int GetNewPatientId()
        {
            return Patients
                .Select(p => p.Id)
                .OrderByDescending(x => x)
                .FirstOrDefault() + 1;
        }

        public static int GetNewStaffId()
        {
            return Staffs
                .Select(s => s.Id)
                .OrderByDescending(s => s)
                .FirstOrDefault() + 1;
        }
        
        public static List<Patient> SearchPatient(string searchString)
        {
            searchString = searchString.ToLower();
            return Patients
                .Where(p => p.FirstName.ToLower().Contains(searchString) || p.LastName.ToLower().Contains(searchString))
                .ToList();
        }

        public static List<Staff> SearchStaff(string searchString)
        {
            searchString = searchString.ToLower();
            return Staffs
                .Where(s => s.FirstName.ToLower().Contains(searchString) || s.LastName.ToLower().Contains(searchString))
                .ToList();
        }

        private static int GetNewSpecialtyId()
        {
            return Specialties
                .Select(s => s.Id)
                .OrderByDescending(s => s)
                .FirstOrDefault() + 1;
        }

        private static int GetNewSubSpecialtyId(int specialtyId)
        {
            return Specialties
                .Where(s => s.Id == specialtyId)
                .SelectMany(s => s.SubSpecialties)
                .Select(s => s.Id)
                .OrderByDescending(s => s)
                .FirstOrDefault() + 1;
        }

        private static int GetNewAppointmentId()
        {
            return Appointments
                .Select(a => a.Id)
                .OrderByDescending(a => a)
                .FirstOrDefault() + 1;
        }

        private static string GetPatientName(int patientId)
        {
            Patient patient = Patients.Find(p => p.Id == patientId);
            return string.Format("{0}, {1}", patient.FirstName, patient.LastName);
        }

        private static string GetStaffName(int staffId)
        {
            Staff staff = Staffs.Find(s => s.Id == staffId);
            return string.Format("{0}, {1}", staff.FirstName, staff.LastName);
        }

        public static int GetSpecialtyId(int staffId)
        {
            Staff staff = Staffs.Find(s => s.Id == staffId);
            return staff.SpecialtyId;
        }

        public static string GetSpecialtyName(int staffId)
        {
            return Specialties.Find(s => s.Id == GetSpecialtyId(staffId)).Name;
        }

        public static string GetPatientFirstName(int patientId)
        {
            return Patients.Find(p => p.Id == patientId).FirstName;
        }

        public static string GetPatientLastName(int patientId)
        {
            return Patients.Find(p => p.Id == patientId).LastName;
        }

        public static string GetStaffFirstName(int staffId)
        {
            return Staffs.Find(s => s.Id == staffId).FirstName;
        }

        public static string GetStaffLastName(int staffId)
        {
            return Staffs.Find(s => s.Id == staffId).LastName;
        }

        public static DateTime GetPatientDOB(int patientId)
        {
            return Patients.Find(p => p.Id == patientId).DateOfBirth;
        }
        public static string GetSubSpecialtyName(int specialtyId, int subspecialtyId)
        {
            return Specialties
                .Find(s => s.Id == specialtyId).SubSpecialties
                .Find(sub => sub.Id == subspecialtyId)
                .Name;
        }

        private static void PopulateDataStore()
        {
            PopulatePatientData();
            PopulateSpecialtyData();
            PopulateStaffData();
            PopulateAppointmentData();
        }

        private static void PopulatePatientData()
        {
            Patients = new List<Patient>();
            Patients.Add(new Patient
            {
                Id = 1,
                FirstName = "Lee",
                LastName = "Ross",
                DateOfBirth = new DateTime(1988, 07, 03)
            });
            Patients.Add(new Patient
            {
                Id = 2,
                FirstName = "Michael",
                LastName = "Warne",
                DateOfBirth = new DateTime(1978, 02, 20)
            });
        }

        private static void PopulateStaffData()
        {
            Staffs = new List<Staff>();
            Staffs.Add(new Staff
            {
                Id = 1,
                FirstName = "Lisa",
                LastName = "Ale",
                SpecialtyId = 1
            });
            Staffs.Add(new Staff
            {
                Id = 2,
                FirstName = "Alexis",
                LastName = "Tax",
                SpecialtyId = 1
            });
        }

        private static void PopulateSpecialtyData()
        {
            Specialties = new List<Specialty>();
            Specialties.Add(new Specialty
            {
                Id = 1,
                Name = "Cardiology",
                SubSpecialties = new List<SubSpecialty>
                {
                    new SubSpecialty
                    {
                        Id = 1,
                        Name = "Measure Heart Pulse"
                    }
                }
            });
        }

        private static void PopulateAppointmentData()
        {
            Appointments = new List<Appointment>();
            DateTime from = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, 00, 00);
            DateTime to = from.AddMinutes(30);
            Appointments.Add(new Appointment
            {
                Id = 1,
                Subject = "Heart Checkup",
                From = from,
                To = to,
                PatientId = 1,
                ServiceProvidedId = 1,
                StaffId = 1,
                PatientName = GetPatientName(1),
                StaffName = GetStaffName(1),
                ServiceProvided = GetSubSpecialtyName(GetSpecialtyId(1), 1)
            });
        }
    }
}
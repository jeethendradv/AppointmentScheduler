using System;

namespace AppointmentScheduler.Data
{
    public class Appointment
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public int StaffId { get; set; }
        public int PatientId { get; set; }
        public int ServiceProvidedId { get; set; }
        public string PatientName { get; set; }
        public string StaffName { get; set; }
        public string ServiceProvided { get; set; }
    }
}
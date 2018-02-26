using System.Collections.Generic;

namespace AppointmentScheduler.Data
{
    public class Specialty
    {
        public Specialty()
        {
            SubSpecialties = new List<SubSpecialty>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public List<SubSpecialty> SubSpecialties { get; set; }
        public string[] subspec { get; set; }
    }
}
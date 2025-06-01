namespace BO.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation Property (1 Role -> Many Students)
        public ICollection<User> User { get; set; }
    }
}

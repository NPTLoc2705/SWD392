namespace BO.dtos.Response
{
    public class FAQResponse
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
    }
}
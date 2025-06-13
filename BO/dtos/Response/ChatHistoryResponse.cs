using System;

namespace BO.Dtos.Response
{
    public class ChatHistoryResponse
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Response { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
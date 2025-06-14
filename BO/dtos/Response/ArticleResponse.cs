using System;

namespace BO.dtos.Response
{
    public class ArticleResponse
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImagePath { get; set; } 
        public int PublishedBy { get; set; }
        public string AuthorName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
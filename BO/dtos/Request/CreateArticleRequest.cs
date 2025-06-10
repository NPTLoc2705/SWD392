using System.ComponentModel.DataAnnotations;

namespace BO.dtos.Request
{
    public class CreateArticleRequest
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }

        public int PublishedBy { get; set; }
    }
}

namespace CleanArchitecture.Core.Features.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryIcon { get; set; } = string.Empty;

    }
}

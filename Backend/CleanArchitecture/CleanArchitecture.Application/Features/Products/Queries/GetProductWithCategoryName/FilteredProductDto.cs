using System.Collections.Generic;

public class FilteredProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PricePerWeek { get; set; }
    public double PricePerMonth { get; set; }
    public bool IsRent { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<string> ProductImageUrls { get; set; } = new();
}

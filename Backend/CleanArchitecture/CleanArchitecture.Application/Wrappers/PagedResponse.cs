using System.Collections.Generic;

namespace CleanArchitecture.Core.Wrappers
{
    public class PagedResponse<T> 
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public T Data { get; set; }

        public PagedResponse(T data, int pageNumber, int pageSize)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Data = data;
        }
    }
}

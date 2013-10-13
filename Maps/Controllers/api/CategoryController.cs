using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Maps.Models;

namespace Maps.Controllers.api
{
    public class CategoryController : ApiController
    {
        private MapsEntities _db = new MapsEntities();

        // GET api/location
        public IEnumerable<Category> Get()
        {
            var rv = _db.Categories;
            return rv;
        }

        // GET api/location/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/location
        public void Post([FromBody]string value)
        {
        }

        // PUT api/location/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/location/5
        public void Delete(int id)
        {
        }
    }
}

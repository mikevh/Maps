using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Maps.Startup))]
namespace Maps
{
    public partial class Startup 
    {
        public void Configuration(IAppBuilder app) 
        {
            ConfigureAuth(app);
        }
    }
}

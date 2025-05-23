using backend.Repositories.Entities;
using backend.Services.Entities;
using ReserveiAPI.Repositories.Interfaces;
using ReserveiAPI.Services.Interfaces;

namespace ReserveiAPI.Services.Server 
{
    public static class DependenciesInjection
    {
        public static void AddUserDependencies(this IServiceCollection services)
        {
            // Dependência: usuário
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
        }
    }
}

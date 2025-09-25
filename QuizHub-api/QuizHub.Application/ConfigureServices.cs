using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using QuizHub.Application.Common.Behaviours;
using QuizHub.Domain.Settings;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, ConfigurationManager configuration)
        {
            services.Configure<TokenServiceProviderSettings>(config =>
            {
                config.Issuer = configuration["TokenServiceProvider:Issuer"];
                config.Audience = configuration["TokenServiceProvider:Audience"];
                config.Secret = configuration["TokenServiceProvider:Secret"];
            });

            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddOpenBehavior(typeof(ValidationBehaviour<,>));
            });

            return services;
        }
    }
}

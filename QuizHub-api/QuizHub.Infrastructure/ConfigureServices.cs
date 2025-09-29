using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using QuizHub.Domain.Contracts;
using QuizHub.Infrastructure.Data;
using QuizHub.Infrastructure.Repository;
using QuizHub.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IQuizRepository, QuizRepository>();
            services.AddScoped<IQuestionRepository, QuestionRepository>();
            services.AddScoped<IQuizResultRepository, QuizResultRepository>();
            services.AddScoped<IUserAnswerRepository, UserAnswerRepository>();
            services.AddScoped<ILobyRepository, LobyRepository>();
            services.AddScoped<ILobbyNotifier, LobbyNotifier>();
            services.AddHostedService<LobbySchedulerService>();
            services.AddScoped<IQuestionSenderService, QuestionSenderService>();


            return services;
        }
    }
}

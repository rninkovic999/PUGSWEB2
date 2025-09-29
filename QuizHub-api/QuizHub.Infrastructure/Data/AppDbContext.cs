using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuizResult> QuizResults { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }
        public DbSet<Loby> Lobies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Question>()
                .HasDiscriminator<string>("QuestionType")
                .HasValue<SingleChoiceQuestion>("SingleChoice")
                .HasValue<MultipleChoiceQuestion>("MultipleChoice")
                .HasValue<TrueFalseQuestion>("TrueFalse")
                .HasValue<FillInTheBlankQuestion>("FillInTheBlank");

            modelBuilder.Entity<Quiz>()
                .HasMany(q => q.Questions)
                .WithOne()
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuizResult>()
                .HasMany(r => r.Answers)
                .WithOne()
                .HasForeignKey(a => a.QuizResultId)
                .OnDelete(DeleteBehavior.Cascade);

            var stringListConverter = new ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>());

            var intListConverter = new ValueConverter<List<int>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<int>>(v, (JsonSerializerOptions)null) ?? new List<int>());

            var stringListComparer = new ValueComparer<List<string>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            var intListComparer = new ValueComparer<List<int>>(
                (c1, c2) => c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList());

            modelBuilder.Entity<SingleChoiceQuestion>()
                .Property(q => q.Options)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            modelBuilder.Entity<MultipleChoiceQuestion>()
                .Property(q => q.Options)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            modelBuilder.Entity<MultipleChoiceQuestion>()
                .Property(q => q.CorrectOptionIndices)
                .HasConversion(intListConverter)
                .Metadata.SetValueComparer(intListComparer);

            modelBuilder.Entity<QuizResult>()
                .HasOne(qr => qr.Quiz)
                .WithMany()
                .HasForeignKey(qr => qr.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Quiz>()
                .HasMany(q => q.Results)
                .WithOne(qr => qr.Quiz)
                .HasForeignKey(qr => qr.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Loby>()
                .HasOne<User>()
                .WithMany() 
                .HasForeignKey(l => l.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Loby>()
                .HasMany(l => l.Participants)
                .WithMany();

            modelBuilder.Entity<Loby>()
                .HasOne(l => l.Quiz)
                .WithMany()
                .HasForeignKey(l => l.QuizId)
                .OnDelete(DeleteBehavior.Restrict);

            var scoresConverter = new ValueConverter<Dictionary<string, int>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrWhiteSpace(v)
                     ? new Dictionary<string, int>()
                     : JsonSerializer.Deserialize<Dictionary<string, int>>(v, (JsonSerializerOptions)null) ?? new Dictionary<string, int>()
            );

            var correctAnswersConverter = new ValueConverter<Dictionary<Guid, List<string>>, string>(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrWhiteSpace(v)
                     ? new Dictionary<Guid, List<string>>()
                     : JsonSerializer.Deserialize<Dictionary<Guid, List<string>>>(v, (JsonSerializerOptions)null) ?? new Dictionary<Guid, List<string>>()
            );


            // ValueComparer za Dictionary<Guid, List<string>> da EF Core može da prati promene
            var correctAnswersComparer = new ValueComparer<Dictionary<Guid, List<string>>>(
                (c1, c2) => c1.Count == c2.Count && !c1.Except(c2).Any(),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.Key.GetHashCode(), v.Value.Aggregate(0, (aa, vv) => HashCode.Combine(aa, vv.GetHashCode())))),
                c => c.ToDictionary(e => e.Key, e => e.Value.ToList())
            );

            modelBuilder.Entity<Loby>()
                .Property(l => l.Scores)
                .HasConversion(scoresConverter);

            modelBuilder.Entity<Loby>()
                .Property(l => l.CorrectAnswers)
                .HasConversion(correctAnswersConverter)
                .Metadata.SetValueComparer(correctAnswersComparer);
        }
    }
}

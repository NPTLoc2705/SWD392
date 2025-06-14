using BO.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        //public DbSet<Programs> Programs { get; set; }
        public DbSet<Appointments> Appointments { get; set; }
        public DbSet<Tickets> Tickets { get; set; }
        //public DbSet<Applications> Applications { get; set; }
        public DbSet<Articles> Articles { get; set; }
        //public DbSet<Email_verifications> Email_verifications { get; set; } 
        public DbSet<Payments> Payments { get; set; }
        //public DbSet<Feedback> Feedback { get; set; } 


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình cho User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(10);


 
            });

            modelBuilder.Entity<Role>().HasData(
                          new Role { Id = 1, Name = "Student" },
                          new Role { Id = 2, Name = "Consultant" },
                          new Role { Id = 3, Name = "Admin" }
            );

            //Cấu hình cho Appointments
            modelBuilder.Entity<Appointments>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).IsRequired();

                entity.Property(e => e.StudentId).IsRequired();
                entity.Property(e => e.StudentName).IsRequired().HasMaxLength(100);

                entity.Property(e => e.ConsultantId).IsRequired();
                entity.Property(e => e.ConsultantName).IsRequired().HasMaxLength(100);

                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.IsPriority).IsRequired();
                entity.Property(e => e.QueuePosition).IsRequired();

                entity.Property(e => e.Create_at).IsRequired();
                entity.Property(e => e.Update_at).IsRequired();

                entity.HasOne(a => a.Student)
                      .WithMany()
                      .HasForeignKey(a => a.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Consultant)
                      .WithMany()
                      .HasForeignKey(a => a.ConsultantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Cấu hình cho Tickets
            modelBuilder.Entity<Tickets>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Subject).IsRequired();
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.created_at).IsRequired();
                entity.Property(e => e.updated_at).IsRequired();
                entity.Property(e => e.Message).IsRequired();

                entity.HasOne(t => t.Student)
                      .WithMany()
                      .HasForeignKey(t => t.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.Consultant)
                      .WithMany()
                      .HasForeignKey(t => t.ConsultantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //// Cấu hình cho Applications
            //modelBuilder.Entity<Applications>(entity =>
            //{
            //    entity.HasKey(e => e.id);
            //    entity.Property(e => e.id).IsRequired().HasMaxLength(50);
            //    entity.Property(e => e.submission_data).HasColumnType("jsonb");
            //    entity.Property(e => e.submitted_at).IsRequired();

            //    entity.HasOne(a => a.Student)
            //          .WithMany()
            //          .HasForeignKey(a => a.student_id)
            //          .OnDelete(DeleteBehavior.Restrict);

            //    entity.HasOne(a => a.Programs)
            //          .WithMany()
            //          .HasForeignKey(a => a.programs_id)
            //          .OnDelete(DeleteBehavior.Restrict);
            //});

            //// Cấu hình cho Articles
            modelBuilder.Entity<Articles>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.id).IsRequired().HasMaxLength(50);
                entity.Property(e => e.title).IsRequired();
                entity.Property(e => e.content).IsRequired();
                entity.Property(e => e.published_by).IsRequired();
                entity.Property(e => e.created_at).IsRequired();
                entity.Property(e => e.updated_at).IsRequired();

                entity.HasOne(a => a.User)
                      .WithMany(u => u.Articles)
                      .HasForeignKey(a => a.published_by)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            //// Cấu hình cho Email_verifications
            //modelBuilder.Entity<Email_verifications>(entity =>
            //{
            //    entity.HasKey(e => e.id);
            //    entity.Property(e => e.id).IsRequired().HasMaxLength(50);
            //    entity.Property(e => e.verification_code).IsRequired();
            //    entity.Property(e => e.is_verified).IsRequired();
            //    entity.Property(e => e.sent_at).IsRequired();

            //    entity.HasOne(e => e.User)
            //          .WithMany(u => u.Email_verifications)
            //          .HasForeignKey(e => e.userid)
            //          .OnDelete(DeleteBehavior.Restrict);
            //});

            //// Cấu hình cho Payments
            // Cấu hình cho Payments
            modelBuilder.Entity<Payments>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).IsRequired();

                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.AppointmentId).IsRequired();

                entity.Property(e => e.Amount).IsRequired().HasColumnType("decimal(12,2)");
                entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Purpose).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);

                entity.Property(e => e.VnpTxnRef).HasMaxLength(100);
                entity.Property(e => e.VnpResponseCode).HasMaxLength(10);
                entity.Property(e => e.VnpOrderInfo);
                entity.Property(e => e.VnpPayDate);
                entity.Property(e => e.CreatedAt).IsRequired();

                entity.HasOne(p => p.User)
                      .WithMany(u => u.Payments)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Appointment)
                      .WithMany(a => a.Payments)
                      .HasForeignKey(p => p.AppointmentId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Cấu hình cho Feedback
            //modelBuilder.Entity<Feedback>(entity =>
            //{
            //    entity.HasKey(e => e.id);
            //    entity.Property(e => e.id).IsRequired().HasMaxLength(50);
            //    entity.Property(e => e.rating).IsRequired();
            //    entity.Property(e => e.comment);
            //    entity.Property(e => e.response);
            //    entity.Property(e => e.resolved).IsRequired();
            //    entity.Property(e => e.created_at).IsRequired();

            //    entity.HasOne(f => f.Student)
            //          .WithMany()
            //          .HasForeignKey(f => f.student_id)
            //          .OnDelete(DeleteBehavior.Restrict);

            //    entity.HasOne(f => f.Consultant)
            //          .WithMany()
            //          .HasForeignKey(f => f.consultant_id)
            //          .OnDelete(DeleteBehavior.Restrict);
            //});
        }
    }
}
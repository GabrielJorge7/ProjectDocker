using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReserveiAPI.Objects.Models.Entities;

namespace ReserveiAPI.Contexts.Builders
{
    public class UserBuilder
    {
        public static void Build(ModelBuilder modelBuilder)
        {
            //Builder
            modelBuilder.Entity<UserModel>().HasKey(u => u.Id);
            modelBuilder.Entity<UserModel>().Property(u => u.NameUser).HasMaxLength(100).IsRequired();
            modelBuilder.Entity<UserModel>().Property(u => u.EmailUser).HasMaxLength(200).IsRequired();
            modelBuilder.Entity<UserModel>().Property(u => u.PasswordUser).HasMaxLength(256).IsRequired();
            modelBuilder.Entity<UserModel>().Property(u => u.PhoneUser).HasMaxLength(15).IsRequired();

            //Inserções
            modelBuilder.Entity<UserModel>().HasData(
                new UserModel
                {
                    Id = 1,
                    NameUser = "Master",
                    EmailUser = "master@development.com",
                    PasswordUser = "313d99eeb6420a37519a343c26296ad00b7c25fb53bf236550d700969802dd5c",
                    PhoneUser = "",
                }
            );
        }
    }
}

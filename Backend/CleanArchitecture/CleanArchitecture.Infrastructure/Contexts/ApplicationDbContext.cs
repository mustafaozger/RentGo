using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Application.Entities;  // for ApplicationUser
using CoreEntities = CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using CleanArchitecture.Infrastructure.Models;
using CleanArchitecture.Core.Entities;

namespace CleanArchitecture.Infrastructure.Contexts
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IDateTimeService _dateTime;
        private readonly IAuthenticatedUserService _authenticatedUser;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            IDateTimeService dateTime,
            IAuthenticatedUserService authenticatedUser)
            : base(options)
        {
            ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _dateTime = dateTime;
            _authenticatedUser = authenticatedUser;
        }

        public DbSet<CoreEntities.Category> Categories { get; set; }
        public DbSet<CoreEntities.Product> Products { get; set; }
        public DbSet<CoreEntities.Cart> Carts { get; set; }
        public DbSet<CoreEntities.Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<RentalProduct> RentalProducts { get; set; }
        public DbSet<RentInfo> RentInfos { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<AuditableBaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = _dateTime.NowUtc;
                        entry.Entity.CreatedBy = _authenticatedUser.UserId;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = _dateTime.NowUtc;
                        entry.Entity.LastModifiedBy = _authenticatedUser.UserId;
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

                        // Map Identity tables to default names
            builder.Entity<ApplicationUser>(e => e.ToTable("AspNetUsers"));
            builder.Entity<IdentityRole>(e => e.ToTable("AspNetRoles"));
            builder.Entity<IdentityUserRole<string>>(e => e.ToTable("AspNetUserRoles"));
            builder.Entity<IdentityUserClaim<string>>(e => e.ToTable("AspNetUserClaims"));
            builder.Entity<IdentityUserLogin<string>>(e => e.ToTable("AspNetUserLogins"));
            builder.Entity<IdentityRoleClaim<string>>(e => e.ToTable("AspNetRoleClaims"));
            builder.Entity<IdentityUserToken<string>>(e => e.ToTable("AspNetUserTokens"));

            // Decimal precision
            foreach (var prop in builder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                prop.SetColumnType("decimal(18,6)");
            }

            // JSON for ProductImageList
            builder.Entity<Product>()
                .OwnsMany(p => p.ProductImageList, a => a.ToJson("ProductImageList"));

            // ProductRentalHistories conversion
            builder.Entity<Product>()
                .Property(p => p.ProductRentalHistories)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<DateTime>>(v));

            // Category - Product
            builder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Customer - Orders
            builder.Entity<CoreEntities.Customer>()
                .HasMany(c => c.OrderHistory)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - RentInfo
            builder.Entity<Order>()
                .HasOne(o => o.RentInfo)
                .WithOne(r => r.Order)
                .HasForeignKey<Order>(o => o.RentInfoID)
                .OnDelete(DeleteBehavior.Cascade);

            // Customer - Cart
            builder.Entity<Customer>()
                .HasOne(c => c.Cart)
                .WithOne(ca => ca.Customer)
                .HasForeignKey<Cart>(ca => ca.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cart - CartItems
            builder.Entity<CoreEntities.Cart>()
                .HasMany(c => c.CartItemList)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // Rental fields on CartItem
            builder.Entity<CoreEntities.CartItem>()
                .Property(ci => ci.RentalPeriodType)
                .HasConversion<int>();
            builder.Entity<CartItem>()
                .Property(ci => ci.RentalDuration)
                .IsRequired();

            // Order - RentalProducts
            builder.Entity<Order>()
                .HasMany(o => o.RentalProducts)
                .WithOne(p => p.Order)
                .HasForeignKey(p => p.OrderID)
                .OnDelete(DeleteBehavior.Cascade);

             builder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable(name: "User");
            });

            builder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable(name: "Role");
            });
            builder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles");
            });

            builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins");
            });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims");

            });

            builder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens");
            });

            //All Decimals will have 18,6 Range
            foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetColumnType("decimal(18,6)");
            }
            base.OnModelCreating(builder);
        }
    }
}

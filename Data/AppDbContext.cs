using ApiSeries.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiSeries.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Serie> Series => Set<Serie>();
}

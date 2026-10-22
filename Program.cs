using ApiSeries.Data;
using ApiSeries.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/series", async (AppDbContext db) =>
{
    var series = await db.Series.ToListAsync();

    return Results.Ok(series);
});

app.MapGet("/api/series/{id:int}", async (int id, AppDbContext db) =>
{
    var serie = await db.Series.FindAsync(id);

    if (serie is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(serie);
});

app.MapPost("/api/series", async (SerieEntradaDto dados, AppDbContext db) =>
{
    var novaSerie = new Serie
    {
        Titulo = dados.Titulo,
        Genero = dados.Genero,
        AnoLancamento = dados.AnoLancamento,
        Temporadas = dados.Temporadas
    };

    db.Series.Add(novaSerie);
    await db.SaveChangesAsync();

    var resposta = new SerieDto(
        novaSerie.Id,
        novaSerie.Titulo,
        novaSerie.Genero,
        novaSerie.AnoLancamento,
        novaSerie.Temporadas
    );

    return Results.Created($"/api/series/{novaSerie.Id}", resposta);
});

app.MapPut("/api/series/{id:int}", async (int id, SerieEntradaDto dados, AppDbContext db) =>
{
    var serie = await db.Series.FindAsync(id);

    if (serie is null)
    {
        return Results.NotFound();
    }

    serie.Titulo = dados.Titulo;
    serie.Genero = dados.Genero;
    serie.AnoLancamento = dados.AnoLancamento;
    serie.Temporadas = dados.Temporadas;

    await db.SaveChangesAsync();

    var resposta = new SerieDto(
        serie.Id,
        serie.Titulo,
        serie.Genero,
        serie.AnoLancamento,
        serie.Temporadas
    );

    return Results.Ok(resposta);
});

app.MapDelete("/api/series/{id:int}", async (int id, AppDbContext db) =>
{
    var serie = await db.Series.FindAsync(id);

    if (serie is null)
    {
        return Results.NotFound();
    }

    db.Series.Remove(serie);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();


record SerieDto(
    int Id,
    string Titulo,
    string Genero,
    int AnoLancamento,
    int Temporadas
);

record SerieEntradaDto(
    string Titulo,
    string Genero,
    int AnoLancamento,
    int Temporadas
);

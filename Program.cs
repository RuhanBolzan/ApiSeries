var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Criar nossa lista
var series = new List<SerieDto>
{
    new SerieDto(1, "Stranger Things", "Ficção científica", 2016, 4),
    new SerieDto(2, "The Last of Us", "Drama", 2023, 2)
};


app.MapGet("/", () => "API de séries está no ar");

app.MapGet("/api/series", () =>
{
    return Results.Ok(series);
});

app.MapGet("/api/series/{id:int}", (int id) =>
{
    var serie = series.Find(serieDaLista => serieDaLista.Id == id);

    if (serie is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(serie);
});

app.MapPost("/api/series", (SerieEntradaDto dados) =>
{
    int proximoId = series.Count + 1;

    var novaSerie = new SerieDto(
        proximoId,
        dados.Titulo,
        dados.Genero,
        dados.AnoLancamento,
        dados.Temporadas
    );

    series.Add(novaSerie);

    return Results.Created($"/api/series/{novaSerie.Id}", novaSerie);
});

app.MapPut("/api/series/{id:int}", (int id, SerieEntradaDto dados) =>
{
    int indice = series.FindIndex(serieDaLista => serieDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    var serieAtualizada = new SerieDto(
        id,
        dados.Titulo,
        dados.Genero,
        dados.AnoLancamento,
        dados.Temporadas
    );

    series[indice] = serieAtualizada;

    return Results.Ok(serieAtualizada);
});

app.MapDelete("/api/series/{id:int}", (int id) =>
{
    int indice = series.FindIndex(serieDaLista => serieDaLista.Id == id);

    if (indice == -1)
    {
        return Results.NotFound();
    }

    series.RemoveAt(indice);

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
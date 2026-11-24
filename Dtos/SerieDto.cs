namespace ApiSeries.Dtos;

public record SerieDto(
    int Id,
    string Titulo,
    string Genero,
    int AnoLancamento,
    int Temporadas
);
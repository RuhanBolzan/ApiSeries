namespace ApiSeries.Dtos;

public record SerieEntradaDto(
    string Titulo,
    string Genero,
    int AnoLancamento,
    int Temporadas
);
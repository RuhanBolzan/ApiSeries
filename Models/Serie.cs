namespace ApiSeries.Models;

public class Serie
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Genero { get; set; } = string.Empty;
    public int AnoLancamento { get; set; }
    public int Temporadas { get; set; }
}

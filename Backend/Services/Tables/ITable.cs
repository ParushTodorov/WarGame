namespace WarGame.Services.Tables
{
    public interface ITable
    {
        Guid Id { get; set; }

        bool TroopAssembly(Guid playerName);

        void ActivateMaxRounds();

        void ActivateTimebank();
    }
}

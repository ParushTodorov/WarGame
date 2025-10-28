namespace WarGame.Services.TableManager
{
    public interface ITableManager
    {
        Guid AddPlayerToTable(Guid playerName, bool isMaxRoundActive = false, bool isTimebankActive = false);

        void CloseTable(Guid TableId);
    }
}

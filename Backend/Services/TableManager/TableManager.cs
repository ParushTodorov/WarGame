using WarGame.Services.Tables;
using WarGame.Utilities.Types;

namespace WarGame.Services.TableManager
{
    public class TableManager : ITableManager
    {
        private readonly IServiceProvider _provider;

        private Queue<ITable> _tablesWithOnePlayer = new Queue<ITable>();

        private Queue<ITable> _tablesMaxRoundGameWithOnePlayer = new Queue<ITable>();
        private Queue<ITable> _tablesTimebankGameWithOnePlayer = new Queue<ITable>();
        private Queue<ITable> _tablesMaxRoundAndTimebankGameWithOnePlayer = new Queue<ITable>();

        Dictionary<Guid, ITable> _tablesInGameMode = new Dictionary<Guid, ITable>();

        public TableManager(IServiceProvider provider)
        {
            _provider = provider;
        }

        public Guid AddPlayerToTable(Guid playerName, bool isMaxRoundActive = false, bool isTimebankActive = false)
        {
            ITable table = GetTable(isMaxRoundActive, isTimebankActive);

            bool isAssembled = table.TroopAssembly(playerName);

            if (isAssembled)
            {
                _tablesInGameMode.Add(table.Id, table);
            }

            return table.Id;
        }

        public void CloseTable(Guid tableId)
        {
            _tablesInGameMode.Remove(tableId);
        }

        private ITable GetTable(bool isMaxRoundActive = false, bool isTimebankActive = false)
        {
            if (_tablesWithOnePlayer.Count > 0 && !(isMaxRoundActive && isTimebankActive))
            {
                return _tablesWithOnePlayer.Dequeue();
            }

            if (_tablesMaxRoundGameWithOnePlayer.Count > 0 && isMaxRoundActive)
            {
                return _tablesMaxRoundGameWithOnePlayer.Dequeue();
            }

            if (_tablesTimebankGameWithOnePlayer.Count > 0 && isTimebankActive)
            {
                return _tablesTimebankGameWithOnePlayer.Dequeue();
            }

            return CreateTable(isMaxRoundActive, isTimebankActive);
        }

        private ITable CreateTable(bool isMaxRoundActive = false, bool isTimebankActive = false)
        {
            ITable table = (ITable)ActivatorUtilities.CreateInstance(_provider, typeof(Table)); ;

            if (isMaxRoundActive)
            {
                table.ActivateMaxRounds();
                _tablesMaxRoundGameWithOnePlayer.Enqueue(table);
            }
            else if (isTimebankActive)
            {
                table.ActivateTimebank();
                _tablesTimebankGameWithOnePlayer.Enqueue(table);
            }
            else
            {
                _tablesWithOnePlayer.Enqueue(table);
            }

            return table;
        }
    }
}
using WarGame.Utilities.Enums;

namespace WarGame.Communication.SignalHub.Messages.Data
{
    public class GameEnd: BaseGameResponse
    {
        public Player Winner { get; set; }
    }
}

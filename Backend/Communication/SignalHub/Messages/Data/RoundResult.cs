using WarGame.Utilities.Enums;
using WarGame.Utilities.Types;

namespace WarGame.Communication.SignalHub.Messages.Data
{
    public class RoundResult: BaseGameResponse
    {
        public Card PlayerOneCard { get; set; }

        public Card PlayerTwoCard { get; set; }

        public int PlayerOneCardsLeft { get; set; }

        public int PlayerTwoCardsLeft { get; set; }

        public Player Winner { get; set; }

        public string WinnerId { get; set; }
    }
}

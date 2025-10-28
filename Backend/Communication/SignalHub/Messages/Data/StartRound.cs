namespace WarGame.Communication.SignalHub.Messages.Data
{
    public class StartRound: BaseGameResponse
    {
        public int RoundId { get; set; }

        public int TimeLeft { get; set; }
    }
}

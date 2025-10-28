namespace WarGame.Communication.SignalHub.Messages.Data
{
    public class StartGame: BaseGameResponse
    {
        public string PlayerOneId { get; set; }

        public string PlayerTwoId { get; set; }

        public int MaxRounds { get; set; }

        public int TimebankInSec { get; set; }
    }
}

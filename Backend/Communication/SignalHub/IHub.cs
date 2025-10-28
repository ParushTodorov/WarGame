namespace WarGame.Communication.SignalHub
{
    public interface ISignalConnectionHub
    {
        Task Message(string message);
    }
}

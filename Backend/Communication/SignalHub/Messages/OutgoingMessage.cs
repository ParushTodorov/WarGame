namespace WarGame.Communication.SignalHub.Messages
{
    public class OutgoingMessage<T>
    {
        public OutgoingMessagesType Type { get; set; }

        public T? Data { get; set; }
    }
}

using MediatR;

namespace WarGame.Mediator.Notifications
{
    public class RSignalMessage : INotification
    {
        public object Message { get; set; }

        public string TableId { get; set; }
    }
}

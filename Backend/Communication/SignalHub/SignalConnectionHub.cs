using Microsoft.AspNetCore.SignalR;

namespace WarGame.Communication.SignalHub
{
    public class SignalConnectionHub : Hub<ISignalConnectionHub>
    {
        public override async Task OnConnectedAsync()
        {
            string tableName = Context.GetHttpContext().Request.Query["tableId"].ToString();

            Console.WriteLine($"Connected user: {tableName}");

            if (!string.IsNullOrEmpty(tableName))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, tableName);
            }

            await base.OnConnectedAsync();
        }
    }
}
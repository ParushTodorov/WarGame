using System.Reflection;
using Microsoft.Extensions.Options;
using WarGame.Utilities.Types;
using WarGame.Communication.SignalHub;
using WarGame.Services.ShuffleMachines;
using WarGame.Services.TableManager;
using WarGame.Services.Tables;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:1209")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddTransient<IShuffleMachine, ShuffleMachine>();
builder.Services.AddTransient<ITable, Table>();
builder.Services.AddSingleton<ITableManager, TableManager>();
builder.Services.Configure<GameConfig>(
    builder.Configuration.GetSection("WarGameConfig")
);
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<GameConfig>>().Value
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowFrontend");

app.MapHub<SignalConnectionHub>("/gameplay");

app.Run();

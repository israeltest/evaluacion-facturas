using GestionFactura.Api.Middlewares;
using Microsoft.AspNetCore.Builder;
using Serilog;
using Serilog.Events;

namespace GestionFactura.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureSerilog(this ConfigureHostBuilder host)
        {
            host.UseSerilog((context, services, configuration) => {
                var logPath = context.Configuration["Serilog:LogPath"] ?? "logs/log-.txt";
                
                configuration
                    .MinimumLevel.Information()
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                    .Enrich.FromLogContext()
                    .WriteTo.Console()
                    .WriteTo.File(
                        path: logPath,
                        rollingInterval: RollingInterval.Day,
                        retainedFileCountLimit: 30,
                        fileSizeLimitBytes: 10485760,
                        rollOnFileSizeLimit: true
                    );
            });
        }

        public static void ConfigureExceptionHandler(this IApplicationBuilder app)
        {
            app.UseMiddleware<GlobalExceptionMiddleware>();
        }
    }
}

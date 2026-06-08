using Microsoft.AspNetCore.Http;
using Serilog;
using System.Net;
using System.Text.Json;

namespace GestionFactura.Api.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Se produjo una excepción no controlada en la solicitud: {Method} {Path}", 
                          httpContext.Request.Method, httpContext.Request.Path);
                
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Ocurrió un error interno en el servidor. Por favor, inténtelo de nuevo más tarde.",
                Detailed = exception.Message
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}

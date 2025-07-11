using BO.Models;
using DAL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repo;
using Repo.Ticket;
using Scalar.AspNetCore;
using Services;
using Services.Service;
using Services.Ticket;
using System.Text;

namespace SWD392.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            // Add session support
            builder.Services.AddDistributedMemoryCache(); // Use in-memory cache for sessions
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30); // Session timeout
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
            });

            // Register IHttpContextAccessor for session access in ChatbotService
            builder.Services.AddHttpContextAccessor();

            // Add OpenAPI with Bearer auth support
            builder.Services.AddOpenApi("v1", options =>
            {
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            // Configure PostgreSQL with EF Core
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register custom repository
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();
            builder.Services.AddScoped<IArticleRepo, ArticlesRepo>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<ITicketRepository, TicketRepository>();
            builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
            builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();

            // Register custom services
            builder.Services.AddScoped<AuthDAO>();
            builder.Services.AddScoped<TicketDAO>();
            builder.Services.AddScoped<FeedbackDAO>();
            builder.Services.AddScoped<ApplicationDAO>();
            builder.Services.AddScoped<IApplicationService, ApplicationService>();
            builder.Services.AddScoped<IProgramService, ProgramService>();
            builder.Services.AddScoped<IFeedBackService, FeedbackService>();
            builder.Services.AddScoped<ITicketService, TicketService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IArticleService, ArticleService>();
            builder.Services.AddScoped<ArticlesDAO>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<UserDAO>();
            builder.Services.AddScoped<IAppointmentRepo, AppointmentRepo>();

            // Register other services
            builder.Services.AddScoped<ChatHistoryDAO>();
            builder.Services.AddScoped<IChatHistoryRepo, ChatHistoryRepo>();
            builder.Services.AddScoped

<IChatbotService, ChatbotService>();
            builder.Services.AddScoped<FAQDAO>();
            builder.Services.AddScoped<IFAQRepo, FAQRepo>();
            builder.Services.AddScoped<IFAQService, FAQService>();
            builder.Services.Configure<LlmSettings>(builder.Configuration.GetSection("LlmSettings"));
            builder.Services.AddScoped<VNPayService>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();

            // Configure JWT authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
                    };
                });

            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure middleware
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();
            app.UseSession(); // Enable session middleware
            app.UseCors("AllowAll");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }

    // Move this class OUTSIDE the Main method
    internal sealed class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
    {
        private readonly Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider _authenticationSchemeProvider;

        public BearerSecuritySchemeTransformer(Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider authenticationSchemeProvider)
        {
            _authenticationSchemeProvider = authenticationSchemeProvider;
        }

        public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            var authenticationSchemes = await _authenticationSchemeProvider.GetAllSchemesAsync();
            if (authenticationSchemes.Any(authScheme => authScheme.Name == JwtBearerDefaults.AuthenticationScheme))
            {
                var securityScheme = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT",
                    Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                };

                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();
                document.Components.SecuritySchemes["Bearer"] = securityScheme;

                // Modify to only apply security to endpoints with [Authorize]
                foreach (var path in document.Paths)
                {
                    foreach (var operation in path.Value.Operations)
                    {
                        // Check if the operation has an Authorize attribute (simplified check)
                        // You may need to customize this logic based on your needs
                        if (operation.Value.Extensions.TryGetValue("x-require-auth", out var auth) && auth.ToString() == "true")
                        {
                            operation.Value.Security ??= new List<OpenApiSecurityRequirement>();
                            operation.Value.Security.Add(new OpenApiSecurityRequirement
                            {
                                [securityScheme] = Array.Empty<string>()
                            });
                        }
                    }
                }
            }
        }
    }
}
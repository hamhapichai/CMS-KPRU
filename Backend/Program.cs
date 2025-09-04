using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Backend.Exceptions;
using Backend.Configuration;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load .env
DotNetEnv.Env.Load();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Webhook options
builder.Services.Configure<WebhookOptions>(
    builder.Configuration.GetSection(WebhookOptions.SectionName));

// Add HttpClient for webhooks
builder.Services.AddHttpClient<IWebhookQueueService, WebhookQueueService>();

// เพิ่ม CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// PostgreSQL connection string from appsettings.json (with env)
var envConnStr = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
var connectionString = !string.IsNullOrEmpty(envConnStr)
    ? envConnStr
    : builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// DI for Repository/Service
builder.Services.AddScoped<ITestItemRepository, TestItemRepository>();
builder.Services.AddScoped<ITestItemService, TestItemService>();
builder.Services.AddScoped<IComplaintsRepository, ComplaintsRepository>();
builder.Services.AddScoped<IComplaintsService, ComplaintsService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAISuggestionsRepository, AISuggestionsRepository>();
builder.Services.AddScoped<IAISuggestionsService, AISuggestionsService>();

// Webhook services
builder.Services.AddSingleton<IWebhookQueueService, WebhookQueueService>();
builder.Services.AddScoped<IWebhookService, WebhookService>();
builder.Services.AddHostedService<WebhookQueueService>();

var app = builder.Build();

// Seed data (roles, departments, admin user)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Seed Roles
    var roles = new[] { "Admin", "User" };
    foreach (var roleName in roles)
    {
        if (!db.Roles.Any(r => r.RoleName == roleName))
            db.Roles.Add(new Role { RoleName = roleName });
    }
    db.SaveChanges();

    // Seed Departments
    var departments = new[] { "ฝ่ายบริหาร", "ฝ่ายบุคคล", "ฝ่ายไอที", "ฝ่ายบัญชี" };
    foreach (var deptName in departments)
    {
        if (!db.Departments.Any(d => d.DepartmentName == deptName))
            db.Departments.Add(new Department { DepartmentName = deptName });
    }
    db.SaveChanges();

    // Seed Admin User
    if (!db.Users.Any(u => u.Username == "admin"))
    {
        var adminRole = db.Roles.FirstOrDefault(r => r.RoleName == "Admin");
        var adminDept = db.Departments.FirstOrDefault();
        if (adminRole != null && adminDept != null)
        {
            // Hash password
            var password = "P@ssw0rd";
            var salt = "cms-kpru";
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(password + salt));
            var hashString = BitConverter.ToString(hash).Replace("-", "").ToLower();
            db.Users.Add(new User
            {
                Username = "admin",
                Email = "admin@cms-kpru.local",
                PasswordHash = hashString,
                Role = adminRole,
                Department = adminDept,
                IsActive = true
            });
            db.SaveChanges();
        }
    }
}

// Exception Middleware
app.UseCustomExceptionMiddleware();

// Static files middleware สำหรับไฟล์แนบ
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// JWT Middleware (ใส่ก่อน MapControllers)
app.UseMiddleware<Backend.Services.JwtMiddleware>();

// ใช้งาน CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

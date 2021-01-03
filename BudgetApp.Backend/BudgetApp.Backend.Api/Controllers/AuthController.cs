using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Configuration;
using BudgetApp.Backend.Api.Controllers.BaseClasses;
using BudgetApp.Backend.Api.Services;
using BudgetApp.Backend.Dto;
using BudgetApp.Backend.Dto.Auth;
using BudgetApp.Backend.Dto.Filtering;
using BudgetApp.Backend.Dto.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using static BudgetApp.Backend.Api.Services.RequestReportGenerator;

namespace BudgetApp.Backend.Api.Controllers
{
    [ApiController]
    public class AuthController : DataController
    {
        public AuthController(IOptions<ApplicationSettings> options) : base(options)
        {
        }

        [HttpPost]
        [Route("auth/login")]
        public async Task<HttpResponse> DoLogin()
        {
            var requestBody = await GetRequestBody();
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(requestBody));
            var pair = decoded.Split(':').Select(itm => itm.Trim()).ToList();
            if (pair.Count != 2)
            {
                return await SerializedObjectResponse(
                    CreateErrorReport(ApiErrorCode.UserNameAndPasswordRequired,
                        "Username and password required."), 400);
            }

            var userQuery = GetUserQuery(pair[0]);
            var user = Manager.Find(nameof(Dto.Auth.User), typeof(User), userQuery);
            if (user is not List<User> users || users.FirstOrDefault() == null)
            {
                return await SerializedObjectResponse(CreateErrorReport(
                    ApiErrorCode.UserNotFound, "No matching user found", new List<string> {pair[0]}));
            }

            var expectedUser = users.FirstOrDefault();
            if (expectedUser.LockedOut)
            {
                var type = IncidentType.AttemptToLogInAsLockedOutUser;
                var level = IncidentLevel.High;
                CreateIncident(level, type, expectedUser);
                return await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.UserLockedOut,
                    "User is locked out.", new List<string> {pair[0]}));
            }

            var authManager = new AuthenticationManager();
            var hash = authManager.GenerateHash(Encoding.UTF8.GetBytes(pair[1]),
                Encoding.UTF8.GetBytes(expectedUser.Salt));
            var correct = authManager.GetTimesafeDifference(Encoding.UTF8.GetBytes(hash),
                Encoding.UTF8.GetBytes(expectedUser.Password));
            if (correct)
            {
                expectedUser.LoginAttempts = 0;
                CreateIncident(IncidentLevel.Low, IncidentType.Login, expectedUser);
                var token = new Token
                {
                    UserId = expectedUser.Identifier,
                    AccessToken = BitConverter.ToString(authManager.GenerateRandomBytes(255))
                        .Replace("-", string.Empty),
                    AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(Options.Value.General.TokenExpiryMinutes)
                };
                Manager.Insert(token.GetType().Name, token.GetType(), token);
                UpdateUser(expectedUser);
                return await SerializedObjectResponse(new AuthSuccessfulResult(token));
            }

            CreateIncident(IncidentLevel.High, IncidentType.InvalidCredentials, expectedUser);
            expectedUser.LoginAttempts++;
            if (expectedUser.LoginAttempts >= Options.Value.General.MaxGuesses)
            {
                expectedUser.LockedOut = true;
                UpdateUser(expectedUser);
                CreateIncident(IncidentLevel.Critical, IncidentType.LockedOut, expectedUser);
                return await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.UserLockedOut,
                    "Too many login attempts, you have been locked out", new List<string>() {pair[0]}));
            }

            UpdateUser(expectedUser);
            CreateIncident(IncidentLevel.High, IncidentType.InvalidCredentials, expectedUser);
            return await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.InvalidCredentials,
                "Your username or password is incorrect. Please try again.", new List<string>() {pair[0]}));
        }

        private void UpdateUser(User expectedUser)
        {
            var updateQuery = new MongoUpdateParser();
            updateQuery.Parse(expectedUser);
            Manager.Update(expectedUser.GetType().Name, expectedUser.GetType(),
                new QueryBuilder(expectedUser.GetType()).ById(expectedUser.Identifier).Build(),
                updateQuery.Result);
        }

        private void CreateIncident(IncidentLevel level, IncidentType type, User expectedUser)
        {
            Manager.InsertIncident(new Incident()
            {
                IncidentLevel = level,
                IncidentType = type,
                Timestamp = DateTime.UtcNow,
                RemoteAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Missing",
                UserId = expectedUser.Identifier
            });
        }

        private string GetUserQuery(string username)
        {
            return new QueryBuilder(typeof(Dto.Auth.User)).CreateAQueryGroup().And.CreateAQuery().WhereField("username").Equals(username)
                .Build();
        }
    }

    public class AuthSuccessfulResult
    {
        [JsonPropertyName("success")] public bool Success { get; set; } = true;
        [JsonPropertyName("result")] public string Result { get; set; }

        public AuthSuccessfulResult(Token token)
        {
            var str = JsonSerializer.Serialize(token, token.GetType());
            Result = Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
        }
    }
}
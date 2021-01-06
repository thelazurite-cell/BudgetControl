using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
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
    /// <summary>
    /// The <see cref="AuthController"/>, handles authenticating users
    /// </summary>
    [ApiController]
    public class AuthController : DataController
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class
        /// </summary>
        /// <param name="options">the application's settingn</param>
        public AuthController(IOptions<ApplicationSettings> options) : base(options)
        {
        }

        /// <summary>
        /// Endpoint called to log in as a desired user
        /// </summary>
        /// <returns>A <see cref="HttpResponse"/> indicating whether the operation was successful or not</returns>
        [HttpPost]
        [Route("auth/login")]
        public async Task DoLogin()
        {
            var pair = await ParseAuthorizationDetails();
            if (pair.Count != 2)
            {
                await SerializedObjectResponse(
                    CreateErrorReport(ApiErrorCode.UserNameAndPasswordRequired,
                        "Username and password required."), 400);
                return;
            }

            var userQuery = GetUserQuery(pair[0]);
            var responseObject = Manager.Find(nameof(Dto.Auth.User), typeof(User), userQuery);
            if (responseObject is not List<User> users || users.FirstOrDefault() == null)
            {
                await SerializedObjectResponse(MergeReportsIfRequired(pair, responseObject));
                return;
            }

            var user = users.FirstOrDefault();
            if (user.LockedOut)
            {
                await ReportAttemptedAccessToLockedUser(user, pair);
                return;
            }

            var authManager = new AuthenticationManager();
            if (CredentialsMatched(authManager, pair, user))
            {
                await AcceptUserAccessRequest(user, authManager);
                return;
            }

            CreateIncident(IncidentLevel.High, IncidentType.InvalidCredentials, user);
            user.LoginAttempts++;
            if (user.LoginAttempts >= Options.Value.General.MaxGuesses)
            {
               await TooManyLoginAttempts(user, pair);
               return;
            }

            await IncorrectCredentialsProvided(user, pair);
        }

        /// <summary>
        /// Checks whether the credentials provided matched what was expected.
        /// </summary>
        /// <param name="authManager">the class responsible for managing authentication tasks</param>
        /// <param name="pair">the credentials received from the request</param>
        /// <param name="expectedUser"></param>
        /// <returns></returns>
        private static bool CredentialsMatched(AuthenticationManager authManager, IReadOnlyList<string> pair, User expectedUser)
        {
            var hash = authManager.GenerateHash(Encoding.UTF8.GetBytes(pair[1]),
                Encoding.UTF8.GetBytes(expectedUser.Salt));
            var correct = authManager.GetTimesafeDifference(Encoding.UTF8.GetBytes(hash),
                Encoding.UTF8.GetBytes(expectedUser.Password));
            return correct;
        }

        /// <summary>
        /// Locks an account if too many attempts to log in have been made.
        /// </summary>
        /// <param name="expectedUser">the affected user</param>
        /// <param name="pair">the credentials sent through as part of the request</param>
        /// <returns></returns>
        private async Task TooManyLoginAttempts(User expectedUser, IReadOnlyList<string> pair)
        {
            expectedUser.LockedOut = true;
            UpdateDto(expectedUser);
            CreateIncident(IncidentLevel.Critical, IncidentType.LockedOut, expectedUser);
            await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.UserLockedOut,
                "Too many login attempts, your account has been locked.", new List<string>() {pair[0]}));
        }

        /// <summary>
        /// Creates an incident if the incorrect credentials have been provided for the user
        /// </summary>
        /// <param name="dto">the affected dto (user)</param>
        /// <param name="pair">the credentials sent to the endpoint</param>
        /// <returns></returns>
        private async Task IncorrectCredentialsProvided(IDto dto, IReadOnlyList<string> pair)
        {
            UpdateDto(dto);
            CreateIncident(IncidentLevel.High, IncidentType.InvalidCredentials, dto);
            await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.InvalidCredentials,
                "Your username or password is incorrect. Please try again.", new List<string>() {pair[0]}), 403);
        }

        /// <summary>
        /// When there is an attempt to authenticate against a locked account, an incident logging the issue should be created,
        /// and a message will be 
        /// </summary>
        /// <param name="dto">the affected dto (user)</param>
        /// <param name="pair">the credentials sent to the endpoint</param>
        /// <returns>The HTTP response</returns>
        private async Task ReportAttemptedAccessToLockedUser(IDto dto, IReadOnlyList<string> pair)
        {
            var type = IncidentType.AttemptToLogInAsLockedOutUser;
            var level = IncidentLevel.High;
            CreateIncident(level, type, dto);
            await SerializedObjectResponse(CreateErrorReport(ApiErrorCode.UserLockedOut,
                "Your account is locked out, please reset your password", new List<string> {pair[0]}), 403);
        }

        /// <summary>
        /// If there was an error attempting to get a response object from the data store, ensure that
        /// we have merged all useful warnings and errors into the response sent back
        /// </summary>
        /// <param name="pair">the username and password pair</param>
        /// <param name="responseObject">the response back from the data store</param>
        /// <returns>the merged datastore </returns>
        private static RequestReport MergeReportsIfRequired(List<string> pair, object responseObject)
        {
            var report = CreateErrorReport(
                ApiErrorCode.UserNotFound, "No matching user found", new List<string> {pair[0]});
            if (responseObject is RequestReport responseReport)
            {
                report.Messages.AddRange(responseReport.Messages);
            }

            return report;
        }

        /// <summary>
        /// Parses the authentication details provided from the logon request
        /// </summary>
        /// <returns>A username and password pair</returns>
        private async Task<List<string>> ParseAuthorizationDetails()
        {
            var requestBody = await GetRequestBody();
            var authAttempt = JsonSerializer.Deserialize<AuthAttempt>(requestBody);
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(authAttempt.Attempt));
            var pair = decoded.Split(':').Select(itm => itm.Trim()).ToList();
            return pair;
        }

        /// <summary>
        /// If the details provided by the user match what was expected, reset the login attempts counter,
        /// Log an incident stating that the user logged in and create the authorization token
        /// </summary>
        /// <param name="expectedUser">The user logging in</param>
        /// <param name="authManager">Responsible for dealing with authentication tasks</param>
        /// <returns></returns>
        private async Task AcceptUserAccessRequest(User expectedUser, AuthenticationManager authManager)
        {
            expectedUser.LoginAttempts = 0;
            CreateIncident(IncidentLevel.Low, IncidentType.Login, expectedUser);
            var token = CreateAuthorizationToken(expectedUser, authManager);
            Manager.Insert(token.GetType().Name, token.GetType(), token);
            UpdateDto(expectedUser);
            await SerializedObjectResponse(new AuthSuccessfulResult(token));
        }

        /// <summary>
        /// Creates a valid auth token for user access
        /// </summary>
        /// <param name="expectedUser">the user to log in as</param>
        /// <param name="authManager">responsible for managing secure values</param>
        /// <returns>A valid authorization token</returns>
        private Token CreateAuthorizationToken(User expectedUser, AuthenticationManager authManager)
        {
            var token = new Token
            {
                UserId = expectedUser.Identifier,
                AccessToken = BitConverter.ToString(authManager.GenerateRandomBytes(255))
                    .Replace("-", string.Empty),
                AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(Options.Value.General.TokenExpiryMinutes)
            };
            return token;
        }

        /// <summary>
        /// Updates the affected dto after a login attempt has occurred
        /// </summary>
        /// <param name="dto">the updated dto value to update</param>
        private void UpdateDto(IDto dto)
        {
            var updateQuery = new MongoUpdateParser();
            updateQuery.Parse(dto);
            Manager.Update(dto.GetType().Name, dto.GetType(),
                new QueryBuilder(dto.GetType()).ById(dto.Identifier).Build(),
                updateQuery.Result);
        }

        /// <summary>
        /// Creates an incident should something happen during a logon attempt
        /// </summary>
        /// <param name="level">The severity of the incident</param>
        /// <param name="type">The type of incident that occurred</param>
        /// <param name="idDto">The dto affected by the incident (most cases the user)</param>
        private void CreateIncident(IncidentLevel level, IncidentType type, IDto idDto)
        {
            Manager.InsertIncident(new Incident()
            {
                IncidentLevel = level,
                IncidentType = type,
                Timestamp = DateTime.UtcNow,
                RemoteAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Missing",
                UserId = idDto.Identifier
            });
        }

        /// <summary>
        /// Generates a query to get a user by their username
        /// </summary>
        /// <param name="username">the username to search for</param>
        /// <returns>the query to find a user by their username</returns>
        private string GetUserQuery(string username)
        {
            return new QueryBuilder(typeof(Dto.Auth.User)).CreateAQueryGroup().And.CreateAQuery().WhereField("username")
                .Equals(username)
                .Build();
        }
    }
}
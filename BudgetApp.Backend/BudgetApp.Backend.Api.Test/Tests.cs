using System;
using System.Threading.Tasks;
using BudgetApp.Backend.Api.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using NUnit.Framework;

namespace BudgetApp.Backend.Api.Test
{
    public class Tests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public async Task Test1()
        {
            var authorizationService = new CustomAuthenticationService();
            await authorizationService.Invoking(async itm => await itm.AuthenticateAsync(new DefaultHttpContext(), ""))
                .Should().ThrowAsync<NotImplementedException>();
        }
    }
}
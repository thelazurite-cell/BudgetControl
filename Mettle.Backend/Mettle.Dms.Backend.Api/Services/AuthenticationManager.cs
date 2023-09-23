using System;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace BudgetApp.Backend.Api.Services
{
    public class AuthenticationManager
    {
        private int msl = 24;
        private int maxIterations = 100000;
        private int maxHashSize = 256;
        private readonly Regex passwordCriteria = new(@"/(?=(.*[A-z]{2,}))(?=(.*?[^ \w]{2,}))(?=(.*?\d){2,})+^(.){12,}$/");

        public bool MatchesCriteria(string password)
        {
            return passwordCriteria.Match(password).Success;
        }

        public byte[] GenerateRandomBytes(int length)
        {
            var temp = new byte[length];
            using var cryptoProvide = new RNGCryptoServiceProvider();
            cryptoProvide.GetNonZeroBytes(temp);
            return temp;
        }

        public bool GetTimesafeDifference(byte[] sourceA, byte[] sourceB)
        {
            var diff = sourceA.Length ^ sourceB.Length;
            for (var i = 0; i < sourceA.Length && i < sourceB.Length; i++)
            {
                diff |= sourceA[i] ^ sourceB[i];
            }

            return diff == 0;
        }

        public string GenerateHash(byte[] password, byte[] salt)
        {
            HashAlgorithm algorithm = new SHA256CryptoServiceProvider();
            algorithm.Initialize();
            var combined = new byte[password.Length + salt.Length];
            for (var i = 0; i < password.Length; i++)
            {
                combined[i]=password[i];
            }

            for (var i = 0; i < salt.Length; i++)
            {
                combined[i + password.Length] = salt[i];
            }

            return Convert.ToBase64String(algorithm.ComputeHash(combined));
        }
    }
}
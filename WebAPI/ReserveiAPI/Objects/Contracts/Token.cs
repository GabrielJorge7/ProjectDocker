using Jose;
using Newtonsoft.Json;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ReserveiAPI.Objects.Contracts
{
    public class Token
    {
        [Required(ErrorMessage = "O token é requerido")]
        public string TokenAcess { get; set; }

        public void GenerateToken(string email)
        {
            TokenSignatures securityEntity = new();

            var payload = new Dictionary<string, object>
            {
                { "iss", securityEntity.Issuer },
                { "aud", securityEntity.Audience },
                { "sub", email },
                { "exp", DateTimeOffset.UtcNow.AddMinutes(60).ToUnixTimeSeconds() },
            };

            this.TokenAcess = JWT.Encode(payload, Encoding.UTF8.GetBytes(securityEntity.Key), JwsAlgorithm.HS256);
        }

        public bool ValidateToken()
        {
            TokenSignatures securityEntity = new();

            string[] tokenParts = this.TokenAcess.Split('.');
            if (tokenParts.Length != 3)
            {
                return false;
            }

            try
            {
                string decodedToken = Encoding.UTF8.GetString(Base64Url.Decode(tokenParts[1]));

                var payload = JsonConvert.DeserializeObject<Dictionary<string, object>>(decodedToken);
                if (!payload.TryGetValue("iss", out object issuerClaim) || !payload.TryGetValue("aud", out object audienceClaim))
                {
                    return false;
                }

                if (issuerClaim.ToString() != securityEntity.Issuer || audienceClaim.ToString() != securityEntity.Audience)
                {
                    return false;
                }

                if (payload.TryGetValue("exp", out object expirationClaim))
                {
                    long expirationTime = long.Parse(expirationClaim.ToString());
                    var expirationDateTime = DateTimeOffset.FromUnixTimeSeconds(expirationTime).UtcDateTime;
                    if (expirationDateTime < DateTime.UtcNow)
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public string ExtractSubject()
        {
            string[] tokenParts = this.TokenAcess.Split('.');
            if (tokenParts.Length != 3)
            {
                return string.Empty;
            }

            try
            {
                string decodedToken = Encoding.UTF8.GetString(Base64Url.Decode(tokenParts[1]));

                var payload = JsonConvert.DeserializeObject<Dictionary<string, object>>(decodedToken);

                if (payload.TryGetValue("sub", out object subjectClaim))
                {
                    return subjectClaim.ToString();
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
    }
}
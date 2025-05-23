using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ReserveiAPI.Objects.DTOs.Entities
{
    public class UserDTO
    {
        public int Id { get; set; }

        [JsonPropertyName("nameUser")]
        [Required(ErrorMessage = "O nome é requerido!")]
        [MaxLength(100)]
        public string NameUser { get; set; }

        [JsonPropertyName("emailUser")]
        [Required(ErrorMessage = "O e-mail é requerido!")]
        [MinLength(10)]
        [MaxLength(100)]
        public string EmailUser
        {
            get => _emailUser;
            set => _emailUser = value.ToLower();
        }
        private string _emailUser;

        [JsonPropertyName("passwordUser")]
        [Required(ErrorMessage = "A senha é requerida!")]
        [MinLength(8)]
        [MaxLength(128)]
        public string PasswordUser { get; set; }

        [JsonPropertyName("phoneUser")]
        [Required(ErrorMessage = "O telefone é requerido!")]
        [MinLength(14)]
        [MaxLength(15)]
        public string PhoneUser { get; set; }
    }
}

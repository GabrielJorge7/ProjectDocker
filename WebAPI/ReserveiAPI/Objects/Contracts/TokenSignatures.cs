namespace ReserveiAPI.Objects.Contracts
{
    public class TokenSignatures
    {
        public string Issuer { get; } = "Course Guide API";
        public string Audience { get; } = "Course Guide API Website";
        public string Key { get; } = "CouserGuide_Barrament_api";
    }
}

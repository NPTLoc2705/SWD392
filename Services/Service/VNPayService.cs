using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Web;

public class VNPayService
{
    private readonly IConfiguration _config;
    public VNPayService(IConfiguration config)
    {
        _config = config;
    }

    public string CreatePaymentUrl(string appointmentId, decimal amount, string orderInfo)
    {
        var vnp_TmnCode = _config["VNPay:TmnCode"];
        var vnp_HashSecret = _config["VNPay:HashSecret"];
        var vnp_Url = _config["VNPay:Url"];
        var vnp_Returnurl = _config["VNPay:ReturnUrl"];

        var vnp_Version = "2.1.0";
        var vnp_Command = "pay";
        var vnp_OrderType = "other";
        var vnp_Amount = ((int)(amount * 100)).ToString(); // VNPay yêu cầu nhân 100
        var vnp_TxnRef = appointmentId;
        var vnp_IpAddr = "127.0.0.1";
        var vnp_CreateDate = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

        var inputData = new SortedDictionary<string, string>
        {
            { "vnp_Version", vnp_Version },
            { "vnp_Command", vnp_Command },
            { "vnp_TmnCode", vnp_TmnCode },
            { "vnp_Amount", vnp_Amount },
            { "vnp_CurrCode", "VND" },
            { "vnp_TxnRef", vnp_TxnRef },
            { "vnp_OrderInfo", orderInfo },
            { "vnp_OrderType", vnp_OrderType },
            { "vnp_Locale", "vn" },
            { "vnp_ReturnUrl", vnp_Returnurl },
            { "vnp_IpAddr", vnp_IpAddr },
            { "vnp_CreateDate", vnp_CreateDate }
        };

        var query = new StringBuilder();
        foreach (var item in inputData)
        {
            query.Append(HttpUtility.UrlEncode(item.Key) + "=" + HttpUtility.UrlEncode(item.Value) + "&");
        }
        var signData = query.ToString().TrimEnd('&');
        var vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);
        var paymentUrl = $"{vnp_Url}?{signData}&vnp_SecureHash={vnp_SecureHash}";
        return paymentUrl;
    }

    private string HmacSHA512(string key, string inputData)
    {
        var hash = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var bytes = hash.ComputeHash(Encoding.UTF8.GetBytes(inputData));
        return BitConverter.ToString(bytes).Replace("-", "").ToLower();
    }
}
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Cryptography;
using System.Text;

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
            if (!string.IsNullOrEmpty(item.Value))
            {
                query.Append(WebUtility.UrlEncode(item.Key) + "=" + WebUtility.UrlEncode(item.Value) + "&");
            }
        }

        // Remove the last '&' character
        var queryString = query.ToString();
        if (queryString.Length > 0)
        {
            queryString = queryString.Remove(queryString.Length - 1, 1);
        }

        var vnp_SecureHash = HmacSHA512(vnp_HashSecret, queryString);
        var paymentUrl = $"{vnp_Url}?{queryString}&vnp_SecureHash={vnp_SecureHash}";
        return paymentUrl;
    }

    private string HmacSHA512(string key, string inputData)
    {
        var hash = new StringBuilder();
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (var hmac = new HMACSHA512(keyBytes))
        {
            byte[] hashValue = hmac.ComputeHash(inputBytes);
            foreach (var theByte in hashValue)
            {
                hash.Append(theByte.ToString("x2"));
            }
        }
        return hash.ToString();
    }
}
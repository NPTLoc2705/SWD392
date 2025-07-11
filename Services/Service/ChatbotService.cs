using BO.dtos.Request;
using BO.dtos.Response;
using BO.Dtos.Response;
using BO.Models; // For BO.Models.ChatHistory
using LLama;
using LLama.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Repo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ChatbotService : IChatbotService
    {
        private readonly LLamaWeights _weights;
        private readonly LLamaContext _context;
        private readonly InteractiveExecutor _executor;
        private readonly IChatHistoryRepo _chatHistoryRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _maxHistoryMessages = 5;

        public ChatbotService(
            IOptions<LlmSettings> llmSettings,
            IChatHistoryRepo chatHistoryRepo,
            IHttpContextAccessor httpContextAccessor)
        {
            _chatHistoryRepo = chatHistoryRepo ?? throw new ArgumentNullException(nameof(chatHistoryRepo));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));

            var settings = llmSettings.Value;
            if (!File.Exists(settings.ModelPath))
            {
                throw new FileNotFoundException("Model file not found", settings.ModelPath);
            }

            var parameters = new ModelParams(settings.ModelPath)
            {
                ContextSize = 1024,
                GpuLayerCount = 0
            };

            _weights = LLamaWeights.LoadFromFile(parameters);
            _context = _weights.CreateContext(parameters);
            _executor = new InteractiveExecutor(_context);
        }

        public async Task<ChatbotResponse> GenerateResponse(ChatbotRequest request, int? userId)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                throw new ArgumentException("Message cannot be empty");

            // Use fully qualified BO.Models.ChatHistory
            List<BO.Models.ChatHistory> recentHistory = new List<BO.Models.ChatHistory>();
            if (userId.HasValue)
            {
                // Authenticated user: Get history from database
                var history = await _chatHistoryRepo.GetChatHistoryByUserId(userId.Value);
                recentHistory = history.OrderByDescending(h => h.Timestamp)
                                      .Take(_maxHistoryMessages)
                                      .OrderBy(h => h.Timestamp)
                                      .ToList();
            }
            else
            {
                // Guest user: Get history from session
                var session = _httpContextAccessor.HttpContext.Session;
                var historyJson = session.GetString("GuestChatHistory");
                if (!string.IsNullOrEmpty(historyJson))
                {
                    recentHistory = JsonSerializer.Deserialize<List<BO.Models.ChatHistory>>(historyJson)
                                    ?.TakeLast(_maxHistoryMessages)
                                    .ToList() ?? new List<BO.Models.ChatHistory>();
                }
            }

            // Build prompt with history
            var prompt = "You are a helpful assistant. Below is the conversation history:\n";
            foreach (var chat in recentHistory)
            {
                prompt += $"User: {chat.Message}\nAssistant: {chat.Response}\n";
            }
            prompt += $"User: {request.Message}\nAssistant: ";

            // Generate response
            var inferenceParams = new InferenceParams()
            {
                MaxTokens = 256,
                AntiPrompts = new[] { "User:", "\n\n" }
            };

            var responseText = "";
            await foreach (var token in _executor.InferAsync(prompt, inferenceParams))
            {
                responseText += token;
            }

            responseText = responseText.Trim();

            // Save to database for authenticated users or session for guests
            var newChat = new BO.Models.ChatHistory
            {
                UserId = userId ?? 0, // 0 for guests, not used in DB
                Message = request.Message,
                Response = responseText,
                Timestamp = DateTime.UtcNow
            };

            if (userId.HasValue)
            {
                await _chatHistoryRepo.SaveChatMessage(userId.Value, request.Message, responseText);
            }
            else
            {
                // Update guest session history
                recentHistory.Add(newChat);
                if (recentHistory.Count > _maxHistoryMessages)
                    recentHistory = recentHistory.TakeLast(_maxHistoryMessages).ToList();
                var session = _httpContextAccessor.HttpContext.Session;
                session.SetString("GuestChatHistory", JsonSerializer.Serialize(recentHistory));
            }

            return new ChatbotResponse { Reply = responseText };
        }

        public async Task<List<ChatHistoryResponse>> GetChatHistory(int userId)
        {
            var history = await _chatHistoryRepo.GetChatHistoryByUserId(userId);
            return history.Select(h => new ChatHistoryResponse
            {
                Id = h.Id,
                Message = h.Message,
                Response = h.Response,
                Timestamp = h.Timestamp
            }).ToList();
        }

        public void Dispose()
        {
            _context?.Dispose();
            _weights?.Dispose();
        }
    }
}
using BO.dtos.Request;
using BO.dtos.Response;
using BO.Dtos.Response;
using BO.Models;
using LLama;
using LLama.Common;
using Microsoft.Extensions.Options;
using Repo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Service
{
    public class ChatbotService : IChatbotService
    {
        private readonly LLamaWeights _weights;
        private readonly LLamaContext _context;
        private readonly InteractiveExecutor _executor;
        private readonly IChatHistoryRepo _chatHistoryRepo;
        private readonly int _maxHistoryMessages = 5; // Limit history to avoid exceeding context size

        public ChatbotService(IOptions<LlmSettings> llmSettings, IChatHistoryRepo chatHistoryRepo)
        {
            _chatHistoryRepo = chatHistoryRepo ?? throw new ArgumentNullException(nameof(chatHistoryRepo));

            var settings = llmSettings.Value;
            if (!File.Exists(settings.ModelPath))
            {
                throw new FileNotFoundException("Model file not found", settings.ModelPath);
            }

            var parameters = new ModelParams(settings.ModelPath)
            {
                ContextSize = 1024, // Increased to accommodate history
                GpuLayerCount = 0 // CPU; set >0 for GPU
            };

            // Correct way to load weights
            _weights = LLamaWeights.LoadFromFile(parameters);

            // Correct way to create context
            _context = _weights.CreateContext(parameters);

            // Correct way to initialize executor - no InferenceParams in constructor
            _executor = new InteractiveExecutor(_context);
        }

        public async Task<ChatbotResponse> GenerateResponse(ChatbotRequest request, int userId)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                throw new ArgumentException("Message cannot be empty");

            // Get recent chat history
            var history = await _chatHistoryRepo.GetChatHistoryByUserId(userId);
            var recentHistory = history.OrderByDescending(h => h.Timestamp)
                                      .Take(_maxHistoryMessages)
                                      .OrderBy(h => h.Timestamp) // Oldest to newest
                                      .ToList();

            // Build prompt with history
            var prompt = "You are a helpful assistant. Below is the conversation history:\n";
            foreach (var chat in recentHistory)
            {
                prompt += $"User: {chat.Message}\nAssistant: {chat.Response}\n";
            }
            prompt += $"User: {request.Message}\nAssistant: ";

            // Generate response using the executor directly
            var inferenceParams = new InferenceParams()
            {
                MaxTokens = 256, // Limit response length
                AntiPrompts = new[] { "User:", "\n\n" } // Stop generation at these tokens
            };

            var responseText = "";
            await foreach (var token in _executor.InferAsync(prompt, inferenceParams))
            {
                responseText += token;
            }

            responseText = responseText.Trim();

            // Save to database
            await _chatHistoryRepo.SaveChatMessage(userId, request.Message, responseText);

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

        // Implement IDisposable to properly cleanup resources
        public void Dispose()
        {
            _context?.Dispose();
            _weights?.Dispose();
        }
    }
}
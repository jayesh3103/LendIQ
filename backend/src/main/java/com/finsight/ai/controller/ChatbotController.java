package com.finsight.ai.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finsight.ai.entity.Budget;
import com.finsight.ai.entity.Expense;
import com.finsight.ai.entity.ExpenseCategory;
import com.finsight.ai.entity.User;
import com.finsight.ai.service.BudgetService;
import com.finsight.ai.service.ChatbotService;
import com.finsight.ai.service.ExpenseService;
import com.finsight.ai.service.FirebaseAuthService;
import com.finsight.ai.service.UserService;
import com.google.firebase.auth.FirebaseToken;

@RestController
@RequestMapping("/ai-chatbot")
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private UserService userService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> payload) {

        try {
            /* ==========================
               1️⃣ Firebase Auth
            ========================== */
            String token = authHeader.replace("Bearer ", "");
            FirebaseToken firebaseToken = firebaseAuthService.verifyToken(token);

            if (firebaseToken == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid authentication token"));
            }

            String firebaseUid = firebaseToken.getUid();

            Optional<User> userOptional =
                    userService.getUserByFirebaseUid(firebaseUid);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "User not found"));
            }

            User user = userOptional.get();

            /* ==========================
               2️⃣ Request Inputs
            ========================== */
            String userMessage = (String) payload.get("message");

            // India defaults
            String currency =
                    (String) payload.getOrDefault("currency", "INR");
            String region =
                    (String) payload.getOrDefault("region", "IN");

            /* ==========================
               3️⃣ Date Ranges (Indian Finance)
            ========================== */
            LocalDate today = LocalDate.now();
            LocalDate monthStart = today.withDayOfMonth(1);
            LocalDate monthEnd = today.withDayOfMonth(today.lengthOfMonth());

            LocalDate sixMonthsAgo = today.minusMonths(6);

            /* ==========================
               4️⃣ Expense & Budget Data
            ========================== */
            List<Expense> allExpenses =
                    expenseService.getUserExpenses(user);

            List<Expense> currentMonthExpenses =
                    expenseService.getUserExpensesByDateRange(
                            user, monthStart, monthEnd);

            List<Expense> lastSixMonthExpenses =
                    expenseService.getUserExpensesByDateRange(
                            user, sixMonthsAgo, today);

            List<Budget> currentBudgets =
                    budgetService.getUserBudgetsByMonth(
                            user, today.getMonthValue(), today.getYear());

            List<Budget> allBudgets =
                    budgetService.getUserBudgets(user);

            /* ==========================
               5️⃣ Calculations
            ========================== */
            BigDecimal spentThisMonth =
                    expenseService.getTotalExpenses(user, monthStart, monthEnd);

            BigDecimal spentLastSixMonths =
                    expenseService.getTotalExpenses(user, sixMonthsAgo, today);

            BigDecimal lifetimeSpending =
                    allExpenses.stream()
                            .map(Expense::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<ExpenseCategory, BigDecimal> categoryWiseSpending =
                    expenseService.getExpensesByCategory(
                            user, monthStart, monthEnd);

            BigDecimal totalMonthlyBudget =
                    currentBudgets.stream()
                            .map(Budget::getMonthlyLimit)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

            double monthlyAverage =
                    lastSixMonthExpenses.isEmpty()
                            ? 0.0
                            : spentLastSixMonths
                                    .divide(BigDecimal.valueOf(6), 2, BigDecimal.ROUND_HALF_UP)
                                    .doubleValue();

            /* ==========================
               6️⃣ AI Context (India-Friendly)
            ========================== */
            Map<String, Object> aiContext = new HashMap<>();
            aiContext.put("message", userMessage);
            aiContext.put("currency", currency);
            aiContext.put("region", region);
            aiContext.put("country", "India");
            aiContext.put("userName", user.getFirstName());

            aiContext.put("currentMonth", today.getMonth().toString());
            aiContext.put("currentYear", today.getYear());

            aiContext.put("spentThisMonth", spentThisMonth);
            aiContext.put("monthlyBudget", totalMonthlyBudget);
            aiContext.put("expenseCountThisMonth", currentMonthExpenses.size());

            aiContext.put("spentLast6Months", spentLastSixMonths);
            aiContext.put("lifetimeSpending", lifetimeSpending);
            aiContext.put("monthlyAverage", BigDecimal.valueOf(monthlyAverage));

            aiContext.put("categoryBreakdown", categoryWiseSpending);
            aiContext.put("budgetCount", allBudgets.size());

            aiContext.put("financeContext",
                    "Indian user, INR currency, EMI & monthly budgeting mindset");

            /* ==========================
               7️⃣ AI Reply
            ========================== */
            String aiReply =
                    chatbotService.getChatbotReply(
                            userMessage, firebaseUid, currency);

            return ResponseEntity.ok(
                    Map.of("reply", aiReply)
            );

        } catch (Exception e) {
            System.err.println("Chatbot error: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to process chat request"
                    ));
        }
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }
}

package com.finsight.ai.controller;

import com.finsight.ai.dto.BudgetDto;
import com.finsight.ai.entity.Budget;
import com.finsight.ai.entity.User;
import com.finsight.ai.service.BudgetService;
import com.finsight.ai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;

    public BudgetController(BudgetService budgetService,
                            UserService userService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    /* =========================================
       Create Budget (India-focused)
    ========================================== */
    @PostMapping
    public ResponseEntity<?> createBudget(
            @RequestHeader("Authorization") String authToken,
            @Valid @RequestBody BudgetDto budgetDto) {

        try {
            User user = authenticate(authToken);
            Budget budget = budgetService.createBudget(budgetDto, user);

            Map<String, Object> response = new HashMap<>();
            response.put("platform", "LendIQ");
            response.put("message", "Budget created successfully");
            response.put("currency", user.getPreferredCurrency());
            response.put("month", Month.of(budget.getMonth()).name());
            response.put("data", budgetService.convertToDto(budget));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* =========================================
       Get Budgets (All / Month-wise)
    ========================================== */
    @GetMapping
    public ResponseEntity<?> getUserBudgets(
            @RequestHeader("Authorization") String authToken,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        try {
            User user = authenticate(authToken);

            List<Budget> budgets = (month != null && year != null)
                    ? budgetService.getUserBudgetsByMonth(user, month, year)
                    : budgetService.getUserBudgets(user);

            List<BudgetDto> budgetDtos = budgets.stream()
                    .map(budgetService::convertToDto)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("platform", "LendIQ");
            response.put("currency", user.getPreferredCurrency());
            response.put("count", budgetDtos.size());
            response.put("budgets", budgetDtos);

            if (month != null && year != null) {
                response.put("period", Month.of(month).name() + " " + year);
            }

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* =========================================
       Update Budget (Smart Status)
    ========================================== */
    @PutMapping("/{budgetId}")
    public ResponseEntity<?> updateBudget(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long budgetId,
            @Valid @RequestBody BudgetDto budgetDto) {

        try {
            User user = authenticate(authToken);
            Budget updatedBudget =
                    budgetService.updateBudget(budgetId, budgetDto, user);

            Map<String, Object> response = new HashMap<>();
            response.put("platform", "LendIQ");
            response.put("message", "Budget updated successfully");
            response.put("currency", user.getPreferredCurrency());
            response.put("status",
                    updatedBudget.isOverBudget() ? "OVER_LIMIT" : "SAFE");
            response.put("data",
                    budgetService.convertToDto(updatedBudget));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* =========================================
       Delete Budget
    ========================================== */
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<?> deleteBudget(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long budgetId) {

        try {
            User user = authenticate(authToken);
            budgetService.deleteBudget(budgetId, user);

            return ResponseEntity.ok(
                    Map.of(
                            "platform", "LendIQ",
                            "message", "Budget deleted successfully",
                            "suggestion", "Consider reallocating funds to EMI or savings"
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* =========================================
       Utility: Auth Handler (unchanged logic)
    ========================================== */
    private User authenticate(String authToken) {
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization token");
        }
        String token = authToken.substring(7);
        return userService.getUserFromToken(token);
    }
}

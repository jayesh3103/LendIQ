package com.finsight.ai.controller;

import com.finsight.ai.dto.ExpenseDto;
import com.finsight.ai.entity.Expense;
import com.finsight.ai.entity.ExpenseCategory;
import com.finsight.ai.entity.User;
import com.finsight.ai.service.ExpenseService;
import com.finsight.ai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    /* ==========================
       Create Expense
    ========================== */
    @PostMapping
    public ResponseEntity<?> createExpense(
            @RequestHeader("Authorization") String authToken,
            @Valid @RequestBody ExpenseDto expenseDto) {

        try {
            User user = getUser(authToken);
            Expense expense = expenseService.createExpense(expenseDto, user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Expense added successfully",
                            "currency", user.getPreferredCurrency(),
                            "data", expense
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Get Expenses (Filters)
    ========================== */
    @GetMapping
    public ResponseEntity<?> getUserExpenses(
            @RequestHeader("Authorization") String authToken,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate,
            @RequestParam(required = false)
            ExpenseCategory category) {

        try {
            User user = getUser(authToken);

            List<Expense> expenses;
            if (startDate != null && endDate != null && category != null) {
                expenses = expenseService
                        .getUserExpensesByCategoryAndDateRange(user, category, startDate, endDate);
            } else if (startDate != null && endDate != null) {
                expenses = expenseService
                        .getUserExpensesByDateRange(user, startDate, endDate);
            } else if (category != null) {
                expenses = expenseService
                        .getUserExpensesByCategory(user, category);
            } else {
                expenses = expenseService.getUserExpenses(user);
            }

            return ResponseEntity.ok(
                    Map.of(
                            "count", expenses.size(),
                            "currency", user.getPreferredCurrency(),
                            "expenses", expenses
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Get Single Expense
    ========================== */
    @GetMapping("/{expenseId}")
    public ResponseEntity<?> getExpense(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long expenseId) {

        try {
            User user = getUser(authToken);

            Expense expense = expenseService.getUserExpenses(user).stream()
                    .filter(e -> e.getId().equals(expenseId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Expense not found"));

            return ResponseEntity.ok(expense);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Update Expense
    ========================== */
    @PutMapping("/{expenseId}")
    public ResponseEntity<?> updateExpense(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long expenseId,
            @Valid @RequestBody ExpenseDto expenseDto) {

        try {
            User user = getUser(authToken);
            Expense expense =
                    expenseService.updateExpense(expenseId, expenseDto, user);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Expense updated successfully",
                            "data", expense
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Delete Expense
    ========================== */
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long expenseId) {

        try {
            User user = getUser(authToken);
            expenseService.deleteExpense(expenseId, user);

            return ResponseEntity.ok(
                    Map.of("message", "Expense deleted successfully")
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Total Expenses
    ========================== */
    @GetMapping("/total")
    public ResponseEntity<?> getTotalExpenses(
            @RequestHeader("Authorization") String authToken,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        try {
            User user = getUser(authToken);
            BigDecimal total =
                    expenseService.getTotalExpenses(user, startDate, endDate);

            return ResponseEntity.ok(
                    Map.of(
                            "currency", user.getPreferredCurrency(),
                            "total", total
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Expenses by Category
    ========================== */
    @GetMapping("/by-category")
    public ResponseEntity<?> getExpensesByCategory(
            @RequestHeader("Authorization") String authToken,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        try {
            User user = getUser(authToken);
            Map<ExpenseCategory, BigDecimal> expenses =
                    expenseService.getExpensesByCategory(user, startDate, endDate);

            return ResponseEntity.ok(expenses);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Daily Expenses
    ========================== */
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyExpenses(
            @RequestHeader("Authorization") String authToken,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        try {
            User user = getUser(authToken);
            return ResponseEntity.ok(
                    expenseService.getDailyExpenses(user, startDate, endDate)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /* ==========================
       Utility
    ========================== */
    private User getUser(String authToken) {
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization token");
        }
        return userService.getUserFromToken(authToken.substring(7));
    }
}




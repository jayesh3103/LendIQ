package com.finsight.ai.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.finsight.ai.entity.Budget;
import com.finsight.ai.entity.Expense;
import com.finsight.ai.entity.ExpenseCategory;
import com.finsight.ai.entity.RecurrenceFrequency;
import com.finsight.ai.entity.RecurringExpense;
import com.finsight.ai.entity.User;
import com.finsight.ai.repository.BudgetRepository;
import com.finsight.ai.repository.ExpenseRepository;
import com.finsight.ai.repository.RecurringExpenseRepository;
import com.finsight.ai.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private RecurringExpenseRepository recurringExpenseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Keeping seeding disabled for real-user flow
        // Uncomment only for local testing or demo
        // if (userRepository.count() == 0) {
        //     seedData();
        // }
        System.out.println("DataSeeder: Sample data disabled (India-ready production setup)");
    }

    private void seedData() {

        /* ===============================
           Demo User (India Context)
        =============================== */
        User demoUser = new User(
                "demo-firebase-uid",
                "demo@lendiq.in",
                "Jayesh",
                "Jain"
        );
        demoUser.setCurrency("INR");          // India currency
        demoUser.setDarkMode(false);
        demoUser = userRepository.save(demoUser);

        /* ===============================
           Sample Expenses (Indian Lifestyle)
        =============================== */
        List<Expense> expenses = Arrays.asList(
                new Expense("Grocery shopping", new BigDecimal("850.50"), ExpenseCategory.GROCERIES, LocalDate.now().minusDays(1), demoUser),
                new Expense("Petrol refill", new BigDecimal("450.20"), ExpenseCategory.TRANSPORTATION, LocalDate.now().minusDays(2), demoUser),
                new Expense("Tea & snacks", new BigDecimal("120.75"), ExpenseCategory.FOOD_DINING, LocalDate.now().minusDays(3), demoUser),
                new Expense("OTT subscription", new BigDecimal("499.00"), ExpenseCategory.ENTERTAINMENT, LocalDate.now().minusDays(4), demoUser),
                new Expense("Electricity bill", new BigDecimal("1200.00"), ExpenseCategory.BILLS_UTILITIES, LocalDate.now().minusDays(5), demoUser),
                new Expense("Lunch outside", new BigDecimal("280.50"), ExpenseCategory.FOOD_DINING, LocalDate.now().minusDays(6), demoUser),
                new Expense("College books", new BigDecimal("999.00"), ExpenseCategory.EDUCATION, LocalDate.now().minusDays(7), demoUser),
                new Expense("Medical expenses", new BigDecimal("500.00"), ExpenseCategory.HEALTHCARE, LocalDate.now().minusDays(8), demoUser),
                new Expense("Online shopping", new BigDecimal("750.30"), ExpenseCategory.SHOPPING, LocalDate.now().minusDays(9), demoUser),
                new Expense("Auto / cab ride", new BigDecimal("180.45"), ExpenseCategory.TRANSPORTATION, LocalDate.now().minusDays(10), demoUser),
                new Expense("Movie tickets", new BigDecimal("240.00"), ExpenseCategory.ENTERTAINMENT, LocalDate.now().minusDays(11), demoUser),
                new Expense("Salon visit", new BigDecimal("350.00"), ExpenseCategory.PERSONAL_CARE, LocalDate.now().minusDays(12), demoUser),
                new Expense("Mobile recharge", new BigDecimal("299.00"), ExpenseCategory.BILLS_UTILITIES, LocalDate.now().minusDays(13), demoUser),
                new Expense("Monthly groceries", new BigDecimal("920.15"), ExpenseCategory.GROCERIES, LocalDate.now().minusDays(14), demoUser),
                new Expense("Gift purchase", new BigDecimal("400.00"), ExpenseCategory.GIFTS_DONATIONS, LocalDate.now().minusDays(15), demoUser)
        );

        expenseRepository.saveAll(expenses);

        /* ===============================
           Monthly Budgets (₹ INR)
        =============================== */
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        List<Budget> budgets = Arrays.asList(
                new Budget(ExpenseCategory.GROCERIES, new BigDecimal("4000.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.FOOD_DINING, new BigDecimal("3000.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.TRANSPORTATION, new BigDecimal("2000.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.ENTERTAINMENT, new BigDecimal("1500.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.BILLS_UTILITIES, new BigDecimal("2500.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.SHOPPING, new BigDecimal("2000.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.HEALTHCARE, new BigDecimal("1500.00"), currentMonth, currentYear, demoUser),
                new Budget(ExpenseCategory.PERSONAL_CARE, new BigDecimal("1000.00"), currentMonth, currentYear, demoUser)
        );

        budgetRepository.saveAll(budgets);

        /* ===============================
           Recurring Expenses (India)
        =============================== */
        List<RecurringExpense> recurringExpenses = Arrays.asList(
                new RecurringExpense("OTT Subscription", new BigDecimal("499.00"), ExpenseCategory.ENTERTAINMENT,
                        RecurrenceFrequency.MONTHLY, LocalDate.now().withDayOfMonth(1), demoUser),
                new RecurringExpense("Gym Membership", new BigDecimal("1000.00"), ExpenseCategory.HEALTHCARE,
                        RecurrenceFrequency.MONTHLY, LocalDate.now().withDayOfMonth(10), demoUser),
                new RecurringExpense("Mobile Recharge", new BigDecimal("299.00"), ExpenseCategory.BILLS_UTILITIES,
                        RecurrenceFrequency.MONTHLY, LocalDate.now().withDayOfMonth(5), demoUser),
                new RecurringExpense("Coffee / Snacks", new BigDecimal("250.00"), ExpenseCategory.FOOD_DINING,
                        RecurrenceFrequency.MONTHLY, LocalDate.now().withDayOfMonth(15), demoUser)
        );

        recurringExpenseRepository.saveAll(recurringExpenses);

        System.out.println("India-style sample data seeded successfully!");
    }
}


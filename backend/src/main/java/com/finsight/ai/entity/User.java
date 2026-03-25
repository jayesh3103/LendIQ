package com.finsight.ai.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(
    name = "lendiq_users",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_firebase", columnList = "firebaseUid")
    }
)
public class User {

    /* =====================
       Primary Details
    ====================== */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String firebaseUid;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    /* =====================
       Profile & Preferences
    ====================== */
    @Column(columnDefinition = "TEXT")
    private String profileImageUrl;

    @Column(nullable = false)
    private Boolean darkModeEnabled = false;

    /**
     * Default currency set to INR for India
     */
    @Column(nullable = false, length = 3)
    private String preferredCurrency = "INR";

    /**
     * Indian context – helpful for AI insights later
     * Example: Asia/Kolkata
     */
    @Column(nullable = false)
    private String timeZone = "Asia/Kolkata";

    /**
     * Monthly salary credit day (1–31)
     * Used for smart budget & EMI reminders
     */
    @Column(nullable = false)
    private Integer salaryCreditDay = 1;

    /* =====================
       LendIQ Intelligence
    ====================== */

    /**
     * Enables AI-based insights & alerts
     */
    @Column(nullable = false)
    private Boolean aiInsightsEnabled = true;

    /**
     * Overall financial health score (0–100)
     * Calculated by LendIQ engine
     */
    @Column(nullable = false)
    private Integer financialHealthScore = 50;

    /**
     * User notification preference
     */
    @Column(nullable = false)
    private Boolean notificationsEnabled = true;

    /* =====================
       Audit Fields
    ====================== */
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /* =====================
       Relationships
    ====================== */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Expense> expenses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Budget> budgets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RecurringExpense> recurringExpenses;

    /* =====================
       Constructors
    ====================== */
    public User() {}

    public User(String firebaseUid, String email, String firstName, String lastName) {
        this.firebaseUid = firebaseUid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    /* =====================
       Derived / Interactive Logic
    ====================== */

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Transient
    public boolean isIndianUser() {
        return "INR".equalsIgnoreCase(preferredCurrency);
    }

    /* =====================
       Getters & Setters
    ====================== */
    public Long getId() {
        return id;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getDarkModeEnabled() {
        return darkModeEnabled;
    }

    public void setDarkModeEnabled(Boolean darkModeEnabled) {
        this.darkModeEnabled = darkModeEnabled;
    }

    public String getPreferredCurrency() {
        return preferredCurrency;
    }

    public void setPreferredCurrency(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }

    // Compatibility methods for existing code
    public String getCurrency() {
        return preferredCurrency;
    }

    public void setCurrency(String currency) {
        this.preferredCurrency = currency;
    }

    public Boolean getDarkMode() {
        return darkModeEnabled;
    }

    public void setDarkMode(Boolean darkMode) {
        this.darkModeEnabled = darkMode;
    }

    public String getProfilePictureUrl() {
        return profileImageUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profileImageUrl = profilePictureUrl;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public Integer getSalaryCreditDay() {
        return salaryCreditDay;
    }

    public void setSalaryCreditDay(Integer salaryCreditDay) {
        this.salaryCreditDay = salaryCreditDay;
    }

    public Boolean getAiInsightsEnabled() {
        return aiInsightsEnabled;
    }

    public void setAiInsightsEnabled(Boolean aiInsightsEnabled) {
        this.aiInsightsEnabled = aiInsightsEnabled;
    }

    public Integer getFinancialHealthScore() {
        return financialHealthScore;
    }

    public void setFinancialHealthScore(Integer financialHealthScore) {
        this.financialHealthScore = financialHealthScore;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(Boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Expense> getExpenses() {
        return expenses;
    }

    public List<Budget> getBudgets() {
        return budgets;
    }

    public List<RecurringExpense> getRecurringExpenses() {
        return recurringExpenses;
    }
}

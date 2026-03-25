import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Menu,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import * as ApiService from '../services/api';
import {
  formatCurrency,
  expenseCategories,
  getCurrentMonth,
  getCurrencySymbol,
} from '../utils/helpers';
import { useUser } from '../contexts/UserContext';

/* ===============================
   LendIQ Lavender Theme
================================ */
const lendiqColors = {
  primary: '#7C6AE6',
  secondary: '#B39DDB',
  light: '#F3EFFF',
  success: '#6FCF97',
  warning: '#F2C94C',
  error: '#EB5757',
};

const LendIQBudgets = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userProfile } = useUser();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState('');

  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.month);
  const [selectedYear, setSelectedYear] = useState(currentMonth.year);

  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    month: selectedMonth,
    year: selectedYear,
  });

  // Helper lists for month/year selectors
  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const yearOptions = [currentMonth.year - 1, currentMonth.year, currentMonth.year + 1];

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ApiService.getBudgets({
        month: selectedMonth,
        year: selectedYear,
      });
      setBudgets(data || []);
    } catch {
      setError('Failed to load LendIQ budgets');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets, userProfile.currency]);

  // When editingBudget is set, open dialog and prefill form
  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        monthlyLimit: editingBudget.monthlyLimit,
        month: editingBudget.month,
        year: editingBudget.year,
      });
      setOpenDialog(true);
    }
  }, [editingBudget]);

  const handleCreateBudget = async () => {
    try {
  // Clear previous dialog error
  setDialogError('');

  // Basic client-side validation
      const limit = parseFloat(formData.monthlyLimit);
      if (!formData.category || formData.category === '') {
        setDialogError('Please select a category for the budget.');
        return;
      }
      if (Number.isNaN(limit) || limit <= 0) {
        setDialogError('Please enter a valid monthly limit greater than 0.');
        return;
      }

      const payload = {
        ...formData,
        monthlyLimit: limit,
        month: Number(formData.month) || selectedMonth,
        year: Number(formData.year) || selectedYear,
      };

      // Log payload for debugging (remove in production)
      // eslint-disable-next-line no-console
      console.debug('Creating/updating budget with payload:', payload);

      if (editingBudget) {
        await ApiService.updateBudget(editingBudget.id, payload);
      } else {
        await ApiService.createBudget(payload);
      }

      await fetchBudgets();
      setOpenDialog(false);
      setEditingBudget(null);
    } catch (err) {
      // Try to extract a useful message
      // eslint-disable-next-line no-console
      console.error('Budget create/update failed:', err);

      const serverData = err?.response?.data;
      let serverMessage = '';

      if (serverData) {
        if (typeof serverData === 'string') serverMessage = serverData;
        else if (serverData.message) serverMessage = serverData.message;
        else if (serverData.error) serverMessage = serverData.error;
        else if (serverData.errors) serverMessage = Array.isArray(serverData.errors)
          ? serverData.errors.join('; ')
          : JSON.stringify(serverData.errors);
        else {
          try { serverMessage = JSON.stringify(serverData); } catch (e) { serverMessage = String(serverData); }
        }
      } else {
        serverMessage = err?.message || 'Something went wrong. Please check details.';
      }

      // If backend says budget already exists, attempt to update the existing budget instead of failing
      if (serverMessage && serverMessage.toLowerCase().includes('budget already exists')) {
        const payload = {
          ...formData,
          monthlyLimit: parseFloat(formData.monthlyLimit),
          month: Number(formData.month) || selectedMonth,
          year: Number(formData.year) || selectedYear,
        };

        const findMatch = (list) => list && list.find(b => (
          String(b.category) === String(payload.category) &&
          Number(b.month) === Number(payload.month) &&
          Number(b.year) === Number(payload.year)
        ));

        let existing = findMatch(budgets);
        if (!existing) {
          // Try refetching budgets in case list was filtered/empty
          try {
            await fetchBudgets();
            existing = findMatch(budgets);
          } catch (refetchErr) {
            // ignore
          }
        }

        if (existing) {
          try {
            // eslint-disable-next-line no-console
            console.debug('Auto-updating existing budget id=', existing.id, 'with', payload);
            await ApiService.updateBudget(existing.id, payload);
            await fetchBudgets();
            setOpenDialog(false);
            setEditingBudget(null);
            setDialogError('');
            return;
          } catch (updateErr) {
            // eslint-disable-next-line no-console
            console.error('Auto-update failed:', updateErr);
            const updMsg = updateErr?.response?.data?.message || updateErr?.message || 'Failed to update existing budget';
            setDialogError(`Failed to update existing budget: ${updMsg}`);
            return;
          }
        }
      }

      const statusText = err?.status ? `(${err.status}) ` : '';
      setDialogError(`${statusText}${serverMessage}`);
    }
  };

  const getStatus = (spent, limit) => {
    const percent = (spent / limit) * 100;
    if (percent >= 100) return lendiqColors.error;
    if (percent >= 80) return lendiqColors.warning;
    return lendiqColors.primary;
  };

  const BudgetCard = ({ budget }) => {
    const progress = Math.min(
      (budget.currentSpent / budget.monthlyLimit) * 100,
      100
    );
    const remaining = budget.monthlyLimit - budget.currentSpent;
    const category = expenseCategories[budget.category];

    return (
      <motion.div whileHover={{ scale: 1.02 }}>
        <Card
          sx={{
            borderRadius: 3,
            borderLeft: `6px solid ${lendiqColors.primary}`,
            boxShadow: '0 8px 24px rgba(124,106,230,0.15)',
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: lendiqColors.light,
                    color: lendiqColors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: 20,
                  }}
                >
                  {category?.icon}
                </Box>
                <Box>
                  <Typography fontWeight={700}>
                    {category?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(budget.year, budget.month - 1).toLocaleString(
                      'en-IN',
                      { month: 'long', year: 'numeric' }
                    )}
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setSelectedBudget(budget);
              }}>
                <MoreVert />
              </IconButton>
            </Box>

            <Box mt={2}>
              <Typography variant="body2">
                Spent: {formatCurrency(budget.currentSpent, 'INR')}
              </Typography>
              <Typography variant="body2">
                Limit: {formatCurrency(budget.monthlyLimit, 'INR')}
              </Typography>

              <LinearProgress
                value={progress}
                variant="determinate"
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: lendiqColors.light,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getStatus(
                      budget.currentSpent,
                      budget.monthlyLimit
                    ),
                  },
                }}
              />
            </Box>

            <Box mt={2} display="flex" alignItems="center">
              {remaining >= 0 ? (
                <>
                  <TrendingUp color="success" />
                  <Typography ml={1} color="success.main">
                    ₹{remaining} remaining
                  </Typography>
                </>
              ) : (
                <>
                  <TrendingDown color="error" />
                  <Typography ml={1} color="error.main">
                    ₹{Math.abs(remaining)} over limit
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={1200} mx="auto">
      <Typography
        variant="h4"
        fontWeight={800}
        color={lendiqColors.primary}
        mb={3}
      >
        LendIQ Budgets 💜
      </Typography>

      <Box display="flex" alignItems="center" mb={3}>
        <Box mr={2} display="flex" alignItems="center">
          <FormControl size="small" sx={{ mr: 1, minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthNames.map((m, idx) => (
                <MenuItem key={m} value={idx + 1}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            // Reset dialog form for create and prefill with currently selected month/year
            setEditingBudget(null);
            setFormData({ category: '', monthlyLimit: '', month: selectedMonth, year: selectedYear });
            setDialogError('');
            setOpenDialog(true);
          }}
        sx={{
          mb: 3,
          background: `linear-gradient(45deg, ${lendiqColors.primary}, ${lendiqColors.secondary})`,
          borderRadius: 3,
          fontWeight: 700,
        }}
      >
        Add Budget
      </Button>
      </Box>

      {/* Debug: create a sample budget quickly for testing */}
      <Button
        variant="outlined"
        sx={{ ml: 2, mb: 3 }}
        onClick={async () => {
          // Clear previous errors
          setError('');
          try {
            const sample = {
              category: Object.keys(expenseCategories)[0] || 'FOOD_DINING',
              monthlyLimit: 999.99,
              month: selectedMonth || new Date().getMonth() + 1,
              year: selectedYear || new Date().getFullYear(),
            };
            // eslint-disable-next-line no-console
            console.debug('Posting sample budget:', sample);
            const res = await ApiService.createBudget(sample);
            // Backend returns created object under data or response
            // Show success briefly and refresh
            setError('Sample budget created successfully');
            await fetchBudgets();
            setTimeout(() => setError(''), 4000);
            // eslint-disable-next-line no-console
            console.debug('Create sample response:', res);
          } catch (err) {
            // Extract server message if available
            // eslint-disable-next-line no-console
            console.error('Sample budget create failed:', err);
            const serverData = err?.response?.data;
            let msg = '';
            if (serverData) {
              if (typeof serverData === 'string') msg = serverData;
              else if (serverData.message) msg = serverData.message;
              else if (serverData.error) msg = serverData.error;
              else msg = JSON.stringify(serverData);
            } else {
              msg = err?.message || 'Unknown error creating sample budget';
            }
            setError(`Failed to create sample budget: ${msg}`);
          }
        }}
      >
        Debug: Create Sample Budget
      </Button>

      <AnimatePresence>
        {budgets.length ? (
          budgets.map((b) => <BudgetCard key={b.id} budget={b} />)
        ) : (
          <Typography color="text.secondary">
            No LendIQ budgets yet. Start planning smarter 🇮🇳
          </Typography>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Create LendIQ Budget'}
        </DialogTitle>
        <DialogContent>
          {dialogError && <Alert severity="error">{dialogError}</Alert>}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {Object.entries(expenseCategories).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v.icon} {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Monthly Limit"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            value={formData.monthlyLimit}
            onChange={(e) =>
              setFormData({ ...formData, monthlyLimit: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBudget}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setEditingBudget(selectedBudget)}>
          <Edit /> Edit
        </MenuItem>
        <MenuItem
          onClick={() =>
            ApiService.deleteBudget(selectedBudget.id).then(fetchBudgets)
          }
        >
          <Delete /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LendIQBudgets;



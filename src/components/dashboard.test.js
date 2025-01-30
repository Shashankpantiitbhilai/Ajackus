import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserDashboard from './UserDashboard';
import { fetchInitialUsers } from '../services/initialLoad';
import { search } from '../utils/SearchHandler';

// Mock the services and dependencies
jest.mock('../services/initialLoad');
jest.mock('../services/paginationService');
jest.mock('../utils/SearchHandler');

// Mock XLSX for Excel operations
jest.mock('xlsx', () => ({
    utils: {
        json_to_sheet: jest.fn(),
        book_new: jest.fn(),
        book_append_sheet: jest.fn(),
    },
    writeFile: jest.fn(),
}));

describe('UserDashboard Component', () => {
    const mockUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            company: { name: 'IT' },
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            company: { name: 'HR' },
        },
    ];

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock the initial users fetch
        fetchInitialUsers.mockImplementation((setUsers) => {
            setUsers(mockUsers);
        });

        // Mock the search function
        search.mockImplementation((searchTerm, users) => users);
    });

    // Test 1: Initial Rendering
    test('renders loading state initially', () => {
        render(<UserDashboard />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Test 2: User List Rendering
    test('renders user list after loading', async () => {
        render(<UserDashboard />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    // Test 3: Search Functionality
    test('search bar filters users correctly', async () => {
        render(<UserDashboard />);
        const searchInput = screen.getByPlaceholderText(/search/i);

        await waitFor(() => {
            fireEvent.change(searchInput, { target: { value: 'John' } });
            expect(search).toHaveBeenCalledWith('John', mockUsers);
        });
    });

    // Test 4: Add User Form
    test('add user form submits correctly', async () => {
        const { getByLabelText, getByText } = render(<UserDashboard />);

        await waitFor(() => {
            // Fill out the form
            fireEvent.change(getByLabelText(/first name/i), {
                target: { value: 'Test' },
            });
            fireEvent.change(getByLabelText(/last name/i), {
                target: { value: 'User' },
            });
            fireEvent.change(getByLabelText(/email/i), {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(getByLabelText(/department/i), {
                target: { value: 'Testing' },
            });

            // Submit the form
            fireEvent.submit(getByText(/submit/i));
        });

        // Verify success message
        await waitFor(() => {
            expect(screen.getByText('User Saved')).toBeInTheDocument();
        });
    });

    // Test 5: Delete User Functionality
    test('delete user shows confirmation dialog', async () => {
        render(<UserDashboard />);

        await waitFor(() => {
            const deleteButton = screen.getAllByTitle('Delete')[0];
            fireEvent.click(deleteButton);
            expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
        });
    });

    // Test 6: Theme Toggle
    test('theme toggle changes mode', async () => {
        render(<UserDashboard />);

        const themeToggle = screen.getByRole('checkbox');
        await waitFor(() => {
            fireEvent.click(themeToggle);
            expect(themeToggle).toBeChecked();
        });
    });

    // Test 7: Department Filter
    test('department filter changes user list', async () => {
        render(<UserDashboard />);

        await waitFor(() => {
            const departmentSelect = screen.getByLabelText(/department/i);
            fireEvent.change(departmentSelect, { target: { value: 'IT' } });
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    // Test 8: Excel Export
    test('export to excel functionality', async () => {
        render(<UserDashboard />);

        await waitFor(() => {
            const exportButton = screen.getByTitle('Export to Excel');
            fireEvent.click(exportButton);
            expect(screen.getByText(/user saved/i)).toBeInTheDocument();
        });
    });

    // Test 9: Form Reset
    test('form reset clears all fields', async () => {
        const { getByLabelText, getByText } = render(<UserDashboard />);

        await waitFor(() => {
            // Fill form
            fireEvent.change(getByLabelText(/first name/i), {
                target: { value: 'Test' },
            });

            // Reset form
            fireEvent.click(getByText(/reset/i));

            // Check if fields are empty
            expect(getByLabelText(/first name/i)).toHaveValue('');
        });
    });

    // Test 10: Error Handling
    test('displays error message on failed API call', async () => {
        fetchInitialUsers.mockImplementation(() => {
            throw new Error('API Error');
        });

        render(<UserDashboard />);

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeInTheDocument();
        });
    });
});
import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  LayoutDashboard,
  UserRound,
  Plus,
  Search,
  Bell,
  Pencil,
  Trash2,
  X,
  Building2,
  CalendarDays,
  RefreshCw,
} from 'lucide-react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/employees/'

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  salary: '',
  joining_date: '',
  status: 'Active',
}

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadEmployees = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to load employees.')
      }

      const data = await response.json()
      setEmployees(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      setError('Backend connection failed. Django server running aanennu check cheyyuka.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const activeCount = employees.filter(
    (employee) => employee.status === 'Active',
  ).length

  const inactiveCount = employees.filter(
    (employee) => employee.status === 'Inactive',
  ).length

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim()

    return employees.filter((employee) =>
      [
        employee.full_name,
        employee.email,
        employee.department,
        employee.position,
      ].some((value) => value?.toLowerCase().includes(query)),
    )
  }, [employees, search])

  const openAddModal = () => {
    setEditingEmployee(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEditModal = (employee) => {
    setEditingEmployee(employee)
    setForm({
      full_name: employee.full_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      position: employee.position || '',
      salary: employee.salary || '',
      joining_date: employee.joining_date || '',
      status: employee.status || 'Active',
    })
    setShowModal(true)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const url = editingEmployee
      ? `${API_URL}${editingEmployee.id}/`
      : API_URL

    try {
      const response = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        const message = Object.entries(data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join('\n')
        throw new Error(message || 'Unable to save employee.')
      }

      setShowModal(false)
      setForm(emptyForm)
      setEditingEmployee(null)
      await loadEmployees()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const deleteEmployee = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.full_name}? This action cannot be undone.`,
    )

    if (!confirmed) return

    try {
      const response = await fetch(`${API_URL}${employee.id}/`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Unable to delete employee.')
      }

      await loadEmployees()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Users size={21} />
          </div>
          <div>
            <h2>PeopleDesk</h2>
            <p>Employee Management</p>
          </div>
        </div>

        <p className="nav-label">MAIN MENU</p>

        <nav className="nav-menu">
          <button className="nav-item active" type="button">
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button className="nav-item" type="button">
            <Users size={17} />
            Employees
          </button>

          <button className="nav-item" type="button">
            <Building2 size={17} />
            Departments
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">AD</div>
            <div>
              <strong>Administrator</strong>
              <small>HR Management</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <h3>Dashboard</h3>
            <p>Manage your workforce</p>
          </div>

          <div className="topbar-right">
            <button className="icon-button" type="button" title="Notifications">
              <Bell size={17} />
            </button>
            <div className="avatar">AD</div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <h1>Employee Overview</h1>
              <p>Here's what's happening with your organization.</p>
            </div>

            <button className="primary-button" onClick={openAddModal}>
              <Plus size={16} />
              Add Employee
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon purple">
                  <Users size={19} />
                </div>
              </div>
              <p>Total Employees</p>
              <h2>{employees.length}</h2>
              <div className="stat-note">All registered employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon green">
                  <UserCheck size={19} />
                </div>
              </div>
              <p>Active Employees</p>
              <h2>{activeCount}</h2>
              <div className="stat-note">Currently active employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon orange">
                  <UserX size={19} />
                </div>
              </div>
              <p>Inactive Employees</p>
              <h2>{inactiveCount}</h2>
              <div className="stat-note">Currently inactive employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon blue">
                  <BriefcaseBusiness size={19} />
                </div>
              </div>
              <p>Departments</p>
              <h2>{new Set(employees.map((employee) => employee.department)).size}</h2>
              <div className="stat-note">Departments in employee records</div>
            </div>
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Employee Directory</h2>
                <p>View and manage your employee records</p>
              </div>

              <div className="topbar-right">
                <div className="search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <button
                  className="icon-button"
                  type="button"
                  onClick={loadEmployees}
                  title="Refresh employees"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading employees...</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>DEPARTMENT</th>
                      <th>POSITION</th>
                      <th>JOINING DATE</th>
                      <th>SALARY</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          No employees found.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="employee-name">
                              {employee.full_name}
                            </div>
                            <div className="stat-note">{employee.email}</div>
                          </td>

                          <td>{employee.department}</td>
                          <td>{employee.position}</td>
                          <td>{employee.joining_date}</td>
                          <td>₹{Number(employee.salary).toLocaleString('en-IN')}</td>

                          <td>
                            <span
                              className={`status ${
                                employee.status === 'Active'
                                  ? 'active'
                                  : 'inactive'
                              }`}
                            >
                              {employee.status}
                            </span>
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-button"
                                type="button"
                                title="Edit employee"
                                onClick={() => openEditModal(employee)}
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                className="action-button delete"
                                type="button"
                                title="Delete employee"
                                onClick={() => deleteEmployee(employee)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="stat-note">Enter employee information below</p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={() => setShowModal(false)}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. IT"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="e.g. Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Salary (₹)</label>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter salary"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={form.joining_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingEmployee
                      ? 'Update Employee'
                      : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
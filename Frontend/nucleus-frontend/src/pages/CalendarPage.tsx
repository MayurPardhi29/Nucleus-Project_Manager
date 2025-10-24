import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import type { Issue } from '../types/Issue';
import type { Project } from '../types/Project';

const CalendarPage: React.FC = () => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter issues when project selection changes
  useEffect(() => {
    if (selectedProject === 'all') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => 
        issue.project?.id.toString() === selectedProject
      ));
    }
  }, [selectedProject, issues]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load issues
      const issuesResponse = await api.issues.getAll();
      if (issuesResponse.data.status === 'success' && issuesResponse.data.data) {
        setIssues(issuesResponse.data.data);
      }

      // Load projects
      const projectsResponse = await api.projects.getAll();
      if (projectsResponse.data.status === 'success' && projectsResponse.data.data) {
        setProjects(projectsResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentViewDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentViewDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentViewDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentViewDate(newDate);
  };

  const goToToday = () => {
    setCurrentViewDate(new Date());
  };

  // Get issues for a specific date
  const getIssuesForDate = (date: Date) => {
    return filteredIssues.filter(issue => {
      const issueDate = new Date(issue.createdAt);
      return (
        issueDate.getDate() === date.getDate() &&
        issueDate.getMonth() === date.getMonth() &&
        issueDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get issues for date range (for week view)
  const getIssuesForDateRange = (startDate: Date, endDate: Date) => {
    return filteredIssues.filter(issue => {
      const issueDate = new Date(issue.createdAt);
      return issueDate >= startDate && issueDate <= endDate;
    });
  };

  // Get color for issue status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#e74c3c';
      case 'IN_PROGRESS': return '#3498db';
      case 'CODE_REVIEW': return '#9b59b6';
      case 'TESTING': return '#f39c12';
      case 'DONE': return '#27ae60';
      case 'CLOSED': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  // Get color for issue priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOWEST': return '#27ae60';
      case 'LOW': return '#2ecc71';
      case 'MEDIUM': return '#f39c12';
      case 'HIGH': return '#e74c3c';
      case 'HIGHEST': return '#c0392b';
      case 'CRITICAL': return '#8e44ad';
      default: return '#95a5a6';
    }
  };

  // Month View Component
  const MonthView = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const weeks = [];
    let currentWeek = [];
    let currentDateInLoop = new Date(startDate);
    
    while (currentDateInLoop <= endDate) {
      currentWeek.push(new Date(currentDateInLoop));
      currentDateInLoop.setDate(currentDateInLoop.getDate() + 1);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return (
      <div style={styles.monthView}>
        <div style={styles.weekDaysHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              const isCurrentMonth = date.getMonth() === month;
              const isToday = date.toDateString() === new Date().toDateString();
              const dayIssues = getIssuesForDate(date);
              
              return (
                <div
                  key={dayIndex}
                  style={{
                    ...styles.monthDay,
                    ...(!isCurrentMonth && styles.otherMonthDay),
                    ...(isToday && styles.today)
                  }}
                  onClick={() => setCurrentViewDate(date)}
                >
                  <div style={styles.monthDayHeader}>
                    <span style={styles.monthDayNumber}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  <div style={styles.monthDayIssues}>
                    {dayIssues.slice(0, 3).map(issue => (
                      <div
                        key={issue.id}
                        style={{
                          ...styles.issueBadge,
                          backgroundColor: getStatusColor(issue.status)
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                        }}
                        title={`${issue.key}: ${issue.title}`}
                      >
                        <span style={styles.issueBadgeText}>
                          {issue.key}: {issue.title.substring(0, 15)}...
                        </span>
                      </div>
                    ))}
                    {dayIssues.length > 3 && (
                      <div style={styles.moreIssues}>
                        +{dayIssues.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Week View Component
  const WeekView = () => {
    const startOfWeek = new Date(currentViewDate);
    startOfWeek.setDate(currentViewDate.getDate() - currentViewDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    const weekIssues = getIssuesForDateRange(weekDays[0], weekDays[6]);

    return (
      <div style={styles.weekView}>
        <div style={styles.weekViewHeader}>
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const dayIssues = weekIssues.filter(issue => {
              const issueDate = new Date(issue.createdAt);
              return issueDate.toDateString() === date.toDateString();
            });

            return (
              <div
                key={index}
                style={{
                  ...styles.weekDayColumn,
                  ...(isToday && styles.todayColumn)
                }}
              >
                <div style={styles.weekDayHeader}>
                  <div style={styles.weekDayName}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div style={{
                    ...styles.weekDayDate,
                    ...(isToday && styles.todayDate)
                  }}>
                    {date.getDate()}
                  </div>
                </div>
                
                <div style={styles.weekDayIssues}>
                  {dayIssues.map(issue => (
                    <div
                      key={issue.id}
                      style={{
                        ...styles.weekIssueItem,
                        borderLeft: `4px solid ${getStatusColor(issue.status)}`
                      }}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div style={styles.weekIssueTime}>
                        {new Date(issue.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div style={styles.weekIssueTitle}>
                        <strong>{issue.key}</strong>: {issue.title}
                      </div>
                      <div style={styles.weekIssueMeta}>
                        <span style={{
                          ...styles.priorityBadge,
                          backgroundColor: getPriorityColor(issue.priority)
                        }}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Day View Component
  const DayView = () => {
    const dayIssues = getIssuesForDate(currentViewDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div style={styles.dayView}>
        <div style={styles.dayViewHeader}>
          <h3 style={styles.dayViewTitle}>
            {currentViewDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div style={styles.dayStats}>
            {dayIssues.length} issues
          </div>
        </div>

        <div style={styles.dayTimeline}>
          {hours.map(hour => {
            const hourIssues = dayIssues.filter(issue => {
              const issueHour = new Date(issue.createdAt).getHours();
              return issueHour === hour;
            });

            return (
              <div key={hour} style={styles.hourRow}>
                <div style={styles.hourLabel}>
                  {hour === 0 ? '12 AM' : 
                   hour < 12 ? `${hour} AM` : 
                   hour === 12 ? '12 PM' : 
                   `${hour - 12} PM`}
                </div>
                
                <div style={styles.hourContent}>
                  {hourIssues.map(issue => (
                    <div
                      key={issue.id}
                      style={{
                        ...styles.dayIssueItem,
                        borderLeft: `4px solid ${getStatusColor(issue.status)}`
                      }}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div style={styles.dayIssueHeader}>
                        <strong style={styles.dayIssueKey}>{issue.key}</strong>
                        <span style={{
                          ...styles.dayIssuePriority,
                          backgroundColor: getPriorityColor(issue.priority)
                        }}>
                          {issue.priority}
                        </span>
                      </div>
                      <div style={styles.dayIssueTitle}>
                        {issue.title}
                      </div>
                      <div style={styles.dayIssueMeta}>
                        <span>Project: {issue.project?.name}</span>
                        <span>Type: {issue.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Issue Detail Modal
  const IssueDetailModal = () => {
    if (!selectedIssue) return null;

    return (
      <div style={styles.modalOverlay} onClick={() => setSelectedIssue(null)}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>
              {selectedIssue.key}: {selectedIssue.title}
            </h2>
            <button 
              style={styles.closeButton}
              onClick={() => setSelectedIssue(null)}
            >
              ✕
            </button>
          </div>

          <div style={styles.modalBody}>
            <div style={styles.issueDetails}>
              <div style={styles.detailRow}>
                <strong>Status:</strong>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(selectedIssue.status)
                }}>
                  {selectedIssue.status}
                </span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Priority:</strong>
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: getPriorityColor(selectedIssue.priority)
                }}>
                  {selectedIssue.priority}
                </span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Type:</strong>
                <span>{selectedIssue.type}</span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Project:</strong>
                <span>{selectedIssue.project?.name}</span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Reporter:</strong>
                <span>{selectedIssue.reporter?.displayName || selectedIssue.reporter?.username}</span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Assignee:</strong>
                <span>
                  {selectedIssue.assignee 
                    ? (selectedIssue.assignee.displayName || selectedIssue.assignee.username)
                    : 'Unassigned'
                  }
                </span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Created:</strong>
                <span>{new Date(selectedIssue.createdAt).toLocaleString()}</span>
              </div>
              
              <div style={styles.detailRow}>
                <strong>Updated:</strong>
                <span>{new Date(selectedIssue.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {selectedIssue.description && (
              <div style={styles.descriptionSection}>
                <h4 style={styles.sectionTitle}>Description</h4>
                <p style={styles.descriptionText}>
                  {selectedIssue.description}
                </p>
              </div>
            )}

            <div style={styles.modalActions}>
              <button 
                style={styles.primaryButton}
                onClick={() => {
                  // Navigate to issue detail page
                  window.location.href = `/issues/${selectedIssue.key}`;
                }}
              >
                Open Issue
              </button>
              <button 
                style={styles.secondaryButton}
                onClick={() => setSelectedIssue(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Calendar</h1>
          <p style={styles.subtitle}>Track issues and deadlines</p>
        </div>
        
        <div style={styles.headerRight}>
          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={styles.projectFilter}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id.toString()}>
                {project.name}
              </option>
            ))}
          </select>

          {/* View Controls */}
          <div style={styles.viewControls}>
            <button
              style={{
                ...styles.viewButton,
                ...(view === 'month' && styles.viewButtonActive)
              }}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(view === 'week' && styles.viewButtonActive)
              }}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(view === 'day' && styles.viewButtonActive)
              }}
              onClick={() => setView('day')}
            >
              Day
            </button>
          </div>

          {/* Navigation Controls */}
          <div style={styles.navigationControls}>
            <button style={styles.navButton} onClick={goToPrevious}>
              ‹
            </button>
            <button style={styles.todayButton} onClick={goToToday}>
              Today
            </button>
            <button style={styles.navButton} onClick={goToNext}>
              ›
            </button>
          </div>

          {/* Date Display */}
          <div style={styles.dateDisplay}>
            {view === 'month' && (
              <h2 style={styles.currentDate}>
                {currentViewDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
            )}
            {view === 'week' && (
              <h2 style={styles.currentDate}>
                Week of {currentViewDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h2>
            )}
            {view === 'day' && (
              <h2 style={styles.currentDate}>
                {currentViewDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
            )}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div style={styles.calendarContainer}>
        {view === 'month' && <MonthView />}
        {view === 'week' && <WeekView />}
        {view === 'day' && <DayView />}
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal />

      {/* CSS Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  } as React.CSSProperties,

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    textAlign: 'center'
  } as React.CSSProperties,

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  } as React.CSSProperties,

  headerLeft: {
    flex: 1
  } as React.CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap'
  } as React.CSSProperties,

  title: {
    margin: '0 0 0.5rem 0',
    color: '#1a202c',
    fontSize: '2.5rem',
    fontWeight: 700
  } as React.CSSProperties,

  subtitle: {
    margin: 0,
    color: '#718096',
    fontSize: '1.1rem'
  } as React.CSSProperties,

  projectFilter: {
    padding: '0.5rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    minWidth: '150px'
  } as React.CSSProperties,

  viewControls: {
    display: 'flex',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
  } as React.CSSProperties,

  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s ease'
  } as React.CSSProperties,

  viewButtonActive: {
    backgroundColor: '#4299e1',
    color: 'white'
  } as React.CSSProperties,

  navigationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  } as React.CSSProperties,

  navButton: {
    padding: '0.5rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  } as React.CSSProperties,

  todayButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500
  } as React.CSSProperties,

  dateDisplay: {
    minWidth: '200px'
  } as React.CSSProperties,

  currentDate: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'right'
  } as React.CSSProperties,

  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  } as React.CSSProperties,

  // Month View Styles
  monthView: {
    display: 'flex',
    flexDirection: 'column'
  } as React.CSSProperties,

  weekDaysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    backgroundColor: '#f7fafc',
    borderBottom: '1px solid #e2e8f0'
  } as React.CSSProperties,

  weekDay: {
    padding: '1rem',
    textAlign: 'center',
    fontWeight: 600,
    color: '#4a5568',
    fontSize: '0.9rem'
  } as React.CSSProperties,

  weekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    minHeight: '120px'
  } as React.CSSProperties,

  monthDay: {
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  } as React.CSSProperties,

  otherMonthDay: {
    backgroundColor: '#f7fafc',
    color: '#a0aec0'
  } as React.CSSProperties,

  today: {
    backgroundColor: '#ebf8ff',
    border: '2px solid #4299e1'
  } as React.CSSProperties,

  monthDayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  monthDayNumber: {
    fontWeight: 600,
    fontSize: '1.1rem'
  } as React.CSSProperties,

  monthDayIssues: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  } as React.CSSProperties,

  issueBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.7rem',
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  } as React.CSSProperties,

  issueBadgeText: {
    fontSize: '0.7rem',
    fontWeight: 500
  } as React.CSSProperties,

  moreIssues: {
    fontSize: '0.7rem',
    color: '#718096',
    fontStyle: 'italic'
  } as React.CSSProperties,

  // Week View Styles
  weekView: {
    padding: '1rem'
  } as React.CSSProperties,

  weekViewHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1rem'
  } as React.CSSProperties,

  weekDayColumn: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white'
  } as React.CSSProperties,

  todayColumn: {
    backgroundColor: '#ebf8ff',
    border: '2px solid #4299e1'
  } as React.CSSProperties,

  weekDayHeader: {
    padding: '1rem',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc'
  } as React.CSSProperties,

  weekDayName: {
    fontSize: '0.8rem',
    color: '#718096',
    textTransform: 'uppercase',
    fontWeight: 600
  } as React.CSSProperties,

  weekDayDate: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2d3748'
  } as React.CSSProperties,

  todayDate: {
    color: '#4299e1'
  } as React.CSSProperties,

  weekDayIssues: {
    padding: '0.5rem',
    minHeight: '400px'
  } as React.CSSProperties,

  weekIssueItem: {
    padding: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  } as React.CSSProperties,

  weekIssueTime: {
    fontSize: '0.7rem',
    color: '#718096',
    marginBottom: '0.25rem'
  } as React.CSSProperties,

  weekIssueTitle: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#2d3748',
    marginBottom: '0.25rem'
  } as React.CSSProperties,

  weekIssueMeta: {
    display: 'flex',
    gap: '0.25rem'
  } as React.CSSProperties,

  // Day View Styles
  dayView: {
    padding: '1rem'
  } as React.CSSProperties,

  dayViewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0'
  } as React.CSSProperties,

  dayViewTitle: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 600
  } as React.CSSProperties,

  dayStats: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4299e1',
    color: 'white',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 500
  } as React.CSSProperties,

  dayTimeline: {
    display: 'flex',
    flexDirection: 'column'
  } as React.CSSProperties,

  hourRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    borderBottom: '1px solid #e2e8f0',
    minHeight: '80px'
  } as React.CSSProperties,

  hourLabel: {
    padding: '1rem',
    backgroundColor: '#f7fafc',
    fontWeight: 600,
    color: '#4a5568',
    fontSize: '0.9rem',
    borderRight: '1px solid #e2e8f0'
  } as React.CSSProperties,

  hourContent: {
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  } as React.CSSProperties,

  dayIssueItem: {
    padding: '1rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  } as React.CSSProperties,

  dayIssueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  dayIssueKey: {
    color: '#2d3748',
    fontSize: '1rem'
  } as React.CSSProperties,

  dayIssuePriority: {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 500
  } as React.CSSProperties,

  dayIssueTitle: {
    color: '#4a5568',
    fontSize: '0.9rem',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  dayIssueMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#718096'
  } as React.CSSProperties,

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem'
  } as React.CSSProperties,

  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
  } as React.CSSProperties,

  modalHeader: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  } as React.CSSProperties,

  modalTitle: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3
  } as React.CSSProperties,

  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#a0aec0',
    padding: '0.25rem'
  } as React.CSSProperties,

  modalBody: {
    padding: '2rem'
  } as React.CSSProperties,

  issueDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  } as React.CSSProperties,

  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f7fafc'
  } as React.CSSProperties,

  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 500
  } as React.CSSProperties,

  priorityBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 500
  } as React.CSSProperties,

  descriptionSection: {
    marginBottom: '2rem'
  } as React.CSSProperties,

  sectionTitle: {
    margin: '0 0 1rem 0',
    color: '#2d3748',
    fontSize: '1.1rem',
    fontWeight: 600
  } as React.CSSProperties,

  descriptionText: {
    color: '#4a5568',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap'
  } as React.CSSProperties,

  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  } as React.CSSProperties,

  primaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  } as React.CSSProperties,

  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#4a5568',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  } as React.CSSProperties
};

export default CalendarPage;
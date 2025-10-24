// pages/LandingPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#3498db',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            N
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Nucleus
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login"
                style={{
                  color: '#3498db',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Login
              </Link>
              <Link 
                to="/register"
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '4px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link 
              to="/dashboard"
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '4px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#219a52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Streamline Your Development Workflow
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Nucleus helps teams plan, track, and release outstanding software. 
            Collaborate seamlessly from idea to deployment.
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c0392b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e74c3c';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '3rem',
            color: '#2c3e50'
          }}>
            Powerful Features for Modern Teams
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '📊',
                title: 'Project Management',
                description: 'Organize projects, track progress, and manage resources efficiently with intuitive boards and timelines.'
              },
              {
                icon: '🐛',
                title: 'Issue Tracking',
                description: 'Capture, assign, and prioritize issues. Never let critical tasks slip through the cracks.'
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                description: 'Role-based access control ensures the right people have the right access to projects and issues.'
              },
              {
                icon: '📈',
                title: 'Advanced Analytics',
                description: 'Get insights into team performance, project health, and delivery metrics with comprehensive dashboards.'
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: 'Multi-level permission system with organization, project, and issue-level access controls.'
              },
              {
                icon: '⚡',
                title: 'Fast & Reliable',
                description: 'Built with modern technologies for speed and reliability that your team can count on.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                style={{
                  padding: '2rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #e9ecef'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2c3e50'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6c757d',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#ecf0f1'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#2c3e50'
          }}>
            Role-Based Access Control
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '3rem',
            color: '#6c757d',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            From Global Admins to Project Viewers, everyone has the right level of access
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            {[
              { role: 'Global Admin', color: '#e74c3c', description: 'Full system access' },
              { role: 'Organization Admin', color: '#3498db', description: 'Organization management' },
              { role: 'Project Admin', color: '#9b59b6', description: 'Project configuration' },
              { role: 'Project Member', color: '#27ae60', description: 'Create and edit issues' },
              { role: 'Project Viewer', color: '#f39c12', description: 'View project progress' }
            ].map((item, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  minWidth: '200px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderTop: `4px solid ${item.color}`
                }}
              >
                <h3 style={{
                  color: item.color,
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem'
                }}>
                  {item.role}
                </h3>
                <p style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Join thousands of teams who use Nucleus to deliver better software, faster.
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#34495e',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#3498db',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              N
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Nucleus
            </span>
          </div>
          <p style={{
            margin: 0,
            opacity: 0.8,
            fontSize: '0.9rem'
          }}>
            Streamlining development workflows for modern teams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React, { useState } from 'react';

const HelpSupportPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'faq' | 'contact' | 'guides' | 'resources'>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Data
  const faqData = [
    {
      id: 1,
      question: "How do I create a new project?",
      answer: "To create a new project, click on the 'Projects' tab in the sidebar, then click the 'New Project' button. Fill in the project name, description, and settings, then click 'Create Project'."
    },
    {
      id: 2,
      question: "How can I invite team members to a project?",
      answer: "Go to the project settings, click on the 'Members' tab, and use the 'Add Member' button. You can invite users by email and assign them appropriate roles (Admin, Member, or Viewer)."
    },
    {
      id: 3,
      question: "What's the difference between issue types?",
      answer: "We support multiple issue types: Story (feature development), Task (general work), Bug (problems to fix), Epic (large features), and Subtask (breakdown of larger tasks). Each type helps organize work effectively."
    },
    {
      id: 4,
      question: "How do I update an issue's status?",
      answer: "You can update an issue status by dragging it between columns in the board view, or by using the status dropdown in the list view. Available statuses: Open, In Progress, Code Review, Testing, Done, and Closed."
    },
    {
      id: 5,
      question: "Can I customize workflows?",
      answer: "Currently, workflows are standardized across projects. However, you can customize issue types, priorities, and labels to match your team's process. More customization options are coming soon!"
    },
    {
      id: 6,
      question: "How do comments and notifications work?",
      answer: "When you comment on an issue, all project members receive notifications. You can mention teammates using @username to send them direct notifications. Notification preferences can be managed in Settings."
    }
  ];

  // Quick Start Guides
  const guides = [
    {
      id: 1,
      title: "Getting Started",
      steps: [
        "Create your first organization",
        "Set up your initial project",
        "Invite team members",
        "Create your first issues",
        "Start tracking progress"
      ],
      icon: "🚀"
    },
    {
      id: 2,
      title: "Project Management",
      steps: [
        "Organize issues with labels and priorities",
        "Use the board view for visual tracking",
        "Set up sprints and milestones",
        "Track time estimates and actuals",
        "Generate progress reports"
      ],
      icon: "📊"
    },
    {
      id: 3,
      title: "Team Collaboration",
      steps: [
        "Use @mentions in comments",
        "Assign issues to team members",
        "Set up notification preferences",
        "Use the search and filter features",
        "Collaborate in real-time"
      ],
      icon: "👥"
    }
  ];

  // Resources
  const resources = [
    {
      title: "Documentation",
      description: "Complete API documentation and user guides",
      link: "#",
      icon: "📚"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      link: "#",
      icon: "🎥"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and share tips",
      link: "#",
      icon: "💬"
    },
    {
      title: "API Reference",
      description: "Complete REST API documentation",
      link: "#",
      icon: "🔌"
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitting(false);
    setSubmitted(true);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Help & Support</h1>
        <p style={styles.subtitle}>
          Get help, browse documentation, or contact our support team
        </p>
      </div>

      {/* Quick Help Cards */}
      <div style={styles.quickHelp}>
        <div style={styles.helpCard}>
          <div style={styles.helpIcon}>📚</div>
          <h3 style={styles.helpTitle}>Documentation</h3>
          <p style={styles.helpText}>
            Browse our comprehensive guides and tutorials
          </p>
          <button 
            style={styles.helpButton}
            onClick={() => setActiveSection('guides')}
          >
            View Guides
          </button>
        </div>

        <div style={styles.helpCard}>
          <div style={styles.helpIcon}>❓</div>
          <h3 style={styles.helpTitle}>FAQ</h3>
          <p style={styles.helpText}>
            Find answers to frequently asked questions
          </p>
          <button 
            style={styles.helpButton}
            onClick={() => setActiveSection('faq')}
          >
            Browse FAQ
          </button>
        </div>

        <div style={styles.helpCard}>
          <div style={styles.helpIcon}>💬</div>
          <h3 style={styles.helpTitle}>Contact Support</h3>
          <p style={styles.helpText}>
            Get help from our support team
          </p>
          <button 
            style={styles.helpButton}
            onClick={() => setActiveSection('contact')}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeSection === 'faq' ? styles.tabActive : {})
            }}
            onClick={() => setActiveSection('faq')}
          >
            ❓ FAQ
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeSection === 'guides' ? styles.tabActive : {})
            }}
            onClick={() => setActiveSection('guides')}
          >
            📖 Guides
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeSection === 'resources' ? styles.tabActive : {})
            }}
            onClick={() => setActiveSection('resources')}
          >
            🛠️ Resources
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeSection === 'contact' ? styles.tabActive : {})
            }}
            onClick={() => setActiveSection('contact')}
          >
            📞 Contact
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      {activeSection === 'faq' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {faqData.map(faq => (
              <div key={faq.id} style={styles.faqItem}>
                <button
                  style={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span style={styles.faqIcon}>
                    {openFaq === faq.id ? '−' : '+'}
                  </span>
                </button>
                {openFaq === faq.id && (
                  <div style={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guides Section */}
      {activeSection === 'guides' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Start Guides</h2>
          <div style={styles.guidesGrid}>
            {guides.map(guide => (
              <div key={guide.id} style={styles.guideCard}>
                <div style={styles.guideHeader}>
                  <div style={styles.guideIcon}>{guide.icon}</div>
                  <h3 style={styles.guideTitle}>{guide.title}</h3>
                </div>
                <ol style={styles.guideSteps}>
                  {guide.steps.map((step, index) => (
                    <li key={index} style={styles.guideStep}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Section */}
      {activeSection === 'resources' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Learning Resources</h2>
          <div style={styles.resourcesGrid}>
            {resources.map((resource, index) => (
              <div key={index} style={styles.resourceCard}>
                <div style={styles.resourceIcon}>{resource.icon}</div>
                <h3 style={styles.resourceTitle}>{resource.title}</h3>
                <p style={styles.resourceDescription}>{resource.description}</p>
                <button style={styles.resourceButton}>
                  Explore {resource.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Support</h2>
          <div style={styles.contactContent}>
            <div style={styles.contactInfo}>
              <h3 style={styles.contactSubtitle}>Get in Touch</h3>
              <p style={styles.contactText}>
                Our support team is here to help you with any questions or issues you might have.
                We typically respond within 24 hours.
              </p>
              
              <div style={styles.contactMethods}>
                <div style={styles.contactMethod}>
                  <div style={styles.methodIcon}>📧</div>
                  <div>
                    <h4 style={styles.methodTitle}>Email Support</h4>
                    <p style={styles.methodText}>support@nucleusapp.com</p>
                  </div>
                </div>
                
                <div style={styles.contactMethod}>
                  <div style={styles.methodIcon}>🕒</div>
                  <div>
                    <h4 style={styles.methodTitle}>Response Time</h4>
                    <p style={styles.methodText}>Within 24 hours</p>
                  </div>
                </div>
                
                <div style={styles.contactMethod}>
                  <div style={styles.methodIcon}>🌐</div>
                  <div>
                    <h4 style={styles.methodTitle}>Community</h4>
                    <p style={styles.methodText}>Join our user community</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.contactForm}>
              {submitted ? (
                <div style={styles.successMessage}>
                  <div style={styles.successIcon}>✅</div>
                  <h3 style={styles.successTitle}>Message Sent!</h3>
                  <p style={styles.successText}>
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button 
                    style={styles.successButton}
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Category</label>
                      <select
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                        style={styles.select}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing</option>
                        <option value="feature">Feature Request</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message *</label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      style={styles.textarea}
                      placeholder="Please describe your issue or question in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      ...styles.submitButton,
                      ...(submitting ? styles.submitButtonDisabled : {})
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={styles.spinnerSmall}></div>
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Help */}
      <div style={styles.emergencyHelp}>
        <div style={styles.emergencyContent}>
          <div style={styles.emergencyIcon}>🚨</div>
          <div>
            <h3 style={styles.emergencyTitle}>Need Immediate Help?</h3>
            <p style={styles.emergencyText}>
              For critical issues affecting your production environment, 
              contact our emergency support line.
            </p>
          </div>
          <button style={styles.emergencyButton}>
            Emergency Support
          </button>
        </div>
      </div>

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
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  } as React.CSSProperties,

  header: {
    textAlign: 'center',
    marginBottom: '3rem'
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
    fontSize: '1.1rem',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto'
  } as React.CSSProperties,

  quickHelp: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  } as React.CSSProperties,

  helpCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  } as React.CSSProperties,

  helpIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  helpTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2d3748',
    fontSize: '1.25rem',
    fontWeight: 600
  } as React.CSSProperties,

  helpText: {
    margin: '0 0 1.5rem 0',
    color: '#718096',
    lineHeight: 1.5
  } as React.CSSProperties,

  helpButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'background-color 0.2s ease'
  } as React.CSSProperties,

  tabContainer: {
    marginBottom: '2rem'
  } as React.CSSProperties,

  tabs: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  } as React.CSSProperties,

  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'all 0.2s ease'
  } as React.CSSProperties,

  tabActive: {
    backgroundColor: '#4299e1',
    color: 'white',
    borderColor: '#4299e1'
  } as React.CSSProperties,

  section: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  } as React.CSSProperties,

  sectionTitle: {
    margin: '0 0 1.5rem 0',
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 600
  } as React.CSSProperties,

  // FAQ Styles
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  } as React.CSSProperties,

  faqItem: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  } as React.CSSProperties,

  faqQuestion: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: 'white',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#2d3748',
    transition: 'background-color 0.2s ease'
  } as React.CSSProperties,

  faqIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#4299e1'
  } as React.CSSProperties,

  faqAnswer: {
    padding: '0 1.5rem 1.5rem 1.5rem',
    borderTop: '1px solid #e2e8f0'
  } as React.CSSProperties,

  // Guides Styles
  guidesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  } as React.CSSProperties,

  guideCard: {
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f7fafc'
  } as React.CSSProperties,

  guideHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  } as React.CSSProperties,

  guideIcon: {
    fontSize: '2rem'
  } as React.CSSProperties,

  guideTitle: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.25rem',
    fontWeight: 600
  } as React.CSSProperties,

  guideSteps: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#4a5568',
    lineHeight: 1.6
  } as React.CSSProperties,

  guideStep: {
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  // Resources Styles
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  } as React.CSSProperties,

  resourceCard: {
    padding: '2rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: 'white'
  } as React.CSSProperties,

  resourceIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  resourceTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2d3748',
    fontSize: '1.1rem',
    fontWeight: 600
  } as React.CSSProperties,

  resourceDescription: {
    margin: '0 0 1.5rem 0',
    color: '#718096',
    fontSize: '0.9rem',
    lineHeight: 1.5
  } as React.CSSProperties,

  resourceButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#4299e1',
    border: '1px solid #4299e1',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  } as React.CSSProperties,

  // Contact Styles
  contactContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem'
  } as React.CSSProperties,

  contactInfo: {
    paddingRight: '2rem'
  } as React.CSSProperties,

  contactSubtitle: {
    margin: '0 0 1rem 0',
    color: '#2d3748',
    fontSize: '1.25rem',
    fontWeight: 600
  } as React.CSSProperties,

  contactText: {
    margin: '0 0 2rem 0',
    color: '#718096',
    lineHeight: 1.6
  } as React.CSSProperties,

  contactMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  } as React.CSSProperties,

  contactMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  } as React.CSSProperties,

  methodIcon: {
    fontSize: '1.5rem'
  } as React.CSSProperties,

  methodTitle: {
    margin: '0 0 0.25rem 0',
    color: '#2d3748',
    fontSize: '1rem',
    fontWeight: 600
  } as React.CSSProperties,

  methodText: {
    margin: 0,
    color: '#718096',
    fontSize: '0.9rem'
  } as React.CSSProperties,

  // Form Styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  } as React.CSSProperties,

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  } as React.CSSProperties,

  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  } as React.CSSProperties,

  label: {
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#4a5568'
  } as React.CSSProperties,

  input: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease'
  } as React.CSSProperties,

  select: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white'
  } as React.CSSProperties,

  textarea: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    minHeight: '120px'
  } as React.CSSProperties,

  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease'
  } as React.CSSProperties,

  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed'
  } as React.CSSProperties,

  spinnerSmall: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as React.CSSProperties,

  // Success Message
  successMessage: {
    textAlign: 'center',
    padding: '3rem 2rem'
  } as React.CSSProperties,

  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  successTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 600
  } as React.CSSProperties,

  successText: {
    margin: '0 0 2rem 0',
    color: '#718096',
    lineHeight: 1.6
  } as React.CSSProperties,

  successButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  } as React.CSSProperties,

  // Emergency Help
  emergencyHelp: {
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '12px',
    padding: '2rem',
    marginTop: '3rem'
  } as React.CSSProperties,

  emergencyContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  } as React.CSSProperties,

  emergencyIcon: {
    fontSize: '3rem'
  } as React.CSSProperties,

  emergencyTitle: {
    margin: '0 0 0.5rem 0',
    color: '#c53030',
    fontSize: '1.25rem',
    fontWeight: 600
  } as React.CSSProperties,

  emergencyText: {
    margin: 0,
    color: '#9b2c2c',
    lineHeight: 1.5
  } as React.CSSProperties,

  emergencyButton: {
    marginLeft: 'auto',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  } as React.CSSProperties
};

export default HelpSupportPage;
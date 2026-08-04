import React, { useState } from 'react';
import { Box, Container, Typography, Button, AppBar, Toolbar, Stack, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  SmartToy, Map, Language, Speed, 
  GitHub, LinkedIn, Email, CheckCircle, ArrowForward, AccountBalance, Phone, LocationOn,
  Menu as MenuIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuAnchor(null); // Close mobile menu after clicking
  };

  // Mobile menu handlers
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
    navigate('/login');
  };

  const handleMobileMenuRegister = () => {
    setMobileMenuAnchor(null);
    navigate('/register');
  };

  const features = [
    { icon: <SmartToy sx={{ fontSize: 28 }} />, title: 'AI-Powered Analysis', desc: 'Automatically categorize and prioritize complaints using Groq AI image analysis.' },
    { icon: <Map sx={{ fontSize: 28 }} />, title: 'GPS Tracking', desc: 'Pinpoint exact complaint locations using integrated OpenStreetMap.' },
    { icon: <Language sx={{ fontSize: 28 }} />, title: 'Multilingual Support', desc: 'Available in English, Hindi, and Marathi for inclusive civic participation.' },
    { icon: <Speed sx={{ fontSize: 28 }} />, title: 'Real-time Resolution', desc: 'Track complaint status from pending to resolved with live timeline updates.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Citizens', color: '#1976d2', bg: '#e3f2fd' },
    { value: '500+', label: 'Issues Resolved', color: '#2e7d32', bg: '#e8f5e9' },
    { value: '98%', label: 'Satisfaction', color: '#ed6c02', bg: '#fff3e0' },
    { value: '24/7', label: 'Support Available', color: '#9c27b0', bg: '#f3e5f5' },
  ];

  const steps = [
    { step: '01', title: 'Report', desc: 'Citizen uploads image & GPS. AI auto-fills details.' },
    { step: '02', title: 'Track', desc: 'Officer accepts, resolves, and uploads proof.' },
    { step: '03', title: 'Resolve', desc: 'Citizen confirms resolution and rates the service.' },
  ];

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#ffffff' }}>
      
      {/* ========================================== */}
      {/* 1. NAVBAR (With Mobile Hamburger Menu)     */}
      {/* ========================================== */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: '#ffffff', 
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: '0 !important', py: 0, minHeight: '64px !important' }}>
            
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto' }}>
              <Box sx={{ 
                width: 36, height: 36, borderRadius: 1.5, 
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AccountBalance sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="700" 
                sx={{ color: '#0f172a', cursor: 'pointer' }} 
                onClick={() => scrollToSection('home')}
              >
                Civic<span style={{ color: '#1976d2' }}>AI</span>
              </Typography>
            </Box>

            {/* Desktop Links (Hidden on Mobile) */}
            <Stack direction="row" spacing={2.5} sx={{ display: { xs: 'none', lg: 'flex' }, mr: 3 }}>
              {navLinks.map((link) => (
                <Typography 
                  key={link.id}
                  variant="body2" 
                  onClick={() => scrollToSection(link.id)}
                  sx={{ 
                    color: '#475569', 
                    fontWeight: 500, 
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#1976d2' }
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>

            {/* Desktop Auth Buttons (Hidden on Mobile) */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', lg: 'flex' } }}>
              <Button 
                onClick={() => navigate('/login')}
                size="small"
                sx={{ 
                  color: '#0f172a', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                size="small"
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                }}
              >
                Register
              </Button>
            </Stack>

            {/* Mobile Hamburger Icon (Visible only on Mobile/Tablet) */}
            <IconButton 
              sx={{ display: { xs: 'flex', lg: 'none' }, color: '#0f172a' }}
              onClick={handleMobileMenuOpen}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Mobile Menu Dropdown */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={() => setMobileMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 1 }}
        >
          {navLinks.map((link) => (
            <MenuItem 
              key={link.id} 
              onClick={() => scrollToSection(link.id)}
              sx={{ fontSize: '0.9rem', fontWeight: 500, py: 1.5, px: 3 }}
            >
              {link.label}
            </MenuItem>
          ))}
          <Box sx={{ borderTop: '1px solid #f1f5f9', my: 1 }} />
          <MenuItem 
            onClick={handleMobileMenuClose}
            sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', py: 1.5, px: 3 }}
          >
            Login
          </MenuItem>
          <MenuItem 
            onClick={handleMobileMenuRegister}
            sx={{ 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: 'white', 
              bgcolor: '#1976d2',
              py: 1.5, 
              px: 3,
              mx: 1,
              mb: 1,
              borderRadius: 1.5,
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            Register
          </MenuItem>
        </Menu>
      </AppBar>

      {/* ========================================== */}
      {/* 2. HERO SECTION - id="home"                */}
      {/* ========================================== */}
      <Box id="home" sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
            Smart Civic Complaint & Resolution
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Empowering citizens and authorities with AI-driven transparency and efficiency.
          </Typography>
          <Stack 
  direction={{ xs: 'column', sm: 'row' }} 
  spacing={2} 
  sx={{ 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}
>
  <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/register')}>
    Report an Issue
  </Button>
  <Button 
    variant="outlined" 
    size="large" 
    sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}} 
    onClick={() => navigate('/login')}
  >
    Officer Login
  </Button>
</Stack>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 3. FEATURES - id="features"                */}
      {/* ========================================== */}
      <Box id="features" sx={{ py: 8, bgcolor: '#f8fafc', scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', mb: 1.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              Why Choose CivicAI?
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto' }}>
              Bridging the gap between citizens and government with cutting-edge technology.
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2.5,
          }}>
            {features.map((feature, index) => (
              <Box 
                key={index}
                sx={{ 
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  bgcolor: 'white',
                  p: 2.5,
                  transition: 'all 0.25s ease', 
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    borderColor: '#1976d2'
                  } 
                }}
              >
                <Box sx={{ 
                  width: 52, height: 52, borderRadius: 2, 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  color: '#1976d2', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  mb: 2 
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ color: '#0f172a', mb: 0.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 4. HOW IT WORKS - id="how-it-works"        */}
      {/* ========================================== */}
      <Box id="how-it-works" sx={{ py: 8, bgcolor: '#ffffff', scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', mb: 1.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              How It Works
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto' }}>
              Simple 3-step process to report and resolve civic issues.
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4,
          }}>
            {steps.map((item) => (
              <Box key={item.step} textAlign="center">
                <Box sx={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  mx: 'auto', mb: 2, 
                  fontSize: 22, fontWeight: '800',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                }}>
                  {item.step}
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: '#0f172a', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Box textAlign="center" sx={{ mt: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForward />} 
              onClick={() => navigate('/register')} 
              sx={{ 
                px: 4, py: 1.5, 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.35)',
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 5. ABOUT - id="about"                      */}
      {/* ========================================== */}
      <Box id="about" sx={{ py: 8, bgcolor: '#f8fafc', scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 6,
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#0f172a', mb: 2, lineHeight: 1.2, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                Transforming Civic Engagement for a Smarter Tomorrow
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
                CivicAI is an innovative platform designed to streamline the process of reporting and resolving civic issues. By leveraging Artificial Intelligence and real-time tracking, we ensure that every citizen's voice is heard.
              </Typography>
              <Stack spacing={1.5}>
                {[
                  '100% Transparent Resolution Process',
                  'AI-Driven Quick Categorization',
                  'Secure & Verified Officer Actions'
                ].map((text, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <CheckCircle sx={{ color: '#2e7d32', fontSize: 20, flexShrink: 0 }} />
                    <Typography variant="body2" fontWeight="500" sx={{ color: '#0f172a' }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 2,
            }}>
              {stats.map((stat, i) => (
                <Box key={i} sx={{ 
                  p: 2.5, 
                  bgcolor: stat.bg, 
                  borderRadius: 2,
                  textAlign: 'center',
                }}>
                  <Typography variant="h5" fontWeight="800" sx={{ color: stat.color, mb: 0.5, fontSize: '1.75rem' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" fontWeight="500" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 6. CONTACT SECTION - id="contact"          */}
      {/* ========================================== */}
      <Box id="contact" sx={{ py: 8, bgcolor: '#ffffff', scrollMarginTop: '64px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', mb: 1.5, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              Get In Touch
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto' }}>
              Have questions? We'd love to hear from you. Reach out to us through any of these channels.
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 3,
          }}>
            {[
              { icon: <Email sx={{ fontSize: 32 }} />, title: 'Email Us', desc: 'support@civicai.com', color: '#1976d2', bg: '#e3f2fd' },
              { icon: <Phone sx={{ fontSize: 32 }} />, title: 'Call Us', desc: '+91 98765 43210', color: '#2e7d32', bg: '#e8f5e9' },
              { icon: <LocationOn sx={{ fontSize: 32 }} />, title: 'Visit Us', desc: 'Smart India Hackathon HQ', color: '#ed6c02', bg: '#fff3e0' },
            ].map((item, i) => (
              <Box 
                key={i}
                sx={{ 
                  p: 3,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: 'all 0.25s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    borderColor: item.color
                  }
                }}
              >
                <Box sx={{ 
                  width: 64, height: 64, borderRadius: 2, 
                  background: item.bg,
                  color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  mx: 'auto', mb: 2 
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: '#0f172a', mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ========================================== */}
      {/* 7. FOOTER                                  */}
      {/* ========================================== */}
      <Box component="footer" sx={{ bgcolor: '#0f172a', color: 'white', py: 5 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: '2fr 1fr 1fr 1.5fr' }, 
            gap: 4,
          }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: 1.5, 
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AccountBalance sx={{ color: 'white', fontSize: 18 }} />
                </Box>
                <Typography variant="h6" fontWeight="700">CivicAI</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7, maxWidth: 280, fontSize: '0.875rem' }}>
                Empowering citizens and authorities with AI-driven transparency and efficiency.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                {['Features', 'How it works', 'About Us'].map((item) => (
                  <Typography 
                    key={item} 
                    variant="body2" 
                    onClick={() => scrollToSection(item === 'Features' ? 'features' : item === 'How it works' ? 'how-it-works' : 'about')}
                    sx={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', '&:hover': { color: 'white' } }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                Support
              </Typography>
              <Stack spacing={1}>
                {['Help Center', 'Privacy Policy', 'Contact'].map((item) => (
                  <Typography 
                    key={item} 
                    variant="body2" 
                    onClick={() => scrollToSection(item === 'Contact' ? 'contact' : 'home')}
                    sx={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', '&:hover': { color: 'white' } }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ mb: 1.5, fontSize: '0.9rem' }}>
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                {[GitHub, LinkedIn, Email].map((Icon, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      width: 36, height: 36, borderRadius: 1.5,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#1976d2' },
                    }}
                  >
                    <Icon sx={{ color: 'white', fontSize: 18 }} />
                  </Box>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                support@civicai.com
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 2.5, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              © 2026 CivicAI Development Team. Built for Smart India Hackathon.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
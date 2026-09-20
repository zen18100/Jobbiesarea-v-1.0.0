import React, { useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { SUBJECTS } from './data/subjects';
import { Subject, UserProfile } from './types';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // UI state
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  // Form states - Register
  const [regFirst, setRegFirst] = useState<string>('');
  const [regLast, setRegLast] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regGender, setRegGender] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [regPass2, setRegPass2] = useState<string>('');
  const [showRegPass, setShowRegPass] = useState<boolean>(false);
  const [showRegPass2, setShowRegPass2] = useState<boolean>(false);
  const [regMsg, setRegMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [regSubmitting, setRegSubmitting] = useState<boolean>(false);

  // Form states - Login
  const [logEmail, setLogEmail] = useState<string>('');
  const [logPass, setLogPass] = useState<string>('');
  const [showLogPass, setShowLogPass] = useState<boolean>(false);
  const [logMsg, setLogMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [logSubmitting, setLogSubmitting] = useState<boolean>(false);

  // Refs for outside click handling
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Retrieve local profile information if available
        let savedProfile: Partial<UserProfile> = {};
        try {
          const stored = localStorage.getItem(`jobbiesarea_profile_${firebaseUser.uid}`);
          if (stored) {
            savedProfile = JSON.parse(stored);
          }
        } catch {
          // ignore
        }

        const displayName = firebaseUser.displayName || '';
        const nameParts = displayName.split(' ');
        const firstName = savedProfile.firstName || nameParts[0] || firebaseUser.email?.split('@')[0] || 'User';
        const lastName = savedProfile.lastName || nameParts.slice(1).join(' ') || '';

        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName,
          lastName,
          phone: savedProfile.phone || '',
          gender: savedProfile.gender || ''
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close dropdowns and hamburger on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileWrapRef.current && !profileWrapRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target) &&
        navLinksRef.current &&
        !navLinksRef.current.contains(target)
      ) {
        setHamburgerOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeAllModals = () => {
    setRegisterOpen(false);
    setLoginOpen(false);
    setActiveSubject(null);
    setDropdownOpen(false);
    setHamburgerOpen(false);
    setRegMsg(null);
    setLogMsg(null);
  };

  const openRegister = () => {
    setHamburgerOpen(false);
    setLoginOpen(false);
    setRegMsg(null);
    setRegisterOpen(true);
  };

  const openLogin = () => {
    setHamburgerOpen(false);
    setRegisterOpen(false);
    setLogMsg(null);
    setLoginOpen(true);
  };

  const switchTo = (target: 'login' | 'register') => {
    if (target === 'login') {
      setRegisterOpen(false);
      setLogMsg(null);
      setLoginOpen(true);
    } else {
      setLoginOpen(false);
      setRegMsg(null);
      setRegisterOpen(true);
    }
  };

  // Helper for human-readable Firebase Auth error messages
  const getAuthErrorMessage = (error: any): string => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please log in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return error?.message || 'Authentication error. Please try again.';
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstName = regFirst.trim();
    const lastName = regLast.trim();
    const phone = regPhone.replace(/\s+/g, '');
    const email = regEmail.trim();
    const gender = regGender;
    const pass = regPass;
    const pass2 = regPass2;

    const phoneRx = /^\+?\d{7,15}$/;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !phone || !gender || !pass) {
      setRegMsg({ text: 'Please fill all required fields.', type: 'error' });
      return;
    }
    if (!phoneRx.test(phone)) {
      setRegMsg({ text: 'Invalid phone number format.', type: 'error' });
      return;
    }
    if (!emailRx.test(email)) {
      setRegMsg({ text: 'Invalid email format.', type: 'error' });
      return;
    }
    if (pass.length < 6) {
      setRegMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (pass !== pass2) {
      setRegMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setRegSubmitting(true);
    setRegMsg(null);

    try {
      // Firebase Authentication: Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Update user display name in Firebase Auth
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Save supplemental profile info to local storage for persistent profile view
      const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        firstName,
        lastName,
        phone,
        gender
      };
      localStorage.setItem(`jobbiesarea_profile_${user.uid}`, JSON.stringify(profileData));

      setCurrentUser(profileData);
      setRegMsg({ text: 'Account created! Logging in... ✅', type: 'success' });

      // Reset form
      setRegFirst('');
      setRegLast('');
      setRegPhone('');
      setRegEmail('');
      setRegGender('');
      setRegPass('');
      setRegPass2('');

      setTimeout(() => {
        setRegisterOpen(false);
        setRegMsg(null);
      }, 1200);
    } catch (error: any) {
      setRegMsg({ text: getAuthErrorMessage(error), type: 'error' });
    } finally {
      setRegSubmitting(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = logEmail.trim();
    const pass = logPass;

    if (!email || !pass) {
      setLogMsg({ text: 'Please enter your email and password.', type: 'error' });
      return;
    }

    setLogSubmitting(true);
    setLogMsg(null);

    try {
      // Firebase Authentication: Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Retrieve existing profile or create friendly defaults
      let firstName = 'User';
      let lastName = '';
      try {
        const stored = localStorage.getItem(`jobbiesarea_profile_${user.uid}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          firstName = parsed.firstName || firstName;
          lastName = parsed.lastName || '';
        } else if (user.displayName) {
          const parts = user.displayName.split(' ');
          firstName = parts[0] || firstName;
          lastName = parts.slice(1).join(' ') || '';
        } else if (user.email) {
          firstName = user.email.split('@')[0];
        }
      } catch {
        // ignore
      }

      setLogMsg({ text: `Welcome back, ${firstName}! 🎉`, type: 'success' });

      setLogEmail('');
      setLogPass('');

      setTimeout(() => {
        setLoginOpen(false);
        setLogMsg(null);
      }, 1000);
    } catch (error: any) {
      setLogMsg({ text: getAuthErrorMessage(error), type: 'error' });
    } finally {
      setLogSubmitting(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Initials for avatar
  const getInitials = (user: UserProfile) => {
    const f = user.firstName ? user.firstName[0].toUpperCase() : 'U';
    const l = user.lastName ? user.lastName[0].toUpperCase() : '';
    return l ? `${f}${l}` : f;
  };

  return (
    <>
      {/* ═══ NAVBAR ═══ */}
      <nav className="navbar" id="mainNavbar">
        <a href="#" className="logo" id="appLogo">
          JOBBIESAREA
        </a>

        {/* Auth buttons (logged out) */}
        {!currentUser && !authLoading && (
          <div
            className={`nav-links ${hamburgerOpen ? 'open' : ''}`}
            id="navLinks"
            ref={navLinksRef}
          >
            <button
              type="button"
              className="nav-btn register-btn"
              id="openRegisterBtn"
              onClick={openRegister}
            >
              Register
            </button>
            <button
              type="button"
              className="nav-btn login-btn"
              id="openLoginBtn"
              onClick={openLogin}
            >
              Login
            </button>
          </div>
        )}

        {/* Hamburger Menu (logged out, mobile) */}
        {!currentUser && !authLoading && (
          <button
            type="button"
            className={`hamburger ${hamburgerOpen ? 'open' : ''}`}
            id="hamburger"
            title="Menu"
            ref={hamburgerRef}
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <span className="hamburger-box">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>
        )}

        {/* Profile (logged in — replaces both hamburger + auth links) */}
        {currentUser && (
          <div className="profile-wrap" id="profileWrap" ref={profileWrapRef}>
            <div
              className="profile-btn"
              id="profileBtn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="profile-avatar" id="profileAvatar">
                {getInitials(currentUser)}
              </div>
              <span className="profile-name" id="profileName">
                {currentUser.firstName}
              </span>
            </div>
            <div
              className={`logout-drop ${dropdownOpen ? 'show' : ''}`}
              id="logoutDrop"
            >
              <button
                type="button"
                id="logoutBtn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ REGISTER MODAL ═══ */}
      <div
        className={`overlay ${registerOpen ? 'show' : ''}`}
        id="regOverlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) setRegisterOpen(false);
        }}
      >
        <div className="modal" id="registerModal">
          <button
            type="button"
            className="modal-close"
            id="closeRegModalBtn"
            onClick={() => setRegisterOpen(false)}
          >
            ✕
          </button>
          <div className="modal-header">
            <div className="accent-bar"></div>
            <h2>Create Account</h2>
          </div>

          {regMsg && (
            <div className={`m-msg ${regMsg.type}`} id="regMsg">
              {regMsg.text}
            </div>
          )}

          <form className="m-form" id="regForm" onSubmit={handleRegister} noValidate>
            {/* Split name row */}
            <div className="name-row">
              <div className="field">
                <label htmlFor="rFirst">First name</label>
                <input
                  id="rFirst"
                  type="text"
                  placeholder="Jane"
                  value={regFirst}
                  onChange={(e) => setRegFirst(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="rLast">Last name</label>
                <input
                  id="rLast"
                  type="text"
                  placeholder="Doe"
                  value={regLast}
                  onChange={(e) => setRegLast(e.target.value)}
                  required
                />
              </div>
            </div>

            <label htmlFor="rPhone">Phone number</label>
            <input
              id="rPhone"
              type="tel"
              placeholder="097123 4567"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              required
            />

            <label htmlFor="remail">Email</label>
            <input
              id="remail"
              type="email"
              placeholder="email@gmail.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <label htmlFor="rGender">Gender</label>
            <select
              id="rGender"
              value={regGender}
              onChange={(e) => setRegGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>

            <label htmlFor="rPass">Password</label>
            <div className="pw-wrap">
              <input
                id="rPass"
                type={showRegPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                id="toggleRegPassBtn"
                onClick={() => setShowRegPass(!showRegPass)}
              >
                {showRegPass ? '🙈' : '👁️'}
              </button>
            </div>

            <label htmlFor="rPass2">Confirm password</label>
            <div className="pw-wrap">
              <input
                id="rPass2"
                type={showRegPass2 ? 'text' : 'password'}
                placeholder="Repeat password"
                value={regPass2}
                onChange={(e) => setRegPass2(e.target.value)}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                id="toggleRegPass2Btn"
                onClick={() => setShowRegPass2(!showRegPass2)}
              >
                {showRegPass2 ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              className="m-btn"
              id="submitRegisterBtn"
              disabled={regSubmitting}
            >
              {regSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="m-hint">
              First name · Last name · Phone · Gender · Password required
            </p>
          </form>

          <div className="switch-link">
            Already have an account?{' '}
            <span id="switchToLoginLink" onClick={() => switchTo('login')}>
              Log in
            </span>
          </div>
        </div>
      </div>

      {/* ═══ LOGIN MODAL ═══ */}
      <div
        className={`overlay ${loginOpen ? 'show' : ''}`}
        id="logOverlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) setLoginOpen(false);
        }}
      >
        <div className="modal" id="loginModal">
          <button
            type="button"
            className="modal-close"
            id="closeLogModalBtn"
            onClick={() => setLoginOpen(false)}
          >
            ✕
          </button>
          <div className="modal-header">
            <div className="accent-bar"></div>
            <h2>Welcome Back</h2>
          </div>

          {logMsg && (
            <div className={`m-msg ${logMsg.type}`} id="logMsg">
              {logMsg.text}
            </div>
          )}

          <form className="m-form" id="logForm" onSubmit={handleLogin} noValidate>
            <label htmlFor="lUser">Email</label>
            <input
              id="lUser"
              type="email"
              placeholder="email@gmail.com"
              value={logEmail}
              onChange={(e) => setLogEmail(e.target.value)}
              required
            />

            <label htmlFor="lPass">Password</label>
            <div className="pw-wrap">
              <input
                id="lPass"
                type={showLogPass ? 'text' : 'password'}
                placeholder="Your password"
                value={logPass}
                onChange={(e) => setLogPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                id="toggleLogPassBtn"
                onClick={() => setShowLogPass(!showLogPass)}
              >
                {showLogPass ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              className="m-btn"
              id="submitLoginBtn"
              disabled={logSubmitting}
            >
              {logSubmitting ? 'Logging In...' : 'Login'}
            </button>
            <p className="m-hint">Email &amp; password required</p>
          </form>

          <div className="switch-link">
            Don't have an account?{' '}
            <span id="switchToRegisterLink" onClick={() => switchTo('register')}>
              Register
            </span>
          </div>
        </div>
      </div>

      {/* ═══ VIEW TOPICS MODAL ═══ */}
      {activeSubject && (
        <div
          className="overlay show"
          id="topicOverlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSubject(null);
          }}
        >
          <div className="modal" id="topicModal">
            <button
              type="button"
              className="modal-close"
              id="closeTopicModalBtn"
              onClick={() => setActiveSubject(null)}
            >
              ✕
            </button>
            <div className="modal-header">
              <div className="accent-bar"></div>
              <h2>{activeSubject.name}</h2>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '0.8rem' }}>
              {activeSubject.description}
            </p>
            <div className="topics-list">
              {activeSubject.topics.map((topic, idx) => (
                <div key={idx} className="topic-item">
                  <div className="topic-bullet"></div>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="m-btn"
              id="closeTopicBtn"
              onClick={() => setActiveSubject(null)}
            >
              Close Topics
            </button>
          </div>
        </div>
      )}

      {/* ═══ MAIN ═══ */}
      <main className="container" id="mainContainer">
        <div className="page-header">
          <h1>Explore Subjects</h1>
        </div>

        <div className="ad-banner" id="adBanner">
          <p>
            <i>You can advertise your products here</i>
          </p>
        </div>

        {/* Subject Grid */}
        <div className="subject-grid" id="subjectGrid">
          {SUBJECTS.map((subject) => (
            <div className="card" key={subject.id} id={`card-${subject.id}`}>
              <div className="card-content">
                <div className={`card-icon ${subject.iconClass}`}>
                  {subject.icon}
                </div>
                <h2>{subject.name}</h2>
                <p>{subject.description}</p>
              </div>
              <button
                type="button"
                className="card-button"
                id={`btn-${subject.id}`}
                onClick={() => setActiveSubject(subject)}
              >
                View Topics
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

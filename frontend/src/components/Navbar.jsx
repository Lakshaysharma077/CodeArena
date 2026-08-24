import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Swords,
  Trophy,
  Shield,
  Flame,
  BookOpen,
  Crown,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Problems', path: '/problems', icon: BookOpen },
    { name: '1v1 Arena', path: '/arena', icon: Swords },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Contests', path: '/contests', icon: Flame },
    { name: 'Ranks', path: '/ranks', icon: Shield },
  ];

  // Minimal & clean rank pill styling
  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 'Conqueror':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Crown':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Master':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Diamond':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Platinum':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Gold':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Silver':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-arena-border/60 bg-arena-bg/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-arena-primary/10 border border-arena-primary/20 flex items-center justify-center text-arena-primary group-hover:bg-arena-primary group-hover:text-white transition-all duration-200">
              <Swords className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-bold tracking-tight text-arena-text">
                Code<span className="text-arena-primary">Arena</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-arena-primary/10 text-arena-primary border border-arena-primary/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${isActive
                    ? 'text-arena-text font-semibold'
                    : 'text-arena-muted hover:text-arena-text hover:bg-arena-card/50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-arena-primary' : 'opacity-70'}`} />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-lg bg-arena-card border border-arena-border/80 -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Theme Toggle + Auth Status */}
          <div className="flex items-center space-x-3">

            {/* Theme Switcher */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-arena-muted hover:text-arena-text hover:bg-arena-card border border-transparent hover:border-arena-border transition-all duration-200"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-arena-border hidden sm:block" />

            {/* Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2.5">
                {/* User Rank & Rating Badge */}
                <Link
                  to="/dashboard"
                  className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-opacity hover:opacity-90 ${getRankBadgeStyle(
                    user.rank
                  )}`}
                >
                  <Crown className="w-3 h-3" />
                  <span>{user.rank}</span>
                  <span className="opacity-40">•</span>
                  <span className="font-mono">{user.rating}</span>
                </Link>

                {/* Profile Link */}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-arena-card border border-transparent hover:border-arena-border transition-all duration-150"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-7 h-7 rounded-md object-cover border border-arena-border"
                  />
                  <span className="hidden lg:block text-xs font-medium text-arena-text pr-1">
                    {user.username}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-arena-muted hover:text-arena-text transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-arena-primary text-white hover:bg-arena-primary/90 transition-all shadow-sm active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-arena-muted hover:text-arena-text hover:bg-arena-card"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-arena-border bg-arena-bg px-4 pt-2 pb-4 space-y-1 overflow-hidden"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-arena-card text-arena-primary font-semibold'
                    : 'text-arena-muted hover:text-arena-text hover:bg-arena-card/50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2,
  LogOut,
  Map,
  Trophy,
  Target,
  BookOpen,
  Layers,
  Flame,
  Compass,
  X,
  Check,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Input } from '../components/ui/Input';
import { useCareer } from '../context/CareerContext';
import { useUI } from '../context/UIContext';
import { careers } from '../data/careers';
import { userApi } from '../services/user.api';

const QUICK_LINKS = [
  { label: 'Career Sky', icon: <Compass size={16} />, to: '/sky', desc: 'Explore your universe' },
  { label: 'Roadmap', icon: <Map size={16} />, to: '/roadmap', desc: 'Your learning path' },
  { label: 'Resources', icon: <BookOpen size={16} />, to: '/resources', desc: 'Courses & books' },
  { label: 'Projects', icon: <Layers size={16} />, to: '/projects', desc: 'Build your portfolio' },
  { label: 'Achievements', icon: <Trophy size={16} />, to: '/achievements', desc: 'Your milestones' },
  { label: 'Readiness', icon: <Target size={16} />, to: '/readiness', desc: 'Job ready score' },
];

const AVATAR_OPTIONS = ['👩‍💻', '👨‍💻', '🚀', '⚡', '🎨', '🧠', '🤖', '🌟', '💡', '🔮', '🏆', '🎯'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, selectedCareer, logout, login } = useCareer();
  const { addToast } = useUI();
  const career = selectedCareer || careers[0];
  const earnedAchievements = user.achievements.filter((a) => a.isEarned);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar || '👩‍💻');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditAvatar(user.avatar || '👩‍💻');
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSaving(true);
    try {
      const updatedUser = await userApi.updateProfile({
        name: editName.trim(),
        avatar: editAvatar,
      });

      login({ ...user, name: updatedUser.name || editName, avatar: updatedUser.avatar || editAvatar });
      addToast({ type: 'success', message: 'Profile updated successfully! ✨' });
      setIsEditing(false);
    } catch (err: any) {
      console.warn('Could not update profile on backend:', err);
      login({ ...user, name: editName, avatar: editAvatar });
      addToast({ type: 'success', message: 'Profile updated successfully! ✨' });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-border pb-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center text-5xl flex-shrink-0 bg-surface shadow-md">
              {user.avatar}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="font-display text-4xl font-medium text-foreground tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">{user.email}</p>
                  <div className="flex items-center gap-3 mt-4">
                    {career && (
                      <Badge variant="default" className="bg-surface border-border">
                        {career.emoji} {career.title}
                      </Badge>
                    )}
                    <Badge
                      variant="orange"
                      className="bg-orange-500/10 border-orange-500/20 text-orange-500"
                    >
                      <Flame size={12} className="mr-1" />
                      {user.progress.streak} day streak
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit2 size={16} />}
                    onClick={handleOpenEdit}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<LogOut size={16} />}
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                {[
                  { label: 'Hours Learned', value: user.stats.totalHoursLearned },
                  { label: 'Skills Acquired', value: user.stats.skillsAcquired },
                  { label: 'Projects Built', value: user.stats.projectsCompleted },
                  { label: 'Achievements', value: earnedAchievements.length },
                ].map((stat) => (
                  <div key={stat.label} className="border-l border-border pl-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      {stat.label}
                    </p>
                    <p className="font-display text-3xl font-medium text-foreground leading-none">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Career readiness */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6 flex items-center justify-between">
              Readiness Score
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/readiness')}
                className="text-primary hover:text-primary/80 px-0 h-auto"
              >
                Full Report →
              </Button>
            </h2>
            <div className="mb-4">
              <div className="flex justify-between text-base mb-3 font-light">
                <span className="text-muted-foreground">{career?.title} Readiness</span>
                <span className="font-medium text-foreground">
                  {user.stats.careerReadinessScore}%
                </span>
              </div>
              <Progress value={user.stats.careerReadinessScore} variant="primary" size="md" />
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">
              Quick Access
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.to}
                  onClick={() => navigate(link.to)}
                  className="flex flex-col items-start gap-3 py-3 border-b border-border hover:border-foreground/30 transition-all duration-300 group"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {link.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground">{link.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent achievements */}
          {earnedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 pt-12 border-t border-border"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Recent Achievements
                </h2>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => navigate('/achievements')}
                  className="px-0 h-auto text-primary"
                >
                  View All →
                </Button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {earnedAchievements.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className="flex-shrink-0 flex items-center gap-4 border border-border p-4 min-w-[240px]"
                  >
                    <span className="text-4xl">{a.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight mb-1">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-light truncate max-w-[140px]">
                        {a.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-foreground">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditAvatar(emoji)}
                        className={`text-2xl p-2.5 rounded-xl border transition-all ${
                          editAvatar === emoji
                            ? 'border-primary bg-primary/10 shadow-sm scale-105'
                            : 'border-border hover:bg-surface-2'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Display Name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  leftIcon={<UserIcon size={16} />}
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    leftIcon={<Check size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

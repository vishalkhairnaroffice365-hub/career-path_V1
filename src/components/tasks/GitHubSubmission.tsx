import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, CheckCircle, AlertCircle, FileText, UploadCloud, Paperclip } from 'lucide-react';
import type { TaskSubmission } from '../../context/CareerContext';
import { submissionApi } from '../../services/submission.api';

interface GitHubSubmissionProps {
  nodeId: string;
  submission: TaskSubmission;
  onSubmit: (data: { githubUrl: string; liveUrl?: string; notes?: string; fileName?: string }) => void;
  githubRequired: boolean;
  liveUrlRequired: boolean;
}

function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(url.trim());
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function GitHubSubmission({
  nodeId,
  submission,
  onSubmit,
  githubRequired,
  liveUrlRequired,
}: GitHubSubmissionProps) {
  const [githubUrl, setGithubUrl] = useState(submission.githubUrl || '');
  const [liveUrl, setLiveUrl] = useState(submission.liveUrl || '');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ github: false, live: false });

  const isSubmitted =
    submission.status === 'submitted' ||
    submission.status === 'under-review' ||
    submission.status === 'passed';

  const githubValid = !githubRequired || (githubUrl.length > 0 && isValidGitHubUrl(githubUrl));
  const liveValid = !liveUrlRequired || (liveUrl.length > 0 && isValidUrl(liveUrl));
  const canSubmit = githubValid && liveValid && !isSubmitted && !isSubmitting;

  const statusConfig = {
    'not-started': { label: 'Not Submitted', color: 'text-muted-foreground', bg: 'bg-muted', emoji: '○' },
    'in-progress': { label: 'In Progress', color: 'text-warning', bg: 'bg-warning/10', emoji: '⚡' },
    'submitted': { label: 'Submitted to MongoDB', color: 'text-info', bg: 'bg-info/10', emoji: '✓' },
    'under-review': { label: 'Under Review', color: 'text-primary', bg: 'bg-primary/10', emoji: '👁' },
    'passed': { label: 'Passed & Verified', color: 'text-success', bg: 'bg-success/10', emoji: '🎉' },
    'failed': { label: 'Revisions Requested', color: 'text-danger', bg: 'bg-danger/10', emoji: '✗' },
  };

  const status = statusConfig[submission.status] || statusConfig['not-started'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await submissionApi.submit({
        nodeId,
        type: 'practical-task',
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl ? liveUrl.trim() : undefined,
        notes: notes.trim() || undefined,
        fileName: fileName || undefined,
      });
    } catch (err) {
      console.warn('Backend submission error:', err);
    } finally {
      setIsSubmitting(false);
      onSubmit({
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl ? liveUrl.trim() : undefined,
        notes: notes.trim() || undefined,
        fileName: fileName || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Submission Status */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
        <span>{status.emoji}</span>
        {status.label}
      </div>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-success/30 bg-success/5 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-success" />
            <div>
              <h3 className="font-display text-xl font-medium text-foreground">Submission Recorded</h3>
              <p className="text-xs text-muted-foreground">Stored securely in MongoDB for your user profile.</p>
            </div>
          </div>
          {submission.githubUrl && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe size={15} /> GitHub Repository
              </div>
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-xs font-mono font-medium hover:underline truncate max-w-[240px]"
              >
                {submission.githubUrl}
              </a>
            </div>
          )}
          {submission.liveUrl && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe size={15} /> Live Project
              </div>
              <a
                href={submission.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary text-xs font-mono font-medium hover:underline truncate max-w-[240px]"
              >
                {submission.liveUrl}
              </a>
            </div>
          )}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Verification Status</span>
            <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {/* GitHub URL */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              GitHub Repository {githubRequired && <span className="text-danger">*</span>}
            </label>
            <div className="relative">
              <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, github: true }))}
                placeholder="https://github.com/username/project-repo"
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>
            {touched.github && !githubUrl && githubRequired && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                <AlertCircle size={12} /> Please enter a GitHub repository URL.
              </p>
            )}
            {touched.github && githubUrl && !isValidGitHubUrl(githubUrl) && (
              <p className="flex items-center gap-1.5 text-xs text-danger mt-1.5">
                <AlertCircle size={12} /> Format: https://github.com/username/repo
              </p>
            )}
            {touched.github && githubUrl && isValidGitHubUrl(githubUrl) && (
              <p className="flex items-center gap-1.5 text-xs text-success mt-1.5">
                <CheckCircle size={12} /> Valid GitHub repository URL format
              </p>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Live Project URL {liveUrlRequired && <span className="text-danger">*</span>}
              {!liveUrlRequired && <span className="text-muted-foreground font-normal normal-case tracking-normal ml-1">(optional)</span>}
            </label>
            <div className="relative">
              <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, live: true }))}
                placeholder="https://my-deployed-project.com"
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
              <FileText size={13} /> Implementation Notes & Architecture Summary (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly describe key architecture decisions, trade-offs, or setup instructions..."
              rows={3}
              className="w-full p-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
              <Paperclip size={13} /> Project Attachment / Archive (Optional)
            </label>
            <label className="flex items-center gap-3 p-3.5 bg-surface border border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-all">
              <UploadCloud size={20} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground flex-1">
                {fileName ? `Attached: ${fileName}` : 'Upload source ZIP, PDF report, or screenshot archive (Max 25MB)'}
              </span>
              <input type="file" onChange={handleFileChange} className="hidden" accept=".zip,.pdf,.png,.jpg,.tar.gz" />
            </label>
          </div>

          {/* Submit button */}
          <motion.button
            onClick={handleFormSubmit}
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Submitting to MongoDB...' : 'Submit Project Milestone 🚀'}
          </motion.button>
        </div>
      )}
    </div>
  );
}

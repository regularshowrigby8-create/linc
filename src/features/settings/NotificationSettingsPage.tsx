import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useActions, useStore } from '@/state/store';
import type { NotificationChannel } from '@/data/types';

const CHANNEL_LABELS: { id: NotificationChannel; label: string; hint: string }[] = [
  { id: 'in_app', label: 'In-app', hint: 'Essential safety and verification notices arrive here.' },
  { id: 'email', label: 'Email', hint: 'Request activity and connection updates.' },
  { id: 'sms', label: 'SMS', hint: 'Time-sensitive request reminders.' },
  { id: 'whatsapp', label: 'WhatsApp', hint: 'Updates where a compliant provider is available.' },
  { id: 'push', label: 'Push', hint: 'Available once a mobile app exists.' },
];

export const NotificationSettingsPage = () => {
  const { state } = useStore();
  const actions = useActions();
  const navigate = useNavigate();

  const settings = state.app.notifications;

  return (
    <div className="lh-page lh-stack">
      <div className="lh-stack-sm">
        <h1 className="lh-h1">Notification settings</h1>
        <p className="lh-muted">
          Safety, security and verification notices are essential and cannot be switched off. Other
          channels are your choice.
        </p>
      </div>

      <Card as="section" className="lh-stack">
        {CHANNEL_LABELS.map((channel) => {
          const locked = settings.lockedChannels.includes(channel.id);
          const enabled = settings.channels[channel.id];
          return (
            <div key={channel.id} className="lh-settingrow">
              <div className="lh-stack-sm">
                <div className="lh-row">
                  <strong>{channel.label}</strong>
                  {locked ? <Badge tone="information">Essential</Badge> : null}
                </div>
                <span className="lh-caption">{channel.hint}</span>
              </div>
              <div className="lh-row">
                <span className="lh-caption">{enabled ? 'On' : 'Off'}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={locked}
                  loading={actions.isPending(`notification:${channel.id}`)}
                  aria-label={`${channel.label} notifications`}
                  title={
                    locked
                      ? 'Safety and security notices cannot be turned off.'
                      : `Turn ${channel.label} notifications ${enabled ? 'off' : 'on'}`
                  }
                  onClick={() => void actions.setNotificationChannel(channel.id, !enabled)}
                >
                  {enabled ? 'Turn off' : 'Turn on'}
                </Button>
              </div>
            </div>
          );
        })}
      </Card>

      <Button variant="ghost" onClick={() => navigate('/app/profile')}>
        Back to my profile
      </Button>
    </div>
  );
};

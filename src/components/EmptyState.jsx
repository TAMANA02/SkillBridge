import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="state-block">
      <div className="state-icon"><Icon size={20} /></div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
}

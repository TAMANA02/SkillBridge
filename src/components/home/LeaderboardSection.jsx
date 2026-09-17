import { leaderboardItems } from '../../data/mockData';

const PANELS = [
  { key: 'weekly', title: 'Weekly Top Projects', field: 'title' },
  { key: 'monthly', title: 'Monthly Top Projects', field: 'title' },
  { key: 'innovators', title: 'Top Innovators', field: 'name' },
  { key: 'colleges', title: 'Leading Colleges', field: 'name' },
  { key: 'active', title: 'Most Active', field: 'name' },
];

export default function LeaderboardSection() {
  return (
    <section className="section section-alt" id="leaderboard">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Hall of Fame</span>
          <h2>Recognizing standout work</h2>
          <p>See which projects, developers, and colleges are leading the SkillBridge community this cycle.</p>
        </div>
        <div className="leaderboard-tabs">
          {PANELS.map((panel) => (
            <div key={panel.key} className="card leaderboard-panel">
              <h4>{panel.title}</h4>
              <div className="leaderboard-list">
                {leaderboardItems[panel.key].map((item) => (
                  <div key={item[panel.field]} className="leaderboard-item">
                    <strong>{item[panel.field]}</strong>
                    <span>{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

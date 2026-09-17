// Requirement-Based Matching Engine
//
// Compares a project's tech/feature tags against developer, team, and
// college profiles and produces a percentage match score. Deterministic
// (seeded by name) so the same project always ranks the same way instead of
// re-shuffling on every render.

function seededVariance(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 7) - 3; // -3..3
}

function overlapRatio(tags, skills) {
  const req = new Set(tags.map((t) => t.toLowerCase()));
  const has = new Set((skills || []).map((s) => s.toLowerCase()));
  if (req.size === 0) return 0.5;
  let hits = 0;
  req.forEach((t) => {
    if (has.has(t)) hits += 1;
  });
  return hits / req.size;
}

function clampScore(score) {
  return Math.max(55, Math.min(99, Math.round(score)));
}

export function scoreDeveloper(tags, developer) {
  const ratio = overlapRatio(tags, developer.skills);
  const ratingBoost = ((developer.rating || 4.5) - 4.5) * 6;
  return clampScore(58 + ratio * 34 + ratingBoost + seededVariance(developer.id || developer.name));
}

export function scoreTeam(tags, team) {
  const ratio = overlapRatio(tags, team.skills);
  const ratingBoost = ((team.rating || 4.5) - 4.5) * 6;
  return clampScore(60 + ratio * 32 + ratingBoost + seededVariance(team.slug || team.name));
}

export function scoreCollege(tags, college) {
  // Colleges don't carry a raw skills array — approximate fit from their
  // published performance signals plus a small deterministic spread so
  // rankings still feel differentiated.
  const ratingBoost = ((college.rating || 4.5) - 4.5) * 8;
  const scoreBoost = ((college.score || 85) - 85) * 0.3;
  return clampScore(62 + ratingBoost + scoreBoost + seededVariance(college.slug || college.name));
}

export function rankMatches({ tags, developers = [], teams = [], colleges = [] }, limit = 3) {
  const developerMatches = developers
    .map((d) => ({ type: 'developer', entity: d, score: scoreDeveloper(tags, d) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const teamMatches = teams
    .map((t) => ({ type: 'team', entity: t, score: scoreTeam(tags, t) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const collegeMatches = colleges
    .map((c) => ({ type: 'college', entity: c, score: scoreCollege(tags, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return { developerMatches, teamMatches, collegeMatches };
}

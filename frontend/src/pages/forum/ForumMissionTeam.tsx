import { UserAvatar } from '../../components/UserAvatar';

export interface MissionTeamPerson { id: string; name: string; avatar_url?: string | null; team_role?: string }
export interface MissionTeam { mentor: MissionTeamPerson | null; cubes: MissionTeamPerson[] }

const SHOWN_CUBES = 4;
const firstName = (person: MissionTeamPerson, userId: string) => (person.id === userId ? 'You' : (person.name || '').trim().split(/\s+/)[0] || 'Unknown');

/**
 * Mission room header line: the mission's mentor and the Cubes on its team, with avatars.
 * Every Admin and Mentor is also in the room, but listing them hides who the room is about.
 */
export function MissionTeamStrip({ team, userId }: { team: MissionTeam; userId: string }) {
  // The Mission Lead first, then the rest in assignment order.
  const cubes = [...team.cubes].sort((a, b) => Number(b.team_role === 'Mission_Lead') - Number(a.team_role === 'Mission_Lead'));
  const shown = cubes.slice(0, SHOWN_CUBES);
  const hidden = cubes.length - shown.length;
  const names = shown.map(cube => `${firstName(cube, userId)}${cube.team_role === 'Mission_Lead' ? ' (Lead)' : ''}`).join(', ');
  const label = [
    team.mentor ? `Mentor: ${team.mentor.name}` : 'No mentor assigned',
    cubes.length ? `Cubes: ${cubes.map(c => c.name).join(', ')}` : 'No Cubes assigned',
  ].join('. ');

  return (
    <span className="talk-mission-team" title={label}>
      <span className="talk-mission-team-group">
        {team.mentor ? (
          <>
            <UserAvatar name={team.mentor.name} avatarUrl={team.mentor.avatar_url} size="xs" className="talk-mission-team-avatar" />
            <span><b>Mentor</b> {firstName(team.mentor, userId)}</span>
          </>
        ) : (
          <span>No mentor</span>
        )}
      </span>
      <span className="talk-mission-team-sep" aria-hidden="true" />
      <span className="talk-mission-team-group">
        {shown.length > 0 ? (
          <>
            <span className="talk-mission-team-stack">
              {shown.map(cube => (
                <UserAvatar key={cube.id} name={cube.name} avatarUrl={cube.avatar_url} size="xs" className="talk-mission-team-avatar" />
              ))}
            </span>
            <span className="talk-mission-team-names">
              {names}
              {hidden > 0 && ` +${hidden}`}
            </span>
          </>
        ) : (
          <span>No Cubes yet</span>
        )}
      </span>
    </span>
  );
}

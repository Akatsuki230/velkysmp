import { Player } from "./Types";
import { PlayerCard } from "./PlayerCard";

export function renderGroupedByOnline(loading: boolean, users: Player[]) {
  return (
    <>
      {loading || (
        <h1 className="text-2xl font-bold my-1">
          Online players:
        </h1>
      )}

      {users.map((x) => {
        if (!x.online) return null;
        return <PlayerCard x={x} />;
      })}

      {loading || (
        <h1 className="text-2xl font-bold my-1">
          Offline players:
        </h1>
      )}

      {users.map((x) => {
        if (x.online) return null;
        return <PlayerCard x={x} />;
      })}
    </>
  );
}

export function renderGroupedByNone(loading: boolean, users: Player[]) {
  return (
    <>
      {loading || (
        <h1 className="text-2xl font-bold my-1">
          Players:
        </h1>
      )}

      {users.map((x) => (
        <PlayerCard x={x} />
      ))}
    </>
  );
}

export function renderGroupedByPlaytime(loading: boolean, users: Player[]) {
  // Filter users into groups based on playtime
  const moreThanAWeek = users.filter((x) => x.seconds > 604800);
  const moreThanADay = users.filter((x) => x.seconds > 86400 && x.seconds <= 604800);
  const moreThanAnHour = users.filter((x) => x.seconds > 3600 && x.seconds <= 86400);
  const lessThanAnHour = users.filter((x) => x.seconds <= 3600);

  return (
    <>
      {moreThanAWeek.length > 0 && !loading && (
        <h1 className="text-2xl font-bold my-1">
          More than a week:
        </h1>
      )}

      {moreThanAWeek.map((x) => (
        <PlayerCard x={x} />
      ))}

      {moreThanADay.length > 0 && !loading && (
        <h1 className="text-2xl font-bold my-1">
          More than a day:
        </h1>
      )}

      {moreThanADay.map((x) => (
        <PlayerCard x={x} />
      ))}

      {moreThanAnHour.length > 0 && !loading && (
        <h1 className="text-2xl font-bold my-1">
          More than a hour:
        </h1>
      )}

      {moreThanAnHour.map((x) => (
        <PlayerCard x={x} />
      ))}

      {lessThanAnHour.length > 0 && !loading && (
        <h1 className="text-2xl font-bold my-1">
          Less then a hour:
        </h1>
      )}

      {lessThanAnHour.map((x) => (
        <PlayerCard x={x} />
      ))}
    </>
  );
}

export function renderGroupedByFirstLetter(loading: boolean, users: Player[]) {
  // Group users by the first letter of their names
  const groupedUsers: { [key: string]: Player[] } = {};

  users.forEach((user) => {
    const firstLetter = user.name.charAt(0).toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });

  // Sort the groups by alphabetical order
  const sortedGroups = Object.entries(groupedUsers).sort(([letterA], [letterB]) => {
    return letterA.localeCompare(letterB);
  });

  // Render cards for each sorted group
  return (
    <>
      {sortedGroups.map(([letter, userList]) => (
        <div key={letter}>
          <h1 className="text-2xl font-bold my-1">{letter}</h1>
          {userList.map((user) => (
            <PlayerCard x={user} />
          ))}
        </div>
      ))}
    </>
  );
}
